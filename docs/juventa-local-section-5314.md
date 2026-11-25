# Juventa 5.314 — hypotetické lokální výšky (příprava)

Main po #108: f025780a17fc6fdcf29657c889070a8310f6bf95. Šest PR workflow 5.313 úspěšných, Pages 5.313 zatím neověřeny. Tato větev je příprava; neobsahuje změny herní verze, renderování ani kolizí.

Výpočet kombinuje již uložené relativní úrovně řezu A (DEKPROJEKT, PDF str. 18) a audit 5.312 z obou regionálních DEM. Pro každý DEM používá minimum a maximum výšek kandidátních vrcholů 47–51 pouze jako scénáře ukotvení spodního terénu (-0,800 m ve výkresu). Výsledný interval NENÍ interval spolehlivosti ani určení vstupu. Přesný vztah mezi výkresem, vstupem a absolutním datumem zůstává neznámý. Neprovádí se posun školního půdorysu.

Přidán Node test obou regionálních dat, chybějícího pokrytí, neplatného vstupu a bezpečnostních příznaků. Node test zatím nebyl spuštěn. Před integrací ověřit test, dostupnost přesného výškového data a případně připojit jen auditní výstup; žádná fyzická změna na základě scénáře. Původní dokument nebyl v tomto kroku znovu otevřen.
