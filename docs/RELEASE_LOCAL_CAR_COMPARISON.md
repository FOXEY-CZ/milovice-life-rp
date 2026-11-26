# Local car source comparison — preparation for #161

Creator [Cars Pack](https://quaternius.com/packs/cars.html) identifies the November 2018 FBX/OBJ/Blend pack as CC0. [Poly Pizza Cars Bundle](https://poly.pizza/bundle/Cars-Bundle-FE5IWe6OMk) offers FBX and GLTF downloads under CC0 (updated 10 July 2022). The [creator FAQ](https://quaternius.com/faq.html) distinguishes CC0 and QAL; use the license specific to the pack, not a blanket claim. These pages were checked 2026-11-26. The original source files have not yet been acquired; previous direct Brotli fetch returned 403.

Obtain the three original GLBs via the normal provider download UI, retaining download page, date and included license notice. Extract the archive locally. Use the correct model variant (two Car and two Sports Car entries are listed on Poly Pizza). Run from repository root:

```sh
node scripts/audit-release-glb.mjs --compare-local-cars local-car-report.json /path/car.glb /path/sport.glb /path/suv.glb
```

GLB or Brotli-compressed GLB accepted, 32 MiB input/output cap. Reports omit local paths, keep model ID, size/hash and status. Output must be a new file. Any mismatch or unavailable input exits nonzero, not an infringement determination. A match verifies only byte identity against the pinned mirror; keep source provenance separately. Do not upload archives or model bytes to GitHub as part of this check. Existing online audit unchanged. No runtime edits or release approval. Local-input test pending.
