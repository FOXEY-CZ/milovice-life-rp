# Milovice RP — rychlý handoff vývoje

> **5.167 (19. 11. 2026; CI/WebGL/Pages PASS):** specializovaný **skutečný mobilní WebGL dopravní scénář** pro test přednosti na jižním existujícím přechodu Topolové: v režimu `streetAudit=topolova-encounter-5167&encounterTest=1` se na skutečný OSM 8618275 segment 13,5 m před zebrou 1316882854 vloží jediné **testovací skutečně animované AI auto**. Původní chodec 5.165 se neteleportuje, jde až k obrubě; AI brzda je z již ověřeného modulu 5.166. Nové WebGL assertions: chodec čekal, auto skutečně brzdilo a zastavilo před přechodem, chodec přešel na západní chodník bez auta na zebře a vozidlo po přejití pokračovalo. **[Celkové CI PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44551388868), [skutečný AI+chodec mobilní WebGL PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44551389164), [GitHub Pages PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44551387919).** V reálném herním cyklu test pozoroval chodec čeká → AI auto brzdí a zastaví → chodec přejde → auto pokračuje; kontrola neporušení 3,5m modelové rezervy při přecházení PASS. Scénář nepředstírá univerzální bezpečnost. V běžné hře `encounterTest` vypnut => **0 vozidel navíc**. Původní GPS/OSM, vozovka, zebry, budovy, vchody, zelené plochy, kolize a starší NPC **beze změn**. Jde o herní scénář, nikoliv statisticky ověřenou dopravní bezpečnost v celém městě.

## Odkazy
- Hra: https://foxey-cz.github.io/milovice-life-rp/
- Nová testovací kamera 5.167: https://foxey-cz.github.io/milovice-life-rp/?v=516700&streetAudit=topolova-encounter-5167&encounterTest=1
- Běžná 5.166 kontrolní kamera: https://foxey-cz.github.io/milovice-life-rp/?v=516600&streetAudit=topolova-priority-5166
- Vývojový repozitář: https://github.com/FOXEY-CZ/milovice-life-rp
- Plný detail a další historie: README.md; pracovní pravidla AGENTS.md, docs/DEVELOPMENT_WORKFLOW.md a docs/STREET_WORKFLOW.md.

## Předchozí ověřené verze
- **5.166 (19. 11.; [CI PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44524948616), [mobilní WebGL PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44524948791), [Pages PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44524947174)):** source-locked lokální přednost AI na obou skutečných zebrách Topolové, modelový odstup zastavení 3,5m, čekání chodce; autem hráče nelze automaticky brzdit. Tehdejší test neměl skutečné setkání auta a chodce; to řeší 5.167.
- **5.165 (18. 11.; [CI PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44418230501), [mobilní WebGL PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44418230404)):** 222,740m pěší okruh východním/západním chodníkem 1316882852/1314665579 přes originální dvě zebry 1316882854/1316882853. Jeden původní animovaný chodec, celkem 6 místních.
- **5.164 (18. 11.; [CI PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44414690496)):** původní mapovaná 196,93m spojitá pěší trasa dvou OSM ways přes sdílený uzel 13.
- **5.163/5.162 (18. 11.):** dvoustranná skutečná Topolová pěší síť 102,53m + připojená 29,3m pěšina, po dvou dalších NPC.
- **5.160/5.161:** zdrojově doložená společná valbová střecha domů 614–618, 616–618 mají *extrapolované* fasády dle sousedních dokumentovaných 614/615.
- **Předchozí etapy:** kompletní seznam v README; centrum Milovic, nádraží, Školská, Slepá, Průběžná, Sportovní, Mladá, Milten, kostel, Juventský les a další jsou rozpracované, nikoli hotové celé město.

## Otevřené priority
1. **Ověřit** v Actions skutečné auto+NPC setkání 5.167 (včetně spolehlivosti na mobilním GPU a zachování FPS). Další rozšíření: validovat i severní zebra a více vozidel bez rušení hráčského provozu.
2. Pokračovat s kompletním skutečným parterem ulice: objektově doložené vstupy 616–618, reálné výšky a okna/střechy, originální povrchy, nástupní místa, osvětlení jen pokud doložené. Žádné nové spekulativní vchody, semafory nebo příčné přechody.
3. Zdrojový režim: OSM/RÚIAN ID ani GPS nepřemísťovat; fotografie jen v rozsahu viděných stran, odhady barev/poloh/výšek značit jako model. 60 FPS je cíl, nikoliv nyní nově změřený výsledek.
4. Otevřené ostatní nejistoty: Sportovní 587 má ČSÚ 3 celková podlaží, počet nadzemních nejistý; 109 stání a 22 lamp z plánů Průběžné jsou bez přesných as-built souřadnic.
5. Pracovní postup: v novém chatu ověřit main HEAD, tento soubor a 1–3 nové README sekce; číst jen související kód, pak jediný atomický commit. Pro změny scény unit + >6s mobilní WebGL/LOD + CI/Pages. Označovat PASS jen skutečné výsledky. `node scripts/dev-check.mjs sportovni`.
