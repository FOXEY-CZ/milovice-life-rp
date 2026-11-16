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


## Doplnění Part 16 — 5.81.17, 15. 11. 2026

- Na opačné (kolejové) straně parkoviště byly z již potvrzených a OSM bezpečných parkovacích polygonů odvozeny **nízké zadní obruby** a **dvě krátká krajní zakončení**. Jsou vykreslovány ve stejné instancované sadě obrub, tedy bez dalšího draw callu. Dlažba 5.81.16, silniční síť, chodník směrem na Nádražní a čáry stání se nemění.
- Metoda: `planRailApronBoundaryKerbs` skládá úseky podle `planRailApronProfiles`; ověření `isRoadFreeRect` chrání komunikace a chodníky. Obruba je uvnitř bezpečné parkovací plochy, nikoli nový okraj silnice.
- **Zelené záhony / výsadbové ostrůvky dosud NEJSOU vytvořeny:** 2023 satelit naznačuje jejich přítomnost u zakončení, ale přesné hranice a polohy nebyly zaměřeny. Nevymýšlet zeleň ani neucpat průjezd.
- Tento krok je geometricky ověřený, nikoliv finální vizuální schválení. Po nasazení porovnat letecký technický pohled a pohled z úrovně člověka, zejména zda koncové obrubníky správně navazují a nevytvářejí spáry.


## Screenshot review Part 16 — 5.81.18 (15. 11. 2026)

Uživatel přidal svislý snímek webového technického nadhledu 5.81.17 v 21:31. V modelu jsou zřetelné dvě **vizuální vady**, nikoli prokázané geodetické odchylky:

1. Plocha šikmých stání u kolejí vypadá jako světlá samostatná deska s tenkým zeleným pásem k servisní komunikaci. Tuto spáru zužujeme zkusmým rozšířením **pouze již foto-podloženého povrchu** směrem k cestě v přírůstcích 0,12 m, max. do souřadnicové vzdálenosti 2,42 m od osy OSM service way 675778842. Každý celý kandidátní polygon je ještě před použitím zkontrolován na všechny cesty, chodníky, budovy a koleje, včetně bezpečnostního odstupu. Není to úprava asfaltové vozovky.
2. Jižní konec vnějšího chodníku na středním ostrově vykazuje několik osamocených pravoúhlých výčnělků. Nově se překryvná texturovaná výplň vytváří **jen v řádcích, kde zároveň existuje schválená souvislá geometrie chodníku**, jinak by totiž překryv pokračoval za špičku ostrůvku.

**Meze důkazů:** georeferencované jsou silnice a některé pěší trasy, přesná hranice parkoviště, typy a souřadnice výsadby nebo šíře zakončení nejsou změřeny. Tyto dvě úpravy jsou vizuální korekce již známého modelu; fotografické schválení nové celkové podoby a výsadba zůstávají otevřené. Nepřidává se nová cesta, strom ani záhon.


## 5.81.22 — audit zelené spáry mezi kolejovým parkovištěm a vozovkou (15. 11. 2026)

Uživatel poslal pohled shora na 5.81.21 (22:20 SEČ). Na snímku už nejsou zelené výřezy **uvnitř** středního parkovacího ostrůvku, ale vlevo u kolejového parkoviště zůstával zelený proužek. Na spodním zakončení středního ostrůvku je pořád několik hranatých dílů. Tuto poslední vadu 5.81.22 **neřeší**.

Na základě nezávislého testu 20 reálných přijatých parkovacích úseků: ve verzi 5.81.21 končila hrana u souřadnice `offset=-2.42` (nejbližší OSM service way 675778842, matematický odstup od modelované šířky 4,5 m = 0,17 m). Přísný hrubý test vymezoval obdélník 36cm vzorkovacími buňkami a zamítal i bezpečný detail `-2.30`.

Pro 5.81.22 je zpřesněno **pouze vzorkování krajních kandidátů a spojovacích panelů** na 12 cm, při zachování stejné konzervativní kružnicové obálky a kladného 2,5cm bezpečnostního bufferu. Potvrzený geometrický audit: všech 20 úseků má nyní `offset=-2.30` a minimální teoretický odstup od OSM modelu vozovky 0,05 m. Nová mapová cesta se nevytváří, silnice ani jejich textury se neposunují.

Fotografické hranice nejsou geodeticky ověřené. Vizuální výsledek na telefonu a konce obou parkovacích ostrovů musí být porovnány znovu. Výsadbu podle pouhého odhadu nadále nevytvářet.

## 5.81.23 — tvar jižního zakončení prostředního ostrůvku (16. 11. 2026)

Při kontrole 5.81.22 už byla levá kolejová parkovací řada spojena s vozovkou do 5 cm (výhradně v modelovaném OSM smyslu). Zůstával však viditelný pravoúhlý výstupek na **vnější/east** straně jižního zakončení prostředního ostrůvku, a několik malých dílků při obou koncích. V testovacích datech prvních 6 metrů chodník přecházel z offsetu `9.551` ven až k `10.013`, potom se vracel: vznikla příčná hrana cca 46 cm.

5.81.23 **nenavyšuje žádný povrch a nemění OSM silnice**. U prvních ~5 metrů ukončí vnější hranu nejvýše tam, kde ležela první celá bezpečná řada. První ukončení souvislého chodníku se zužuje z ~0.74 m na ~0.38 m, uvnitř stejného ověřeného rasterového políčka. Spodní doplňková vrstva sdílí přesně stejný zakončovací profil, aby na špičce nepřečníval samostatný obdélníkový přesah. Celá délka parkovacích stání, silniční asfalt, zaparkovaná vozidla, venkovní obruby u kolejí i vnitřní výplň pěšího pásu zůstaly nedotčené.

**Míra jistoty:** OSM bezpečnost a soulad mezi dvěma vrstvami chodníku lze ověřit testy; kulaté zakončení je *foto-informovaný model*, nikoli zaměřená skutečná geometrie. První vizuální ověření uživatelem je nutné, zejména u menších pravoúhlých prvků na první řadě parkovacích dlaždic, které nejsou součástí této úpravy.

## 5.81.24 — zkrácení zbylého koncového jazýčku (16. 11. 2026)

Uživatelův nadhled 5.81.23 (01:07) potvrdil, že velký čtvercový přesah na jižní špičce byl menší, ale vpravo stále zůstával úzký svislý jazýček asi jednoho dlažebního dílku. V nové úpravě je terminální průřez chodníku stále **uvnitř první již schválené buňky**. Zkrátil se o cca 0,2175 metru po směru osy a šířka jeho koncové hrany je 0,32 m (zbytek se rozevírá do standardní šířky). **Důležité:** spodní výplň je nyní ukončena na *témže* souřadnicovém začátku `startAlong`, jako viditelný chodník a obrubník; dříve používala původní obdélníkový počátek buňky.

Nezměnily se banky parkování, přístupové cesty, OSM silnice, vnitřní dlažební buňky ani kolejový parking. Jde o cílené odstranění vizuálního přečnívání, nikoli skutečně zaměřený oblouk; ověření proti fotografii a screenshotu 5.81.24 stále otevřené.
