# Milovice RP — aktuální handoff (22. 11. 2026)

> **Aktuální herní verze 5.284** — nové barevné 3D fasády na původním domě **Armádní č.p. 891**. PR [#70](https://github.com/FOXEY-CZ/milovice-life-rp/pull/70) **MERGED** do `main` jako `dc53056a4f5ac2750e083de6ec8e2376a356ccc9`, konečný testovaný commit `9990e28424b410e0d97994002534c6646033516b`. **CI 5/5 PASS**. GitHub Pages run [#45058662005](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45058662005) byl při zápisu ve frontě; nasazení 5.284 zatím **nepotvrzeno**. Základní poslední potvrzené Pages [#45056339198](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45056339198) před 5.284 = PASS.

## Co je skutečně změněné v 5.284

- **Jedna původní RÚIAN budova:** Armádní **891**, OSM `1047406190`, RÚIAN `107125749`, geometrický hash `e8e44d23`, 4 podlaží, 25 bytů. Exteriérová realitní fotogalerie na **výslovné adrese č.p. 891**: https://jirisimon.cz/milovice/ . Na fotografiích dokončeného domu jsou vidět **světlejší horní stěny, tmavší přízemí, balkony**. To jsou reálné fotografie (na rozdíl od STAKO C16 vizualizace).
- Nový `scripts/osm-armadni-891-photo-wall-5284.js`: pouze pro originální zdrojový půdorys 891 vykreslí světlou horní fasádu, tmavé přízemí a tenkou světlou oddělovací linku. **10 původních obvodových hran**, **2 meshe / 60 trojúhelníků** za dosavadními modelovými okny a nad jejich soklem. Neviděné strany stěn, odstíny RGB a výška pruhu **~2,90 m** jsou **modelové odhady**, ne fotometrické/geodetické zaměření.
- Fotky od třetí strany **nejsou kopírované do assetů**; v in-game panelu technické kamery je externí odkaz a vysvětlení nejistoty. Viditelné balkony nebyly doplněny, protože není bezpečně přiřazená jejich přesná fasádní hrana v RÚIAN polygonu.
- **Nedotčeno:** původní OSM GPS, 4 budovy Armádní 886/887/890/891, **100 bytů**, **360 odhadnutých oken** na původních 26 fasádních hranách, střechy, modelové výšky, fyzické zdi, kolize, pěší síť, doprava, ostatní město; **0 nových budov, vchodů, balkonů, cest a colliderů**.
- **CI všech 5 PASS na koncovém PR commitu `9990e28`:** [Validate #45057876965](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45057876965) (včetně nového source-locked Node testu a opravného HUD buildu), [street-block + mobilní/široký Armádní Chromium/SwiftShader po 7,1s LOD #45057876946](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45057876946), [Station #45057876927](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45057876927), [Nádražní #45057876947](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45057876947), [Italská #45057876959](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45057876959). Tyto testy prokazují přítomnost meshů a kompatibilitu scény, **ne pixelovou shodu se skutečnou fasádou**.

## Dřívější poslední dokončené úseky

- **5.283** — [PR #68](https://github.com/FOXEY-CZ/milovice-life-rp/pull/68) a [#69](https://github.com/FOXEY-CZ/milovice-life-rp/pull/69) MERGED, oba CI 5/5 PASS, [Pages #45056339198](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45056339198) PASS. Rozbalitelný audit zdrojů v kamerách Armádní. [Městský zápis rady 29/2024, str. 2](https://milovice.hlasenirozhlasu.cz/files/milovice/attachments/249858/Anonymizovany-Zapis-z-jednani-29-2024-2547.pdf#page=2) dokládá **C15 = č.p. 890, C16 = č.p. 891**; STAKO vizualizace ≠ fotografie realizované stavby.
- **5.282** — [PR #67](https://github.com/FOXEY-CZ/milovice-life-rp/pull/67) MERGED, CI 5/5, [Pages #45052283109](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45052283109) PASS: 4 původní bytové domy Armádní s 360 **modelovými** okny přes 16 meshů, nikoli replikami skutečných oken.
- **5.281** — [PR #66](https://github.com/FOXEY-CZ/milovice-life-rp/pull/66) MERGED, CI 5/5, [Pages #45050325323](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45050325323) PASS: 11 chybných **povrchových** pruhů (~136 m) z 5 OSM podzemních pěších cest `tunnel=yes;layer=-1` skryto. Podzemní průřezy, vchody a samotný tunel nejsou zamodelované bez podkladů.
- **5.280** — [PR #65](https://github.com/FOXEY-CZ/milovice-life-rp/pull/65) MERGED, CI 5/5, [Pages #45048472704](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45048472704) PASS: plynulejší otáčení a krokování chodce Pod Lesem po původních 267,4 m OSM chodníků.
- **5.279** — [PR #64](https://github.com/FOXEY-CZ/milovice-life-rp/pull/64) MERGED, CI 5/5: blokuje i kolineární překryv pěší trasy s importovanou motorovou cestou.

## Ověřovací kamera a další přesný krok

[Armádní 890/891 — nová světlá/tmavá fasáda 891](https://foxey-cz.github.io/milovice-life-rp/?v=528400&streetAudit=armadni-houses-east-5282)

[Armádní 886/887 — původní domy, zatím modelové fasády](https://foxey-cz.github.io/milovice-life-rp/?v=528400&streetAudit=armadni-houses-west-5282)

**Další krok:** samostatně potvrdit přesnou fasádní hranu balkonů č.p. **891** porovnáním autoritativně licencované exteriérové fotografie s okolní OSM pěší a uliční sítí. Bez identifikace strany nepřidávat hádané balkony. Pro č.p. 890/886/887 získat vlastní foto každého domu. Po další změně zachovat souvislý celý blok včetně střech, návaznosti chodníků a FPS rozpočtu.

Plný changelog a důkazy: [README.md](https://github.com/FOXEY-CZ/milovice-life-rp/blob/main/README.md). Pravidla: `AGENTS.md`, `docs/DEVELOPMENT_WORKFLOW.md`, `docs/STREET_WORKFLOW.md`.
