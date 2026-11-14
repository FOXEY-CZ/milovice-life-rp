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
- Dvě veřejné fotografie přednádražního prostoru z roku 2024 a samostatné fotografie stanovišť A/B ze stejného roku jsou odkázané s licencí a geolokací **kamery**, ne nepodložených fyzických objektů. Pro stanoviště A/B je odkázané též schéma PID s platností od 15. prosince 2024.
- Přístup přes rebuild.html, každou jeho uliční kartu i mapu přímo ve hře. Vlastní 15bodová kontrola / poznámky jsou pouze **lokálně v prohlížeči**, bez zásahu do sdílených herních dat a bez změny stavu approved.
- Automatický test rebuild2-survey.test.mjs chrání před ztrátou OSM objektů, duplikací zdrojů a chybným přiřazením křižovatky. Nejde o automatický důkaz fotografické 3D shody; ta musí následovat před opravami fasád, parkování a mobiliáře.

**Další fyzický rebuild:** Nádražní projít od jednoho konce k druhému přes všechny přiřazené i hraniční objekty; opravovat pouze to, co potvrdí fotografie nebo geodata. Zachovat stávající kolize a kontrolu FPS. V této fázi se 3D modely svévolně nepřestavovaly.
