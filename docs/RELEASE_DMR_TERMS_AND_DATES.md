# DMR service terms and historical update dates — issue #147

Reviewed 2026-11-26; supersedes the earlier inability to retrieve the service terms PDF. Not a legal sign-off.

## Official evidence
- [Dataset CZ-CUZK-DMR4G-V](https://geoportal.gov.cz/php/micka/record/basic/CZ-CUZK-DMR4G-V): catalog revision 2026-06-01, metadata update 2026-11-11; CC BY 4.0, free access, reference to decree 31/1995 Sb.
- [Service CZ-CUZK-AGS-DMR4G](https://geoportal.gov.cz/php/micka/record/basic/CZ-CUZK-AGS-DMR4G): the exact ArcGIS ImageServer used by the game extraction scripts. Its access/use link leads to the following PDF.
- [Zásady užívání dat a služeb ZÚ](https://geoportal.cuzk.gov.cz/Dokumenty/Podminky.pdf), č. j. ZÚ-01256/2026-13310, 23 March 2026, 7 pages. Successfully retrieved in web search and visually checked pages 3 and 7. Sections 1.2 and 2 describe free open ZABAGED data and download/export mechanisms; section 7.3 describes free network services and possible restriction of excessive load. Sections 5 and 6 are about CZEPOS and ETJTZÚ, not the game's raster sampling scripts. No blanket prohibition of commercial reuse of the open DMR dataset was identified in these relevant provisions.
- [Public administration service S10555](https://portal.gov.cz/sluzby-vs/poskytovani-udaju-zabaged-ortofota-cr-statniho-mapoveho-dila-databazoveho-souboru-geografickeho-nazvoslovi-a-bodovych-poli-dalkovym-pristupem-jako-otevrena-data-S10555) corroborates CC BY 4.0 for the relevant open spatial data.
- [Decree 31/1995 Sb., § 11a](https://www.zakonyprolidi.cz/cs/1995-31#p11a) paragraph 4 requires source and latest update date when disseminating or making available the relevant data. Paragraph 3 addresses excessive service load. Confirm applicability and adequate date attribution for the specific exported raster.
- [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.cs) permits modification and commercial sharing subject to attribution, license link, modification notice and no additional restrictions.

## Actual shipped terrain history (Git evidence)
Checked path history at main a5e13d9cce39cc952e07684fca4e5cc01566797b. Each file has one listed path commit.
| File | Recorded project data commit (UTC) | Commit |
|---|---|---|
| data/milovice-terrain.json | 2026-11-12 20:30:22 | 0a8a4edd9b1a423659b3a8103e24b2f58a027ae4 |
| data/regions/terrain-mlada.json | 2026-11-12 22:27:07 | 6868e73a40f4153a9c84cad14194dd3c72cbe1ed |
| data/regions/terrain-vrutice.json | 2026-11-12 22:27:07 | 6868e73a40f4153a9c84cad14194dd3c72cbe1ed |
| data/regions/terrain-westlink.json | 2026-11-12 22:27:07 | 6868e73a40f4153a9c84cad14194dd3c72cbe1ed |
| data/regions/terrain-centerlink.json | 2026-11-12 22:27:07 | 6868e73a40f4153a9c84cad14194dd3c72cbe1ed |
| data/regions/terrain-bozidar.json | 2026-11-12 22:27:07 | 6868e73a40f4153a9c84cad14194dd3c72cbe1ed |

These are Git author dates, NOT proven upstream raster revision or extraction timestamps. The current national catalogue dates are likewise NOT proof of the revision of the actual historical raster. Do not substitute any of these dates as the provider's actual last update of our exported data. Existing JSON files do not record a provider revision or acquisition timestamp; source builders retain neither original raster nor response metadata. Before release, ask provider for how to identify the relevant update date, or re-acquire from a dated source and review geometry differences separately. For future exports retain the response metadata, acquisition UTC time, source revision when provided, request parameters and raster digest. Keep original data unchanged meanwhile.

## Follow-up
After #181 merges, update credits to link the recovered official terms, clearly distinguish the recorded project data date from unknown upstream update date, and keep #147 open for the unresolved date, ODbL/mixed-source obligations and final distribution review. This independent documentation change leaves the pending #181 untouched and makes no runtime or legal approval changes.
