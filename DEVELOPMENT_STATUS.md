# Milovice RP — aktuální handoff

> **5.280 (22. 11. 2026; PR #65 MERGED, CI 5/5 PASS, Pages nepotvrzeno)** — jediný modelový chodec na původní 267,399m pěší trase Pod Lesem se nyní natáčí plynule (max. 4,6 rad/s), krokové pohyby váže na ušlou vzdálenost a při čekání na modelové zebře zklidní ruce/nohy. Nedotčeny OSM GPS, trasa, dopravní pravidla, ochrana 5.279, objekty, kolize, NPC limit a FPS rozpočty. Nový build marker `20261122-pod-lesem-walker-pose-528000`. **5/5 PASS**: Validate #45047702331, Station #45047702377, Nádražní #45047702338, blok 5.82 #45047702355, Italská mobilní/široký WebGL #45047702343. [PR #65](https://github.com/FOXEY-CZ/milovice-life-rp/pull/65) sloučen `969e716`; screenshoty CI nebyly nezávisle obrazově přezkoumány. Nasazení Pages zatím nepotvrzené.

> **5.279 (22. 11. 2026; PR #64 MERGED, CI 5/5 PASS, Pages zatím neověřeno)** — západní trasa Pod Lesem nově odmítne i **plný či částečný souběžný překryv** s novou OSM motorovou komunikací; v 5.278 se odmítalo jen běžné protínání. Aktuální původní 267,4m trasa se nemění. **5/5 kontrol GitHub Actions PASS**: Validate #45045544270, Station photo #45045544166, Nádražní #45045544231, blok 5.82 #45045544157, Italská mobilní WebGL #45045544273. PR: https://github.com/FOXEY-CZ/milovice-life-rp/pull/64 ; merge commit `7d07ee1`. Nebyly vytvořeny nové GPS, objekty, silnice, chodníky, NPC ani kolize. Screenshoty nebyly nezávisle obrazově prověřeny.

> **Poznámka k Pages 5.278:** při kontrole Actions běhu #45043547046 build PASS, deploy CANCELLED; tento běh není potvrzením nasazení. Mohlo dojít k nahrazení novějším deployem, který zatím nebyl ověřen.

> **5.278 (22. 11. 2026; PR #62 sloučen, CI 60/60 PASS, Pages čeká)** — jeden simulovaný chodec u Pod Lesem × Armádní nyní chodí po **267,4 m** dvou propojených původních OSM chodníků (5.277: 196,6 m).

## Co je ve hře

- Rozšíření o **70,806 m** na OSM **1044078118**: skutečný `highway=footway`, `footway=sidewalk`, `lit=yes`, 11 GPS uzlů, hash `26506719`. Pěší cesta navazuje beze změny mapy na `1005977571` přes společný uzel `50.2290044,14.8702188`.
- NPC používá pouze první čtyři skutečné segmenty nové cesty. Na originálním uzlu 4 se otočí **9,6 m před OSM servisní silnicí 1456361936**, kde převedení chodců není prokázáno. Žádná nedoložená cesta přes Zátopkovu.
- Při neplatných původních GPS, změně tagů či přidání motorové cesty protínající prodloužení se rozšíření nevykreslí a zůstane 5.277/5.275 fallback. **4s herní predikce aut z 5.276 zůstává**, bez zastavení už zahájeného přecházení.
- Původní OSM budovy, chodníky, vozovky, obruby, parkování, GPS, kolize i rozpočet NPC zůstaly beze změn. **Nebyl vytvořen žádný další chodník, přechod ani fyzický objekt.**
- OSM uzly a tagy ověřené; skutečný materiál západní cesty, poloha namalované zebry, její obrubníky a technické azimuty kamer **nejsou foto/geodeticky ověřené**.

## Hotové ověření a odkazy

- **5.278 PR #62 MERGED**: https://github.com/FOXEY-CZ/milovice-life-rp/pull/62 ; merge commit `a850a53`, původní feature commit `ef5a0a9`. **60/60 GitHub Actions PASS** (55 push + 5 PR), včetně Node `PASS 5.278 +70.8m...` a Chromium/SwiftShader `PASS 5.278 joined 267m ... mobile+wide ... after LOD`, log v https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45042659993 ; screenshot artefakt `italska-apartments-5235`.
- **Pages 5.278/5.279:** původní 5.278 Pages run https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45043547046 skončil s build PASS, ale deploy CANCELLED; úspěšný novější deploy dosud neověřen.
- Technická kamera západního napojení: https://foxey-cz.github.io/milovice-life-rp/?v=527800&streetAudit=pod-lesem-west-sidewalk-5278
- Kamera původní zebry: https://foxey-cz.github.io/milovice-life-rp/?v=527800&streetAudit=pod-lesem-pedestrian-5275
- **5.277 PR #61 MERGED**: `a58f719`, 5/5 základních PR CI PASS; **Pages PASS** https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45041782043
- **5.276 PR #59 MERGED**, cílený Node/Chromium PASS, Pages PASS.

## Další přesný krok

Ověřit GitHub Pages pro 5.280 podle skutečného build markeru a vizuálně zkontrolovat chodce v technické kameře. Poté se vrátit ke komplexní rekonstrukci celé ulice/bloku podle veřejných fotografií a OSM, místo dalších neviditelných mikroúprav; bez improvizace pěšího křížení servisní silnice. Při stavění domů nevytvářet duplicity: tři sedmipodlažní RÚIAN domy `53865704`, `53865910`, `53865911` jsou **už v 5.219**. Fotky fasád chybí, nejsou potvrzené.

Zdroj: https://github.com/FOXEY-CZ/milovice-life-rp
Pravidla: AGENTS.md, docs/DEVELOPMENT_WORKFLOW.md, docs/STREET_WORKFLOW.md
