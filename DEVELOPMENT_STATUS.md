# Milovice RP — aktuální handoff

> **5.279 (22. 11. 2026; vývojová větev, PR/CI/Pages čekají)** — k původnímu chodci Pod Lesem × Armádní přidána **jedna modelová postava** na oddělené původní OSM pěší odbočce 1272081412, přibližně 109 m. Hlavní 267,4m trasa 5.278 se nemění.

## Nový ověřitelný krok: odbočka Pod Lesem

- OSM `1272081412`: `highway=path, lit=no`, devět původních GPS uzlů, hash `69d970c5`. Uzel index 8 je přesně totožný s indexem 4 chodníku `1005977571` na `50.2288905,14.8710178`. Používají se původní uzly **8 až 1**.
- Uzel index 0 je přímo totožný s uzlem 2 původní ulice Pod Lesem `83076185` (hash `63325626`). Nový NPC se **otočí už u indexu 1, přibližně 14,8 m před osou vozovky**, bez nedoloženého přechodu. Celá nová trasa má od motoristických OSM cest nejméně cca 9 m odstup os (předpokládané okraje vozovek nejsou měřením).
- Modul `scripts/osm-pod-lesem-branch-walker-5279.js` kontroluje geohash, přesné tagy, návaznost na 5.278 a každou možnou průsečnou motoristickou OSM linii. Když se zdroje změní nebo trasa není dostatečně daleko od vozovek, další NPC se nevytvoří.
- **Žádný** nový chodník, vozovka, křížení, světlo, materiál, kolize, vstup, budova ani fyzický detail. `lit=no` neznamená vymyšlené lampy; OSM nemá `surface`, takže materiál netvrdit. Postavy nejsou skutečné zaznamenané osoby.
- Jeden přidaný humanoidní rig respektuje celkový limit 65 chodců a běžné LOD. Předchozí 5.278 4s dopravní predikce zůstává.

## Testy a kamery

- Nový `scripts/osm-pod-lesem-branch-walker-5279.test.mjs` a mobilní + široký `scripts/osm-pod-lesem-branch-webgl-5279.mjs` po 7,2 s LOD v Italská workflow. **CI výsledky a nové screenshoty zatím nepotvrzeny.**
- Nová technická kamera: https://foxey-cz.github.io/milovice-life-rp/?v=527900&streetAudit=pod-lesem-branch-5279 — skutečná GPS, azimut 185° technický ODHAD.
- **5.278 PR #62** https://github.com/FOXEY-CZ/milovice-life-rp/pull/62 MERGED (`a850a53`), **60/60 PR+push CI PASS**. GitHub Pages 5.278 **PASS**, novější dokumentační main `328e07f`: https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45043743449. Původní merge Pages `45043547046` byl automaticky zrušen a nahrazen úspěšným běžícím dokumentačním commitem.
- **5.277 PR #61** MERGED, 5/5 CI PASS a Pages PASS; **5.276 PR #59** MERGED a Pages PASS.

## Další přesný krok

Ověřit nový Node + Chromium mobilní/široký WebGL v 5.279 včetně existence právě jedné další postavy a žádné nové silnice. PR sloučit jen po PASS, následně ověřit Pages. U domu a souvislé ulice požadovat autorizované fotografie/OSM — nic nevymýšlet; 7podlažní bloky `53865704, 53865910, 53865911` jsou už ve 5.219, nepřidávat duplicitně.

Repo: https://github.com/FOXEY-CZ/milovice-life-rp
Pravidla: AGENTS.md, docs/DEVELOPMENT_WORKFLOW.md, docs/STREET_WORKFLOW.md
