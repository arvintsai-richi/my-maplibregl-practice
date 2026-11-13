import dayjs from 'dayjs';
import { useLayer } from './useLayer';
import * as maplibregl from 'https://unpkg.com/maplibre-gl@^6.17.0/dist/maplibre-gl.mjs';

/**
 * 地震資料圖層
 * @returns
 * - `layerId`: 圖層Id
 * - `name`: 圖層名稱
 * - `addToMap`: 加入地圖的函式
 * - `transparency`: 圖層透明度，範圍0~100，預設為 0
 * - `isVisible`: 圖層是否可見，預設 false
 */
export function useEarthquakeLayer() {
  const name = '地震';
  const sourceId = 'earthquake';
  const layerId = 'earthquake';
  const sourceData = {
    type: 'geojson',
    data: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson',
    cluster: true,
    clusterMaxZoom: 9,
    clusterProperties: {
      // keep separate counts for each magnitude category in a cluster
      max_mag: ['max', ['get', 'mag']],
    },
    promoteId: 'ids',
  };
  const layerData = {
    id: layerId,
    type: 'circle',
    source: sourceId,
    paint: {
      'circle-radius': [
        'case',
        ['has', 'point_count'],
        ['*', 12, ['+', 1, ['log10', ['get', 'point_count']]]],
        12,
      ],
      'circle-color': [
        'case',
        ['has', 'max_mag'],
        ['step', ['get', 'max_mag'], 'green', 3, 'yellow', 7, 'red'],
        ['step', ['get', 'mag'], 'green', 3, 'yellow', 7, 'red'],
      ],
      'circle-stroke-width': [
        'case',
        ['boolean', ['feature-state', 'selected'], false],
        6,
        0,
      ],
      'circle-stroke-color': 'orange',
    },
  };
  const opacityProperties = ['circle-opacity', 'circle-stroke-opacity'];

  const baseLayer = useLayer(
    name,
    sourceId,
    sourceData,
    layerId,
    layerData,
    opacityProperties,
  );
  let _map = null;
  let _selectedStateId = null;

  /**
   * 將圖層套用到地圖上
   * @param {maplibregl.Map} map 要將圖層套上去的地圖
   * @returns (void)
   */
  function addToMap(map) {
    if (!(map instanceof maplibregl.Map)) {
      return;
    }
    baseLayer.addToMap(map);
    _map = map;

    _map.on('click', layerId, (e) => {
      // 蒐集 popup 要顯示的參數
      const { cluster, point_count, mag, time, place } =
        e.features[0].properties;
      const coordinates = e.features[0].geometry.coordinates.slice();
      let descriptionHTML = '';

      if (cluster) {
        descriptionHTML = `<strong>資料</strong> ${point_count} 筆`;
      } else {
        const timeString = dayjs(time).toString();
        descriptionHTML = `<strong>震度</strong> ${mag}<br>
                           <strong>時間</strong> ${timeString}<br>
                           <strong>地點</strong> ${place}`;
      }

      // 新增 popup
      new maplibregl.Popup()
        .setLngLat(coordinates)
        .setHTML(descriptionHTML)
        .addTo(_map);

      // hightlight 這一個點
      if (e.features.length > 0) {
        _setSelectedPoint(e.features[0].id);
      }

      // 將螢幕移動到該點
      if (e.features[0].properties.cluster) {
        _map.flyTo({ center: coordinates });
      } else {
        _map.flyTo({ center: coordinates, zoom: 10 });
      }
    });

    // hover 時把游標變成手指
    _map.on('mouseenter', layerId, () => {
      _map.getCanvas().style.cursor = 'pointer';
    });

    // 沒 hover 時把游標變回去
    _map.on('mouseleave', layerId, () => {
      _map.getCanvas().style.cursor = '';
    });
  }

  function _setSelectedPoint(pointId) {
    if (_selectedStateId) {
      _map.setFeatureState(
        { source: sourceId, id: _selectedStateId },
        { selected: false },
      );
    }
    if (pointId) {
      _map.setFeatureState(
        { source: sourceId, id: pointId },
        { selected: true },
      );
    }
    _selectedStateId = pointId;
  }

  return {
    layerId,
    name,
    addToMap,
    transparency: baseLayer.transparency,
    isVisible: baseLayer.isVisible,
  };
}
