# Milovice RP — aktuální handoff

> **5.282 (22. 11. 2026; PR #67 MERGED, CI 5/5 PASS, Pages PASS #45052283109)** — 4 existující obytné budovy **Armádní 886, 887, 890 a 891** jsou původní RÚIAN/OSM objekty s 4 podlažími a 25 byty každá. Celkem 100 bytů, modelově **360 oken na 26 původních venkovních hranách** a pouze 16 společných 3D meshů. Půdorysy, výšky, střechy a kolize se nemění; přesná poloha/počet/barva skutečných oken **nebyly fotoověřené**, bez vymýšlení vchodů či balkonů. C15/C16 na Armádní 890/891 doloženo městským zápisem 29/2024, souřadnice a podlaží ověřené RÚIAN. Dvě technické kamery `armadni-houses-east-5282` a `armadni-houses-west-5282`; nový Node + mobilní/široký Chromium/WebGL test. **5/5 CI PASS** na konečném commitu `807df25`: Validate #45051610933, Station #45051610960, Nádražní #45051610978, street-block #45051610954 (**skutečný mobilní i široký Chromium/SwiftShader PASS po 7,1 s LOD**), Italská #45051611029. PR https://github.com/FOXEY-CZ/milovice-life-rp/pull/67 sloučen jako `84932bb`. GitHub Pages nasazení https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45052283109 **completed/success** pro commit `c86da96`. Ruční porovnání s reálnými fasádními fotografiemi nebylo potvrzené.

> **5.281 (22. 11. 2026; PR #66 MERGED, 5/5 CI PASS, Pages PASS #45050325323)** — pět původních pěších úseků u „Nadzemí podzemí“, OSM `435045331`, `435050519`, `1330579585`, `1330579586` a `1330579587`, je označeno `tunnel=yes; layer=-1`. Oprava skrývá jejich **11 nesprávných povrchových pásů (cca 136 m)** na DEM; neodstraňuje jejich mapové GPS, cesty ani původní metadata. Podzemní fyzický 3D tunel (hloubka, vchody, průřez) nebyl bez podkladů vymyšlen. **5/5 PASS** na závěrečném commitu `fba66e4`: Validate #45049498971, Station #45049498952, Nádražní #45049499045, blok 5.82 #45049498956 (**nový mobilní+široký Chromium test Vrutice PASS po LOD**), Italská #45049498963. PR https://github.com/FOXEY-CZ/milovice-life-rp/pull/66 sloučen do `main` jako `7e5f5b6`. Build `20261122-vrutice-underground-528100`. Nasazení Pages https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45050325323 **completed/success** na commitu `799e3f2`; živý runtime webu ani screenshoty nebyly nezávisle fotograficky přezkoumány.

> **5.280 Pages GitHub Actions PASS** — nasazení https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45048472704 skončilo `completed/success` na commitu `5330b753` dne 22. 11. 2026. Přímý runtime v uživatelském prohlížeči nebyl nezávisle prohlédnut.

> **5.280 (22. 11. 2026; PR #65 MERGED, CI 5/5 PASS, Pages 45048472704 PASS)** — jediný modelový chodec na původní 267,399m pěší trase Pod Lesem se nyní natáčí plynule (max. 4,6 rad/s), krokové pohyby váže na ušlou vzdálenost a při čekání na modelové zebře zklidní ruce/nohy. Nedotčeny OSM GPS, trasa, dopravní pravidla, ochrana 5.279, objekty, kolize, NPC limit a FPS rozpočty. Nový build marker `20261122-pod-lesem-walker-pose-528000`. **5/5 PASS**: Validate #45047702331, Station #45047702377, Nádražní #45047702338, blok 5.82 #45047702355, Italská mobilní/široký WebGL #45047702343. [PR #65](https://github.com/FOXEY-CZ/milovice-life-rp/pull/65) sloučen `969e716`; screenshoty CI nebyly nezávisle obrazově přezkoumány. Nasazení Pages zatím nepotvrzené.

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

Pages 5.282 PASS. Otevřít obě technické kamery Armádní a porovnat s vhodně licencovanými fotografiemi stejného domu/úhlu. Po takové kontrole nahradit modelové rastry skutečně doloženými barvami, okny a balkony v celém 4domovém bloku, ne vymýšlenými náhodnými detaily. Podzemní cesty nemají namodelované chybějící tunely nebo vchody. Při stavění domů nevytvářet duplicity: tři sedmipodlažní RÚIAN domy `53865704`, `53865910`, `53865911` jsou **už v 5.219**. Fotky fasád chybí, nejsou potvrzené.

Zdroj: https://github.com/FOXEY-CZ/milovice-life-rp
Pravidla: AGENTS.md, docs/DEVELOPMENT_WORKFLOW.md, docs/STREET_WORKFLOW.md
