## 5.29.1 — Oprava celého profilu střechy Školská 220/1

**Zdroj:** [ŠJů, Wikimedia Commons, 30. 5. 2024](https://commons.wikimedia.org/wiki/File:Milovice,_%C5%A0kolsk%C3%A1_1.jpg), CC BY 4.0. Fotografie ukazuje přízemní plnou fasádu a vysokou tmavou střechu s obytným podkrovím a **dvěma výraznými příčnými štíty s obloukovými okny**. Předchozí herní model měl nesprávné druhé plné fasádní podlaží a izolované „krabičky“ vikýřů.

**Konkrétní změny:**

- OSM 118487980 má nepravidelný sedmibodový půdorys. Hlavní čtyřsklonová střecha používá stále jeho původní identifikaci a obrys. Nové souvislé svislé plochy od vrchu zdiva po matematickou střešní rovinu a 30cm uzavřené okapní přesahy zabraňují pohledu skrz dům pod šikmou střechou.
- Dva výrazné štítové prvky mají nové originální spojité střešní plochy, podbití, štítové boky a zakončení. Původní samostatně rotované kvádry střech se u této budovy **vůbec nepoužívají**.
- Na základě foto-proporcí je výška **plné obvodové stěny k okapu přibližně 3,75 m**, zatímco druhá mapovaná úroveň je ztvárněna jako podkroví **pod hlavní střechou**, nikoliv plné druhé patro s pravidelnou řadou oken. Přibližné výšky nejsou geodeticky změřené.
- Výrazné příčné štíty mají rozdílné orientační rozměry a přibližně 43° sklon odvozený z vizuálního poměru na fotografii; přesný rozměr, poloha oken a boční či zadní fasáda zatím **nejsou 360° doložené**.
- Oprava se uplatní **jen** na OSM ID 118487980. Nádraží, kostel, okolní jiné domy, cesty, průchod a mobilní ovládání se nemění.
- Matematická kontrola používá přímo sedm hran z `data/milovice-osm.json` a vyžaduje uzavřený spoj, podbití, roviny střech a průchod browserovým WebGL testem. Uživatelovy screenshoty z mobilu jsou finální vizuální kontrola.

---

# Milovice RP — Street pass 02: Školská 220/1 and adjoining roofs (v5.29.0)

**13 November 2026 — first building-by-building reconstruction after station roof approval.**

## OSM 118487980 — Školská 220/1

- Source: [Wikimedia Commons, Milovice, Školská 1](https://commons.wikimedia.org/wiki/File:Milovice,_%C5%A0kolsk%C3%A1_1.jpg), ŠJů, 30 May 2024, CC BY 4.0.
- Positively photo-anchored identifying traits: cream masonry, dark pitched roof, **two street-facing small gables with arched attic windows**.
- **New 3D work**: arched attic windows now use a curved glass polygon and a matching continuous plaster border, with a mullion, transom, and sill. Previously the windows were rectangles with a separate hemispheric glass object and a straight top bar.
- The curved profile is reusable original game geometry, but **placed specifically on this building** based on photographic traits, not assigned randomly to surrounding houses.
- Photo-anchored facades no longer receive random shutters, decorative lintels, or unverified door awnings. Unobserved door and window locations remain approximate; this does not constitute a 360-degree survey.
- Footprint and OSM identity stay fixed. No copyrighted photo pixels or proprietary map tiles are embedded in the game.

## Street-level roof cleanup

- Previous city renderer drew a horizontal LineLoop at one fixed height around **every building**, even gable or hipped roofs. This created black floating seams, jagged corners and one unnecessary draw call per building.
- v5.29.0 removes this unsupported feature globally. Real landmark-specific 3D eaves remain in place, including the accepted v5.28.8 station.
- The building audit queue remains unchanged: 44 station-area candidates, with most sites awaiting independent facade photos. **No unphotographed neighboring house has been promoted to verified.**

## Next building-by-building steps

1. Station OSM 53865956 → Školská 220/1, OSM 118487980: photo-anchored model, not a completed multi-angle reconstruction.
2. Identify further station-area OSM IDs against dated source photos before changing their real-looking doors and windows; use 360° whenever available.
3. Follow the inventory in data/architecture/building-audit-queue.json; retain a source link and uncertainty for each face.
4. Preserve the approved station roof and continue reporting actual phone FPS separately from desktop WebGL tests.

## Automated checks

- Genuine arched glass/border profile and removal of the old rectangular-plus-sphere fake arch.
- No generic roof-line shim, and no random ornaments on previously photo-anchored facades.
- WebGL checks for two arched attic windows, all existing photo-anchored landmark IDs and public architecture cards.
