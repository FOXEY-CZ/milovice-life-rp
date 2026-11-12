#!/usr/bin/env python3
"""Build one offline Milovice ground-height tile from the official ČÚZK DMR 4G (5 m) raster.

Output elevations are decimetres relative to the grid centre, sampled every 10 m.
Map projection follows index.html's approximate WGS84 local coordinate conversion.
The exported elevations are not building heights, and cannot replace surveyed foundations.

Source: https://ags.cuzk.gov.cz/arcgis2/rest/services/dmr4g/ImageServer
Open data: ČÚZK, CC BY 4.0 https://ags.cuzk.cz/opendata/
"""
from __future__ import annotations
import io
import json
import math
import pathlib
import time
import numpy as np
import rasterio
import requests
from pyproj import Transformer

LAT0, LON0 = 50.226, 14.889
HALF, STEP = 1100, 10
N = HALF * 2 // STEP + 1
OUT = pathlib.Path("data/milovice-terrain.json")
SOURCE = "https://ags.cuzk.gov.cz/arcgis2/rest/services/dmr4g/ImageServer/exportImage"
TO_SJTSK = Transformer.from_crs("EPSG:4326", "EPSG:5514", always_xy=True)
COSLAT = math.cos(math.radians(LAT0))

def geo(x, z):
    return LON0 + x / (111320.0 * COSLAT), LAT0 - z / 111320.0

def ground_points():
    result = []
    for iz in range(N):
        z = -HALF + iz * STEP
        for ix in range(N):
            x = -HALF + ix * STEP
            result.append(TO_SJTSK.transform(*geo(x, z)))
    return result

def download_raster(points):
    # A 40 m border avoids interpolation outside the export raster.
    xx = [p[0] for p in points[::N - 1]]
    yy = [p[1] for p in points[::N - 1]]
    xmin, xmax = min(xx) - 40, max(xx) + 40
    ymin, ymax = min(yy) - 40, max(yy) + 40
    # Keep approximately native 5 m pixels in EPSG:5514.
    width = math.ceil((xmax - xmin) / 5)
    height = math.ceil((ymax - ymin) / 5)
    params = {
        "f": "json",
        "bbox": f"{xmin},{ymin},{xmax},{ymax}",
        "bboxSR": "5514",
        "imageSR": "5514",
        "size": f"{width},{height}",
        "format": "tiff",
        "pixelType": "F32",
        "interpolation": "RSP_Bilinear",
        "renderingRule": json.dumps({"rasterFunction": "None"}),
    }
    for attempt in range(3):
        try:
            response = requests.get(SOURCE, params=params, timeout=120)
            response.raise_for_status()
            info = response.json()
            if "error" in info:
                raise RuntimeError("ČÚZK export error: " + str(info["error"]))
            href = info.get("href")
            if not href:
                raise RuntimeError("No export raster URL: " + str(info)[:600])
            raster = requests.get(href, timeout=180)
            raster.raise_for_status()
            return raster.content
        except Exception:
            if attempt == 2:
                raise
            time.sleep(4 * (attempt + 1))

def main():
    points = ground_points()
    blob = download_raster(points)
    with rasterio.MemoryFile(blob) as mem:
        with mem.open() as raster:
            print("Raster", raster.width, raster.height, "bands", raster.count, "dtype", raster.dtypes)
            if raster.count != 1:
                raise ValueError("ČÚZK did not return a single-band elevation raster")
            if raster.crs and raster.crs.to_epsg() not in (5514, None):
                raise ValueError(f"Unexpected coordinate reference {raster.crs}")
            samples = np.asarray([row[0] for row in raster.sample(points)], dtype=float)
            if raster.nodata is not None:
                samples[samples == raster.nodata] = np.nan
    valid = np.isfinite(samples) & (samples >= 100) & (samples <= 350)
    print("Valid heights", int(valid.sum()), "/", len(samples),
          "range", float(np.nanmin(samples)), float(np.nanmax(samples)))
    if valid.sum() < len(samples) * .98:
        raise ValueError("Missing/unrealistic elevations; refusing to publish a false DEM")
    center = float(samples[(N * N) // 2])
    values = [int(round((float(value) - center) * 10)) if ok else 0
              for value, ok in zip(samples, valid)]
    payload = {
        "source": "ČÚZK DMR 4G (5 m source grid); 10 m game sampling",
        "license": "CC BY 4.0",
        "credit": "© ČÚZK / Zeměměřický úřad",
        "origin": [LAT0, LON0],
        "n": N,
        "step": STEP,
        "min": -HALF,
        "base": round(center, 2),
        "values": values,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, separators=(",", ":"), ensure_ascii=False), encoding="utf-8")
    print("Wrote", OUT, "at centre altitude", center, "m, samples", N * N)

if __name__ == "__main__":
    main()
