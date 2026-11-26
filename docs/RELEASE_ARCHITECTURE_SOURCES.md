# CROSSVEX — published architecture source inventory

Baseline 0a9500f327b88b08768d67801e6d6a9e90454d8b; independent prep while #153 is under review.

The actual staged verified-buildings manifest contains five manually reviewed geometry cards, four citing five Wikimedia Commons photos, one citing a Mapy.com Panorama reference (also repeated in its N facade). The records include estimated dimensions and photo-informed colors, not surveyed measurements. Source links are preserved; the manifest does not contain original photo pixels. This is limited to this manifest, not all architecture implemented in index.html or other scripts.

2026-11-26 source check: the exact Wikimedia Commons Mírová 36 file listing corroborated ŠJů, 2024-05-30, CC BY 4.0 (https://commons.wikimedia.org/wiki/File:Milovice,_M%C3%ADrov%C3%A1_36.jpg). The other four exact photo pages were inaccessible in this review; retain existing declarations without elevating them to independent verification. Mapy REST API terms https://developer.mapy.com/terms-and-conditions/ expressly address derivative content; those API terms do not establish which terms apply to the historical user-supplied web Panorama or whether the independently modelled geometry is permitted. No permission verified. Seek applicable terms/permission or independently sourced replacement evidence before release; do not silently relabel sources as CC BY.

The separate inventory explicitly marks all five records pending. The new audit compares actual staged source URLs, secondary and facade references, declared author/license/date and ID coverage, with negative tests for new records and changed license. It does not confer rights, verify visual accuracy, or remove or alter any geometry. New CI pending. No changes to runtime or public attribution.

## Technical evidence
Run 45833312724 PASS: staged 281 files, all five published records match the independent inventory, negative tests for altered license and new ID PASS. All five remain pending rights review. Added narrow PR paths for changes to inventory, manifest parser and staging. No changes to runtime or geometry.
