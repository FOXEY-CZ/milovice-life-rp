# Milovice RP — 5.81: Nádražní / celé přednádraží (fotografický plán, NE hotový build)

**Stav:** pracovní checklist navazující na funkční hru **5.80**. Tento soubor sám nemění geometrii ani nenasazuje build 5.81.  
**Předmět:** celé okolí stanice a cyklověže, nikoliv další iterace obou automatů.  
**Datum evidence:** 15. 11. 2026.  
**Zdroj nového pozorování:** **10 uživatelem předaných screenshotů panoramat Mapy.com / Seznam**, snímání uvedeno **17. 5. 2022**. Snímky jsou zde popsány, nikoliv kopírovány do repozitáře nebo herních textur. Původní GPS stanoviště panoramat z přeposlaných screenshotů **neznáme**; navigační šipky nejsou geodetické souřadnice.

## Zásady při realizaci

1. Všechny zásahy musí být doložené konkrétním zdrojem a správným OSM objektem nebo přesvědčivě spárovaným místem. Přítomnost na screenshotu **není důkaz přesné x/z pozice**. OSM budova není důkaz podoby oken.
2. **Neduplikovat** existující budovu nádraží, cyklověž, dva PID automaty, sloupky A/B ani již potvrzené parkování a vnější chodník ze 5.76. Nejprve modelové porovnání s realitou.
3. 2022 Mapy.com panorama + 2024 Commons fotografie dokládají **historický stav z různých let**. Neprohlašovat je bez dalšího ověření za stav roku 2026.
4. Žádný nově vymyšlený přechod, obrubník zasahující do silnice, sloup ve vozovce nebo domnělý přesun mezi ulicemi. Vybavení u domu z boční ulice nemusí být ve stejné rovině před nádražím.
5. Ponechat současné herní kolize, hranice budov i běžné mobilní kamery; přidávat po dávkách a kontrolovat draw cally, VRAM, FPS.
6. Nešířit obrazové pixely z Mapy.com ani nepřekreslovat přesné chráněné cedule bez licence. Pro sdílenou hru vytvářet vlastní materiály a výslovně oddělit doložený obsah od aproximací.

## Inventář fotografií přijatých 15. 11. 2026

| Záběr (podle pořadí v chatu) | Přímo pozorovatelné | Co z fotografie NEVÍME |
|---|---|---|
| 1 | Široká asfaltová plocha před budovou nádraží, červená střecha, vzrostlý strom, vpravo cyklověž, vlevo konstrukce zastávky | Přesná šířka a polygon asfaltu, rozměr stromu, jeho x/z |
| 2 | Světle omítnutý nárožní dům, tmavá střecha, obrubník, šachta, parkování, keře a ploty, boční ulice | Vazba na konkrétní OSM dům a správný směr pohledu |
| 3 | **Modrá dvouramenná lampa**, na sloupu několik skříní/kamer, zelený strom, záhony, červený informační rám, stoly a lavička před nádražím | Souřadnice paty lampy, přesné typy zařízení, rozměry záhonů |
| 4 | Skleněná polygonální cyklověž s viditelnou vnitřní ocelovou konstrukcí, modrá vstupní část, vysoký sousední stožár, žluté značení **BUS** a obrubník | Přesné polohy značek na vozovce, délka stání, rozměry stožáru |
| 5 | Cyklověž v pozadí, zaparkovaná auta, jednosměrné a zákazové značky, nárožní světle růžový dům | Správné OSM napojení domu, přesné počty stání |
| 6 | Velký vzrostlý strom, budova nádraží, cyklověž, parkovací auta a travnatý pás | GPS kmene, zda dnešní parkování odpovídá roku 2022 |
| 7 | Navazující ulice s žlutým značením **BUS**, řada aut, dopravní značky a stromořadí | Přesný OSM way a orientace dopravních značek |
| 8 | Žlutý dům, stříška autobusového přístřešku, lavičky, koš, živý plot a plot | Identita/OSM ID domu a přesná poloha přístřešku |
| 9 | Pruh s označením **BUS**, jednosměrná značka, chodník vedle cyklověže a další dopravní prostor | Přesná délka a začátek BUS značení |
| 10 | Celkový pohled přes velkou asfaltovou plochu na nádraží, vpravo řada aut, dvojramenná lampa a vzrostlý strom | Skutečné rozměry plochy a přesný počet parkovacích míst |

**Poznámka:** Pozorované fyzické objekty (strom, přístřešek, lampa, značka) jsou důkaz, že *tam v roce 2022 byly*, nikoliv podklad pro náhodné souřadnice. Parkující auta a chodci představují přechodný stav; neopisovat jejich konkrétní rozmístění.

## Existující implementace — co nesmíme stavět podruhé

- Nádražní budova: **OSM 53865956**, cyklověž: **OSM 1011197691**; identita a půdorysy jsou už ve `scripts/station-forecourt-pass.js` a stavebních generátorech. Viditelnost a proporce ověřit screenshotem, ne novým náhodným objektem.
- **Sloupky A/B už existují** ve `scripts/station-forecourt-pass.js` a jejich testech. Zdroj je geotagovaná Commons fotografie z **30. 5. 2024**; současná metodika hledá bezpečné umístění nejvýše 6 metrů od GPS fotoaparátu (nikoliv přesnou GPS sloupku). A = Nádražní, B = 5. května; tato dvě stanoviště se nesmí sloučit.
- Jeden velký strom, **dvojramenná lampa a záhon** jsou v plánovači zatím jako `deferred=['broadleaf','twin-lamp','flowerbed']`. V kódu pro ně jsou přípravné modely, **ale zatím se nevkládají do scény**, protože není zajištěná přesná pozice. To je správná ochrana před vymyšlenými objekty.
- Existující **parkovací ostrov 5.76, vnější souvislý chodník a samostatný roh u nádraží** jsou v `scripts/station-photo-parking.js`; **nevytvářet nový chodník přes silnici**.
- Oboje reálné automaty, bílé dveře a pravoúhlé okno tvoří samostatný dokončený dílčí blok **5.77–5.80**. Neotevírat jej, pokud nepřibyl důkaz skutečného nesouladu.
- `data/rebuild2-street-inventory.json` a `docs/REBUILD-2.md` zůstávají hlavní evidencí **celých ulic včetně domů, zeleně, značek a 360° kontroly**.

