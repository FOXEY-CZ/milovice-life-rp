# Milovice RP — aktuální handoff vývoje

> **5.269 (22. 11. 2026; PR/CI ZATÍM NEOVĚŘENÉ):** Zdrojová práce na skutečném povrchu křižovatky **Rakouská × Pod Lesem**. Oficiální [Zápis Rady města Milovice 42/2025, str. 4, 12. 11. 2025](https://www.mesto-milovice.cz/assets/File.ashx?id_dokumenty=19018&id_org=9519) výslovně uvádí žulové dlažební kostky v místě výkopu na těchto ulicích, **neurčuje však přesné hranice ani rozměry**. Ve zdrojovém OSM exportu dosud **bez `surface=*`**: původní Rakouská **8590288** (19 GPS uzlů, hash `7486fd8b`), Pod Lesem **8590287** (5 uzlů, hash `2da4a507`), jejich **společný OSM uzel 50.2244708,14.8721468**. Nový source-lock `scripts/osm-rakouska-granite-5269.js` renderuje **pouze povrchové žulové kostky** na **4 modelových ramenou × 12 m** = **48 m podél původních os**. Délka/hranice jsou výslovně **MODEL ODHAD**, ne terénní zaměření. Jde o **skutečnou viditelnou změnu běžného 3D povrchu**, bez nové cesty, ostrůvku, obruby, přechodu, plotu, materiálu/textury, fyzické vrstvy, šířky vozovky, kolize, GPS, NPC nebo dopravy. Pro zobrazení se znovu použije sdílený světově zarovnaný materiál žulové dlažby Kaštanové 5.261. Kreslení rozděluje jen 4 původní úseky; jejich celková délka zůstává shodná. Všude jinde na Rakouské a Pod Lesem se nepodložený materiál nemění.

## Přesný další krok

**Nejdříve PR + CI 5.269:** spustit Node source-lock test (délky, GPS, hash, odmítání změn), mobilní Chromium/SwiftShader WebGL >7,2 s LOD, screenshoty `rakouska-granite-5269-mobile.png` a `-wide.png` a širší regresní workflow. Pokud projdou, **obrazově prohlédnout screenshoty** a sloučit. Teprve potom potvrdit Pages deploy. Žádné falešné PASS. Dál dohledat *skutečné* foto či pozemkové podklady pro další uliční plochy / chodníky, ne rozšiřovat délku kostek podle dojmu.

## Poslední dokončené a publikované práce

- **5.268 [PR #51](https://github.com/FOXEY-CZ/milovice-life-rp/pull/51)** sloučena do `main` jako `99ad157`, navazující docs `2a0843d`; 5/5 hlavních PR CI PASS. [GitHub Pages deployment 5.268](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45024812581) **SUCCESS**. Na OSM Rakouské 8590288 ↔ obytné spojce 8590286 ↔ původním neznačeném přechodu 1484073944 ↔ originální 534,368m pěší síti Italské vznikl **opt-in diagnostický 3D pohled**, nic fyzického ani nová zebra. Mob.+wide screenshoty otevřeny a posouzeny, čáry opravdu jen diagnostické. 
- **5.267 [PR #50](https://github.com/FOXEY-CZ/milovice-life-rp/pull/50)** 5/5 PR CI PASS: podle Wikimedia Commons foto Rakouská 15 modelový (NEZAMĚŘENÝ) příčný zelený plot 13,75m s mezerou 3,3m u markýzy; po kontrolních screenshotch viditelný. 
- **5.266 [PR #49](https://github.com/FOXEY-CZ/milovice-life-rp/pull/49)** podélný zelený plot a vegetace na Rakouské, modelové polohy. **5.265 [PR #48](https://github.com/FOXEY-CZ/milovice-life-rp/pull/48)** modelové skleněné zádveří. **5.264/5.263** fotograﬁcky podložené změny horní fasády a historického nároží Vojenského zátiší.

**Ulice Rakouská–Italská není hotová.** Městský zápis je bodová informace o materiálu, **ne fotodůkaz celé ulice** ani záruka hotového výkopu. OSM/RÚIAN, existující domy 53865876/53865877, vchody a nepodložené chodníky/obruby neměnit jen odhadem. Pracovní šířky z předchozích verzí nejsou survey. Dopravní proud a cíl mobilních 60 FPS hlídat.

Hra — po potvrzení deploy 5.269: https://foxey-cz.github.io/milovice-life-rp/?v=526900&streetAudit=rakouska-granite-5269

Repo: https://github.com/FOXEY-CZ/milovice-life-rp

Postup: `AGENTS.md`, `docs/DEVELOPMENT_WORKFLOW.md`, `docs/STREET_WORKFLOW.md`.
