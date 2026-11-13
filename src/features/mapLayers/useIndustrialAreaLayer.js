import { useLayer } from './useLayer';

/**
 * 工業區範圍圖層
 * @returns
 * - `layerId`: 圖層Id
 * - `name`: 圖層名稱
 * - `addToMap`: 加入地圖的函式
 * - `opacity`: 圖層透明度，範圍0~100，預設為 0
 * - `isVisible`: 圖層是否可見，預設 false
 */
export function useIndustrialAreaLayer() {
  const name = '工業區範圍';
  const sourceId = 'industrial-area-raster';
  const layerId = 'industrial-area-raster';
  const sourceData = {
    type: 'raster',
    tiles: [
      'https://richimap1.richitech.com.tw/arcgis/services/CBB_Practice/CBB_Practice_Industry_84/MapServer/WMSServer?request=GetMap&service=WMS&version=1.3.0&layers=0&styles=default&crs=EPSG:3857&bbox={bbox-epsg-3857}&width=400&height=400&format=image/png',
    ],
    bounds: [120.125844, 22.404025, 121.868217, 25.168814],
    tileSize: 256,
  };
  const layerData = {
    id: layerId,
    type: 'raster',
    source: sourceId,
  };
  const opacityProperties = ['raster-opacity'];

  return useLayer(
    name,
    sourceId,
    sourceData,
    layerId,
    layerData,
    opacityProperties,
  );
}
