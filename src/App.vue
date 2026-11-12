<script setup>
import { onMounted, shallowRef } from 'vue';
import { MapLayersPanel } from '@/features/mapLayers';
import { MapStyleSelector } from './features/mapStyles';
import * as maplibregl from 'https://unpkg.com/maplibre-gl@^6.17.0/dist/maplibre-gl.mjs';

const map = shallowRef();

onMounted(() => {
  map.value = new maplibregl.Map({
    container: 'map',
    center: [121, 23.5],
    zoom: 7,
    rollEnabled: true,
  });
  map.value.addControl(
    new maplibregl.NavigationControl({
      visualizePitch: true,
      visualizeRoll: true,
      showZoom: true,
      showCompass: true,
    }),
  );
});
</script>

<template>
  <main>
    <div id="map">
      <MapLayersPanel class="map-layer-panel" :map="map" />
      <MapStyleSelector class="map-style-selector" :map="map" />
    </div>
  </main>
</template>

<style lang="scss">
@font-face {
  font-family: 'Noto Sans TC';
  src:
    local('Noto Sans TC'),
    url('/fonts/NotoSansTC-Regular.woff2') format('woff2');
}

body {
  font-family: 'Noto Sans TC', sans-serif;
  margin: 0;
}

main {
  height: 100%;
}

#map {
  width: 100vw;
  height: 100vh;
  & > * {
    z-index: 1;
  }
}

.map-style-selector {
  position: absolute;
  top: 15px;
  right: 50px;
}

.map-layer-panel {
  position: absolute;
  top: 30px;
  left: 50px;
  padding: 10px;
}
</style>
