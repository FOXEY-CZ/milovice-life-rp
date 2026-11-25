# Juventa 5.313 — registrace objektů A/C (příprava)
Základ main 8413775894346a8aa5920179978304537f5669d9; 5.312 / #107 sloučena po 6/6 PR kontrolách. Skutečný mobilní WebGL log 45627698743 potvrzuje základ 222,017 m, terénní reliéf obvodu 7,75 m a rozdíl základ–uzly 47–51 4,628–5,137 m (načtená Mladá, bez fallbacku).

## Nově znovu otevřený podklad
DEKPROJEKT 2024-017735-AdM, [PDF](https://smlouvy.gov.cz/smlouva/soubor/40162820/Smlouva%20podepsan%C3%A1_redacted.pdf), str. 17 obr. 1: červeně objekt A, modře C, sever nahoru. Str. 18 obr. 2: řez A. Městské PDF ATRIO IN se při tomto průchodu nepodařilo načíst (timeout).

Ruční odečet čtyř přibližných kontrolních bodů z obrazového zobrazení stránky 1024×1447 px, vazba na původní OSM vrcholy 64,31,22,0. Dvourozměrná podobnostní transformace nejmenších čtverců, bez změny zdrojových GPS: 3,199 px/m, maximální reziduum cca 1,85 m, nikoli garantovaná skutečná přesnost. Červený a modrý vyznačený čtyřúhelník převeden do kandidátních GPS masek. Posuzován střed hrany s tolerancí 3 m vůči dané masce a vzdáleností nad 5 m vůči druhé. Hrany 47/51 vycházejí u A, 33 u C, výstupek 48–50 nikoliv v blízkosti masky A podle tohoto kritéria. Nejde o potvrzení vstupu ani skutečné členění stěn; podklad je střechový letecký snímek, kontrolní body ručně odhadnuté, nikoliv geodetické body. Žádné obrazové pixely nejsou v repozitáři.

## Připravený další krok
Modul a Node test jsou samostatné, bez připojení ke hře. Test ještě neběžel. Po ověření 5.312 vytvořit kontrolní vizualizaci kandidátních oblastí pouze v auditním režimu a porovnat s fotografií; neřezat půdorys ani přemisťovat školu bez potvrzení skutečného rozhraní a výšek. Nepovažovat samotné reziduum za přesnost hranic objektu. Zachovat fyziku, zdrojový polygon a původní geometrii.

## Integrace 5.313
Přidán výhradně auditní režim `?v=531300&streetAudit=juventa-wings-5313`. Červená a modrá průsvitná vrstva nad společnou modelovou střechou, dva obrysy, čtyři trojúhelníky, žádné kolize ani fyzická změna. Kamera 300 m nad terénem, technický odhad. Původní fotoaudit ověřuje nepřítomnost překryvu; nový mobilní test ověřuje viditelnost po LOD a všechny rohy v záběru. Testy čekají. V tomto kroku původní dokument znovu neotevírán, vychází z uložených ručních odečtů.
