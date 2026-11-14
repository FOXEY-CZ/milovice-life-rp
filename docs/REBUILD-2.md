# Milovice RP — oficiální plán REBUILD 2.0

## Jednotka práce = CELÁ ULICE, ne jeden dům

Nový průchod znamená znovu postavit, opravit a porovnat **každou již řešenou budovu včetně kostela, nádraží, školy, hotelu Modrá hvězda i všech ostatních**. Současné modely a uložené předchozí práce se **neodstraňují**; slouží jako počáteční základ, nikoli důkaz dokončené stavby.

Každou ulici projít **od jednoho konce k druhému**, po obou stranách a všemi pohledy 360°, včetně budov, zahrad, veřejného prostoru, dopravy, krajiny a veškerých malých předmětů. Uliční skupiny mohou mít více úseků či křižovatek; hranice se ručně zpřesní před označením ulice za dokončenou.

## Oficiální pořadí

1. **Nádražní + nádraží:** budovy nádraží, průchod a nádražka, Bike Tower, nástupiště, koleje, autobusové zastávky, celá přednádražní plocha, silnice, chodníky, parkování, lampy, značky, zeleň a okolní domy.
2. **Školská:** škola a její zahrada, Školská 220/1, další domy, ploty, vjezdy, přechody, silnice, chodníky, parkování a všechny drobnosti.
3. **5. května:** **kostel znovu podle reality**, okolní prostranství, domy, obchodní objekty, křižovatky, případné přechody, dopravní vybavení a zeleň.
4. **Poštovní – kostelní blok:** celý úsek Poštovní včetně kostela sv. Kateřiny a návaznosti na Mírovou a 5. května; **nejde jen o samostatnou opravu kostela**. V mapové evidenci je kostel OSM 118487991 orientačně přiřazen k Poštovní, zatímco veřejně uváděná adresa je Mírová.
5. **Mírová:** Modrá hvězda, Mírová 36, další domy a podniky, kompletní uliční prostor.
6. **Ostatní Staré Milovice:** propojené ulice dům po domu, ale s celým okolím.
7. **Mladá:** všechny ulice a jejich objekty.
8. **Západní propojení:** silnice, chodníky, stavby, příroda a dopravní návaznosti.
9. **Benátecká Vrutice:** všechny dostupné ulice i okolí.
10. **Střední propojení:** propojené ulice, pěší trasy, doprava a okolní objekty.
11. **Boží Dar:** celé dostupné ulice, budovy, příroda a přístupové trasy.

## Povinné oblasti pro KAŽDOU ulici

1. **Budovy:** skutečná poloha a rozměry, tvar, střecha, výška, materiály, fasády, okna, dveře, římsy, balkony, vchody, garáže, přístavby.
2. **Silnice:** geometrie, počty pruhů, šířky, povrchy, napojení.
3. **Chodníky:** obě strany, chodníkové ostrůvky, obrubníky, rampy, pěší spojky.
4. **Přechody a značení:** pouze doložené, bez náhodných přechodů přes vozovku.
5. **Dopravní značky:** skutečné pozice, orientace, správné tabule.
6. **Osvětlení:** lampy, semafory, sloupy, technická vedení.
7. **Parkování:** reálná stání, parkoviště, vjezdy, bezpečné průjezdy.
8. **Ploty a drobné stavby:** brány, schody, podezdívky, zídky, přístřešky.
9. **Mobiliář:** zastávky, lavičky, koše, stojany, informační tabule.
10. **Zeleň a terén:** stromy, keře, tráva, záhony, úpravy terénu.
11. **Železnice a doprava:** koleje, nástupiště a další dopravní objekty, pokud na ulici existují.
12. **Technická infrastruktura:** trafostanice, hydranty, kabelové skříně a další objekty.
13. **Funkčnost:** vchody na výšce terénu, průchozí chodníky, žádné blokované vjezdy.
14. **360° fotografická kontrola:** oba směry podél ulice, všechny strany domů, pohled shora, přesná provenience.
15. **3D a výkon:** kolize, napojení všech objektů, střechy bez děr, okna přilepená k fasádě, mobilní FPS a LOD.

## Kdy je ulice HOTOVÁ?

Až když budou všechny její objekty identifikované a porovnané s legálně použitelnými podklady, bude u každé z 15 oblastí zaznamenaný výsledek, zásadní geometrické a kolizní chyby budou opravené a uživatel odsouhlasí **celou ulici**. Dosud odsouhlasená škola znamená úspěšný dílčí model, **nikoli hotovou Školskou v Rebuild 2.0**.

**Neověřená zadní fasáda nebo chybějící údaj o lampě se neprohlásí za hotové.** Pokud nemáme obrázek či jiný legální podklad, ponecháme provizorní jednoduchý model a položku „vyžaduje ověření“. Bez důkazů nevymýšlet objekty. Snímky z různých let nemusejí odpovídat roku 2026.

