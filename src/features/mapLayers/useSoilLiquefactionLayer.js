import { useLayer } from './useLayer';

/**
 * 土壤液化潛勢圖層
 * @returns
 * - `layerId`: 圖層Id
 * - `name`: 圖層名稱
 * - `addToMap`: 加入地圖的函式
 * - `transparency`: 圖層透明度，範圍0~100，預設為 0
 * - `isVisible`: 圖層是否可見，預設 false
 */
export function useSoilLiquefactionLayer() {
  const name = '土壤液化潛勢';
  const sourceId = 'soil-liquefaction';
  const layerId = 'soil-liquefaction';
  const sourceData = {
    type: 'geojson',
    data: '/data/土壤液化潛勢.GeoJSON',
  };
  const layerData = {
    id: layerId,
    type: 'fill',
    source: sourceId,
    paint: {
      'fill-color': [
        'case',
        ['==', ['get', 'class'], '3'],
        'green',
        ['==', ['get', 'class'], '2'],
        'yellow',
        ['==', ['get', 'class'], '1'],
        'red',
        'white',
      ],
    },
  };
  const opacityProperties = ['fill-opacity'];

  return useLayer(
    name,
    sourceId,
    sourceData,
    layerId,
    layerData,
    opacityProperties,
  );
}
