# Milovice RP — rychlý handoff vývoje

> **5.168 (19. 11. 2026; source/CI/WebGL/Pages PASS):** nový test-only kontrolní scénář **severního původního OSM přechodu 1316882853 v Topolové 8618275**, pro dva simulované AI osobní vozy v opačných směrech (původní silniční OSM úseky [1] a [2], každé 13,5 m před mapovou osou) a stávajícího chodce 5.165. Přednost a brzdění řídí 5.166, vozidla používají běžný reálný `rpAnimateTraffic`. Chodec je **pouze při inicializaci speciálního kontrolního režimu** zdrojově umístěn na původní západní chodník 0,7 m před severním přechodem; nedeklaruje se skutečné absolvování 223m od jihu. Jen `?streetAudit=topolova-north-encounter-5168&encounterTest=1` přidá dvě testovací auta; běžné hraní nezměněno. GPS/OSM hash vozovky `c0fe69b0`, original 2 zebry, původní budovy a terén beze změn. Kontroly připraveny: minimálně 7s mobilní WebGL po LOD, dvě auta dobrzdí, chodec čeká, přejde na východní chodník, obě auta se rozjedou bez porušení modelového odstupu 3,5 m. **Ověřeno:** [celkové CI PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44584327991), [source/unit + 7s mobilní WebGL s dvěma protijedoucími vozy PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44584327941), [regrese 5.167 PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44584328052). Obě auta zdrojových OSM úseků dobrzdila, chodec vyčkal a přešel na východní chodník, obě auta pokračovala; ani jedno při přecházení nepřekročilo modelový odstup 3,5 m. **[GitHub Pages (vývojová i dokumentační verze) PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44584706483).**

## Odkazy a pracovní stav

- Hra: https://foxey-cz.github.io/milovice-life-rp/
- Kamera 5.168: https://foxey-cz.github.io/milovice-life-rp/?v=516800&streetAudit=topolova-north-encounter-5168&encounterTest=1
- Dřívější test jižní zebry 5.167: https://foxey-cz.github.io/milovice-life-rp/?v=516700&streetAudit=topolova-encounter-5167&encounterTest=1
- GitHub: https://github.com/FOXEY-CZ/milovice-life-rp
- Všechny podrobnosti a historie verzí: `README.md`. Pracovní režim: `AGENTS.md`, `docs/DEVELOPMENT_WORKFLOW.md`, `docs/STREET_WORKFLOW.md`.

## Předchozí ověřené milníky

- **5.167 (19. 11. 2026; [CI PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44551388868), [mobilní WebGL PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44551389164), [Pages PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44551387919)):** v reálném mobilním 3D cyklu byla ověřena *jižní* zebra Topolové: jedno testovací auto opravdu dobrzdilo, chodec z 5.165 vyčkal a přešel, vozidlo pak pokračovalo bez překročení modelového odstupu.
- **5.166 (19. 11.; [CI PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44524948616), [mobilní WebGL PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44524948791), [Pages PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44524947174)):** source-locked přednost AI u obou originálních zebrových přechodů; čtyři nájezdy, modelová mez zastavení 3,5 m a čekání chodce. Hráčovo auto se nebrzdí automaticky.
- **5.165 (18. 11.; [CI PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44418230501), [WebGL PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44418230404)):** skutečný 222,740m uzavřený OSM okruh po východním chodníku 1316882852, jižní zebře 1316882854, západním chodníku 1314665579 a severní zebře 1316882853. 7 původních GPS uzlů, 6 úseků, 6 místních sim NPC celkem.
- **5.164/5.163/5.162 (18. 11.):** cca 197m souvislá chodníková navigace + 102,53m hlavní chodník a 29,3m pěšina; starší 5 původních chodců bez teleportování.
- **5.160–5.161:** originálně doložená společná valbová střecha domu 614–618, ale fasády 616–618 obsahují označené modelové extrapolace ze 614–615.
- Starší realizace: Sportovní, Průběžná, Školská, nádraží/Bike Tower, kostel, garáže, Mladá, Milten, Juventský les a jiné lokality jsou **rozpracované**, nikoliv všechna hotová geografická místa.

## Další práce

1. Nejprve ověřit 5.168 v CI/WebGL včetně reálného průběhu dvou AI aut + jednoho chodce; případně chyby skutečně opravit. Mimo testovací režim zachovat původní dopravní a pěší NPC.
2. Potom větší celek Topolové: zdrojově podložené domovní vstupy 616–618, terén, reálné přilehlé objekty a související chodníky/osvětlení. Nepřidávat spekulativní prvky.
3. OSM/RÚIAN souřadnice a ID neměnit. Veřejné fotografie podloží jen části, které jsou opravdu vidět. Kde jsou zdi/balkony/výšky/rozteče extrapolace, výslovně to přiznat. 60 FPS zůstává cíl, nikoli aktuálně měřená garance.
4. Zbylé nejistoty: Sportovní 587 má tři podlaží celkem podle ČSÚ (nadzemní počet neověřen); 109 stání a 22 lamp z návrhu Průběžné mají neznámé zaměřené souřadnice.
5. Efektivní pokračování: ověřit `main` HEAD a tento krátký status, jen 1–3 poslední README sekce, a související moduly. Pokud lze jeden atomický commit, node unit + mobilní Chromium WebGL/LOD 6+s, GitHub Actions a Pages. PASS pouze po skutečném běhu.