## Technická evidence

- [Strojový inventář ulic a OSM ID](../data/rebuild2-street-inventory.json), [veřejný přehled](../rebuild.html).
- Spojeno **6 překrývajících se geografických zdrojů**: 6 867 záznamů → **3 712 unikátních OSM prvků** v **78 pracovních skupinách** (z toho 6 výslovných backlogů pro nepřiřazené objekty).
- Klasifikace: **2 120 budov, 803 silničních komunikací, 631 pěších/cyklistických cest, 16 železničních prvků, 128 krajinných prvků, 3 další veřejné objekty, 11 inženýrských objektů**.
- Přiřazení uliční skupiny podle `addr:street` či nejbližší pojmenované OSM cesty do 40–65 m je **orientační**, nikoli skutečná hranice ulice. Nepřiřazené objekty se musí ručně zařadit.
- Lampy, koše, značky, jednotlivé stromy, ploty, lavičky a vodorovné dopravní značení nejsou v OSM automaticky kompletně zaznamenané. Každá ulice dostává povinný fotografický soupis těchto prvků.
- Pracovní stav všech skupin je **čeká na Rebuild 2.0** nebo **nutno přiřadit ulici**. Žádná se automaticky nepovažuje za dokončenou.
- Nechat zachovanou existující hru, účetní a herní postup, kolize a FPS optimalizace; nezaplňovat scénu tisíci jednotlivých draw calls.
- Fotky používat pouze v souladu s licencí. OSM: © OpenStreetMap contributors, ODbL. Z chráněných panoramat bez oprávnění nekopírovat pixely ani automaticky netěžit modely.

## Cyklus práce po ulicích

**Inventář všech objektů → zdrojová fotografie / prohlídka → budovy i uliční prostor → napojení na terén → 360° vizuální kontrola → fyzické kolize + mobilní výkon → uživatel schválí → uložit stav → sousední ulice.**

Nezasekávat se na jednotlivých detailech bez konce: používat společný systém střech, oken, vchodů a chodníků, úpravy provádět po smysluplných úsecích a brát nově získané zkušenosti i na starší práci.

### Kostelní uzel – identita ulice
Zdroj: https://www.kdykde.cz/rejstrik/kostel-sv-kateriny-alexandrijske/ (Mírová, poblíž 5. května a Poštovní). OSM sousední ulice má jen orientační spád do skupiny Poštovní; před skutečnou přestavbou ověřit pěší napojení a rozsah křižovatky. Poštovní se musí projít **celá**, nejen kostel.


## PART 12 — 5.56: Nádražní / prvotní kontrolní průchod (nikoliv schválená ulice)

- [Otevřít celou ulici v mapové kontrole](../survey.html?id=old%3AN%C3%A1dra%C5%BEn%C3%AD). Jednotný prohlížeč funguje i pro zbývajících 77 skupin přes odkaz v [REBUILD dashboardu](../rebuild.html).
- Čte **skutečné mapové OSM ID** a rozlišuje 22 budov, 6 vozovek, 5 pěších tras a 5 železničních objektů aktuálně *přiřazených* Nádražní. To není soupis všech lamp, značek a jednotlivých stromů; položky mimo OSM mají zůstat „chybí podklady“.
- Stanice (53865956), cyklověž (1011197691), dvě OSM pěší trasy ke stanici (549346217, 1550920096) a nástupiště (549346219) jsou zachované. Čtyři doložené jednosměrné OSM úseky zůstávají ve scéně i v evidenci.
- **Přímo na mapě** jsou vyznačeny také sousední komunikace 5. května (22880478), Školská (22880480) a jejich navazující pěší trasy (1282187908, 1282187911), ale nepočítají se jako hotová Nádražní.
- Více nezávislých veřejných fotografií přednádražního prostoru, cyklověže a zastávek z roku 2024 včetně stanovišť A/B jsou odkázané s licencí a geolokací **kamery**, ne nepodložených fyzických objektů. Pro stanoviště A/B je odkázané též schéma PID s platností od 15. prosince 2024.
- Přístup přes rebuild.html, každou jeho uliční kartu i mapu přímo ve hře. Vlastní 15bodová kontrola, **stav a poznámky každého jednotlivého OSM objektu** a filtrování dosud neprohlédnutých položek jsou pouze **lokálně v prohlížeči**, bez zásahu do sdílených herních dat a bez změny stavu approved.
- Automatický test rebuild2-survey.test.mjs chrání před ztrátou OSM objektů, duplikací zdrojů a chybným přiřazením křižovatky. Nejde o automatický důkaz fotografické 3D shody; ta musí následovat před opravami fasád, parkování a mobiliáře.

