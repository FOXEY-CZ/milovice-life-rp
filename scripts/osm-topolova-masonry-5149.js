/**
 * Milovice RP 5.149 — the six-storey source-locked Topolová 647 block
 * has MASONRY load-bearing walls, not a verified prefabricated panel facade.
 * Evidence: Czech Statistical Office iRSO building 1035017661, 2025-04-01,
 * RÚIAN 42429056. Public metadata proves construction type, number
 * of storeys, flat count and lift but NOT plaster color, facade detail,
 * individual windows/entries, roof line, or metre-accurate height.
 */
import {TOPOLOVA_RESIDENTIAL_5148} from './osm-topolova-residential-5148.js';
export const TOPOLOVA_CSU_5149=Object.freeze({
 source:'Český statistický úřad · iRSO',
 url:'https://apl2.czso.cz/irso4/buddet.jsp?b=21&budid=3443237&hkodcis=43&idob=1035017661&kod=537501&kodcis=43&kodpol=nnnnnn',
 validOn:'2025-04-01',ruian:'42429056',address:'Topolová 647, Mladá, Milovice',
 allStoreys:6,flats:60,loadBearingWalls:'bricks-and-masonry-blocks',
 liftPresent:true,footprintAreaSquareMetres:858,enclosedVolumeCubicMetres:16888,
 exteriorPaintUnverified:true,individualPanelJointsUnverified:true
});
export function planTopolovaMasonry5149({panelPlan}={}){
 const ref=TOPOLOVA_RESIDENTIAL_5148,source=TOPOLOVA_CSU_5149;
 if(panelPlan?.version!=='5.148'||panelPlan.id!==ref.id||
  panelPlan.regionId!==ref.regionId||
  panelPlan.sourceRUIANId!==source.ruian||
  panelPlan.sourceOSMHash!==ref.geometryHash||
  !panelPlan.sourceGeometryExactlyMatched||
  panelPlan.floors!==source.allStoreys||panelPlan.flats!==source.flats||
  panelPlan.photographedFacade!==false||
  panelPlan.footprintChanged!==false||
  panelPlan.roofShapeChanged!==false)return null;
 return {
  version:'5.149',sourceCsu:source.url,sourceDate:source.validOn,
  address:source.address,buildingId:ref.id,sourceRUIANId:source.ruian,
  floors:source.allStoreys,flats:source.flats,
  loadBearingWalls:source.loadBearingWalls,liftRecorded:source.liftPresent,
  // A wall's structural material does NOT establish the visible surface.
  useExistingGenericWallMaterial:true,exteriorColorPhotoVerified:false,
  removeFalsePanelSeams:true,originalFacadeWindowsRemainModel:true,
  originalRoofAndHeightRemainEstimates:true,
  newDoors:0,newWindows:0,newBuildings:0,newColliders:0,
  roadGeometryChanged:false,footprintChanged:false,roofShapeChanged:false
 };
}
