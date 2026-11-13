import { useLayer } from './useLayer';

/**
 * 縣市名稱圖層
 * @returns
 * - `layerId`: 圖層Id
 * - `name`: 圖層名稱
 * - `addToMap`: 加入地圖的函式
 * - `opacity`: 圖層透明度，範圍0~100，預設為 0
 * - `isVisible`: 圖層是否可見，預設 false
 */
export function useCountySymbolLayer() {
  const name = '縣市區界(名稱)';
  const sourceId = 'county-symbol';
  const layerId = 'county-symbol';
  const sourceData = {
    type: 'geojson',
    data: 'https://ncdr3d.richitech.com.tw/Files/disp/AdministrativeDistrict/MOI_W84_COUNTY_Point.json',
  };
  const layerData = {
    id: layerId,
    type: 'symbol',
    source: sourceId,
    paint: {
      'text-color': '#4E4E4E',
      'text-halo-color': '#FFFFFF',
      'text-halo-width': 1.33333,
    },
    layout: {
      'text-field': ['get', 'COUNTYNAME'],
    },
  };
  const opacityProperties = ['text-opacity'];

  return useLayer(
    name,
    sourceId,
    sourceData,
    layerId,
    layerData,
    opacityProperties,
  );
}