**Další fyzický rebuild:** Nádražní projít od jednoho konce k druhému přes všechny přiřazené i hraniční objekty; opravovat pouze to, co potvrdí fotografie nebo geodata. Zachovat stávající kolize a kontrolu FPS. V této fázi se 3D modely svévolně nepřestavovaly.


## PART 12 — 5.57: první skutečná 3D oprava u nástupiště

**Změna je přímo v herní scéně**, nikoli jen na kontrolním dashboardu. Na železniční straně stanice (OSM 53865956) se nyní vytváří **kompaktní, konstrukčně přiznaná zastřešená část** nad mapovaným nástupištěm OSM 549346219 (railway=platform, shelter=yes). Vychází z [fotografie nástupiště z 25. 5. 2013 (Palickap, CC BY-SA 3.0)](https://commons.wikimedia.org/wiki/File:Milovice,_n%C3%A1dra%C5%BE%C3%AD,_n%C3%A1stupi%C5%A1t%C4%9B.jpg). Fotografie potvrzuje existenci typu konstrukce v roce 2013, **nepřináší však přesné geodetické rozměry ani automatický důkaz stavu roku 2026**.

- Nový čistý plánovač scripts/station-platform-canopy.js: všechny rohy a nosníky vycházejí z přímé vnější hrany skutečného OSM půdorysu nádraží a pouze směrem **dovnitř skutečného polygonu železničního nástupiště**. Nikdy nevytváří 29m stříšku u silnice a cyklověže; ta zůstává odstraněná.
- Z více kandidátů se bere nejdelší **souvislá** a bezpečná strana zdiva; na aktuálních datech cca **15,00 m**. Nepropojuje oddělené hrany přes výklenky a nedělá náhodné vyčnívající střechy.
- Vzhled je pouze foto-inspirovaný: přesah přibližně **2,2 m**, lehce skloněný nízký kryt s kovovou konstrukcí, bez průchozích volně stojících sloupů. Vše přiznané jako **odhad**, vyžaduje hráčské 360° porovnání.
- Navázání na terén: konstrukce používá **stejnou vypočtenou základní výšku** jako budova nádraží (zjištěnou při tvorbě skutečného modelu, nikoli nezávislé vzorkování DEM na krajích), takže nezůstává výšková mezera vůči fasádě. Pod stříškou zůstává pěší průchod.
- Railway-clearance testuje také krátké dvoubodové OSM koleje; zastřešení nesmí zasáhnout do vlakové trasy. 3D část přidává nejvýše **3 draw cally** (střešní líc, podhled a instancované konzoly), žádnou per-frame geometrii.
- Přidána automatická kontrola scripts/station-platform-canopy.test.mjs v GitHub Actions, včetně obráceného pořadí vrcholů polygonu, nulové stříšky bez podkladu, vlakové vůle, společné výšky a omezeného renderovacího rozpočtu. **Bez fotografického schválení z telefonu se Nádražní nepovažuje za dokončenou.**

**Další opravy celého bloku:** obě strany silnice, skutečná pozice parkování, pěší přístup a schody, stanoviště A/B, budovy a fasády po jednotlivých OSM ID, návaznost na Školskou a 5. května, následně kostelní blok. Nezaměňovat dílčí model zastřešení za hotovou ulici.


## PART 12 — 5.58: zásadní oprava polohy stříšky podle průchodu

Uživatel opravil zadání: krytí patří **nad částí průchodu / jeho železniční vyústění**, nikoli nad libovolně dlouhou stěnu u nástupiště. Předešlá verze 5.57 (15m kryt na nejdelší stěně) byla proto chybně umístěná a je **nahrazena**.

- Vazba je nyní na OSM 1550920096 (pěší průchod budovou). Podle druhého koncového bodu je vybráno vyústění na **železniční straně** OSM 53865956; druhá strana budovy se nesmí stát chybným kotvicím bodem.
- Stříška pokrývá jen část zdi nejblíže tomuto vyústění. Aktuální výpočet dává **dva přímo sousedící úseky cca 3,2 m, dohromady 6,4 m**, kolem skutečného železničního koncového bodu trasy, na styku fasádních hran 4 a 5.
- Dvě střešní plochy sdílejí přesně stejný spojovací bod i vnější orientaci; automatický test kontroluje nulovou mezeru na stěně i na okraji střechy.
- Kontrolují se také skutečný OSM polygon nástupiště, bezpečný odstup od kolejí, stejná výška základny jako u nádraží a výkonnostní strop **3 draw cally**.
- Pokud OSM pěší průchod chybí, je od mapy nebo nesedí na nástupištní fasádu, konstrukce se **nevygeneruje**; žádná náhodná náhradní stříška.
- Vizuální podobu a velikost oproti skutečné současné stavbě je nadále třeba porovnat z fotek včetně pohledu od podchodu. Tato oprava zajišťuje správnou **část nádraží**, nikoli kompletní dokončení ulice.


## PART 12 — 5.59: obě řady severních garáží Nádražní

Implementována další **fyzická změna ve 3D scéně**, která se týká celého bloku, nikoli jedné budovy. Lokalita severní části Nádražní je mapově vymezena kolem 50.23040 N, 14.88345 E (45m vyhledávací rozsah). OpenStreetMap v této zóně obsahuje **17 individuálních garáží**, dvě rovnoběžné řady, typický půdorys 2,96 × 5,85 m. Modely domů už existovaly, ale vratový algoritmus používal nejdelší fasádu, která u řad zpravidla tvoří **společnou boční zeď** mezi garážemi.

Nový `scripts/nadrazni-garage-court.js` před vytvořením 3D detailů zkontroluje všechny garáže najednou. Pro každou povolí pouze krátkou 2,35–4,1m stěnu, jejíž vnější normála směřuje k ostatním mapovaným garážím **přes společný otevřený prostor** (oddělení přibližně 8–33 m, s příčnou tolerancí pro posunuté řady). Vše je čitelně označeno jako **geometrický odhad směru vrat**, ne jako foto-ověřená barva nebo stavební dokumentace. **17/17 řadových garáží** dostalo nástupní čelo s běžným, stávajícím modelem vrat, který se usazuje podle DEM pro práh a přimyká k čelní zdi. Vrata do společných bočních zdí byla tím odstraněna.

Systém neumisťuje žádné parkovací čáry, pojezdové plochy, cestu mezi řadami, strom nebo dopravní značku bez odpovídajícího podkladu. Test `scripts/nadrazni-garage-court.test.mjs` zakotvuje 17 reálných OSM ID, délky vybraných hran, výhled do dvou protilehlých řad, invariantnost při převrácení pořadí OSM vrcholů a bezpečné vypnutí při neúplném mapování. Napojen na GitHub CI. Další etapa Nádražní zůstává otevřená a zahrnuje okolní domy, chodníky, nádražní parkování, vybavení a zeleň.

**Poznámka k postupu:** Přijetí stříšky nádraží 5.58 je dočasné a neznamená, že je její vizuální podoba bezvadná.


## PART 12 — 5.60: POVINNÁ FOTOGRAFICKÁ DOKUMENTACE A STAŽENÍ NEOVĚŘENÝCH GARÁŽÍ

**Uživatelské rozhodnutí, závazné pro celý projekt:** Každá ulice, budova a viditelný objekt se smí vydávat za rekonstrukci reality pouze na základě dostupných **skutečných fotografických podkladů** konkrétního místa. OSM je pomocný geodetický podklad, ne vizuální důkaz. Nestačí mapový tag `building=garage`, samotný půdorys, počet podlaží, algoritmická podobnost či fotografický snímek jiného místa. Skutečné fotografie je nutné datovat a prostorově přiřadit; pokud nelze identitu potvrdit, model čeká na průzkum.

**Zpětná oprava 5.59:** 17 OSM objektů 194679587…194679763 v severní Nádražní bylo dříve vykresleno jako šedé garáže s odhadnutými vraty. Identita, současný skutečný druh objektů, střecha, fasády ani vratová orientace **nebyly fotograficky ověřeny** a byly oprávněně zpochybněny. Po kontrole veřejných snímků se nepodařilo jednoznačně spojit dostupné fotografie s těmito konkrétními OSM ID. Status **NEOVĚŘENO**; 5.59 bylo předčasné a není platným dokončeným vizuálním milníkem.

**Úpravy aktivní hry 5.60:**
- Všech **17 sporných OSM ID je explicitně pozastaveno ve 3D** před vytvořením zdi, střechy, vchodu i kolize. V mapovém datasetu zůstávají, takže je lze dál najít a vyfotit.
- Opuštěn a ze zdrojů aktivní hry odstraněn spekulativní algoritmus založený na protilehlých řadách; soubory plánovače a starého testu odstraněny, jejich historie zůstává v Git.
- V `survey.html` jsou sporné objekty v seznamu i mapě upozorněním označené jako **neověřený typ stavby**, se samostatným počtem a možností zdokumentovat chybějící fotografie.
- `scripts/photo-verification-policy.js`: evidence-first schvalování konkrétní OSM identity, fotografie a vizuálního porovnání. Dokud nejsou doložené zdroje, těchto 17 nelze zobrazit. Zvlášť je uvedeno, že ostatní staré modely mají jen **legacy** status a neprošly automaticky validací.
- `scripts/photo-verification-policy.test.mjs` ověřuje fail-closed 17 ID, odmítnutí fotografií z jiné lokality a budov bez vizuálního přiřazení, zachování OSM mapových dat, nepropojení se starým 5.59 generátorem a zachování zbytku herní scény.

**Další příprava:** Každý nový fotorealistický stavební průchod se musí opírat o dostupné aktuální snímky celé oblasti; pokud fotka chybí, neupravovat objekty odhadem. Historické modely, včetně kostela a nádraží, čeká postupný 360° re-audit. Uživatelsky přijaté provizorní řešení stříšky 5.58 zůstává zatím nezměněné.


## PART 12 — 5.61: VRÁCENÍ 17 OMÝLEM SKRYTÝCH BUDOV

Uživatel zjistil, že objekty z původních screenshotů pravděpodobně nebyly 17 garáží na severním okraji Nádražní. Proto bylo **nesprávné** zablokovat právě tyto jiné objekty ve 5.60. Verze 5.61 je vrací do výchozího staršího, fotograficky **neschváleného** zobrazení a především zachovává jejich původní pozice, 3D meshe i kolizní záznamy. Stále není doloženo, jak tyto konkrétní budovy dnes vypadají, ale chybné odstranění se nesmí stát formou náhrady za fotografický audit.

Technicky má všech 17 dotčených OSM ID nyní ve `scripts/photo-verification-policy.js` odpověď `render:true`, `photographicApproval:false`, `status:'legacy-restored-awaiting-photo'`. Stará 5.59 spekulativní verze vylepšování vrat zůstává odstraněná. Hra eviduje obnovené starší modely ve `window.__milovicePhotoVerificationAudit.restoredLegacy3D` a testuje 17/17 v CI. `survey.html` zachovává výstrahu, ale nehlásí „3D model pozastaven“: uvádí „původní model obnoven, typ neověřen“.

**Důležité:** Modely z screenshotů uživatele (šedé nízké budovy s tmavými velkými vraty a okny, viditelný nedaleký kostel) nelze přiřadit k některému OSM ID pouze vizuálním dojmem. Před další úpravou je potřeba přesné souřadnice objektu ve hře a fotografické zdroje. Žádné další masové skrývání objektů ani automatické převzetí OSM účelu budovy jako vizuálního faktu.


## PART 12 — 5.62: IDENTIFIKACE OBJEKTŮ PŘÍMO VE HŘE (BEZ HÁDÁNÍ)

Po předchozí chybě se 17 nesprávně skrytými garážemi bylo nutné zavést důkazně bezpečný způsob, jak z mobilního screenshotu získat **přesné OSM ID z konkrétního 3D modelu**. `scripts/osm-building-inspector.js` procházejí registrované modelové půdorysy: ray z hráčské kamery + skutečné hrany polygonu + výškový rozsah objektu, vybere první správný průsečík se stěnou. Při pohledu shora může použít střešní průsečík, ale nevymýšlí identitu na základě blízkosti nebo neurčité barvy. Ke každému zasaženému modelu jsou údaje OSM way ID a world-to-GPS souřadnice přibližné podle herního mapového modelu.

V `index.html` hráč aktivuje **🔎 Objekt**, klepne přímo na model a uvidí ID, mapový údaj o typu stavby s **výslovným varováním o chybějící fotografické validaci**, plus otevření daného OSM way a zkopírování identifikačního řádku. Při spuštění s `?inspect=1` je režim automaticky zapnutý. Kamera a hra jsou jinak zachovány. Zpracování geometrie běží **jen při klepnutí**; nedochází k per-frame průchodům OSM.

Rozlišujeme tři skutečně mapované skupiny:
- **17 severních OSM garáží** mezi Nádražní a V zahrádkách okolo 50.230396,14.883489, 17 OSM ID 194679587…194679763.
- **7 v oblasti Dukelská** okolo 50.229744,14.886733, ID 539003452…539003458.
- **8 na východě** okolo 50.226192,14.890987, ID 202389162…202389187.

Podobný herní vzhled těchto skupin **neprokazuje shodu** se screenshotem, jedině klikací identifikace odpoví, co je reálně v konkrétním záběru hry. Vnější fotografický průzkum dosud nepřiřadil jednoznačný detailní snímek k těmto garážovým průčelím; žádné jejich fasády se nově nevymýšlely a žádný objekt se bez schválení neskrýval. CI: `scripts/osm-building-inspector.test.mjs`.


## PART 12 — 5.63: první fotograficky doložené dvě řady garáží Nádražní

**Důkazní zdroj:** 10 screenshotů panoramat Mapy.com ze dne **17. 5. 2022**, předané uživatelem v aktuální konverzaci, copyright zobrazen ve snímcích **© Seznam.cz, a.s. / Cyclomedia Technology B.V.** Obrázky nejsou publikované v repozitáři ani převedené na textury (použití čistě jako vizuální reference). Různé pohledy na řady ukazují číslovaná vrata **1–17**, hnědé svisle žebrované kovové panely, světlé betonové dělicí pilíře, nízký tmavý plochý horní lem a široký štěrkový/hlinitý dvůr. V pozadí jsou rozpoznatelné vzrostlé jehličnany/listnáče, oplocení, drobné domy, špička kostela a průmyslový komín s nápisem AUTOSERVIS. **Přesné 3D umístění těchto doprovodných objektů stále vyžaduje ověření; zatím se automaticky nepřidávají.**

**Ztotožnění:** OSM v prostoru severní Nádražní/ulice V zahrádkách mapuje **17 individuálních ways**, přesně **7 objektů v jedné řadě a 10 v protilehlé**, s typickým půdorysem cca 2,96 × 5,85 m. To ve spojení s panoramaty velmi silně indikuje shodu celé skupiny s uživatelovým záběrem. Každé jednotlivé **OSM ID ↔ číslo vrat však není samostatně dokázané** a proto se čísla do hry nepřidávají. OSM tag není považován za fotografický důkaz sám o sobě.

**Fyzický 3D patch:** Nový source-gated `scripts/nadrazni-photo-garage-court.js` pouze pro explicitní 17 ID. Povolí průčelí jen při potvrzení kompletní skupiny, mapové odstupy řad a téměř východozápadní směry vnějších normál na krátkých čelních stranách. V `index.html` specifická foto-větev vykreslí nízkou cca 2,49m (výška je **odhad z fotografie**, ne zaměřená) jednoduchou zděnou stavbu, kovová **tmavě hnědá, vertikálně ribovaná vrata**, světle šedobéžové ztužující sloupky a tmavě hnědý jednoduchý střešní lem. Vše navazuje na konkrétní OSM fasádní rovinu a místní digitální model terénu. Starší obecné šedé garážové dveře a náhodné okenice se této skupině nepřidávají.

Přiložené záběry dokazují štěrk mezi oběma řadami. Nová lehká indexovaná plocha následuje výškový model v mřížce 6×9, se štěrkem z originální generované 128px textury. Odvoditelná vnitřní plocha je přibližně **14,2×20,5 m**, její hranice jsou **odhad** mezi doloženými průčelími a vnějšími hranami OSM, nikoli zaměřený katastrální výkres. Výkon: jeden materiál a draw call pro dvůr; detaily vrat jsou GPU instancované pro všech 17 budov, ne individuální draw cally za každé žebro.

Zachované hranice: bez redistribuce cizích obrazových dat, bez přidělení čísel k ID, bez náhodného parkování/plotů/vegetace a bez tvrzení, že fotografie **17. 5. 2022** potvrzují existenci/vzhled v roce 2026. Zbytek Nádražní i ostatních ulic nadále čeká na fotografický 360° audit. CI test `scripts/nadrazni-photo-garage-court.test.mjs` navazuje na datovou integritu, převrácené OSM polygonové pořadí, ochranu před cizími garážemi a nejednoznačným číslováním.


## 5.63.1 — kritická oprava „Unknown door family garage-photo-2022“

**Nahlášeno 14. 11. 2026** uživatelským screenshotem při načtení skutečné mapy Milovic. Nedovolovalo načíst celou OSM scénu. Diagnóza: ve 3D foto-garážové větvi byly správně vypočtené prahy a dveře, ale následné `recordEntranceGrade(grade,'garage-photo-2022',osmId)` zavolalo neexistující rodinu v kontrolním registru `entranceGradeAudit`, který obsahuje jen `garageDoors`, `schoolDoors`, `industrialDoors`, `commerceDoors`, `legacyDoors`, `heroDoors`. Funkce hodila výjimku, která přerušila přidávání OSM budov do hry. Oprava mění kategorii na `garage`, **nikoli samotný fotograficky doložený model**.

Pro prevenci do budoucna doplněn test všech používaných rodin v `scripts/entrance-grade.test.mjs` s ochrannou podmínkou, že nová neznámá kategorie neprojde do výroby. Fotografické garáže mají nadále vlastní metadata v `window.__milovicePhotoGarageCourt`, takže není důvod vymýšlet další hodnoty interního typu prahu.

`scripts/nadrazni-photo-garage-court.test.mjs` navíc počítá všech **17 garážových prahů** na původní 10m mřížce ČÚZK DMR 4G, stejným způsobem jako hry. Prošly všechny 17/17 včetně výšky dveří a návaznosti prahu na místní terén.

Ověřená verze kódu: `5.63.1`, build `20261114-nadrazni-garage-hotfix-5631`. Na telefonu je třeba otevřít novou adresu s `?v=5631`. Stav publikování GitHub Pages je třeba ověřit v prohlížeči, protože kontrola veřejné stránky není z tohoto prostředí dostupná.


## PART 12 — 5.64: fotograficky podložený vnitřek cyklověže

Uživatel zvolil pokračovat dál, protože předchozí garážový blok již odpovídá jeho referenčním snímkům. Záměr: postupovat po **celé Nádražní**, nikoli donekonečna retušovat přijatou stavbu. Ověřeny public commons snímky Milovic z 30. května 2024 a výrobní reference: BIKETOWER BT 2.2, realizace Milovice 2021. Stávající OSM objekt **way 1011197691** již ve scéně byl; nová `scripts/bike-tower-interior.js` mu pouze dodává jednoduchou, viditelnou vnitřní ocelovou kostru skrz transparentní fasádu. Celkem **52 instancovaných originálních 3D ocelových dílů**, agregovaných do **1 GPU draw callu**. Dílce vždy zůstávají uvnitř OSM zakotveného válcového pláště a nepřekážejí chodníkům ani vchodu. Fotografie nedokládají přesné počty a rozmístění nosníků, proto `steelRackArrangementEstimated:true`.

Vizuální důkaz: [Milovice, Nádražní, cyklověž](https://commons.wikimedia.org/wiki/File:Milovice,_N%C3%A1dra%C5%BEn%C3%AD,_cyklov%C4%9B%C5%BE.jpg) (ŠJů, 30. 5. 2024, CC BY 4.0), [výrobce BIKETOWER](https://www.biketower.cz/reference-a-mapa/). Nevytvářeny neověřené sloupy na ulici, lampy, zastřešení, parkovací místa ani přenos fotografií do textur. Nové schodiště z Nádražní nebylo modelováno: veřejná fotografie schodiště existuje v [kategorii stanice Milovice](https://commons.wikimedia.org/wiki/Category:Milovice_(train_station)), ale v místních OSM podkladech není jednoznačně přiřaditelné `highway=steps`. Na uživatelském požadavku **nikdy nezaměňovat fotografické reference za smyšlená rozmístění** se nic nemění.

Automatické testy `scripts/bike-tower-interior.test.mjs` ověřují přesné OSM ID a průměr, rozsah interní geometrie, orientaci, žádné nové prvky na ulici a rozpočet jednoho vykreslení. Test `scripts/entrance-grade.test.mjs` byl zároveň odpojen od pevné hodnoty BUILD_ID 5.63.1; ochrana proti neznámým typům dveří a systém čísel verzí se tak navzájem neblokují. Vizuální výsledek na mobilu a potvrzení nasazení GitHub Pages stále čekají na test ve hře.


## PART 13 — 5.66: obě fotograficky doložené parkovací řady před nádražím

Po 5.65 (autobusové zastávky A/B) je další fyzicky rekonstruovaná plocha **parkoviště okolo skutečné příjezdové komunikace OSM 675778842**. Dvě nezávislé fotografické pozice ŠJů z 30. 5. 2024, obě se směrem 200°, zachycují **asfaltovou střední průjezdovou plochu s betonovými zatravňovacími panely na obou stranách**. [Foto 1](https://commons.wikimedia.org/wiki/File:Milovice,_n%C3%A1dra%C5%BE%C3%AD,_parkovi%C5%A1t%C4%9B.jpg) + [foto 2](https://commons.wikimedia.org/wiki/File:Milovice,_n%C3%A1dra%C5%BE%C3%AD,_parkovi%C5%A1t%C4%9B_(01).jpg), ŠJů, CC BY 4.0. Kamery leží 0,27 a 1,16 m od skutečně mapované osy OSM silnice; nejde o zaměřené polohy jednotlivých stání.

**Vytvořeno:** 25 přibližných stání / dvě strany / 700 stylizovaných 3D dlaždic / nejvýše 3 draw cally. Kandidáti procházejí ověřením **celého půdorysu** proti OSM silnicím a chodníkům, dodatečnou kontrolou budov a kolejí. Jedno z 26 uvažovaných stání neprošlo, protože by zasáhlo do mapované komunikace nebo pěší plochy. Vše je součást Nádražní / přednádraží; ulice Nádražní jako celek zůstává **ROZPRACOVANÁ**. Není přidáno žádné vymyšlené auto ani 2024 strom na odhadovanou souřadnici. Další v pořadí: nezávisle lokalizovat lampy, stromy a parkovací hranice, pak provést srovnání v 360° a přesunout se po zbylých objektech celé Nádražní.


## PART 13 — 5.67: uživatelská vizuální oprava přednádraží

Uživatel 14. 11. 2026 přímo porovnal hru 5.66 s panoramatem Mapy.com ze dne **17. 5. 2022**. Doložil, že dvě asfaltové vozovky mají mezi sebou **širokou světlou dlážděnou parkovací plochu** se zaobleným koncem, nikoli travnatou mezeru a dvě tenké oddělené linie kamenných dlaždic. Z důvodu pravidel licencování screenshot slouží pouze k vizuální kontrole; nikdy nevstupuje jako bitmapa do repozitáře nebo textury. Konstrukční podklad = OSM 675778842 + OSM 128308366 a nadále otevřené fotografie ŠJů z května 2024.

Průchod 5.67 nahrazuje nesprávnou procedurální konstrukci 5.66 **plošně souvislým světlým parkovacím ostrovem**, který zaplňuje veřejný prostor mezi skutečnými komunikacemi. Tvar se v každé příčné řadě přepočítává podle vzájemné vzdálenosti mapovaných silnic, zúžení konce je proporčně odhadnuto z fotografie. Každý dlažební prvek kontroluje celou vlastní stopu proti všem OSM cestám; čtyři rohy se navíc hlídají vůči budovám a kolejišti. Přibližně 490 dlažebních segmentů a několik set nízkých obrubníků používá dohromady jen tři instancované dávky. Žádné nové cesty ani auta se nevytvářejí. Cyklověž, garáže, stříška a ostatní části hry jsou zachovány.

**Nádražní nadále není označena jako dokončená.** Nutná mobilní 360° kontrola a případně samostatně ověřené stromy, dopravní značky, správné parkovací značky a koncové obrubníky. Nikde neprohlašovat odhadovaný tvar za geodeticky přesný.


## PART 13 — 5.68: oprava chybějící protilehlé poloviny parkování a pěší trasy

Po verzi 5.67 uživatel správně upozornil, že **sama světlá plocha mezi silnicemi nestačí**: na jeho fotografickém porovnání z roku 2022 jsou druhá řada parkování naproti a chodník u vnějšího okraje. V 5.67 jedna polovina parkoviště chyběla. Opravená 5.68 modeluje **dvě oddělené části**: souvislý světlý vydlážděný středový ostrov (mezi OSM 675778842 a 128308366) a na **opačné železniční straně servisní cesty** samostatná travnatě-rastrující řada přibližně 20 stání. Mezi ní a vnějším okolím se rezervuje **1,54 m široký pěší pás** s nízkým obrubníkem a 0,45 m mezerou od stání. Tato druhá pěší trasa je **fotograficky inspirovaná aproximace**, ne nové OSM tvrzení; existující OSM chodník 1165594426 zůstává beze změny.

Každé celé parkovací pole a segment chodníku jsou testovány proti OSM vozovkám/chodníkům, okrajům budov a kolejišti. Oprava nijak nemění cyklověž, garáže, autobusové zastávky a dříve schválené objekty. Výkon: maximálně šest instancovaných renderovacích skupin pro dlaždice a obrubníky. Záloha před úpravou: `backup/567-before-parking-both-sides-fix`. Pozor na další vizuální srovnání: nestačí, že automatické kolizní testy projdou — **přesné polohy chodníků a konců stání stále čekají na potvrzení proti realitě**.

## PART 13 — 5.69: červeně označené dva chodníky

Uživatel dodal dalších osm fotografických pohledů a **dvojici červeně označených screenshotů**; červená leží na (a) **dlouhém světlém pásu na středovém ostrově mezi dvěma asfaltovými rameny** a (b) **samostatném pravém nárožním chodníku** u vstupního křížení. Opravovaná v5.68 měla nesprávně vytvořený 1,54m chodník **u kolejí za druhou řadou parkování**. To neodpovídalo fotografii.

v5.69: Chybná železniční pěší vrstva a lemování byly smazány, **protilehlé parkování 20 stání** zachováno. Původní široký střední dlažební ostrov zůstává; existující cca 492 půdorysů kamenné dlažby se bez duplikací rozděluje na dopravní/parkovací a **249 pěších kamenů** blíže ke středové hraně. OSM chodník **1165594426** se nepřesouvá. Na pravém rohu je geometrie navázána na skutečný OSM chodník **1282187911**, zvlášť kontroluje sousední Školskou **22880480**, a na bezpečné straně přidává 10 dlaždic a 5 obrubníků. Poloha a zakřivení rohové plochy jsou přibližné podle zaslaných pohledů, **nikdy přesné geodetické tvrzení**. Externí snímky zůstávají pouze v chatu, nikdy ne jako herní textura.

Do budoucna nesmí nikdo interpretovat "chodník vedle nádražního parkování" jako "souvislý chodník za železniční řadou". Jedná se o **pěší středový ostrov + pravé nároží u křižovatky**. Testy musí hlídat `wrongRailSidewalkTiles=0`, zachování obou parkovacích bank, existence středového pásu a nárožního obrubníku a bezpečnost vůči všem vozovkám.
