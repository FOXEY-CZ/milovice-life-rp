# Milovice RP — rychlý handoff vývoje

> **5.268 (22. 11. 2026; PR/CI dosud čekají):** Po obrazové kontrole 5.267 screenshotů (plot ve hře viditelný, žádné tvrzení o dokonalé foto shodě) je prioritou **pěší návaznost Rakouská × Italská**. Původní OSM Rakouská **8590288** (hash `7486fd8b`) sdílí GPS uzel **50.2259647,14.8745896** s obytnou spojkou **8590286** (hash `916afa20`, ~73,08 m). Ta sdílí GPS uzel **50.2255209,14.8752199** s **neoznačeným pěším přechodem 1484073944** (hash `9c3463dd`), navazujícím na původní **534,368m** OSM pěší řetězec `1484073943–1484073947` (verze 5.233), obsahující druhý neoznačený přechod **1484073946**. `scripts/osm-rakouska-walk-link-5268.js` přidává bezpečně zdrojově zamčený **opt-in TECHNICKÝ inspektor**, který na real-world OSM stopách kreslí 3 nadzemní diagnostické linkové dávky (tyrkysová: původní chodníky, žlutá: neoznačená crossing way, růžová: původní osa obytné spojky). **NEJSOU to namalované zebry, nové fyzické chodníky, obrubníky, silniční značení ani změna krajiny**. Pouze při `?v=526800&streetAudit=rakouska-walk-link-5268`; v normální hře 0 dalších meshů. Nezměněná OSM GPS, povrchy, 3D vozovka, šířky, kolize, AI doprava a NPC. **Fotografický či geodetický doklad pro samostatný obrubník přímo před Vojenským zátiším stále chybí. Nedoplňovat jej odhadem.**

## Kde pokračovat

**PR/CI a stav verze 5.268:** vzniká v rámci současného vývojového kroku; dokud GitHub Actions nevypíšou PASS, neprohlašovat ji za dokončenou. Nové Node testy vyžadují přesné původní identifikátory, všechny GPS návaznosti, žádné nové fyzické objekty a 3 inspekční dávky; nový mobilní Chromium SwiftShader screenshot test kontroluje přes 7,2 s LOD. Starší push-only CI odhalilo dvě **zastaralé testové šablony**: Topolová 5.183 již při změně vozidla/resetu maže i naváděcí beacon; Višňová 5.217 barevný materiál je nadále přítomen, ale od 5.249 má fotoověřená Italská v syntaxi prioritu. Testy jsou upraveny podle současného chování, žádná příslušná herní funkce není odebrána. Devět literal BUILD_ID kontrol 5.258–5.267 je změněno na obecnou kontrolu existence; ostatní testy nadále ověřují konzistenci meta/HUD/JS.

**Příští 5.269:** prohlédnout 5.268 OSM diagnostické screenshoty a vybrat podle veřejných fotografií/OSM **skutečně ověřený úsek povrchu, obrubníku či návaznosti**. Bez podkladů nevyrábět další vymyšlený pás před Vojenským zátiším. Ověřit, že osy 8590288 a 8590286 zůstaly 3D bezpečné a že tyto technické linky vůbec nejsou viditelné při normálním hraní.

## Poslední ověřená verze v main

**5.267 [PR #50](https://github.com/FOXEY-CZ/milovice-life-rp/pull/50)** sloučena v `20819a1`, následné dokumentační `a9408fc`; 5/5 hlavních PR CI PASS. [GitHub Pages build/deploy a9408fc úspěšný](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45023050584), takže publikace 5.267 potvrzena. [Italská/Rakouská WebGL + screenshoty](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45022507613) PASS (fotky otevřeny a vizuálně posouzeny). Verze přidala příčný 13,75m nízký zelený modelovaný plot před bývalým Vojenským zátiším s 3,3m modelovou mezerou k markýze, nad původní budovou **53865882 / RÚIAN 40057411**; polohy a délky jsou fotograficky inspirovaný **ODHAD**, nikoliv skutečné zaměření. Plot je pouze vizuální a bez kolizí, dveří či brány.

**5.266 [PR #49](https://github.com/FOXEY-CZ/milovice-life-rp/pull/49):** původní OSM Rakouská 8590288, souvislý modelový podélný plot a porost v 3 dávkách. **5.265 [PR #48](https://github.com/FOXEY-CZ/milovice-life-rp/pull/48):** dekorativní zádveří/markýza. **5.264 [PR #47](https://github.com/FOXEY-CZ/milovice-life-rp/pull/47), 5.263 [PR #46](https://github.com/FOXEY-CZ/milovice-life-rp/pull/46):** vyšší nároží Vojenského zátiší, pozorované horní okno a omítky. Starší informace v README.

Celé Rakouská–Italská je stále **NEHOTOVÁ**. Neměnit bez dokladů domy 53865876, 53865877, silnice, chodníky, vstupy či domy přilehlého bloku. Všechny pracovní modelové šířky/obrubníky jsou odhady, skutečné GPS OSM/RÚIAN musí zůstat.

## Odkazy

- Inspektor 5.268 **až po potvrzeném deploy**: https://foxey-cz.github.io/milovice-life-rp/?v=526800&streetAudit=rakouska-walk-link-5268
- Stará publikovaná 5.267: https://foxey-cz.github.io/milovice-life-rp/?v=526700&streetAudit=rakouska-cross-frontage-5267
- Repo https://github.com/FOXEY-CZ/milovice-life-rp
- Pravidla `AGENTS.md`, `docs/DEVELOPMENT_WORKFLOW.md`, `docs/STREET_WORKFLOW.md`.
