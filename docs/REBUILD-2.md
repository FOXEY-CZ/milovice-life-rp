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
