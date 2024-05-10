export const propertiesNames = {
  'circle-radius': '标绘大小',
  fill: '填充颜色',
  label: '标绘名称',
  size: '文字字号',
  'halo-width': '轮廓宽度',
  'text-color': '文字颜色',
  'halo-color': '轮廓颜色',
  width: '线条宽度',
  opacity: '透明度',
  'fill-outline-color': '轮廓颜色',
  'halo-opacity': '轮廓透明度',
  'text-width': '文字轮廓宽度',
  'text-halo-color': '文字轮廓颜色',
};
const color = '#00f900';
export const layerList = [
  {
    id: 'map-data-point',
    type: 'circle',
    source: 'map-data',
    filter: ['==', ['geometry-type'], 'Point'],
    paint: {
      'circle-radius': ['coalesce', ['get', 'circle-radius'], 6],
      'circle-opacity': ['coalesce', ['get', 'opacity'], 1],
      'circle-color': ['coalesce', ['get', 'fill'], '#fff'],
    },
  },
  {
    id: 'map-data-fill',
    type: 'fill',
    source: 'map-data',
    paint: {
      'fill-color': ['coalesce', ['get', 'fill'], color],
      'fill-opacity': ['coalesce', ['get', 'opacity'], 0.3],
    },
    filter: ['==', ['geometry-type'], 'Polygon'],
  },
  {
    id: 'map-data-line',
    type: 'line',
    source: 'map-data',
    paint: {
      'line-color': ['coalesce', ['get', 'fill'], color],
      'line-width': ['coalesce', ['get', 'width'], 4],
      'line-opacity': ['coalesce', ['get', 'opacity'], 1],
    },
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    filter: ['==', ['geometry-type'], 'LineString'],
  },
  {
    id: 'map-data-fill-outline',
    type: 'line',
    source: 'map-data',
    paint: {
      'line-color': ['coalesce', ['get', 'halo-color'], color],
      'line-width': ['coalesce', ['get', 'halo-width'], 2],
      'line-opacity': ['coalesce', ['get', 'halo-opacity'], 1],
    },
    filter: ['==', ['geometry-type'], 'Polygon'],
  },
  {
    id: 'map-data-text',
    source: 'map-data',
    type: 'symbol',
    layout: {
      'text-field': '{label}',
      'text-anchor': 'center',
      // "text-offset": ['coalesce', ['get', 'text-offset'],  [0,-1]],
      'text-offset': [0, -1],
      'text-font': [
        'Open Sans Regular',
      ],
      'text-allow-overlap': true,
      'text-size': ['coalesce', ['get', 'size'], 14],
    },
    filter: ['!=', 'type', 'tip'],
    paint: {
      'text-halo-width': ['coalesce', ['get', 'text-width'], 1],
      'text-halo-color': ['coalesce', ['get', 'text-halo-color'], 'black'],
      'text-color': ['coalesce', ['get', 'text-color'], '#ffffff'],
    },
  },
  {
    id: 'map-data-tip',
    source: 'tip-data',
    type: 'symbol',
    layout: {
      'text-field': '{label}',
      'text-anchor': 'center',
      'text-max-width': 60,
      // "text-offset": ['coalesce', ['get', 'text-offset'],  [0,-1]],
      'text-offset': [1, -2],
      'text-font': [
        'Open Sans Regular',
      ],
      'text-size': 12,
    },
    paint: {
      'text-halo-width': 60,
      'text-halo-color': 'black',
      'text-color': '#ffffff',
    },
  },
];
