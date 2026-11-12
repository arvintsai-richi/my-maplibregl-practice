import { useLayer } from './useLayer';

/**
 * 地籍圖層
 * @returns
 * - layerId: 圖層Id
 * - name: 圖層名稱
 * - addToMap: 加入地圖的函式
 * - opacity: 圖層透明度，範圍0~100，預設為 0
 * - isVisible: 圖層是否可見，預設 false
 */
export function useCadastralLayer() {
  const name = '地籍';
  const sourceId = 'cadastral';
  const layerId = 'cadastral';
  const sourceLayerId = 'cadastral';
  const sourceData = {
    type: 'vector',
    tiles: [
      'https://localhost:53558/cadaster/tiles/bipCadastral/{z}/{x}/{y}.pbf',
    ],
  };
  const layerData = {
    id: layerId,
    type: 'fill',
    source: sourceId,
    'source-layer': sourceLayerId,
    paint: {
      'fill-color': '#ffd338',
      'fill-outline-color': '#6E6E6E',
    },
  };
  const opacityProperties = ['fill-opacity'];

  const { addToMap, opacity, isVisible } = useLayer(
    sourceId,
    sourceData,
    layerId,
    layerData,
    opacityProperties,
  );

  return { layerId, name, addToMap, opacity, isVisible };
}
