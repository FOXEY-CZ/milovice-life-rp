# Milovice RP — aktuální handoff

> **5.272 (22. 11. 2026; [PR #55](https://github.com/FOXEY-CZ/milovice-life-rp/pull/55) sloučen, commit `3b02659`; všech 5 hlavních CI PASS, [Pages #45031920240](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45031920240) PASS)** — geometrické vyhlazení dvou skutečných OSM zlomů původní šestimetrové asfaltové ulice Pod Lesem `128087258` před Armádní. Dva malé trojúhelníkové **modelové výplně vnitřních spár** se napojují na existující silniční pásy, stejný DEM, materiál a road-batch. **Nejsou zaměřenými obrubníky ani novou vozovkou.** Zdrojové uzly, půdorysy, kolize, GPS, přístup `motor_vehicle=no`, NPC, zebra z 5.271 a 60FPS rozpočet zůstávají nedotčeny.

## Podklady, rozsah a nutné ověření 5.272

- Zamčená OSM geometrie: Pod Lesem `128087258` hash `6e14ec02` (4 uzly, `width=6`), návazná Pod Lesem `83076185` hash `63325626` a Armádní `1331897690` hash `197dbea8`. Vybírají se pouze původní vnitřní uzly indexů 1 a 2. Vyplňují se dvě vypočtené trojúhelníkové spáry. **Míry hran jsou jen výpočet z OSM modelové šířky, nejsou fotogeodeticky zjištěny.**
- **Testy PASS (5/5 hlavních):** [Validate](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45031303470), [Italská a Pod Lesem Chromium/SwiftShader mobil+wide po 7,2s LOD](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45031300115), [Station photo](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45031303506), [Nádražní](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45031303456), [blok 5.82](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45031303498). Test Italská skutečně loguje `PASS 5.272` v Node a mobilním + širokém Chromium po 7,2 s LOD, původní přechod 5.271 zůstává. Screenshoty jsou uložené jako CI artefakty; nebyly však zatím samostatně obrazově otevřeny nebo porovnány s fotografií. **GitHub Pages verze 5.272: [deploy #45031920240](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45031920240) úspěšný pro `main` dokumentační HEAD `f96cd33` (zahrnuje merge PR #55).**
- Technický pohled: https://foxey-cz.github.io/milovice-life-rp/?v=527200&streetAudit=pod-lesem-bends-5272 (po úspěšném Pages nasazení). Kamera není fotografie reality.
- Další krok: samostatně prohlédnout obě CI fotky a porovnat s oprávněnou skutečnou fotografií, pak doplnit **jen doložené** hranice vozovek a opravdové pěší návaznosti celé Pod Lesem/Armádní podle oprávněných fotek nebo půdorysů. Nepřidávat fiktivní ostrůvky, lampy, obrubníky ani přechody.

## Dosavadní ověřený základ

**5.271** [PR #54](https://github.com/FOXEY-CZ/milovice-life-rp/pull/54) sloučen v `98cf32a`, navazující docs `7218ddb`. Oprava detekce nového OSM `footway=crossing` poblíž modelové zebry kontroluje celé OSM segmenty, nejen vrcholy. **5/5 hlavních CI PASS**: [validace](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45029768140), [Italská mobilní WebGL](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45029755345), [Station photo](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45029768156), [Nádražní](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45029768269), [blok 5.82](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45029768155). **Pages PASS**: [#45030455309](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45030455309).

**5.270** [PR #53](https://github.com/FOXEY-CZ/milovice-life-rp/pull/53): [městem doložená zakázka P25V00000049](https://zakazky.mesto-milovice.cz/contract_display_85.html) obsahuje přechod Pod Lesem u Armádní, ovšem jeho **zvolený střed 10,5 m od napojení je MODEL** bez geodetické přesnosti. Původní asfalt a OSM šířka 6m, dopravní síť a zebra zůstávají ve 5.272.

**5.269** [PR #52](https://github.com/FOXEY-CZ/milovice-life-rp/pull/52): doložená žulová dlažba Rakouská × Pod Lesem, délka upravených ramen odhad. **5.268** [PR #51](https://github.com/FOXEY-CZ/milovice-life-rp/pull/51): opt-in technická linka pro existující OSM chodníky, bez nových přechodů. Detaily předchozí práce v README.

Repo: https://github.com/FOXEY-CZ/milovice-life-rp
Pravidla: `AGENTS.md`, `docs/DEVELOPMENT_WORKFLOW.md`, `docs/STREET_WORKFLOW.md`.
