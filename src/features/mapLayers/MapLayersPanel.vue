<script setup>
import { watch } from 'vue';
import { useIndustrialAreaLayer } from './useIndustrialAreaLayer.js';
import { useCadastralLayer } from './useCadastralLayer.js';
import { useCountyLineLayer } from './useCountyLineLayer.js';
import { useCountySymbolLayer } from './useCountySymbolLayer.js';
import { useEarthquakeLayer } from './useEarthquakeLayer.js';
import { useSoilLiquefactionLayer } from './useSoilLiquefactionLayer.js';
import * as maplibregl from 'https://unpkg.com/maplibre-gl@^6.17.0/dist/maplibre-gl.mjs';

const props = defineProps(['map']);

const industrialAreaLayer = useIndustrialAreaLayer();
const cadastralLayer = useCadastralLayer();
const countyLineLayer = useCountyLineLayer();
const countySymbolLayer = useCountySymbolLayer();
const earthquakeLayer = useEarthquakeLayer();
const soilLiquefactionLayer = useSoilLiquefactionLayer();

const layerList = [
  industrialAreaLayer,
  earthquakeLayer,
  cadastralLayer,
  soilLiquefactionLayer,
  countyLineLayer,
  countySymbolLayer,
];

function clamp(value, minValue, maxValue) {
  return Math.min(Math.max(value, minValue), maxValue);
}

function changeTransparency(layer, transparency) {
  // 設定兩次 transparency.value 是因為要讓數值確實改變而觸發 v-bind 到輸入框的值
  // 如果只設定一次，可能會導致輸入框存在不合理的數字 (例如打完100之後可以繼續在後面加0)
  layer.transparency.value = transparency;
  transparency = clamp(transparency, 0, 100);
  layer.transparency.value = transparency;
}

function changeVisibility(layer, isVisible) {
  layer.isVisible.value = isVisible;
}

watch(
  () => props.map,
  () => {
    const map = props.map;
    if (!(map instanceof maplibregl.Map)) {
      return;
    }

    layerList.forEach((layer) => layer.addToMap(map));
  },
);
</script>

<template>
  <div class="layer-panel">
    <div class="layer-panel-header">圖層套疊</div>
    <div class="layer-panel-body">
      <table cellspacing="20">
        <thead>
          <tr>
            <th scope="col">圖層名稱</th>
            <th scope="col">透明度</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="layer in layerList" :key="layer.layerId">
            <td scope="row">
              <input
                type="checkbox"
                :value="layer.isVisible.value"
                @input="changeVisibility(layer, $event.target.checked)"
              />
              {{ layer.name }}
            </td>
            <td>
              <input
                class="input-transparency"
                type="number"
                min="0"
                max="100"
                :value="layer.transparency.value"
                @input="changeTransparency(layer, $event.target.value)"
              />&nbsp;%
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="css" scoped>
.layer-panel {
  font-size: 18px;
}

.layer-panel-header {
  padding: 16px 20px;
  background-color: #009bfd;
  color: white;
}

.layer-panel-body {
  background-color: #f5f7f9;
}

.input-transparency {
  width: 50px;
  text-align: center;
}

th {
  font-weight: normal;
}
</style>
