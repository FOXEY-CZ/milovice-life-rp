# Milovice RP — rychlý handoff vývoje

> **5.166 (19. 11. 2026, CI/WebGL/Pages zatím neověřeno):** AI auta na původní OSM Topolové 8618275 umí modelově zpomalit a zastavit s odstupem 3,5 m před dvěma existujícími zebrami 1316882854 a 1316882853, pokud k nim míří simulovaný chodec z 5.165. Chodec může počkat u obruby, dokud auto nedobrzdí nebo neprojede. Všechny 4 směry příjezdu jsou zdrojově uzamčeny na GPS (hash silnice c0fe69b0); žádná nová silnice, zebra, vchod, značka, lampa ani kolize. **Hráčem řízené auto není automaticky brzděno.** Je to omezený model lokální AI, ne certifikovaný bezpečnostní systém. Nový unit a mobilní WebGL/LOD test byly přidány; CI a Pages musí být ověřeny po commitu.

## Spuštění a zdroje
- Hra: https://foxey-cz.github.io/milovice-life-rp/
- Kontrolní kamera 5.166: https://foxey-cz.github.io/milovice-life-rp/?v=516600&streetAudit=topolova-priority-5166
- Kamera 5.165: https://foxey-cz.github.io/milovice-life-rp/?v=516500&streetAudit=topolova-loop-5165
- GitHub: https://github.com/FOXEY-CZ/milovice-life-rp
- Podrobná historie: README.md. Pravidla: AGENTS.md, docs/DEVELOPMENT_WORKFLOW.md, docs/STREET_WORKFLOW.md.
- Herní kód index.html, související moduly scripts/, původní mapová data data/regions/mlada.json.

## Nedávné ověřené verze
- **5.165 (18. 11.; [CI](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44418230501), [mobilní WebGL](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44418230404), [Pages](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44418229247) PASS):** původní OSM 222,740 m pěší okruh po východním chodníku 1316882852, jižní zebře 1316882854, západním chodníku 1314665579 a severní zebře 1316882853; 7 originálních GPS bodů, 6 úseků, 1 nový NPC a celkem 6 lokálních.
- **5.164 ([CI PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44414690496)):** skutečná 196,93 m spojitá pěší trasa z více OSM ways bez teleportu.
- **5.163 ([CI PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44413071918)):** 102,53 m původního dlážděného chodníku Topolové a 2 další NPC.
- **5.162 ([CI PASS](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/44409477126)):** 29,3 m původní pěšiny a 2 NPC.
- **5.160/5.161:** jedna skutečně zdrojově podložená valbová střecha Topolová 614–618 a označené *modelové* fasády 616–618 podle sousedních dokumentací 614/615.
- **5.155–5.159:** pětipatrový blok 614–618 podle úředních podkladů; Topolová 646 foto-fasády, bez vymyšlených otvorů na nedoložených stranách.
- **Starší části:** rozpracované Sportovní/Průběžná, MŠ Sluníčko, Milten, centrum, nádraží/Bike Tower, Školská, Mladá, kostel, garáže, Juventský les a další. Ne všechny budovy jsou fotograficky dokončené.

## Priority a přísná pravidla
1. **Celé propojené realistické Milovice**, ulice jako celky: domy, střechy, vstupy, okna, chodníky, vozovka, parter, zeleň, osvětlení a skutečné dopravní interakce. OSM/RÚIAN ID/GPS zachovat.
2. Fotografie dokazují jen skutečně viděné strany; rozměry/odstíny a interpolované části označit jako model, nelíčit je jako zaměřenou realitu. Neumisťovat bez důkazů fiktivní vchody, parkovací stání, semafory, přechody, lampy, stromy nebo ploty.
3. **Další po 5.166:** pozorování skutečného setkání AI auta s čekajícím NPC na zebře (mobilní WebGL test); poté objektově doložené skutečné vstupy 616–618 a dokončování souvislého ulicového parteru. Hráčem řízené auto je nadále mimo automatické brzdění.
4. Nejistoty: fasády 616–618 extrapolace; Sportovní 587 u ČSÚ uvádí tři podlaží celkem bez potvrzení počtu nadzemních; plán 109 stání a 22 lamp v Průběžné neudává ověřené polohy.
5. Zrychlený workflow: přečíst HEAD a tento přehled, poté jen relevantní 1–3 sekce README a kód. Jedna věcná práce, pokud lze jeden atomický commit i s unit/mobilním Chromium WebGL testem. CI/Pages označit PASS jen pokud byly reálně úspěšné. Rychlé unit: node scripts/dev-check.mjs sportovni.
