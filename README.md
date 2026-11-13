## Milovice RP 5.27.3 — odstraněná falešná zelená stříška ze strany nádraží

Podle screenshotů hráče jsme odstranili **zelenou stříšku vedle cyklověže a na špatné straně nádraží**, její ocelové sloupy, vzpěry, žebra a s ní související domyšlený pás dláždění. Fotografie zachycovala zastřešení skutečného železničního nástupiště **na protější straně**, nikoli tuto boční konstrukci.

Nádraží, průchod, původní střecha budovy, nádražní název, autobusové zastávky, cyklověž a mapované chodníky zůstávají. Zastřešení vrátíme až po dokladovaném ověření místa, ne pouhým odhadem. Kontroly: WebGL smoke + testy v GitHub Actions.

---

## Milovice RP 5.27.2 — Nádražka není vedle nádraží

- Opravený poslední přehlédnutý zbytek: automatický generátor dával na boční koncové stěny nádraží neověřená okna, takže prostředí působilo jako vymyšlená boční kavárna. Tyto dekorace se nyní na koncové fasády nevkládají ani v přízemí, ani ve vyšším patře.
- Nádražka **není samostatný 3D objekt ani boční přístavek**. Pouze v mapě zůstává označení uvnitř čekárny poblíž správného mapovaného přístupu; jde o orientační bod, ne tvrzení o poloze konkrétních dveří.
- Hlavní orientační bod v plné mapě se jmenuje **Nádraží Milovice** bez spojeného označení Nádražky. Obrys stanice, podloubí, chodníky, střecha a zelený přístřešek nástupiště se zachovávají.
- Historické zdroje: [Nádražky.eu](https://www.nadrazky.eu/hospoda.php?hospodaID=100273), [Železničář 08/2022](https://zeleznicar.cd.cz/assets/zeleznicar/zeleznicar_08_2022.pdf).

---

## Milovice RP 5.27.1 — fotorealističtější střecha nádraží

- Střecha **nádražní budovy** má nyní červenou taškovou texturu a matný materiál, nikoli plechové pásy. Barevný a materiálový podklad: [fotografie výpravní budovy ŠJů](https://stellwerke.info/stw/stw.php?id=22402).
- Ocelové **zastřešení nástupiště** zůstává zelené a oddělené. Textura je již existující původní herní grafika, ne kopie fotografie, a nepřidává GPU texturu navíc.

---

## Milovice RP 5.27.0 — skutečná pěší osa skrz nádraží (13. 11. 2026)

- **Zásadní oprava vstupu:** našli jsme opomíjenou OSM cestu **1550920096** vedoucí přímo mezi oběma stranami nádražní budovy, navázanou na venkovní cestu **549346217**. Průchod se neodsouvá o ~2 m jen proto, aby se vešel do jedné části fasády. Správně se rozdělí stěny i přes jejich společné rohy.
- **Dlažba a přístupy:** podlaha v průchodu se konečně posouvá *spolu s průchodem*; předtím zůstávala v podélném středu budovy. Zmizely čtyři odhadované propojovací pruhy dlažby — mapované pěší cesty už skutečný spoj obsahují.
- **Věrnost:** vstupní body vycházejí z OSM, nikoli z tvrzení, že máme centimetrově přesné fotografie. Přesná šířka a dekorativní fasáda vyžadují další měření. Kontrolováno jednotkovým testem i browser WebGL + kolizními sondami; mobilní výkon chrání stávající batching a LOD.

---

## Milovice RP 5.15 — mobilní výkon / optimalizace 27 FPS (13. 11. 2026)

Po hlášení **27 FPS na telefonu** byla priorita přesunuta od přidávání výzdoby k obnově plynulosti. Oprava je zaměřena na reálné náklady GPU, nikoli na prázdné tvrzení o 60 FPS. Číslo z konkrétního mobilního zařízení nelze garantovat bez měření na tomto zařízení.

- **Mobilní detekce:** samostatná kontrola dotykového GPU; předchozí pravidlo `(pointer:coarse) and (max-width:850px)` nezahrnovalo některé telefony otočené na šířku (např. 853 CSS px). Dotykový joystick se kvůli kompatibilitě nemění.
- **Automatická kvalita:** v základním vyváženém režimu měří FPS po 1,2 s, při 2 po sobě jdoucích hodnotách pod 36 FPS postupně sníží vykreslované DPR až na 0,72, dohlednost detailů a aktivní oblast města. Po 6 stabilních vzorcích nad 52 FPS zase kvalitu po krocích obnovuje. Nenastává zběsilé přepínání ani zásah do rychlosti postavy či fyziky.
- **Vzdálené objekty:** mapové budovy dál existují v plné geometrii, ale na telefonu se město vykresluje z přibližně 300–440 m místo celých 620–1000 m, jakmile adaptivní profil vyhodnotí pomalý běh. Vzdálená okna, balkony, střešní doplňky a vegetace mizí dříve než budovy, které jsou na očích. Mlha skrývá přechod. Desktop zachovává dosavadní dohlednost.
- **První fotografický blok:** originální štíty, rooflighty a jiné díly jsou nyní sloučeny do společné geometrie podle materiálu, aby 48 samostatných meshů znamenalo výrazně méně samostatných GPU draw calls. Photo-detail skupiny nově podléhají stejnému chunk cullingu jako okolní budovy. Reset oblasti odebere vlastní skupiny a zamezí kumulaci kopií při opětovném načítání.
- **Manuální „Vysoká kvalita“:** vědomá volba hráče stále dovolí dražší stíny a větší dohlednost. Automatické snižování je určené jen pro vyváženou kvalitu.
- **Ověření:** Node test profilového hysteretického přepínání, mobilní Chromium smoke s WebGL a kontrolou výchozího dohledového budgetu, základní jízdní testy a zachování dříve přidané geometrie i ověřených karet.

**Důležité:** výsledek na opravdovém telefonu se musí změřit. Pokud FPS zůstanou u 27, diagnostika v levém rohu ukazuje FPS, draw calls, počet trojúhelníků a aktuální render rozlišení. Tento údaj pomůže rozhodnout, zda další brzdou je GPU, CPU, provoz GLB modelů nebo doprava.

---

## Milovice RP 5.14 – reálná přestavba první skupiny budov (13. 11. 2026)

Konečně nejde o nové menu: v okolí **Mírová × 5. května × Školská** jsou přímo ve 3D městě přestavěné tři existující budovy se specifickými **foto-doloženými** vnějšími prvky (Školská 220/1, Modrá hvězda a Mírová 243/36). Do společné databáze přibyly **3 zdrojově ověřené karty**. Vedle starších částí dostaly nové modelované štíty, střešní okna, římsy a nízké živé ploty. Podrobnosti, zdrojové fotografie a meze přesnosti: [První uliční blok](docs/street-pass-01.md).

---

## Milovice RP 5.13 — Shared Street Architecture: natrvalo vydané domy

Stavební editor doposud používal výhradně místní `localStorage`; změny byly vidět jen ve stejném prohlížeči. Nově hra automaticky načte společný verzovaný manifest `data/architecture/verified-buildings.json` a smíchá schválené údaje s lokálními náhledy.

- **Publikované budovy:** manifest je součástí GitHub repozitáře a po nasazení ho při otevření hry čtou všichni. V současné výchozí verzi je záměrně **PRÁZDNÝ**: žádná budova nebyla publikována bez nezávislého ověření skutečných zdrojů. Údaje z automatických testů o smyšlené fasádě nejsou zaneseny do skutečné městské databáze.
- **Kontrola zdrojů:** každá veřejně schválená budova musí mít validní OSM ID, ověřený zdroj pro svoje geometrické údaje, stav `verified` a ruční revizi (`review.approved`, autor revize, datum a shrnutí kontroly). Nesprávný nebo chybně strukturovaný manifest nesmí rozbít spuštění hry. Všechny schválené záznamy jsou pod verzovacím systémem Git.
- **Lokální náhled:** změny uložené v editoru stále fungují okamžitě po restartu hry na témže zařízení. Kde lokální záznam obsahuje jen jednu změněnou fasádu, nepřepíše výšku, barvy a další ověřené strany z veřejné databáze.
- **Přenos do města:** editor umožní stáhnout dávku ověřených domů pro nezávislou revizi a následné začlenění do společného manifestu. Export není oprávnění k automatickému publikování. Schválené dávky lze po revizi zapsat do manifestu a jednorázově vydat celou ulici.

**Omezení:** první vydání 5.13 vytváří trvalou infrastrukturu, ale nijak automaticky nepotvrdí správnost fotografií. Zdrojová kontrola musí probíhat pro každou budovu; geometrie z fotek je stále přibližná podle přesnosti půdorysu/výšky. Přenesené informace mohou mít licenční a atribučně podmíněný původ.

---

## Milovice RP 5.12 – Automatická obhlídka ulic a fasád (13. listopadu 2026)

Stavební editor nyní podporuje prohlídku **celé vybrané ulice**, nikoliv jen jednoho ručně vybraného domu. V sekci „Automatická obhlídka ulice“ lze s použitím veřejného **Mapillary klientského tokenu** spustit kontrolu snímků pro aktuální dům nebo všechny domy na jeho ulici. Pro každý dům se používají existující mapované OSM půdorysy a směr jeho jednotlivých fasád. Procházení města je implementováno přes oficiální `https://graph.mapillary.com/images` API s malými ohraničujícími oblastmi (maximálně 24 dotazů na uličku na jedno ruční spuštění).

- Mapillary poskytuje GPS, směr pohledu, typ kamery, datum, autora a případnou miniaturu snímku. Náš výběr seřadí kandidáty podle vzdálenosti a vhodného směru ke konkrétní fasádě, přičemž u 360° snímků respektuje možnost otočení.
- Editor zobrazí možná pokrytí domů a fasád a výběr dostupných náhledů. **Shoda metadat NENÍ vizuální ověření domu!** Před použitím je nutné konkrétní záběr prohlédnout. U obrázků je odkaz na původní snímek, jméno autora a odkaz na licenci Mapillary CC BY-SA 4.0. Cizí pixely se neukládají do hry ani do lokálních karet.
- Projít ulici: domy v jedné ulici (OSM `addr:street` nebo heuristicky nejbližší pojmenovaná cesta) se dotazují v malých geografických buňkách. Sken vypíše budovy, které nemají ani orientačně vhodný snímek, a nabídne jejich otevření pro jiný zdroj. Dotazy se dají zrušit. Při překročení bezpečného maxima dlaždic editor nespustí neúplnou rozsáhlou operaci.
- **API token se neukládá** do JSON, GitHubu, dat hráčských účtů ani localStorage; v běžné aplikaci se používá výhradně v hlavičce `Authorization: OAuth` vůči Mapillary. Používej klientský token určený pro veřejné použití v prohlížeči, nikoliv přihlašovací či soukromý access token. Bez tokenu zůstávají externí odkazy Mapy.com / Mapillary funkční.
- Ani tato verze hromadně netahá snímky poskytovatelů do vlastního foto-3D nástroje. Import fotografie pro přesné měření vyžaduje ověřit příslušné oprávnění. Geometrie domů se mění **až podle explicitně ověřených anotací** jako ve verzi 5.11.
- Testy: Node ověřuje směry kamer, velikost API výřezů, práci s tokenem v hlavičce, filtrování pohledů a souhrn pokrytí. Chromium simuluje oficiální API bez potřeby skutečného tokenu, prověří nalezení kandidáta, zkopírování odkazu a že kandidát automaticky nepovýší stav fasády na „Prohlédnuto“.

---

## Milovice RP 5.11.0 – Foto-zaměřování fasád (13. listopadu 2026)

**Nový praktický fotografický pracovní postup** ve Street Editoru. Uživatel může importovat *vlastní nebo oprávněně použitelnou* fotografii celé fasády (JPG, PNG nebo WebP, max. 12 MB). Obrázek se zpracovává **jen lokálně** a NEPOSÍLÁ se do cloudu, NEUKLÁDÁ do JSON ani do herních souborů. V exportované kartě zůstávají pouze souřadnice anotací, druh (okno/dveře), SHA-256 otisk zdrojového souboru a potvrzení práv.

Uživatel na snímku vyznačí čtyři rohy celé fasády v pořadí levý horní → pravý horní → pravý dolní → levý dolní. Geometrický převod homografií opraví perspektivní zkreslení rovinné stěny. Systém nabízí buď ruční obdélníky jednotlivých oken/dveří nebo **experimentální automatické návrhy tmavých pravoúhlých oblastí** z pixelů snímku bez nahrávání na server. Návrhy mají viditelnou jinou barvu a bez samostatného potvrzení uživatele se NIKDY neaplikují do hry. Práva musí uživatel potvrdit a pro fasádu musí vyplnit pozorování. Záznam se použije **jen po celkovém ověření karty domu**.

V 3D generátoru mají jednotlivé potvrzené fotografické anotace přednost před dřívějším stejnoměrným rozmístěním oken. Souřadnice oken se násobí délkou skutečné OSM stěny a výškou aktuálního domu; dveře získají přesné umístění a proporce z anotací, kolizní půdorys je zachován. U neověřených stran není změna. Aplikace diagnosticky vypisuje počet fotograficky zaměřených fasád a polohy použitých oken pro browser testy.

**Omezení:** Získané metry jsou pouze aproximací, pokud výška fasády není přesně změřená; projekce jediné fotografie neumí rekonstruovat celé skryté části domu. Přesnost je ovlivněna kvalitou snímku, výběrem rohů, perspektivou, případnou optickou deformací a půdorysem. Heuristické detekování tmavých oblastí není spolehlivé rozpoznávání oken, a může navrhovat stíny či jiné objekty. Pro více pater, členité fasády, balkony a nepravidelné výlohy je často lepší ruční anotace. Ani zde nepoužíváme snímky Mapy.com/Google bez relevantního oprávnění.

**Testováno:** Jednotkové testy perspektivní transformace, validace otvorů, heuristického návrhu oken, evidence práv a propojení se staršími fasádami; Chromium prochází syntetickou vlastněnou fotkou, ruční anotací, potvrzením práv, uložením, reloadem a skutečným převodem na různě rozmístěná 3D okna ve hře.

---

# Milovice RP 5.10.0 – Geometrie z ověřených fasád (13. 11. 2026)

Stavební editor nyní nabízí **strukturovaná pole pro každou ze čtyř hlavních stěn zvlášť**. Záznam severní, jižní, východní nebo západní strany umí nést počty oken pro jednotlivá patra (např. `2,3,2`), přibližnou šířku a výšku oken, polohu a šířku vstupu, barvu fasády v HEX a přítomnost okenic.

Podporované obytné domy použijí při novém spuštění hry tyto parametry pro **skutečná geometrická vyříznutí oken/dveří, zapuštěná skla, rámy, parapety, dřevěné dveřní prvky a barvu jen vybrané strany**. Dům je přiřazen podle stálého OSM ID a fasáda podle směru ze zaznamenaného půdorysu; neověřené strany zachovávají svůj dosavadní vzhled. Varianta bez vchodu a přízemí s nulou oken jsou nyní explicitně modelovatelné.

**Ověřitelnost:** geometrické údaje se přijmou jen u karty `Ručně ověřeno` a jednotlivé fasády `Prohlédnuto` se samostatným HTTP(S) odkazem na zdroj a textovým popisem. Pole s chybnými rozměry, neověřená fasáda či chybějící zdroj se do 3D nepoužijí. Informace se ukládají lokálně v prohlížeči a exportují do JSON, neautomaticky na GitHub. Pro běžné městské budovy zůstává původní fallback.

**Meze přesnosti:** Umístění oken je zatím **pravidelně interpolované** podle ověřeného počtu na patro, není automaticky rozpoznané z fotografie ani měřené na milimetry. Polohy dveří `vlevo / střed / vpravo` jsou schematické. Samotné prohlížení 360° není totéž co vytvoření 3D modelu; ukládáme vlastní parametry, ne cizí snímky. Přesné polohy každého otvoru, atypické střechy a automatické rozpoznávání panoramat jsou další práce.

**Testy:** jednotkové ověření normalizace důkazních zdrojů, směru fasád, počtů oken, polohy vchodů a validace dat; Playwright ověří vyplnění jižní/severní strany, přežití změny strany a reloadu a skutečné použití příslušných fasád v 3D modelu OSM budovy.

---

# Milovice RP 5.9.0 — Street Facade Survey + Panorama (13. listopadu 2026)

Nový postup po celé ulici: stavební editor rozděluje dům podle OSM půdorysu na čtyři hlavní fasády (severní, jižní, východní, západní), pro každou navrhne nejbližší místo pohledu z mapované silnice a natočení kamery, vyznačí ho na mapě a poskytne odpovídající externí odkazy na Mapy.com a Mapillary.

- **Pohledy na každou stranu:** samostatný stav *Neprohlédnuto / Prohlédnuto / Nedostupné* plus odkaz a poznámky. Poznámky a stavy se ukládají lokálně do stávající karty domu (pod `facades`) a exportují stejným JSON nástrojem.
- **Plynulý postup:** tlačítko „Další dům“ konečně posouvá kurzor po seznamu a přeskakuje dokončené objekty; nepřeskakuje pořád na první nedokončený.
- **Oficiální Mapy.com Panorama uvnitř editoru:** volitelně načte JS prohlížeč až po kliknutí uživatele se zadaným veřejným, doménou omezeným API klíčem, nastaví natočení z ulice směrem k příslušné fasádě a povolí procházení dalších sfér. API klíč není uložen do localStorage ani do GitHubu. **API provoz může být zpoplatněn**; pokud klíč chybí nebo panorama v daném místě není, fungují externí odkazy. Autentizační/API klíče nevkládejte do veřejného repozitáře.
- **Omezení:** výběr fasád a kamer je odhad z OSM polygonů, nikoli potvrzení panoramatického pokrytí; panoramatické fotografie se nestahují, nescrapují, neukládají do hry a automaticky z nich netěžíme 3D modely. Vyžaduje ruční vizuální ověření a vhodná práva k referencím.
- **Regrese:** automatické Node testy geometrie fasád a průběžného pořadí budov, Chromium UI test přepínání stran, lokálního uložení, odkazu na 360° API a návaznosti na 3D hru.

---

## Propojení stavebního editoru se hrou (5.8.0)

Editor nyní nabízí **strukturované 3D parametry**: barvu fasády a střechy v HEX, typ střechy, počet oken na každé fasádě (stále přibližný), ověřenou výšku a počet pater. Pouze karta označená **Ručně ověřeno** s URL zdroje a poznámkou může ovlivnit podporovaný obytný model. Zdrojová fotografie se do hry nestahuje ani nekopíruje. Změny se promítnou **až po obnovení/spuštění hry ve stejném prohlížeči**; data zůstávají lokální, export/import JSON funguje.

Pozor: identické počty oken pro všechny stěny jsou dočasná pomůcka, nikoli fotorealistická rekonstrukce. Editor zatím neodvozuje polohy oken nebo výšku z fotografie.

---

## Stavební editor ulic (Street Editor 1.0)

Nový systém pro průběžné procházení celých Milovic je dostupný na **[editor.html](./editor.html)**. Obsahuje skutečný OSM inventář budov podle čtvrtí a ulic, interaktivní mapu, karty budov, přímé odkazy na Mapy.com Panorama a Mapillary, evidenci ověřování, lokální ukládání a export/import JSON.

Je to **pracovní stavební editor**, nikoliv další herní grafický update. Nezaručuje pokrytí panoramatem a nemodeluje budovy automaticky z cizích fotografií. Jeho úkolem je systematicky organizovat modelování dům po domu bez nutnosti pokaždé vybírat nový objekt. Podrobnosti: [STREET_WORKFLOW.md](./docs/STREET_WORKFLOW.md).

---

# Milovice RP 5.7.0 — skutečná geometrie domů kolem kostela a nádraží (13. listopadu 2026)

První vymezená architektonická oblast v okolí kostela sv. Kateřiny a nádraží. Je to **pilotní čtvrť**, nikoliv prohlášení, že celé Milovice jsou nyní na úrovni GTA San Andreas.

- **Změna způsobu modelování:** až 68 vybraných obytných domů kolem obou míst již nevykresluje neprůhledný monolit s nalepenými modrými obdélníky. Vnější stěny mají triangulované skutečné otvory pro okna a vstupní dveře. Okno má zapuštěné sklo s tmavým ostěním, oddělený rám, zárubně, překlady a masivnější parapet; vstupy mají zapuštěné dveřní křídlo, schod a stříšku.
- **Střechy a fasády:** u podporovaných čtyřúhelníkových půdorysů jsou vidět trojúhelníková čela sedlových střech. Všechny upravené fasády mají barevné materiály, základové sokly a římsy; vybrané stavby komíny. Geometrie respektuje půdorys domu z OSM.
- **Mobilní výkon:** stěny jsou slučovány podle bloků, opakované rámy a dveře používají instancování; detailnější prvky už nyní podléhají 175m mobilnímu LOD.
- **Bezpečnost existujících systémů:** speciální modely nádraží a kostela, kolize, doprava, vozidla, účty a rozšířené oblasti Mladá / Boží Dar zůstávají zachované. Nádražní podloubí se nepřestavuje.
- **Omezení přesnosti:** půdorysy pocházejí z OpenStreetMap, ale umístění jednotlivých oken a dveří je zatím ilustrativní, nikoliv potvrzené fotografiemi pro každý dům. Další fáze musí být fotoověřená architektura vybraných domů, realističtější assety a srovnávací screenshoty před/po.
- **Testy:** kontrola reálných otvorů pomocí 3D raycastingu a početně ověřené konstrukce fasád v Chromium, vedle dosavadního dopravního a mapového testování.

---

# Milovice RP 5.6.0 — BIG VISUAL UPDATE 1 (13. listopadu 2026)

**Vizuální změny najednou:**
- Nová sada 8 původních 256px herních textur se silnějším kontrastem a detailnější kamenitou silnicí, dlážděnými chodníky, různorodou trávou, omítkami s patinou, nástupišti, sklem, kolejovým štěrkem a plechovou střechou. Zdrojový kód je `scripts/visual-overhaul.js`; nejde o textury z GTA.
- Teplejší denní osvětlení, méně vybledlá modrá obloha a teplejší horizont, vyladěná expozice a barevná mlha. Fasády mají jemné svislé nečistoty.
- Procedurální auta mají členitější masku, zadní sklo, registrační tabulky a 4 oblouky blatníků sdružené v instancované geometrii. Všechny procedurální pneumatiky mají vlastní správné otočné pivoty.
- **Stop rozpadlým kolům:** už NIKDY nepřidáváme kola jiného procedurálního vozidla přes importované GLB. Import se smí zobrazit jen se čtyřmi ověřitelnými nezávislými koly na správných pozicích. Nevyhovující GLB zůstane načtené pro diagnostiku, ale zobrazí se konzistentní procedurální auto s otáčejícími se koly. To může dočasně snížit počet viditelných GLB, zato nebudou kola na střeše ani obří vnější overlay.
- Běžné pouliční detaily navázané na reálné OSM silnice (lehké opravy povrchu, vpusti, poklopy, orientační sloupky) jako instancované objekty, nikoliv jednotlivé draw calls. Umístění těchto rekvizit je **umělecká aproximace**, ne přesná poloha skutečných poklopů v Milovicích.
- Jeden dynamicky aktualizovaný instancovaný stín pod okolními vozidly a autobusy pro lepší dojem kontaktu kol s vozovkou.
- Mobilní LOD: dál od kamery se skrývají náročné drobnosti fasád už od ~175 m, zatímco siluety domů zůstávají. Cílem je zlepšit 25–27 FPS hlášených na mobilu, ale reálný FPS musí být změřen na zařízení.

**Co to ještě není:** grafika GTA San Andreas na úrovni všech objektů ani fotorealistické Milovice. Nejvýraznější omezení dál tvoří základní tvary velké části domů, neanimovaná kola u nepoužitelných externích GLB a absence profesionálních scénovaných 3D modelů městských objektů. Nelze slibovat, že každý uživatel uvidí „brutální“ skok bez porovnání screenshotů.

**Regresní testy:** kontinuita starého města a čtvrtí, kolize a průchody, účty a výzvy, jízdní fyzika, chůze joystickem. Browser smoke požaduje nové textury/pouliční detaily a garantuje, že žádné importované GLB nemá chybně přidaná cizí kola.

---

# Milovice RP 5.5.0 — World Collisions (13. listopadu 2026)

- **Kolize budov:** hráč a řízená vozidla nyní narážejí do skutečných OSM polygonových půdorysů, včetně nově streamovaných čtvrtí. Pro rychlost na mobilu je použit prostorový hash 32 m, ne průchod celou mapou každým snímkem.
- **Průchozí nádraží:** nádraží není jeden neprůchozí obdélník. Kolize jsou registrovány podle samostatných přízemních zdí, ve dvou skutečně otevřených podloubích zůstává volná cesta.
- **Pohyb podél zdí:** kontrola posunu po krátkých krocích omezuje pronikání skrz překážky i při nižším FPS; při šikmém kontaktu funguje posouvání podél zdi. Stojící a projíždějící vozidla i chodci jsou dynamické překážky hráče. Auto se při nárazu zastaví a kola neanimují imaginární ujetou vzdálenost.
- **Omezení:** jde o 2D aproximaci kolizí u země, nikoli úplnou fyzikální simulaci. Vozidla a NPC se navzájem stále aktivně nevyhýbají, chybí fyzika nárazů a přesné kolize tvaru aut. Průchod interiéry budov zatím není implementován.
- **Ověření:** čistý JS test polygonů, stěn, průchodů, slidingu, resetu a prohlížečová kontrola načtených OSM staveb a portálů. Všechny předchozí modely, úkoly, parkování, ovládání a účty zůstávají zachovány.

---

# Milovice RP 5.4.0 — Vehicle Update

**13. listopadu 2026.** Opravy hlášených chyb mobilního hráče:

- **Záměna auta za autobus při vystoupení:** dříve pěší režim v animační smyčce nastavoval *nezávislý* autobus na souřadnice posledního řízeného automobilu; autobus tak vizuálně překryl zaparkované auto. Nyní zůstává autobus vždy na svých uložených souřadnicích `busPark`, přitom vystoupené auto si uchová své číslo, typ, 3D objekt, pozici a dostupnost pro další nastoupení. Navíc se opětovné nastoupení přednostně nabídne do právě opuštěného auta.
- **Odlišné modely:** `scripts/vehicle-assets.js` podporuje několik nezávislých instancí různých Quaternius/Spectral GT GLB vozidel současně místo jediného modelu v danou chvíli. Nejvýše 3 detailní auta na dotykovém telefonu (5 na počítači), další vozidla používají 8 stávajících procedurálních karoserií s nově proměnlivým lakem a rozlišujícími doplňky (střešní ližiny, prahy). Nahrané GLB je vždy samostatný clone, nikdy se nepřemisťuje mezi vozidly.
- **Rotující kola:** skutečné pivoty procedurálních aut i modelovaných regionálních autobusů se při pohybu otáčejí podle dráhy a poloměru kola, včetně řízeného auta a couvání. GLB importy podporují otáčení pojmenovaných dílů kol, pokud jsou rozdělené na samostatné pivoty; u některých modelů může být geometrie kol sloučená a bude potřebovat specializovaný rig.
- **Parkování:** nová plánovací knihovna `scripts/parking-layout.js` vytváří deterministicky náhodné odstavené osobní vozy podél **skutečně mapovaných** klidnějších obytných ulic a veřejných obslužných cest; respektuje `access=private/no`, `service=driveway`, rozestupy, vyhýbá se koncům ulic a hlavním průtahům. Umí také zohlednit skutečně vyznačené OSM venkovní parkovací plochy, pokud jsou v exportu. **Omezení dat:** současný export z Milovic obsahuje prakticky jen vícepatrové parkoviště jako budovu, nikoli použitelné označené povrchové parkovací polygonové plochy; proto se žádný vymyšlený areál neoznačuje jako skutečně zmapované parkoviště. Stání u obslužných komunikací jsou herní aproximací a vyžadují pozdější ruční ověření podle fotografií.

**Testy:** GitHub Actions ověřují spuštění Three.js, OSM/DMR, generování parkovaných aut v různých typech a skutečný pohyb kol. Rozšířený browser smoke zkouší nastoupení/vystoupení/nastoupení do téhož vozidla, pozici samostatného autobusu a načítání licencovaných GLB. Všechny původní účty, dopravní síť, kamera a práce byly ponechány.

---

# Milovice RP 5.3.4 – správný směr jízdy importovaných aut

**Oprava GLB vozidel (13. 11. 2026):** Konvence herních vozidel je, že předek směřuje k lokálnímu **−Z**. Původní procedurální hatchbacky a autobus už takhle vznikají a jejich pohyb, řízení a kamery zůstaly zachované. Importované modely Quaternius Car, SUV a Sports Car však používaly `frontAxis: 'AUTO'`, které poznávalo orientaci jen z délky a šířky modelu — nikoliv podle skutečného směru přídě. U všech tří Quaternius GLB je nyní výslovné `frontAxis: '+Z'` a jejich vizuál se při importu otočí o 180°; pro Spectral GT zůstává existující explicitní `+X`. Žádné vozidlo se neřídí obráceně a neotáčí se kamera; opravuje se pouze orientace externího 3D modelu. Při GLB importu je zachována původní transformace. Prohlížečový test ověřuje geometrii načtených modelů a jejich výsledný předek vůči směru jízdy.

---

# Milovice RP 5.3.2 — správná velikost postav + analogový joystick

**13. 11. 2026 – zásadní oprava 3D člověka a pohybu.** Modely GLB měly vlastní transformaci měřítka, která se při normalizaci omylem přepisovala, takže postava vyrostla na desítky metrů a okolní NPC visely v T-póze. Import nyní zachovává původní transformace glTF a aplikuje 1,94m výšku pomocí zvláštní nadřazené skupiny. Po vytvoření se kontroluje skutečný bounding-box modelu, který musí mít 1,65–2,20 m a chodidla kolem úrovně země; nevalidní GLB se nepoužije a zůstane předchozí procedurální model. Kosterní idle/chůze drží paže spuštěné místo původní T-pózy.

**Ovládání:** na dotykových telefonech se během pěšího pohybu namísto čtyř tlačítek zobrazuje kruhový **analogový joystick** nalevo, nad panelem hlavních akcí. Pohyb prstu od jeho středu určuje intenzitu: přibližně prvních 12 % je mrtvá zóna, zbytek stupňuje chůzi až po běh (0,8–5,5 m/s), bez potřeby spolehlivě neimplementovatelného měření síly přítlaku na displej. Při puštění joysticku pohyb bezpečně zastaví; při přepnutí na vozidlo se obnoví původní šipky řízení. Na PC zůstává WASD / šipky, Shift umožňuje sprint. Kosterní model používá různé rychlosti a délky kroku podle intenzity pohybu. Kód je v `scripts/analog-controls.js` a `scripts/human-assets.js`. Prohlížečový CI ověřuje hranice modelu i fyzický pohyb virtuálního joysticku v mobilním viewportu a návrat do nulového stavu.

---

# Milovice Life RP — 5.3.0 Real 3D Models (humans, greenery, mobile cars)

**13. listopadu 2026 – skutečná modelová výměna, nikoli další barevná textura.** Verze 5.3.0 přidává nový modul `scripts/human-assets.js` s opravdovými texturovanými glTF/GLB humanoidy z CC0 sady **Quaternius Ultimate Modular Men/Women Pack** (muž v civilu, žena v civilu, muž v obleku). Hráč je nyní zastoupen GLB modelem místo staré figurky; ve vhodné vzdálenosti také až 5 okolních NPC, zatímco ostatní používají původní úsporné modely. Import využívá `SkeletonUtils.clone`, takže se kostry různých postav navzájem neovlivňují. Vybraný web-ready mirror soubor nemá animované klipy, ale obsahuje **49 skutečných kostí**. Proto jsou chůze a stání animovány programově přes `UpperLegL/R`, `LowerLegL/R`, `UpperArmL/R`, lokty a hrudník. Ověřené browser CI: GLB hráč se načetl, kostra obsahuje 49 kostí, je aktivní procedurální skeletal walk a modely nejméně tří civilistů jsou dostupné.

**Příroda a auta:** Modul `scripts/nature-assets.js` nahrazuje nejvýše 12 původních kulatých stromů kolem nádraží detailnějšími přímo načítanými Quaternius GLB stromy (CommonTree a BirchTree). Jejich pozice pocházejí pouze z již generovaných pozic herních stromů, nepředstavují nové zaměřené OSM body. Browser CI potvrdilo 12 instancí a načtení obou typů stromů. Modul `scripts/vehicle-assets.js` nyní v režimu „Automaticky“ zobrazuje i na mobilu nejvýše jedno detailnější vozidlo na dohled: pro úsporný mobilní režim je připraven Quaternius CC0 Car (~174 kB), Sports Car (~175 kB) a SUV (~182 kB). Na PC zůstává dostupná i původní detailnější sportovní varianta. Pro kvalitu lze zapnout ostřejší render s náročnějšími stíny; výchozí úsporný režim se nemění. Při chybě stahování mají lidé, stromy i vozidla funkční procedurální fallback.

**Licenční zdroje (CC0-1.0):** [Quaternius Ultimate Modular Men](https://quaternius.com/packs/ultimatemodularcharacters.html), [Ultimate Modular Women](https://quaternius.com/packs/ultimatemodularwomen.html), [Ultimate Nature](https://quaternius.com/packs/ultimatenature.html) – GLB exporty z [trebeljahr/quaternius-showcase](https://github.com/trebeljahr/quaternius-showcase/blob/main/LICENSES.md), připnuté ke konkrétnímu upstream commitu. Mobilní automobily z [bennibeni/garage – CC0 LICENSE](https://github.com/bennibeni/garage/blob/main/public/models/LICENSE.txt). Nepoužívají se žádné textury, skripty ani modely z GTA.

**Omezení:** Modely Quaternius zůstávají stylizované, takže samotná výměna zatím neznamená úroveň grafiky GTA San Andreas. Nepřesné obrysy ostatních budov, vzdálené dopravní modely a široká mapa Milovic ještě vyžadují vlastní ověřené 3D architektonické modely a fotoreferenční práci. Výkon 5.3.0 na konkrétním mobilním telefonu zatím nebyl změřen – pokud se FPS zhorší, lze v menu vypnout detailní postavy, auta a kvalitnější stíny.

---

# Milovice Life RP — 5.2.0 Graphics 2.0

**První grafický základ 5.2.0 (13. listopadu 2026):** Na základě zpětné vazby k vizuálu na mobilu vznikla nová vlastní knihovna `scripts/graphics2.js`, která vytváří 8 sdílených barevných textur (asfalt s kamenivem, dlážděné chodníky, trávu, jemnou omítku, betonové nástupiště, tónované sklo, kolejový štěrk a falcovanou červenou střechu). Pro staré Milovice i průběžně načítané další čtvrti jsou použity jediné materiály namísto mnoha jednotlivých fotografií. Textury jsou procedurální a originální, bez externích požadavků, s opakováním/mipmapami a při běhu nepřidávají nové draw calls. Na nádraží získaly 3D plochy nové povrchy omítky, skel a střechy; nástupiště i kolejiště mají texturované plochy. Upravené denní osvětlení je méně přesvětlené a hráč má lehký transparentní kontaktní stín pod nohama. Toto je **základ pro postupné zlepšování**, nikoliv tvrzení, že hra už má grafiku jako GTA San Andreas. Stávající Three.js engine, půdorysy OSM, výškopis ČÚZK, účty, vozidla i systém řízení zůstávají zachovány. CI ověřuje JS a skutečné 3D spuštění v prohlížeči, včetně 8 aplikovaných materiálů; přesné FPS na telefonu je třeba následně otestovat.

**Cesta k cílovému vzhledu:** další krok jsou skutečné samostatně licencované GLB/glTF animované postavy a detailní regionální vozidla, silnější normal/roughness materiály, fotodokumentované charakteristické fasády Milovic a lokální optimalizace podle draw calls. Modely ani současné textury nejsou kopií komerčních her.

---

# Milovice Life RP — 5.1.5 Connected Station Pedestrian Access

**Napojení nádražního průchodu 5.1.5 (13. listopadu 2026):** Předchozí pruh dlažby končil v trávě a nenavazoval na chodník. Nově se vygenerovaná dlažba průchodu zarovnává podle obou reálných otvorů v modelu nádraží a její uliční konec je propojen krátkou pěší spojkou k již mapované cestě **OSM way 549346217** vedoucí od ulice 5. května. Spojka vede po vnější straně budovy, používá texturu chodníku a respektuje ČÚZK terén. Druhý výstup získal krátké dlážděné napojení směrem k ploše nástupiště. OSM trasy footway/path mají nyní povrch dlažby místo silničního asfaltu. Trasa spojky mezi existujícím herním otvorem a mapovanou cestou je herní geometrické propojení, nikoli ověřené zaměření skutečného stavu; nepředstavuje nový OSM prvek ani přesný digitální dvojník. Automatický browser smoke test ověřuje navázání na way ID 549346217 a vytvoření čtyř spojovacích úseků. Původní funkční doprava, průchodnost a ostatní herní systémy zůstávají zachované.


**Grafický průchod 5.1.4 – 13. listopadu 2026:** Podle uživatelských mobilních screenshotů (42–55 FPS na zobrazených scénách před aktualizací) se na telefonech automaticky sbaluje vysoký informační HUD. Zobrazuje jen název, stav hry a režim; přes tlačítko **☰ Info** je možné ihned vrátit plný původní panel. Stávající ovládání, minimapa, zaměstnání a podrobné statistiky zůstávají funkční. Do modelu nádraží v přesném půdorysu OSM byla přidána opakovaná řada bílých okenních rámů s oblouky, malá římsa a dlažba v průchozím otvoru namísto trávy. Pozice dalších oken a šířka dlažby vychází z herního odhadu, nikoliv z geodetického měření. Vlastní procedurální postava a NPC mají přirozenější proporce trupu, končetin a vlasů; hráč navíc díly bundy a podrážky bot. Model **není** fotorealistický ani anatomicky přesný. Prohlížečový CI test kontroluje alespoň 8 oken nádraží, průchozí dlažbu a možnost otevřít/zavřít HUD při viewportu 390 × 820. Nové FPS po aktualizaci zatím nebyly přímo změřeny na uživatelově telefonu.

**Fotografická reference:** [Železniční stanice Milovice – září 2024, Wikimedia Commons](https://commons.wikimedia.org/wiki/File:%C5%BDelezni%C4%8Dn%C3%AD_stanice_Milovice_(z%C3%A1%C5%99%C3%AD_2024).jpg); pouze inspirační podklad, žádné pixely fotografie nejsou použity jako textury.

**Nástupiště 2026-11-13 (5.1.3):** Mapovaný polygon nástupiště Milovice (`railway=platform`, OSM way 549346219) nyní zobrazuje žluté texturované varovné pásy a světlou nástupištní hranu na úsecích orientovaných ke skutečně mapovaným kolejím. Viditelné detaily využívají vlastní procedurální texturu a ČÚZK výškovou mapu; foto nástupiště ukazuje žluté pásy (historické foto [Nymburský deník, prosinec 2009](https://nymbursky.denik.cz/zpravy_region/trat_milovice20091210.html)). OSM neudává přesné materiály ani stavební výšky; rozměry, odstín a počet dlaždic jsou herní odhad, nikoli současný zaměřený stav. Žádný nový polygon ani přechod nebyl vymyšlen. Prohlížečový smoke test ověřuje vytvoření alespoň 3 úseků a 30 metrů hrany; skutečnou shodu s dnešní podobou stanice netvrdí.

**Přízemní obchodní budovy 2026-11-13:** U OSM půdorysů s `building=retail`, `supermarket`, `commercial`, `shed` nebo `service` bez kladného `building:levels` se nyní pro odhad výšky používá jedno podlaží namísto obytného výchozího počtu dvou. Výslovně uvedené kladné počty podlaží a explicitní výšky zůstávají prioritní; hodnota `building:levels=0` se již nesprávně nevyhodnocuje jako chybějící údaj pro dvoupodlažní dům. Jde o heuristiku pro neúplná OSM data, nikoli o fotograficky ověřenou výšku konkrétních staveb.

**Optimalizace vývěsních štítů 2026-11-13:** Nápisy provozoven načtených z OSM nyní používají jednu sdílenou jednotkovou geometrii `THREE.PlaneGeometry` a individuální rozměry se nastavují pomocí `scale`. Každá provozovna nadále používá vlastní texturu a materiál; jména, orientace, poloha a velikost štítů zůstávají stejné. Snižuje se počet vytvořených geometrií, nikoli počet textur nebo draw calls. Nejde o nové ani fotograficky ověřené provozovny.

**Optimalizace hran střech 2026-11-13:** Obrysy střech vykreslované z půdorysů OSM nyní sdílejí jediný materiál `THREE.LineBasicMaterial` napříč budovami a postupně načítanými oblastmi. Geometrie jednotlivých obrysů, barva i poloha zůstávají beze změny. Jde o omezení počtu alokací materiálů, nikoliv o nový mapový podklad nebo měření FPS.

**Fasády obchodů 2026-11-13:** U budov s názvem a odpovídajícími OSM tagy obchodu/služby se na přízemí už nevykreslují generická obytná okna přes samostatně modelovanou prosklenou výlohu. Vyšší podlaží a ostatní budovy zůstávají beze změny. Nejde o ověření skutečného členění fasád; vychází z mapových tagů a existujícího stylizovaného modelu.

**Optimalizace výloh 2026-11-13:** Při výběru stěny orientované k ulici se pro každou OSM provozovnu předem vyberou pouze blízké silniční segmenty (v rozsahu 230 m od středu budovy), namísto opakovaného procházení celé sítě načtených oblastí pro každou stěnu. Původní hranice vzdálenosti pro hodnocení 120 m zůstává zachována. U neobvykle rozlehlých půdorysů může výběr vyžadovat další kontrolu; nejedná se o nová mapová data ani o nové obchody.

**Optimalizace 2026-11-13:** Stromy a pouliční lampy vytvářené z OSM silnic nyní sdílejí čtyři základní Three.js geometrie (kmen, koruna, sloup, svítidlo) napříč postupně načítanými oblastmi. Jejich polohy a vzhled se nemění; omezuje se počet samostatně alokovaných GPU geometrií. Nejde o nové mapové body ani o nový herní systém.

**Hra:** https://foxey-cz.github.io/milovice-life-rp/

Browser-based singleplayer RP prototype using real OpenStreetMap footprints of Milovice and official ČÚZK terrain. **Not** yet a photorealistic digital twin or an exact reconstruction of every house. Some regional buildings have mapped heights; untagged buildings use archetype-based approximations.

## 5.1.2 — Live OSM storefronts

- Named OpenStreetMap grocery buildings **BILLA**, **Tesco** and **Penny** now have large readable street-facing signs, prominent glass entrances, colour-specific signage, canopies, surrounding paving and bicycle stands. This uses imported OSM building footprints and names: **no new unmapped shops** were invented.
- Additional OSM-named services such as **Šperky Milovice** and **Poliklinika Milovice** get their own exterior glazing and shopfront signs. Storefront style and entrance placement are *approximate*, not scans or facade surveys.
- Building shapes now reference real street-level photos: **BILLA** grey box with charcoal entrance canopy and yellow rooftop lettering; **Tesco** bright corrugated white facade with red-blue signage; **Penny** a large grey pitched gable and red fascia band. The photos are reference material only and are **not copied as textures**. Exact orientation and shopfront measures are estimated.
  - [BILLA Milovice storefront](https://www.firmy.cz/detail/13214923-billa-milovice-mlada.html), [Penny Milovice storefront](https://www.firmy.cz/detail/2413114-penny-market-milovice-mlada.html), [Tesco Milovice storefront](https://zpravy.aktualne.cz/mesto-milovice-dnes/r~6bf975b2cdc111eb8a900cc47ab5f122/).
- Repeated facade details are batched; individual signs are only rendered near the player as part of the existing 3D draw-distance LOD system.

## 5.1.1 — Licensed 3D cars and realistic station

- Real Three.js GLTFLoader imports high-detail GLB car geometry and materials, not a 2D car picture.
- Spectral GT RS is a 4.7 MB CC0 sculpted sports coupe with interior, glass, rims and paint. It is an original unbranded car, NOT a Škoda, Toyota or BMW.
- A small CC0 **Quaternius SUV** GLB (~182 KB, pinned GitHub redistributor) is loaded on demand when driving a suitable SUV. An earlier external SUV host was unavailable in browser tests, so it was replaced.
- On desktop the model setting defaults to Auto. On touchscreens the cheaper procedural cars remain standard; the player can override it. Only ONE high-polygon vehicle can be active near the player or while driving, keeping distant traffic inexpensive.
- GLB network failures automatically return to original working procedural vehicles with visible status.
- The railway station gains a glass-fronted street entrance, verified address marker 469/13, waiting benches, information case, trash bins and a tactile strip, without sealing the pedestrian through-passage.
- Shape and position of the station footprint comes from mapped OSM coordinates. Extra furniture is artistic placement, NOT a surveyed digital twin.

### External asset licenses and credits

| Model | Author | License | Source |
| --- | --- | --- | --- |
| Spectral GT RS GLB | JaronKBragg7337 | CC0 1.0 | https://github.com/JaronKBragg7337/spectral-gt-rs |
| Quaternius SUV GLB | Quaternius | CC0 1.0 | https://quaternius.itch.io/lowpoly-cars and https://github.com/bennibeni/garage |

The Three.js loader downloads the Spectral asset from its author and the Quaternius SUV from the exact GitHub revision of a third-party redistributor; sources are not bundled in this repository. Model license and provenance are documented above. No manufacturer endorsement is implied.

Remaining limits: accurate GLB bodies for real Škoda, BMW and Toyota models are not installed; the playable PID bus and train are still original approximations, and not every Milovice building has been photo-modeled. Official Škoda fan 3D print models forbid commercial use and cannot be substituted into this commercial-capable game.

## 5.0 — connected living town / in-game LOD

- Player-selectable draw distance: **360 / 620 / 1,000 m** (stored locally). Fog and perspective clipping follow the chosen distance; near facade instances remain detailed while distant wall silhouettes stay visible.
- Real **OpenStreetMap forest, grass, park, playground and sports pitch polygons** are now used to build terrain-coloured 3D landscape areas. Forest and park tree placement is bounded, deterministic and locally instanced; individual tree positions are generated *inside* real mapped green polygons, not taken from tree surveys.
- Terrain, buildings, signs, trees and architectural elements use real OSM/ČÚZK coordinates. City sectors preload once the player approaches; **no map loading screen between sectors**, although large sector downloads can still be visible on slow connections and uncovered outskirts remain incomplete.
- Facade detail batches are split by map cell. Original procedural roadside greenery and lamps are also divided into 200 m render cells; scene and GPU workload falls with distance.
- Original sculpted pedestrians and player character: face/hair/limb and clothing variations, arm/leg walking animation, lightweight distant silhouettes.
- Sculpted road-vehicle archetypes instead of default box bodies: generic hatchbacks, estates, saloons, crossovers, SUVs, vans, sculpted tires and glass. Paint uses original procedurally generated metallic micrograin textures.
- Regional route **432** is confirmed as active in 2026 and operated by OAD Kolín. A red/white bus inspired by contemporary PID livery replaces the previous yellow player coach; civilian traffic includes a stylized **18 m articulated regional bus** with bellows and extra axle. Its body is a non-certified game interpretation, not an accurate SOR NS 18 3D scan.
- Passenger boarding: gameplay bus-work stops now display temporary waiting pedestrians, who approach the coach doors during boarding. AI route 432 pauses at simulated stop checkpoints. **Not an official stop/timetable simulation**: published PID GTFS stop points and trips are not yet imported.
- Animated original three-car double-decker EMU, visually referencing the **ČD 471 CityElefant**. Follows OSM railway geometry and pauses near Milovice station, independent of the road traffic. A gameplay rail animation, **not an actual 2026 train timetable**.

Public transport references: [PID 432 operator and current stops](https://pid.cz/zastavkove-jizdni-rady/?cid=432&from=1792447200&type=busreg), [documented OAD Kolín SOR NS 18 on line 432](https://mhdfoto.cz/cs/foto/82701) (photos **not** copied), [ČD CityElefant train history](https://www.bluetrains.cz/soupravy-a-jednotky/elektricke-soupravy/cityelefant/). Manufacturer trademarks and logos are not embedded as manufacturer-certified assets.

**Important remaining work:** Individual BMW/Toyota/Škoda production vehicle meshes, officially licensed transit fleet models, actual stop coordinates and real schedules, street-level photo matching for every building and a full city-wide draw-call/FPS audit are **not complete**. Avoid calling these procedural approximations photorealistic or exact.

## 4.9 — station and recognizable neighborhoods

- Real photographs of the Milovice railway building show **cream plaster, white-framed windows and a dark red metal roof**. The 3D station now has a separate original standing-seam roof material on each of its three roof sections, an extended platform shelter with wood-toned support posts, a rail-side nameplate and a street-side nameplate.
- Ground-floor arched window heads, platform paving, Nádražka and the provisional shop remain part of the 3D station. The walk-through opening remains open; its exact dimensions and the shop location have **not** been surveyed.
- Braniborská and Rakouská now receive different **neighborhood-level facade schemes**. These are photo-inspired styles, not a claim that every individual exterior was verified.
- OSM roads are read before buildings, making nearby-street architectural classification deterministic. Region streaming now rebuilds lightweight visual trees and street dressing so more distant districts do not appear barren.
- Reference photographs: [Wikimedia railway station images, including September 2024](https://commons.wikimedia.org/wiki/Category:Milovice_(train_station)), [historical station frontage photograph](https://stellwerke.info/stw/stw.php?id=22402), [Braniborská / Komenského / Spojovací images](https://commons.wikimedia.org/wiki/Category:Soviet_modernist_architecture_in_Milovice).

**Limitation:** This remains a Three.js procedural open-world prototype. A building will not become photorealistic merely because its OSM footprint is correct. The still-missing house-by-house survey, high-quality 3D assets and exact textures are future work.

## 4.8 map expansion & graphics

- Five independently streamed OSM sectors: **Mladá, Benátecká Vrutice, Západní propojení, Mladá–Staré Milovice–Boží Dar, Boží Dar**. The older central extract remains the first sector.
- True local streets, service roads, rails and OSM building outlines. Data downloads are deduplicated by OSM way IDs in overlapping sectors.
- Matching **ČÚZK DMR 4G** regional elevation grids with 20 m gameplay sampling; old center retains more detailed 10 m DEM.
- The spawn vehicle menu now contains a **district selector**. As the player drives, adjacent regions are loaded progressively; citywide traffic gets new routes.
- Panel apartment blocks tagged 4–16 floors retain their height and receive photo-inspired facade styles, long balcony arrays, slab seams and entrance canopies. Houses, garages, schools, commercial and industrial buildings get different procedural facade treatment.
- Railway station model no longer uses one towering solid polygon. It has a raised central section, two low side wings, separate pitched red roofs and an open through-passage. Precise openings/roof dimensions remain *photo-informed approximations*.
- Graphics selector includes lightweight **balanced** mode and **realistic shadows** mode with localized PCF shadow casting; the latter can reduce FPS on phones.
- No photographs or Google Street View tiles are used as textures without suitable permission; only original procedurally generated game textures are embedded.

The area sectors are expanded **gameplay map windows**, not authoritative municipal boundary polygons. Additional distant countryside and exact landmark geometry remain incomplete.


## Earlier 4.7 mapped landmarks

| Place / feature | Geodata | Work done |
| --- | --- | --- |
| Full-sized map | Game-simulated location, not phone GPS | Blue live player arrow, recenter, nearby landmark pins |
| Milovice railway station | OSM way 53865956 | Two physical open portico faces in station ground floor, arches, a platform canopy, station sign |
| Milovická Nádražka | Located in station building | Small cafe facade, serving window, courtyard seating; exact storefront wall inferred |
| Station shop | Reported by local player | Provisional shop frontage, exact tenant and physical face not yet verified |
| Modrá hvězda | Mírová 134/11, OSM way 202367194 | 2-floor photo-matched ochre/orange facade, red ground floor, white trim and balcony |
| Mírová 243/36 | OSM way 202367254 | Cream plaster, deep red roof, dormers, corner shop |
| Potraviny D a Š | Mírová 74/4, OSM way 202298645 | Verified address; provisional grocery facade |
| Cyklověž Milovice | OSM way 1011197691 | Tall faceted translucent glass/metal circular biketower |
| Church of St. Catherine | OSM way 118487991 | Neo-Gothic clock tower and spire |
| ZŠ T. G. Masaryka | OSM way 118487979 | School facade with signage |

See [architecture data & references](data/architecture-references.json), including photo author, historical date, license and model uncertainty. Many OSM building levels are missing or outdated. The new building heights remain **photo-derived estimates**, not survey measurements.

## Game
Controls: WASD/arrows to walk or drive; E to board/leave; C camera; R reset; M minimap; J jobs. Also supports mobile touch controls. Spawn picker offers a regional location (including the Mladá and Boží Dar areas), plus walking, sedan, SUV, van, police car and bus. Only an **active bus job** shows doors, passengers and route markers.

## Sources and attribution
- Footprints, road centerlines, rail, paths: © OpenStreetMap contributors (ODbL).
- Elevation: © ČÚZK / Zeměměřický úřad DMR 4G (CC BY 4.0), offline 10 m sample grid.
- Photo sources: Wikimedia Commons and various documentary/business sites as visual reference only. No Google Street View image tiles or third-party photograph pixels copied into game.

## Quality checks
GitHub Actions validates JavaScript and runs a real Chromium WebGL smoke test on the 3D world, terrain, player/map marker, vehicle entry and bus job, including a two-opening station passage check. Repeated facade details are built with shared instanced geometry to reduce draw calls.

## Further work
Verify station shop, passage dimensions and each house level/roof against up-to-date photographs or survey; expand the geographic area after the center becomes recognizable.
