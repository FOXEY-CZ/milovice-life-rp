# Milovice RP — rychlý handoff vývoje

> **5.250 (21. 11. 2026; CI a Pages před ověřením):** V bývalém Vojenském zátiší v Italské nyní foto-GPS pozice původních dvou veřejných 2025 fotografií a originální OSM 29bodový obrys way 53865882 / RÚIAN 40057411 filtrují 3 zakryté stěnové úseky (indexy 1, 7, 26). Původních 15 kandidátů zdobení se mění na **12 skutečně přímo viditelných stěn podle geometrického testu**, původních 13 odhadovaných skvrn omítky na **11**, 2 společné mesh dávky. Sousední budovy ani případné stromy se v testu nezohledňují, samotná geometrická viditelnost *není* fotogrammetrie. Originální GPS, střecha, silnice, NPC, kolize, textury bez foto pixelů, okna, vchody neměněné. scripts/osm-italska-photo-sightlines-5250.js, nový source Node test, mobilní Chromium/SwiftShader 6,6s LOD, dev-check italska a workflow. Diagnostika: window.__miloviceItalskaSightlineRuntime5250(). [Kontrolní kamera 5.250](https://foxey-cz.github.io/milovice-life-rp/?v=525000&streetAudit=italska-vojen-zatisi-5249). **Po commitu musí být skutečně ověřeny CI, screenshot i nasazení.**

> **5.249 (21. 11. 2026; GitHub Actions PASS, Pages samostatně NEověřené):** Původní fotografické přiblížení omítky a střechy Vojenského zátiší na Italské. [Foto 04](https://commons.wikimedia.org/wiki/File:Italsk%C3%A1,_Milovice_04.jpg), [foto 05](https://commons.wikimedia.org/wiki/File:Italsk%C3%A1,_Milovice_05.jpg), Stanislav Doronenko, CC BY-SA 4.0, 20. 8. 2025. Původně 15 foto-orientovaných stěn a 13 přibližných skvrn; 5.250 opravuje 3 skryté hrany. 5 původních PR kontrol PASS, [sloučeno #30](https://github.com/FOXEY-CZ/milovice-life-rp/pull/30). Počet pater v OSM není udán.

> **5.248 (21. 11. 2026; GitHub Actions PASS):** Žluté modelové nástupištní pásy u skutečných OSM platform 549346219/994855884 bezpečně ořezány vůči hranici polygonu a kolejím, 26 úseků / 500,98 m na kompletním regionálním OSM. Mobilní kamera v daný okamžik viděla 6 pásů / 58 m. Fotodůkaz přesného vzoru dlažby chybí. [Main aeb2408](https://github.com/FOXEY-CZ/milovice-life-rp/commit/aeb24083500695733b374f7560ea9e794bf969d3).

> **5.247 (21. 11. 2026; GitHub Actions PASS):** Ochrana generických NPC chodců před skrytým přeříznutím silnice pomocí 0,7m koridoru na celé mapované trase. OSM zdroj zachoval 648 pěších fragmentů a 288 bezpečných pokračování; fyzické cesty se neměnily. [Main 7567bb0](https://github.com/FOXEY-CZ/milovice-life-rp/commit/7567bb0ae6207c1d0af7c62062e138a165c487ce).

## Rozpracované uliční celky a omezení

- Italská, Rakouská, Višňová, Lesní a okolí Armádní: původní OSM/RÚIAN bloky, chodníky, travnaté plochy, bytové domy, obyvatelé a doprava. Půdorys z OSM **není fotodůkaz** skutečných oken, vchodů a barev.
- Nádraží a Bike Tower, Topolová 614–618 (vstupy 616–618 ještě čekají na ověření), Sportovní, Průběžná, Školská, kostel, Milten, Juventský les, garáže: stále ve vývoji, **nikoliv hotová městská rekonstrukce**.
- Civilní doprava 5.240–5.241 používá povolené původní OSM silnice a nevykonává viditelný teleport na konci jednosměrky. Běžní chodci 5.243–5.247 používají jen mapované bezpečné pěší segmenty a jejich pokračování.

## Další krok

1. Ověřit GitHub Actions, skutečný mobilní screenshot a Pages po 5.250; nikdy neprohlašovat neproběhlé testy za PASS.
2. Pokračovat **celým blokem Italská–Rakouská**, zvlášť skutečným chodníkem OSM 1484073943, nemalovaným přechodem 1484073944 (nevymýšlet zebru) a sousedními původními obytnými/skladovými objekty. Pro případné nové 3D prvky potřebujeme konkrétní OSM nebo veřejné licencované foto důkazy; nepřidávat fiktivní lampy, stromy, vstupy či parkování.
3. 60 FPS je stále cíl, nikoliv zaručená hodnota. Technická kamera z GPS fotografie nemá nutně přesný heading.

Hra: https://foxey-cz.github.io/milovice-life-rp/
Repo: https://github.com/FOXEY-CZ/milovice-life-rp
Úplná historie a jednotlivé důkazy: README.md.
Pracovní režim: AGENTS.md, docs/DEVELOPMENT_WORKFLOW.md, docs/STREET_WORKFLOW.md.
