#!/usr/bin/env python3
"""Sample Czech ČÚZK DMR 4G raster for wider Milovice in 20 m geographic tiles.

Grid values are in decimetres around each tile's absolute (Bpv) center elevation.
The JS client subtracts the original old-town center altitude for seamless world Y.
Regional sample spacing 20 m is for LOD/performance, not a surveyed building height.
"""
import json
import math
import pathlib
import sys
import time
import requests
import numpy as np
import rasterio
from pyproj import Transformer

ROOT=pathlib.Path(__file__).resolve().parent.parent
REGIONS=json.loads((ROOT/"data/regions/index.json").read_text(encoding="utf8"))["regions"]
ORIGIN_LAT=50.226
ORIGIN_LON=14.889
COSLAT=math.cos(math.radians(ORIGIN_LAT))
PROJECT=Transformer.from_crs("EPSG:4326","EPSG:5514",always_xy=True)
URL="https://ags.cuzk.gov.cz/arcgis2/rest/services/dmr4g/ImageServer/exportImage"

def geo(x,z):
    return ORIGIN_LON+x/(111320*COSLAT),ORIGIN_LAT-z/111320

def get_raster(points):
    xx=np.array([p[0] for p in points])
    yy=np.array([p[1] for p in points])
    x0,x1=float(xx.min()-55),float(xx.max()+55)
    y0,y1=float(yy.min()-55),float(yy.max()+55)
    params={
      "f":"json","bbox":f"{x0},{y0},{x1},{y1}","bboxSR":"5514","imageSR":"5514",
      "size":f"{math.ceil((x1-x0)/5)},{math.ceil((y1-y0)/5)}",
      "format":"tiff","pixelType":"F32","interpolation":"RSP_Bilinear",
      "renderingRule":json.dumps({"rasterFunction":"None"})
    }
    errors=[]
    for k in range(3):
        try:
            res=requests.get(URL,params=params,timeout=160);res.raise_for_status()
            info=res.json()
            if "error" in info or not info.get("href"):
                raise ValueError("DMR4G export error: "+str(info)[:500])
            tif=requests.get(info["href"],timeout=180);tif.raise_for_status()
            return tif.content
        except Exception as exc:
            errors.append(str(exc));time.sleep(3*(k+1))
    raise RuntimeError("DMR download failed: "+"; ".join(errors))

def export_region(region):
    west,south,east,north=region["bbox"]
    xmin=(west-ORIGIN_LON)*111320*COSLAT
    xmax=(east-ORIGIN_LON)*111320*COSLAT
    zmin=-(north-ORIGIN_LAT)*111320
    zmax=-(south-ORIGIN_LAT)*111320
    step=20.
    nx=math.ceil((xmax-xmin)/step)+1
    nz=math.ceil((zmax-zmin)/step)+1
    points=[PROJECT.transform(*geo(xmin+ix*step,zmin+iz*step))
            for iz in range(nz) for ix in range(nx)]
    blob=get_raster(points)
    with rasterio.MemoryFile(blob) as mem:
        with mem.open() as raster:
            if raster.count!=1:
                raise ValueError("Expected 1 elevation band")
            values=np.fromiter((float(row[0]) for row in raster.sample(points)),dtype=np.float64,count=len(points))
            if raster.nodata is not None:values[values==raster.nodata]=np.nan
    valid=np.isfinite(values)&(values>=100)&(values<=350)
    if valid.sum()<len(points)*.98:
        raise ValueError(f"Not enough elevation samples for {region['id']}: {valid.sum()}/{len(points)}")
    center=float(values[(nz//2)*nx+nx//2])
    rounded=[int(round((float(v)-center)*10)) if bool(ok) else 0 for v,ok in zip(values,valid)]
    output={
       "source":"ČÚZK DMR 4G (5m source), 20m regional game grid",
       "credit":"© ČÚZK / Zeměměřický úřad","license":"CC BY 4.0",
       "region":region["id"],"origin":[ORIGIN_LAT,ORIGIN_LON],
       "minX":round(xmin,3),"minZ":round(zmin,3),
       "step":step,"nx":nx,"nz":nz,"base":round(center,3),"values":rounded
    }
    target=ROOT/"data/regions"/region["terrain"]
    target.write_text(json.dumps(output,separators=(",",":"),ensure_ascii=False),encoding="utf8")
    print(region["id"],nx,nz,"min/max",round(float(values[valid].min()),1),round(float(values[valid].max()),1),
          "file",target.stat().st_size,flush=True)

if __name__=="__main__":
    only=set(sys.argv[1:])
    for region in REGIONS:
        if region["id"]=="old" or (only and region["id"] not in only):continue
        export_region(region)
