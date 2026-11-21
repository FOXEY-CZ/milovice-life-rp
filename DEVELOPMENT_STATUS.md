# Milovice RP — rychlý handoff vývoje

> **5.252 (21. 11. 2026; GitHub Actions/mobilní WebGL/Pages pro tuto verzi NEověřené):** **Oprava chybějícího kusu skutečné Italské:** originální OSM `highway=residential` **8590284** (9 uzlů, FNV 233aae3b, bez `width=*`) se přiblížil k originálnímu OSM chodníku **1484073943** (7 uzlů, FNV 7d8bc0e5) tak těsně, že generická **7,8m** modelová šířka silnice zcela překryla prvních **51,968 m** původní pěší trasy. Jediná source-locked výjimka mění modelový rozměr silnice na **5,0 m**, společný pro render, clearance index, dopravu i bezpečnostní ořez pěšího povrchu; část původní cesty se tím znovu zobrazí: **cca 29,8 m**, dalších cca 22,2 m stále bezpečně skrytých kvůli vozovce. **5,0 m není fotoměřená ani zaměřená šířka.** Nikdo neposunul původní GPS, střednice, budovy, dveře, kolize či NPC trasy, žádná nová cesta, parkování, lampa ani přechod; oba OSM přechody 1484073944 a 1484073946 zůstávají nemalované. Nový `scripts/osm-italska-road-sidewalk-5252.js`, fail-closed Node test nad všemi zdrojovými regionálními silnicemi a 0,7m pěším clippingem, nový mobilní Chromium/SwiftShader 6,8s LOD + screenshot, GitHub workflow a `dev-check italska`. [Přímá kamera](https://foxey-cz.github.io/milovice-life-rp/?v=525200&streetAudit=italska-road-footway-5252); diagnostika `window.__miloviceItalskaRoadFootwayRuntime5252()`. **Po commitu ověřit všech pět CI PR checks a Pages, modelové míjení aut vyžaduje kontrolu.**

> **5.251 (21. 11. 2026; 5 PR CI/WebGL PASS a [Pages PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44944427874)):** Třetí [fotografie bývalého Vojenského zátiší z Rakouské](https://commons.wikimedia.org/wiki/File:Rakousk%C3%A1_(Milovice)_15.jpg) (Stanislav Doronenko, 20. 8. 2025, CC BY-SA 4.0, GPS kamery 50.226027/14.874584) odkryla šest dalších geometricky přímo viditelných původních stěn na OSM 53865882/RÚIAN 40057411: celkem 18 existujících zdobených hran, 16 modelově odhadnutých skvrn omítky a stále 2 GPU dávky. [PR #32 sloučen](https://github.com/FOXEY-CZ/milovice-life-rp/pull/32). Vizuální manuální kontrola CI screenshotu NEproběhla, pozice skvrn/heading modelové, nikoli fotogrammetrické.

> **5.250 (21. 11. 2026; 5 PR CI/WebGL PASS, [Pages PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44943022440)):** Dvě 2025 fotografie Italské; 3 zakryté původní fasádní hrany vyřazeny z 15 kandidátů, 12 přímo viditelných, 11 skvrn omítky. [PR #31](https://github.com/FOXEY-CZ/milovice-life-rp/pull/31).

## Stav uličních celků

- **Italská–Rakouská:** historická budova, sousední skutečná pěší cesta, nemalované přechody (1484073944/3946), okolní OSM sklad 53865876 a obytný dům 53865877 stále nejsou kompletní fotorealistická ulice. Silnice 8590284 má v 5.252 pracovní zúženou modelovou šířku kvůli chybějícímu chodníku, nikoliv geometricky zaměřený obrubník.
- **Další místa:** Višňová/Lesní, nádraží/Bike Tower, Topolová, Sportovní/Průběžná, Školská, kostel, garáže, Milten, Juventský les: průběžné modelové rekonstrukce, nikoliv hotové. Cíl 60 FPS není zaručená hodnota. Všechny domy/ulice navrhovat jako CELKY, bez vymyšlených vstupů či zebry.
- Stávající NPC auta respektují původní OSM trasy 5.240–5.241; generičtí chodci jen bezpečné mapované pěší trasy 5.243–5.247. Nová 5.252 upravuje ŠÍŘKU modelové silnice, nikoliv její GPS nebo povolené směry.

## Další krok

1. Ověřit 5.252 Node, mobilní WebGL po 6,8 s LOD a manuální screenshot z OSM pěší kamery; pak všech pět PR GitHub Actions, merge, Pages. Nekontrolované věci NEoznačovat PASS.
2. Pokračovat Italská–Rakouská jako celý celek: **zdrojové pěší plochy, provoz reálnými auty na 5m modelu, nemalované přechody**, sousední skutečné budovy a jejich dokumentovaná fasáda. Nepřidávat fiktivní reliéf, stromy či vchody bez podkladu.
3. Stále používat pouze původní OSM/RÚIAN GPS a přesně odlišovat *doloženou mapovou polohu* od *modelové šířky/barvy/okna*.

Hra: https://foxey-cz.github.io/milovice-life-rp/
Repo: https://github.com/FOXEY-CZ/milovice-life-rp
Historie/důkazy: README.md.
Pracovní pravidla: AGENTS.md, docs/DEVELOPMENT_WORKFLOW.md, docs/STREET_WORKFLOW.md.
