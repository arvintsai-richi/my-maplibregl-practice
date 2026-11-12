import { ref, watch } from 'vue';
import * as maplibregl from 'https://unpkg.com/maplibre-gl@^6.17.0/dist/maplibre-gl.mjs';

/**
 * 使用地圖圖層
 * @param {string} sourceId 圖層資料源Id
 * @param {object} sourceData 圖層資料源
 * @param {string} layerId 圖層Id
 * @param {object} layerData 圖層參數
 * @param {string[]} opacityProperties 控制透明度的所有屬性
 * @returns
 * - addToMap: 加入地圖的函式
 * - opacity: 圖層透明度，範圍0~100，預設為 0
 * - isVisible: 圖層是否可見，預設 false
 */
export function useLayer(
  sourceId,
  sourceData,
  layerId,
  layerData,
  opacityProperties,
) {
  let _map = null;
  const opacity = ref(0);
  const isVisible = ref(false);

  watch(opacity, _setOpacity);
  watch(isVisible, _setVisibility);

  /**
   * 將圖層套用到地圖上
   * @param {maplibregl.Map} map 要將圖層套上去的地圖
   * @returns (void)
   */
  function addToMap(map) {
    if (!(map instanceof maplibregl.Map)) {
      return;
    }

    _map = map;

    _map.on('style.load', () => {
      _map.addSource(sourceId, sourceData);
      _map.addLayer(layerData);
      _setOpacity();
      _setVisibility();
    });
  }

  function _setOpacity() {
    opacityProperties.forEach((property) => {
      _map.setPaintProperty(layerId, property, opacity.value / 100);
    });
  }

  function _setVisibility() {
    const visibility = isVisible.value ? 'visible' : 'none';
    _map.setLayoutProperty(layerId, 'visibility', visibility);
  }

  return { addToMap, opacity, isVisible };
}
