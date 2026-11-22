# Milovice RP — aktuální handoff

> **5.271 (22. 11. 2026; větev `fix/pod-lesem-crossing-segment-5271`; CI / Pages zatím NEOVĚŘENY)** — opravena ochrana 5.270 proti dvojímu vykreslení přechodu Pod Lesem při pozdějším doplnění skutečného `footway=crossing` do OSM. Nově se porovnává vzdálenost modelové zebry od **celé geometrie pěšího přechodu**, ne jen od jeho vrcholů; dlouhá přímka s oběma koncovými body dál než 22 m už případný průnik neobejde. Původní OSM, kolize, navigace, povrch, 10,5m odhad polohy a počet vykreslených pruhů současného datasetu se nemění. Fotogeodetické potvrzení stále chybí.

## Ověření a další krok 5.271

Nový Node regresní test obsahuje průnik segmentu, těsný průchod, vzdálený neškodný segment i chybné souřadnice. Následný CI (včetně skutečného Chromium/SwiftShader mobil+wide po 7,2s LOD) a GitHub Pages označovat za PASS **teprve po dokončení**. Po ověření přejít zpět na souvislou uliční návaznost Pod Lesem/Armádní; přesnou polohu značení a obrubníků řešit až podle oprávněných fotografií či situačního plánu.

Kontrolní hra po případném nasazení: https://foxey-cz.github.io/milovice-life-rp/?v=527100&streetAudit=pod-lesem-municipal-crossing-5270

## Předchozí verze 5.270

> **5.270 (22. 11. 2026; [PR #53](https://github.com/FOXEY-CZ/milovice-life-rp/pull/53) sloučen, commit `7d0313a`, 5/5 hlavních PR CI PASS)** — práce na reálné uliční bezpečnosti. [Oficiální zakázka P25V00000049](https://zakazky.mesto-milovice.cz/contract_display_85.html) na 4 přechody podél Armádní (Rakouská, Kaštanová, Pod Lesem, bezejmenná) byla zadána na podzim 2025, plnění dle profilu skončilo 7. 1. 2026; [tisková bilance 2025](https://nymbursky.denik.cz/zpravy_region/milovice-rok-2025-pumptrack-psi-park-opravy-investice.html) také uvádí postavení nových přechodů. Městská smlouva obsahuje vodorovné V7a značky a snížení obrubníků. **Přesné geodetické polohy nebyly dohledány.** Pro jednu jasně pojmenovanou odbočku Pod Lesem použijeme modelový **jeden vizuální přechod** na **původní OSM silnici 128087258** (hash `6e14ec02`, source width 6m, motor_vehicle=no) v odhadnuté vzdálenosti **10,5 m od skutečného napojení** na Armádní **1331897690** (hash `197dbea8`, GPS spoj `50.2286371,14.8727931`). Odhad = **jen modelové pruhy, ne skutečné zaměření**. Model se deaktivuje při novější zdrojové `footway=crossing` do 22 m. Zůstává původní OSM, šířka, průjezd, kolize, materiál a NPC graf. Zbylé tři smluvní přechody neimplementovat naslepo, protože chybí jejich jednotlivá aktuální geodetická poloha.

## Ověření 5.270 + otevřená rizika

**5/5 hlavních PR CI PASS:** [hlavní validace](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45027460413), [Italská + modelový přechod](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45027460475), [Station photo](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45027460432), [Nádražní](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45027460449), [blok 5.82](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45027460500). [Druhý Italská push test](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45027440894) loguje `PASS 5.270` Node (zdrojové původní GPS a hash) i Chromium/SwiftShader mobil+wide **po 7,2 s LOD**. Oba `pod-lesem-municipal-crossing-5270-*.png` screenshoty skutečně staženy a otevřeny: zebra na asfaltu, po LOD zůstává, žádná očividná plovoucí deska. **Lokálně viditelné nedodělané hrany ulice** a **modelové (ne zaměřené) umístění zebry** jsou známá rizika. **GitHub Pages 5.270 ověřeno:** [pages build and deployment #45028108960](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45028108960) skončilo `success` dne 22. 11. 2026 v 13:35 UTC pro `main` HEAD `c0bb68871de15eea3ab4bdf778704dfd5fd14819` (zahrnuje merge 5.270). Jde o potvrzení nasazení, nikoli nové ruční prověření hraní z veřejné URL.

## Předchozí dokončená a nasazená práce

**5.269** [PR #52](https://github.com/FOXEY-CZ/milovice-life-rp/pull/52), sloučeno v `716f0d5`, docs `b2eade2`. **5/5 PR CI PASS**; [GitHub Pages úspěšný deploy](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45026408713). Městem doložený povrch kostek Rakouská × Pod Lesem, ale délka **4 modelová ramena × 12 m** je výslovný odhad. Stejně jako Kaštanová používá stávající sdílený sett materiál, beze změn silnic a provozu. Screenshoty mobil+wide pro 5.269 otevřené a zhodnocené.

**5.268** [PR #51](https://github.com/FOXEY-CZ/milovice-life-rp/pull/51) 5/5 CI PASS, Pages success: opt-in TECHNICKÉ barevné vyznačení původních OSM chodníků a dvou **neoznačených** přechodů na Italské. **NIKDY** z těchto dvou neoznačených 1484073944/1484073946 nevytvářet zebru jen kvůli novému projektu na jiné lokalitě. **5.267** [PR #50](https://github.com/FOXEY-CZ/milovice-life-rp/pull/50) foto opřený model příčného plotu u Vojenského zátiší; **5.266** [PR #49](https://github.com/FOXEY-CZ/milovice-life-rp/pull/49) podélný plot + porost. **5.265–5.263** model předního zádveří, nároží a fasády, podrobnosti README.

**Milovice jako celek jsou stále rozpracované.** Nová zakázka 2025 má jinou geografii než přechody `1484073944`/`1484073946` na Italské a nenahrazuje jejich značkování. Pod Lesem přechod 5.270 není aktuální OSM-footway ani zaměřená zebra, je to **autorsky modelovaná rekonstrukce podle městského projektu**. Nedoplňovat nepodložené obrubníky, chodníky, lampy, ostrůvky, nové vstupy.

## Původně plánovaný další krok po 5.270

Pages pro 5.270 potvrzeny (viz výše). Dále porovnat již prohlédnuté technické WebGL screenshoty s veřejně autorizovanou fotografií nebo půdorysným situačním plánem čtyř přechodů. Zpřesňovat polohy jen s podklady; ověřit v běžném hraní bezpečnou kolizi s vozidly a zda modelové pruhy zůstávají na povrchu. Poté pokračovat další celou ulicí a skutečně doloženými obrubami. Zachovat OSM GPS a 60FPS optimalizace.

Hra po nasazení 5.270: https://foxey-cz.github.io/milovice-life-rp/?v=527000&streetAudit=pod-lesem-municipal-crossing-5270

Repo: https://github.com/FOXEY-CZ/milovice-life-rp

Pravidla: `AGENTS.md`, `docs/DEVELOPMENT_WORKFLOW.md`, `docs/STREET_WORKFLOW.md`.
