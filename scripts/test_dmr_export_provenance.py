import json
import pathlib
import tempfile
import unittest
from datetime import datetime, timezone
from types import SimpleNamespace
from dmr_export_provenance import PARAMS, capture_export, digest, evidence_directory, write_evidence

class EvidenceTest(unittest.TestCase):
    def setUp(self):
        self.params = {key: "fixture" for key in PARAMS}
        self.raster = SimpleNamespace(content=b"synthetic raster bytes", headers={"Last-Modified":"Wed, 01 Jan 2025 00:00:00 GMT","Authorization":"secret"})
        self.response = SimpleNamespace(headers={"Date":"Thu, 26 Nov 2026 21:00:00 GMT"})
        self.info = {"href":"https://example.test/export.tif?token=secret","width":10,"height":10}
        self.record = capture_export(self.params,self.info,self.response,self.raster,acquired=datetime(2026,11,26,21,tzinfo=timezone.utc))

    def test_metadata(self):
        self.assertEqual(self.record["raster"],digest(self.raster.content))
        self.assertIsNone(self.record["providerDatasetUpdateDate"])
        self.assertEqual(self.record["acquiredUtc"],"2026-11-26T21:00:00+00:00")
        self.assertEqual(self.record["rasterDownloadLocationWithoutQuery"],"https://example.test/export.tif")
        self.assertNotIn("secret",json.dumps(self.record))
        with self.assertRaises(ValueError):
            capture_export({},self.info,self.response,self.raster)
        with self.assertRaises(ValueError):
            capture_export(self.params,self.info,self.response,self.raster,acquired=datetime(2026,1,1))

    def test_external_bundle(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=pathlib.Path(tmp)
            repo=root/"repo";repo.mkdir()
            external=root/"archive";external.mkdir()
            with self.assertRaises(ValueError):evidence_directory(repo,str(repo))
            archive=evidence_directory(repo,str(external))
            output=b'{"values":[0,1]}'
            target=write_evidence(archive,"old",self.record,self.raster.content,output)
            manifest=json.loads((target/"manifest.json").read_text(encoding="utf8"))
            self.assertEqual(manifest["terrain"],digest(output))
            self.assertEqual((target/"terrain.json").read_bytes(),output)
            self.assertEqual((target/"source.tif").read_bytes(),self.raster.content)
            with self.assertRaises(ValueError):write_evidence(archive,"../escape",self.record,self.raster.content,output)
            with self.assertRaises(ValueError):write_evidence(archive,"old",self.record,b"wrong",output)
            self.assertEqual(list(archive.iterdir()),[target])

if __name__ == "__main__":
    unittest.main()
