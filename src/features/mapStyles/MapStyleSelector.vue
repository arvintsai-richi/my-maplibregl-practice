<script setup>
import { ref, watch } from 'vue';
import * as maplibregl from 'https://unpkg.com/maplibre-gl@^6.17.0/dist/maplibre-gl.mjs';

const props = defineProps(['map']);

const MAP_STYLES = [
  {
    name: '公司服務',
    link: 'https://demotiles.maplibre.org/style.json',
  },
  {
    name: 'maptiler',
    link: 'https://api.maptiler.com/maps/77c09ec9-7fd5-4622-9997-0304ad25b620/style.json?key=Q1ccDNKktmjNBdazPWHD',
  },
  {
    name: 'MapLibre',
    link: 'https://ncdrccra.richitech.com.tw/files/styles/emap.json',
  },
];

const selectedMapStyle = ref(MAP_STYLES[2].link);

watch(selectedMapStyle, () => {
  props.map.setStyle(selectedMapStyle.value);
});

watch(
  () => props.map,
  () => {
    if (!(props.map instanceof maplibregl.Map)) {
      return;
    }
    props.map.setStyle(selectedMapStyle.value);
  },
);
</script>

<template>
  <select v-model="selectedMapStyle">
    <template v-for="style in MAP_STYLES">
      <option :value="style.link">
        {{ style.name }}
      </option>
    </template>
  </select>
</template>
