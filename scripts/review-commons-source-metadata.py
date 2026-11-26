#!/usr/bin/env python3
"""Public Commons metadata evidence only; never download photos or change rights status."""
import argparse
import datetime
import html
import json
import re
import sys
import unicodedata
import urllib.parse
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

API = "https://commons.wikimedia.org/w/api.php"
USER_AGENT = "CrossvexArchitectureSourceReview/1.0 (https://github.com/FOXEY-CZ/milovice-life-rp; public metadata audit)"
class Plain(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts = []
    def handle_data(self, data):
        self.parts.append(data)
def plain(value):
    p = Plain()
    p.feed(value or "")
    return unicodedata.normalize("NFC", " ".join(" ".join(p.parts).split()))
def title(url):
    u = urllib.parse.urlsplit(url)
    if u.scheme != "https" or u.netloc != "commons.wikimedia.org" or not u.path.startswith("/wiki/File:"):
        raise ValueError("Unexpected Commons source URL")
    return unicodedata.normalize("NFC", urllib.parse.unquote(u.path[len("/wiki/"):]).replace("_", " "))
def queries(inventory):
    result = {}
    for record in inventory["records"]:
        if record["provider"] != "Wikimedia Commons":
            continue
        for url in [record["source"], record.get("secondarySource"), *[f["source"] for f in record.get("facadeSources", [])]]:
            if not url:
                continue
            t = title(url)
            result.setdefault(t, []).append({"id": record["id"], "url": url, "author": record["declaredPhotoAuthor"], "license": record["declaredPhotoLicense"], "date": record["photoDate"]})
    return result
def field(metadata, key):
    return metadata.get(key, {}).get("value")
def normalized_photo_date(value):
    """Accept explicit ISO date/time or the English Commons 'Taken on' format."""
    iso = re.fullmatch(r"(\d{4}-\d{2}-\d{2})(?:[ T]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?)?", value)
    if iso:
        try:
            return datetime.date.fromisoformat(iso.group(1)).isoformat()
        except ValueError:
            return None
    human = re.fullmatch(r"Taken on (\d{1,2}) (January|February|March|April|May|June|July|August|September|October|November|December) (\d{4})", value)
    if human:
        months = ("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December")
        try:
            return datetime.date(int(human.group(3)), months.index(human.group(2)) + 1, int(human.group(1))).isoformat()
        except ValueError:
            return None
    return None
def evaluate(expected, payload):
    if "error" in payload:
        raise ValueError("Commons API error: " + str(payload["error"].get("code")))
    q = payload["query"]
    aliases = {n["from"]: n["to"] for n in q.get("normalized", [])}
    pages = {p["title"]: p for p in q["pages"]}
    records = []
    for requested, sources in expected.items():
        page = pages.get(aliases.get(requested, requested), {})
        info = (page.get("imageinfo") or [{}])[0]
        meta = info.get("extmetadata", {})
        author = plain(field(meta, "Artist"))
        license_name = plain(field(meta, "LicenseShortName"))
        license_url = field(meta, "LicenseUrl")
        original_date = plain(field(meta, "DateTimeOriginal"))
        checks = {}
        for source in sources:
            checks[source["id"]] = {
                "author": source["author"] == author,
                "license": source["license"] == license_name and license_url in ("https://creativecommons.org/licenses/by/4.0", "https://creativecommons.org/licenses/by/4.0/", "http://creativecommons.org/licenses/by/4.0", "http://creativecommons.org/licenses/by/4.0/"),
                "photoDate": normalized_photo_date(original_date) == source["date"],
            }
        matched = bool(info.get("sha1") and page.get("pageid") and checks and all(all(c.values()) for c in checks.values()))
        records.append({"requestedTitle": requested, "returnedTitle": page.get("title"), "pageid": page.get("pageid"), "lastrevid": page.get("lastrevid"), "descriptionurl": info.get("descriptionurl"), "sha1": info.get("sha1"), "mime": info.get("mime"), "uploadTimestamp": info.get("timestamp"), "artistRaw": field(meta, "Artist"), "artist": author, "license": license_name, "licenseUrl": license_url, "dateTimeOriginal": original_date, "normalizedPhotoDate": normalized_photo_date(original_date), "attribution": field(meta, "Attribution"), "credit": field(meta, "Credit"), "restrictions": field(meta, "Restrictions"), "sources": sources, "checks": checks, "metadataStatus": "matched" if matched else "unverified", "rightsStatus": "pending"})
    return records
def self_test():
    t = "File:Sample.jpg"
    expected = {t: [{"id": "1", "author": "ŠJů", "license": "CC BY 4.0", "date": "2024-05-30"}]}
    page = {"title": t, "pageid": 1, "imageinfo": [{"sha1": "abc", "timestamp": "2024-06-01", "extmetadata": {"Artist": {"value": "<a href='/wiki/User:X'>ŠJů</a>"}, "LicenseShortName": {"value": "CC BY 4.0"}, "LicenseUrl": {"value": "https://creativecommons.org/licenses/by/4.0/"}, "DateTimeOriginal": {"value": "2024-05-30 12:00:00"}}}]}
    payload = {"query": {"pages": [page]}}
    assert evaluate(expected, payload)[0]["metadataStatus"] == "matched"
    page["imageinfo"][0]["extmetadata"]["DateTimeOriginal"]["value"] = "Taken on 30 May 2024"
    assert evaluate(expected, payload)[0]["metadataStatus"] == "matched"
    for value in ("Taken on 31 February 2024", "Taken on 31 May 2024", "Uploaded on 30 May 2024", "2024-05-30 unknown", ""):
        page["imageinfo"][0]["extmetadata"]["DateTimeOriginal"]["value"] = value
        assert evaluate(expected, payload)[0]["metadataStatus"] == "unverified"
    page["imageinfo"][0]["extmetadata"]["DateTimeOriginal"]["value"] = ""
    assert evaluate(expected, payload)[0]["metadataStatus"] == "unverified"
    page["imageinfo"] = []
    assert evaluate(expected, payload)[0]["metadataStatus"] == "unverified"
    assert evaluate(expected, payload)[0]["rightsStatus"] == "pending"
    assert title("https://commons.wikimedia.org/wiki/File:Milovice,_%C5%A0kolsk%C3%A1_1.jpg") == "File:Milovice, Školská 1.jpg"
    print("PASS Commons metadata comparison fixtures")
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--self-test", action="store_true")
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    if args.self_test:
        self_test()
        return 0
    if not args.output or args.output.exists():
        parser.error("Provide a new report output")
    inventory = json.loads((Path(__file__).resolve().parents[1] / "docs/architecture-source-inventory.json").read_text())
    expected = queries(inventory)
    if len(expected) != 5:
        raise ValueError("Expected five exact published Commons photo references")
    params = {"action": "query", "format": "json", "formatversion": "2", "uselang": "en", "prop": "info|imageinfo", "iiprop": "sha1|mime|timestamp|url|extmetadata", "iiextmetadatafilter": "Artist|LicenseShortName|LicenseUrl|DateTimeOriginal|Attribution|Credit|Restrictions", "titles": "|".join(expected), "maxlag": "5"}
    report = {"scope": "exact public Commons metadata only, no photos downloaded; no derivative or distribution rights approval", "requestedAt": datetime.datetime.now(datetime.timezone.utc).isoformat(), "api": API, "requestedTitles": list(expected), "records": [], "rightsStatus": "pending"}
    try:
        request = urllib.request.Request(API + "?" + urllib.parse.urlencode(params), headers={"User-Agent": USER_AGENT, "Accept": "application/json"})
        with urllib.request.urlopen(request, timeout=30) as response:
            if urllib.parse.urlsplit(response.geturl()).netloc != "commons.wikimedia.org":
                raise ValueError("Unexpected API redirect")
            report["httpStatus"] = response.status
            raw = response.read(2_000_001)
            if len(raw) > 2_000_000:
                raise ValueError("Unexpected metadata size")
        report["records"] = evaluate(expected, json.loads(raw))
        report["result"] = "matched" if all(r["metadataStatus"] == "matched" for r in report["records"]) else "unverified"
    except Exception as error:
        report["result"] = "unavailable"
        report["error"] = str(error)
    with args.output.open("x", encoding="utf-8") as file:
        json.dump(report, file, ensure_ascii=False, indent=2)
        file.write("\n")
    print("COMMONS METADATA", json.dumps(report, ensure_ascii=False))
    return 0 if report["result"] == "matched" else 1
if __name__ == "__main__":
    sys.exit(main())
