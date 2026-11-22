# Milovice RP — aktuální handoff

> **5.274 (22. 11. 2026; [PR #57](https://github.com/FOXEY-CZ/milovice-life-rp/pull/57) sloučen v `0c56061`; 5/5 hlavních CI PASS; [GitHub Pages #45035319544](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45035319544) PASS)** — **pouze poloha již existující modelové zebry Pod Lesem** se mění z dříve nezaměřeného odhadu **10,5 m od Armádní** na **původní společný OSM uzel chodníku a silnice** `50.2285685,14.8727322`, vzdálený **8,782 m od napojení** (posun asi 1,718 m). Je to lepší **mapová návaznost na pěší trasu**, ne důkaz centimetrové přesnosti nového vodorovného značení.

## Provedená změna a její ochrany 5.274

- Úprava existujícího zdrojově zamčeného `scripts/osm-pod-lesem-municipal-crossing-5270.js`. Silnice `128087258` hash `6e14ec02` + Armádní `1331897690` hash `197dbea8` + originální chodník `1005977571` hash `263e12b3` (7 bodů, `footway=sidewalk` + `surface=paving_stones`). Chodník a silnice sdílejí **přesný zdrojový uzel**, modelová zebra se umisťuje do jeho středu bez úpravy jejich původního GPS. Všechna OSM označení, šířky, kolize, dopravní sítě, zdroje materiálů a původní ostatní střety s nově zmapovanými `footway=crossing` zůstávají.
- **Existenci** přechodu dokládá [městská zakázka](https://zakazky.mesto-milovice.cz/contract_display_85.html), *přesné umístění namalovaných pruhů* zatím nikoliv. [Archiv 29/26](https://ud.mestolysa.cz/archiv.html) (24. 8. 2026, `MULNL-SC/54044/2026/Uh/132`) obsahuje správní záznam, ale situační výkres se dosud nepodařilo získat a pro geometrii ho nelze použít.
- Změněné testy `scripts/osm-pod-lesem-municipal-crossing-5270.test.mjs` + Chromium mobil/široký `scripts/osm-pod-lesem-municipal-crossing-webgl-5270.mjs` se zachováním regresí 5.272 a 5.273; 7,2 s LOD, bez kolizí a nový build `20261122-pod-lesem-walk-aligned-527400`. **5/5 CI PASS**: [Validate](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45034524713), [Italská a Pod Lesem Chromium/SwiftShader mobil+wide po 7,2s LOD](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45034524644), [Station photo](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45034524656), [Nádražní](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45034524747), [blok 5.82](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45034524660). Screenshoty nové zebry byly staženy; **wide screenshot skutečně obrazově prohlédnut** a označení zůstává na asfaltu. **GitHub Pages PASS:** [deploy #45035319544](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45035319544) pro `main` `5277f4e` včetně sloučené 5.274. Technický pohled po případném Pages nasazení: https://foxey-cz.github.io/milovice-life-rp/?v=527400&streetAudit=pod-lesem-municipal-crossing-5270

## Další krok

Node/WebGL CI potvrzeny, zebra po 7,2 s LOD zůstává na asfaltu; PR #57 sloučen, wide screenshot prohlédnut. GitHub Pages nasazení bylo ověřeno (viz nahoře). Pak pokračovat po souvislé ulici s dalšími doloženými chodníky, krajnicemi a budovami; skutečné obruby/přesnou polohu přechodu brát až z oprávněných fotek či situačního výkresu.

## Předchozí ověřený základ

**5.273** [PR #56](https://github.com/FOXEY-CZ/milovice-life-rp/pull/56) merge `45000e5`, [Pages #45033633077](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45033633077) PASS. Zjištěn a vizuálně opraven přesah hnědé cesty `1011197688` do asfaltu Pod Lesem, jen vizuální začátek +3,05 m, bez GPS/silničního grafu. **5.272** [PR #55](https://github.com/FOXEY-CZ/milovice-life-rp/pull/55), dvě modelové asfaltové výplně v OSM lomech na Pod Lesem. **5.271** [PR #54](https://github.com/FOXEY-CZ/milovice-life-rp/pull/54), bezpečnost segmentového testu proti duplikátnímu přechodu. **5.270** [PR #53](https://github.com/FOXEY-CZ/milovice-life-rp/pull/53) městem doložený přechod se starým odhadem polohy.

Repo: https://github.com/FOXEY-CZ/milovice-life-rp
Pravidla: `AGENTS.md`, `docs/DEVELOPMENT_WORKFLOW.md`, `docs/STREET_WORKFLOW.md`.
