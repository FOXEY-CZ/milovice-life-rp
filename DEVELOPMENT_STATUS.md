# Milovice RP — aktuální handoff

> **5.278 (22. 11. 2026; vývojová větev, CI/PR/Pages čekají)** — jediný simulovaný chodec Pod Lesem × Armádní používá 267,4 m propojených původních OSM chodníků místo 196,6 m ve verzi 5.277.

## Zdrojová data a hotová změna

- +**70,806 m** z původního `highway=footway, footway=sidewalk, lit=yes` OSM **1044078118**, 11 GPS uzlů, hash `26506719`. Původní 1005977571 se s ním potkává přesně v `50.2290044,14.8702188`; využijí se pouze čtyři první segmenty přidané cesty.
- Jeden chodec se otočí na jejím zdrojovém uzlu index 4, **9,6 m před servisní vozovkou OSM 1456361936** na uzlu 5. Ta není doložena jako pěší přechod; další část chodníku se nepřechází. Žádná vymyšlená trasa přes Zátopkovu, nové cesty, přechody, kolize, obruby, budovy, lampy či parkování.
- Procházení zebry z 5.274 a 4s predikce aut z 5.276 zůstávají. Pokud se nová motorová OSM komunikace střetne se segmentem prodloužení, 5.278 se bezpečně deaktivuje a použije 5.277/5.275.
- Ověřené jsou OSM GPS a tagy. Materiál chodníku, skutečná poloha malby zebry, fasády a úhel technické kamery **nejsou fotograficky/geodeticky doložené**.

## Ověření

- Nový `scripts/osm-pod-lesem-west-join-5278.js` s `.test.mjs`, úpravy původní logiky 5.277 a predikce 5.276, Chromium mobile + wide a druhá technická kamera po 7,2 s LOD. **5.278 CI/PR/Pages zatím nepotvrzeny.**
- Kamera na západním napojení: https://foxey-cz.github.io/milovice-life-rp/?v=527800&streetAudit=pod-lesem-west-sidewalk-5278
- Kamera u zebry: https://foxey-cz.github.io/milovice-life-rp/?v=527800&streetAudit=pod-lesem-pedestrian-5275
- **5.277 PR #61 sloučen do main** jako `a58f719`, **5/5 hlavních CI PASS** na PR commitu `0cf22ccd` včetně mobilního Chromium/WebGL, screenshot artefakt `italska-apartments-5235`. Stav Pages po sloučení ověřit samostatně.
- **5.276 PR #59** sloučen, cílené Node/Chromium PASS a Pages PASS.

## Další krok

Dokončit CI a screenshot 5.278, merge při úspěchu, ověřit Pages. Následnou servisní silnici nepřecházet bez podkladů o skutečném převedení. Sedmipodlažní domy OSM 53865704, 53865910 a 53865911 již byly modelovány ve 5.219; nevytvářet duplicity.

Repo: https://github.com/FOXEY-CZ/milovice-life-rp
Postup: AGENTS.md, docs/DEVELOPMENT_WORKFLOW.md, docs/STREET_WORKFLOW.md
