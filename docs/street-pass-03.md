# Další uliční blok: 5. května × Mírová × Školská

**Milovice RP, 16. 11. 2026.** Účel: návazný, evidence-first průchod *celým blokem*, nikoli náhodné zdobení jednotlivé budovy. Přednádražní parkoviště 5.81.27 prošlo uživatelským vizuálním přezkumem technických nedostatků; fotogrammetrická přesnost okolí stále nebyla potvrzena.

## Veřejné fotografické reference

1. **5. května – pohled 26. 7. 2014**, Tiia Monto, [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Milovice_-_5._kv%C4%9Btna.jpg), CC BY-SA 4.0, kamera **50.227797, 14.884813**. Na fotografii jsou viditelné souvislá asfaltová vozovka, sousedící domy v teplých odstínech se šikmými červenými střechami, úzký chodník, místní zeleň/živé ploty, sloup s vedením a směrové tabule. Přítomné auto je pouze stav z roku 2014, nikoli podklad trvalého umístění. Konkrétní domovní čísla, 2026 barvy a přesné pozice stromů či značek tímto jediným směrem **nejsou ověřeny**.
2. **Mírová – pohled 30. 5. 2024**, ŠJů, [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Milovice,_M%C3%ADrov%C3%A1_(01).jpg), CC BY 4.0, kamera **50.2286667, 14.8847222**, heading 30°. Je to veřejně datovaná fotografie ulice, nikoli důkaz fasády konkrétního domu na druhé straně křižovatky.
3. **Fotograficky přiřazené budovy**: Školská 220/1, OSM `118487980`; Mírová 134/11, OSM `202367194`; Mírová 243/36, OSM `202367254`. Jejich přímé zdroje a nejistoty jsou evidované v `scripts/street-photo-evidence.js` a `docs/street-pass-01.md`. Starší dílčí stavby nepovažovat za 360° schválené.

## Pořadí revize

- **A. Fotomapa bloku:** rozepsat jednotlivé OSM úseky silnic, pěších tras a domovních půdorysů; u každého zaznamenat zdroj, datum, kameru a viditelnou stranu. OSM reference je podklad topologie, ne potvrzení fyzického detailu.
- **B. Souvislá ulice:** ověřit oba okraje vozovky, chodníky včetně vjezdů, stromy/zeleň, ploty, značení, lampy a jejich skutečnou existenci po směru ulice. Nepřenášet objekty ze záběru z roku 2014 bez dalšího ověření.
- **C. Dům po domu:** střecha (silhouette a viditelnost), fasáda, otvory a vstupy, a hlavně napojení k chodníku a terénu. Neznámé strany zůstanou provisional. Už dříve fotodoložené tři OSM domy využít jako referenční body.
- **D. Zpětný obrazový test:** porovnat herní ulici z 2–3 potvrzených kamer s autorizovanými fotografiemi, včetně pohledu 360° tam, kde existuje; kontrola kolizí, LOD a telefonních FPS. Automatické testy nepotvrzují vizuální 1:1 shodu.

## Stav

**Založený rozsah, nikoli nový 3D release.** Bez dostatečně přesné fotografické opory se nevytvářejí nové geometrie, umělé přechody, obrubníky, světla ani výsadba. Další implementace může začít jen u prvků s doložitelnou identitou a přiměřeně určenou polohou. U všech nedoložených atributů označit `estimated`/ `needs-source`.
