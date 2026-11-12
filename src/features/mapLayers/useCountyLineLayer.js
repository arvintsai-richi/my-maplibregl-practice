import { useLayer } from './useLayer';

/**
 * 縣市界線圖層
 * @returns
 * - layerId: 圖層Id
 * - name: 圖層名稱
 * - addToMap: 加入地圖的函式
 * - opacity: 圖層透明度，範圍0~100，預設為 0
 * - isVisible: 圖層是否可見，預設 false
 */
export function useCountyLineLayer() {
  const name = '縣市區界(線)';
  const sourceId = 'county-line';
  const layerId = 'county-line';
  const sourceData = {
    type: 'geojson',
    data: 'https://ncdr3d.richitech.com.tw/Files/disp/AdministrativeDistrict/MOI_W84_COUNTY_SIMPLIFY.json',
  };
  const layerData = {
    id: layerId,
    type: 'line',
    source: sourceId,
    paint: {
      'line-color': '#FFFFFF',
      'line-width': 1.33333,
    },
  };
  const opacityProperties = ['line-opacity'];

  const { addToMap, opacity, isVisible } = useLayer(
    sourceId,
    sourceData,
    layerId,
    layerData,
    opacityProperties,
  );

  return { layerId, name, addToMap, opacity, isVisible };
}
