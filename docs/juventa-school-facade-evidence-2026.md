# Juventa, Komenského 578 — stavební a fotografické podklady 2026

## Ověřený podklad
Městská zadávací dokumentace ATRIO IN z dubna 2026, [Oprava fasádního soklu objekt A a C](https://zakazky.mesto-milovice.cz/document_1250/65ebd096e4d0b8ab546f76ddfc2ea91a-priloha-c-7-pd_zs-juventa-oprava-sok-pdf). Prohlédnuty skutečné stránky PDF (číslování prohlížeče od 1):
- str. 2: oprava soklů A/C, rampy a zastřešeného hlavního vstupu A; stávající zámková dlažba podél rampy má být vyrovnána při zachování sklonu.
- str. 9: u výtahové šachty C je navržena černohnědá mozaiková omítka podobná původní.
- str. 13: situační výřez u rampy s navrženou drenáží; samotný výřez neposkytuje bezpečně použitelné georeferencované rohy rampy.
- str. 14: fotografie A ukazují světlou omítku, tmavý hnědošedý sokl a růžově/červenohnědé obklady na některých hranách.
- str. 15–16: hlavní vstup A je krytý plochou střechou na hranatých tmavých sloupech; viditelné šedé schodiště, podesta, kovové zábradlí a prosklené vstupní dveře.
- str. 17: samostatná dlouhá přístupová rampa se šedým povrchem a zábradlím po obou stranách, oddělená od zdi úzkým nezpevněným pásem.

[Zakázka II](https://zakazky.mesto-milovice.cz/contract_display_104.html) a [záznam smluv z 29. 7. 2026](https://smlouvy.gov.cz/vyhledavani?all_versions=0&subject_idnum=239453&do=searchResultList-setLimit&file_text=&foreign_currency=&limit=500) dokládají zadání opravy, nikoli dokončení ani přesný odstín po realizaci. [Nymburský deník – bilance roku 2025](https://nymbursky.denik.cz/zpravy_region/milovice-rok-2025-pumptrack-psi-park-opravy-investice.html) uvádí obnovu fasády dvou školních budov. Starší snímky nelze automaticky použít jako aktuální vzhled celého komplexu.

## Vazba na herní mapu
V uložených exportech Mladá i Westlink je identický uzavřený OSM way [53865836](https://www.openstreetmap.org/way/53865836), 73 uzlů včetně uzavíracího, FNV-1a hash be655146 (lat/lon na sedm desetinných míst, oddělovač středník), RÚIAN 62834916, building=civic, school=primary, building:levels=5. Bounding box lat 50.2260613–50.2274128, lon 14.8659911–14.8675623. Jde o jeden členitý obrys komplexu, nikoli samostatně pojmenované objekty A/C; nelze jeho 5 podlaží bez dalšího přisoudit každému křídlu. Přilehlý civic way 53865846 (RÚIAN 49232924) nebyl přiřazen k A/C.

## Další implementace
Nejdříve spojit situační výřez a fotografie s přesnými hranami původního OSM půdorysu a odpovídajícími pěšími přístupy 5.305. Teprve poté vytvořit jednotlivé, prostorově správné modely podesty, schodů, rampy, sloupů a zábradlí. Fotografie nejsou geotagované; výška a sklon rampy ani přesná výška soklu nejsou touto rešerší zaměřeny. Nepoužívat fotografii jako texturu bez oprávnění. Žádná nová herní geometrie ani změna kolizí v tomto dokumentačním commitu.

## Stav 25. 11. 2026
5.304 PR #95 sloučen jako 63d0e42, 5/5 CI PASS. 5.305 PR #97: Validate PASS, širší WebGL kontroly dosud nedokončené; Pages neověřeny. Tento dokument je samostatný zdrojový audit a nemění herní build.
