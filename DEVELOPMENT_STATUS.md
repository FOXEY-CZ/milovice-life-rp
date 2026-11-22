# Milovice RP — aktuální handoff

> **5.278 (22. 11. 2026; PR #62 sloučen, CI 60/60 PASS, Pages čeká)** — jeden simulovaný chodec u Pod Lesem × Armádní nyní chodí po **267,4 m** dvou propojených původních OSM chodníků (5.277: 196,6 m).

## Co je ve hře

- Rozšíření o **70,806 m** na OSM **1044078118**: skutečný `highway=footway`, `footway=sidewalk`, `lit=yes`, 11 GPS uzlů, hash `26506719`. Pěší cesta navazuje beze změny mapy na `1005977571` přes společný uzel `50.2290044,14.8702188`.
- NPC používá pouze první čtyři skutečné segmenty nové cesty. Na originálním uzlu 4 se otočí **9,6 m před OSM servisní silnicí 1456361936**, kde převedení chodců není prokázáno. Žádná nedoložená cesta přes Zátopkovu.
- Při neplatných původních GPS, změně tagů či přidání motorové cesty protínající prodloužení se rozšíření nevykreslí a zůstane 5.277/5.275 fallback. **4s herní predikce aut z 5.276 zůstává**, bez zastavení už zahájeného přecházení.
- Původní OSM budovy, chodníky, vozovky, obruby, parkování, GPS, kolize i rozpočet NPC zůstaly beze změn. **Nebyl vytvořen žádný další chodník, přechod ani fyzický objekt.**
- OSM uzly a tagy ověřené; skutečný materiál západní cesty, poloha namalované zebry, její obrubníky a technické azimuty kamer **nejsou foto/geodeticky ověřené**.

## Hotové ověření a odkazy

- **5.278 PR #62 MERGED**: https://github.com/FOXEY-CZ/milovice-life-rp/pull/62 ; merge commit `a850a53`, původní feature commit `ef5a0a9`. **60/60 GitHub Actions PASS** (55 push + 5 PR), včetně Node `PASS 5.278 +70.8m...` a Chromium/SwiftShader `PASS 5.278 joined 267m ... mobile+wide ... after LOD`, log v https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45042659993 ; screenshot artefakt `italska-apartments-5235`.
- **5.278 Pages čeká**: GitHub publikace merge commitu https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45043547046 byla naposledy `queued`, úspěch nepotvrzen.
- Technická kamera západního napojení: https://foxey-cz.github.io/milovice-life-rp/?v=527800&streetAudit=pod-lesem-west-sidewalk-5278
- Kamera původní zebry: https://foxey-cz.github.io/milovice-life-rp/?v=527800&streetAudit=pod-lesem-pedestrian-5275
- **5.277 PR #61 MERGED**: `a58f719`, 5/5 základních PR CI PASS; **Pages PASS** https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45041782043
- **5.276 PR #59 MERGED**, cílený Node/Chromium PASS, Pages PASS.

## Další přesný krok

Ověřit Pages vydání 5.278, potom pokračovat ulicí Pod Lesem nebo jiným původním OSM napojením bez improvizace pěšího křížení servisní silnice. Při stavění domů nevytvářet duplicity: tři sedmipodlažní RÚIAN domy `53865704`, `53865910`, `53865911` jsou **už v 5.219**. Fotky fasád chybí, nejsou potvrzené.

Zdroj: https://github.com/FOXEY-CZ/milovice-life-rp
Pravidla: AGENTS.md, docs/DEVELOPMENT_WORKFLOW.md, docs/STREET_WORKFLOW.md