## Checklist 5.81 — pořadí provedení

### A. Plochy a dopravní funkce (P0)

- [ ] Srovnat **reálnou širokou asfaltovou plochu** a její napojení s aktuální 3D geometrií. Zachovat OSM síť a nepřepojit falešně boční ulice.
- [ ] Ověřit dvě strany parkování, souvislý *vnější* chodník, obrubníky, pěší průchod z nádraží a přístup k cyklověži; porovnat 2022 / 2024 podklady a aktuální model.
- [ ] Pro **žluté BUS označení** určit konkrétní úseky OSM a směr autobusů pomocí fotografií **4, 7, 9** a případně jiného nezávislého pohledu; dokud není přisazení prokázané, jen **evidovat kandidátní úsek**.
- [ ] Porovnat sloupky **A/B již existující ve hře** se samostatnými Commons fotografiemi a panoramaty 2022; ověřit stranu, orientaci, bezpečný pěší průchod a nerozbitý provoz.

### B. Dominanty a bezkolizní umístění (P1)

- [ ] Revidovat **OSM cyklověž 1011197691**: polygonální skleněný plášť, viditelná ocel uvnitř, modrý přízemní vstup, chodník, přístup. Opravit pouze foto-doložený nesoulad.
- [ ] Pro velký strom **identifikovat místo kmene** porovnáním alespoň dvou fotografických směrů proti okolním stavbám a vegetaci; ověřit kolize s chodníkem a vozovkou. **Do té doby neodstraňovat `broadleaf` z deferred.**
- [ ] Stejně určit patu **dvojramenné modré lampy** a její orientaci k vozovce. Spárovat s panoramaty **3 a 10**; správný tvar Y a zdokumentované umístění kamer/boxů. **Do té doby neodstraňovat `twin-lamp` z deferred.**

### C. Mobiliář, výsadba, značky (P2)

- [ ] Označit hranice výsadby z panoramatu **3**: nízké záhony, stůl/stoly, lavička, červený informační rám. Souřadnice a počty před umístěním doložit; **`flowerbed` ponechat deferred**.
- [ ] Katalogizovat dopravní značky (jednosměrka, zákaz vjezdu/odbočení, zákaz zastavení) z panoramat **2, 5, 7, 9**; nejdříve určit jejich **přesnou ulici a líc směrem k řidiči**.
- [ ] Porovnat stávající povrchy, trávník, odpadkové koše a zastávkové prvky. Nespravovat přístřešky nově, pokud již existují.

### D. Návaznost na 5.82 (P3)

- [ ] Identifikovat **žlutý dům a černý přístřešek** z panoramatu **8** s konkrétními OSM prvky a lokální pěší komunikací.
- [ ] Identifikovat **nárožní světlý dům a přilehlou křižovatku** z panoramat **2 a 5**, připojit k uličnímu inventáři; nevyvozovat orientaci domu jen z barvy.
- [ ] Průjezdnost sousedních ulic, výhledy, obruby, parkovací stání a vegetační hranice ověřit z obou konců ulice.

## Povinné ověření před nasazením 5.81

- [ ] **Žádná nová scéna s odhadnutými souřadnicemi** bez evidované dvojice: identita OSM / důkaz konkrétní pozice. Až po ověření lze částečně uvolnit `deferred` pro daný objekt.
- [ ] OSM road-clearance, pěší průchodnost, základny stromů/stožárů, kolize s budovami, značením a vozidly; dvojité chodníky přes silnici = automatické odmítnutí.
- [ ] Otestovat regresi `node scripts/station-forecourt-pass.test.mjs` + `node scripts/station-photo-parking.test.mjs` + ostatní testy z `.github/workflows/validate.yml`.
- [ ] WebGL/Chromium desktop + portrétní mobil: stejná kamera na skutečnou plochu a protilehlý pohled; žádné FPS/divné LOD výkyvy, žádná ztráta základních budov, správné pořadí a skutečné načtení oblasti.
- [ ] Ověřit **všech 360°** kolem hlavních objektů a přilehlých komunikací, včetně úrovně chodníku a střešních obrysů.
- [ ] **Uživatel schvaluje konkrétní upravené částí, ne celou Nádražní**, která je stále v rekonstrukci podle REBUILD 2.0.

## Co je v 5.81 fakticky možné udělat už teď

1. **Bezpečně:** přesně zdokumentovat screenshoty a kandidáty, doplnit inventář a srovnávací audit staré scény bez změny polohy; prověřit stávající A/B a cyklověž.
2. **Až po kotevních důkazech:** přidat strom, dvojramennou lampu, záhony, BUS značení, přístřešky a cedule. Fotografie dokládá vzhled/přítomnost, **nikoliv sama o sobě měřenou polohu**.
3. **Pozdější 5.82:** okolní domy a propojené přístupové ulice; to je stále jeden konzistentní uliční systém, ne samostatné objekty rozmístěné od oka.

**Doporučená první implementační dávka:** diagnostická scéna / porovnávací inventář „pohled od Bike Tower na nádraží + opačný pohled“ s vyznačenými existujícími OSM kotvami a auditními značkami, nikoliv fyzické fiktivní lavičky či nová asfaltová vrstva.
