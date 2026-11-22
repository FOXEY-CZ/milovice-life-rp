# Milovice RP — aktuální handoff

> **5.270 (22. 11. 2026; PR + CI dosud NEOVĚŘENO)** — práce na reálné uliční bezpečnosti. [Oficiální zakázka P25V00000049](https://zakazky.mesto-milovice.cz/contract_display_85.html) na 4 přechody podél Armádní (Rakouská, Kaštanová, Pod Lesem, bezejmenná) byla zadána na podzim 2025, plnění dle profilu skončilo 7. 1. 2026; [tisková bilance 2025](https://nymbursky.denik.cz/zpravy_region/milovice-rok-2025-pumptrack-psi-park-opravy-investice.html) také uvádí postavení nových přechodů. Městská smlouva obsahuje vodorovné V7a značky a snížení obrubníků. **Přesné geodetické polohy nebyly dohledány.** Pro jednu jasně pojmenovanou odbočku Pod Lesem použijeme modelový **jeden vizuální přechod** na **původní OSM silnici 128087258** (hash `6e14ec02`, source width 6m, motor_vehicle=no) v odhadnuté vzdálenosti **10,5 m od skutečného napojení** na Armádní **1331897690** (hash `197dbea8`, GPS spoj `50.2286371,14.8727931`). Odhad = **jen modelové pruhy, ne skutečné zaměření**. Model se deaktivuje při novější zdrojové `footway=crossing` do 22 m. Zůstává původní OSM, šířka, průjezd, kolize, materiál a NPC graf. Zbylé tři smluvní přechody neimplementovat naslepo, protože chybí jejich jednotlivá aktuální geodetická poloha.

## Před sloučením

- Jednotkový test `scripts/osm-pod-lesem-municipal-crossing-5270.test.mjs` vyžaduje source lock, společný uzel a žádný duplikát. 
- Reálný mobilní + široký Chromium/SwiftShader test `scripts/osm-pod-lesem-municipal-crossing-webgl-5270.mjs` po 7,2s LOD vyžaduje přítomné bílé pruhy, bez nových cest / kolizí, screenshoty `pod-lesem-municipal-crossing-5270-mobile.png` a `-wide.png`.
- **Zatím žádné PASS netvrdit**, testy ještě doběhnou na PR. U screenshotů kontrolovat zejména, zda model nepřekrývá okraj nebo se nevznáší. Po 5/5 zelených PR CI teprve merge a Pages deploy.

## Poslední hotový a nasazený stav

**5.269** [PR #52](https://github.com/FOXEY-CZ/milovice-life-rp/pull/52), sloučeno v `716f0d5`, docs `b2eade2`. **5/5 PR CI PASS**; [GitHub Pages úspěšný deploy](https://github.com/FOXEY-CZ/milovice-life-rp/actions/runs/45026408713). Městem doložený povrch kostek Rakouská × Pod Lesem, ale délka **4 modelová ramena × 12 m** je výslovný odhad. Stejně jako Kaštanová používá stávající sdílený sett materiál, beze změn silnic a provozu. Screenshoty mobil+wide pro 5.269 otevřené a zhodnocené.

**5.268** [PR #51](https://github.com/FOXEY-CZ/milovice-life-rp/pull/51) 5/5 CI PASS, Pages success: opt-in TECHNICKÉ barevné vyznačení původních OSM chodníků a dvou **neoznačených** přechodů na Italské. **NIKDY** z těchto dvou neoznačených 1484073944/1484073946 nevytvářet zebru jen kvůli novému projektu na jiné lokalitě. **5.267** [PR #50](https://github.com/FOXEY-CZ/milovice-life-rp/pull/50) foto opřený model příčného plotu u Vojenského zátiší; **5.266** [PR #49](https://github.com/FOXEY-CZ/milovice-life-rp/pull/49) podélný plot + porost. **5.265–5.263** model předního zádveří, nároží a fasády, podrobnosti README.

**Milovice jako celek jsou stále rozpracované.** Nová zakázka 2025 má jinou geografii než přechody `1484073944`/`1484073946` na Italské a nenahrazuje jejich značkování. Pod Lesem přechod 5.270 není aktuální OSM-footway ani zaměřená zebra, je to **autorsky modelovaná rekonstrukce podle městského projektu**. Nedoplňovat nepodložené obrubníky, chodníky, lampy, ostrůvky, nové vstupy.

## Další krok 5.271

Po zelených testech + Pages nového modelu prohlédnout skutečný WebGL screenshot a porovnat s veřejně autorizovanou fotografií nebo půdorysným situačním plánem čtyř přechodů. Zpřesňovat polohy jen s podklady; ověřit v běžném hraní bezpečnou kolizi s vozidly a zda modelové pruhy zůstávají na povrchu. Poté pokračovat další celou ulicí a skutečně doloženými obrubami. Zachovat OSM GPS a 60FPS optimalizace.

Hra po nasazení 5.270: https://foxey-cz.github.io/milovice-life-rp/?v=527000&streetAudit=pod-lesem-municipal-crossing-5270

Repo: https://github.com/FOXEY-CZ/milovice-life-rp

Pravidla: `AGENTS.md`, `docs/DEVELOPMENT_WORKFLOW.md`, `docs/STREET_WORKFLOW.md`.
