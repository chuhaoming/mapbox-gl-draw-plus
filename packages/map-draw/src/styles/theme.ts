const coldColor = '#3bb2d0';
const hotColor = '#fbb03b';
export const theme = [
  {
    id: 'gl-draw-polygon-fill-inactive',
    type: 'fill',
    filter: ['all',
      ['==', 'active', 'cold'],
      ['==', '$type', 'Polygon'],

    ],
    paint: {
      'fill-color': ['coalesce', ['get', 'fill-color'], coldColor],
      'fill-outline-color': ['coalesce', ['get', 'fill-outline-color'], coldColor],
      'fill-opacity': ['coalesce', ['get', 'fill-opacity'], 0.1],
    },
  },
  {
    id: 'gl-draw-polygon-fill-active',
    type: 'fill',
    filter: ['all', ['==', 'active', 'hot'], ['==', '$type', 'Polygon']],
    paint: {
      'fill-color': ['coalesce', ['get', 'fill-color'], hotColor],
      'fill-outline-color': ['coalesce', ['get', 'fill-outline-color'], hotColor],
      'fill-opacity': ['coalesce', ['get', 'fill-opacity'], 0.1],
    },
  },
  {
    id: 'gl-draw-polygon-midpoint',
    type: 'circle',
    filter: ['all',
      ['==', '$type', 'Point'],
      ['==', 'active', 'hot'],
      ['==', 'meta', 'midpoint']],
    paint: {
      'circle-radius': 3,
      'circle-color': hotColor,
    },
  },
  {
    id: 'gl-draw-polygon-stroke-inactive',
    type: 'line',
    filter: ['all',
      ['==', 'active', 'cold'],
      ['==', '$type', 'Polygon'],
    ],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': ['coalesce', ['get', 'line-color'], coldColor],
      'line-width': ['coalesce', ['get', 'line-width'], 2],
      'line-opacity': ['coalesce', ['get', 'line-opacity'], 1],
    },
  },
  {
    id: 'gl-draw-stroke-active',
    type: 'line',
    filter: ['all', ['==', 'active', 'hot'], ['!=', '$type', 'Point']],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': ['coalesce', ['get', 'line-color'], hotColor],
      'line-width': ['coalesce', ['get', 'line-width'], 2],
      'line-dasharray': [0.2, 2],
    },
  },
  {
    id: 'gl-draw-line-inactive',
    type: 'line',
    filter: ['all',
      ['==', 'active', 'cold'],
      ['==', '$type', 'LineString'],

    ],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': ['coalesce', ['get', 'line-color'], coldColor],
      'line-width': ['coalesce', ['get', 'line-width'], 2],
    },
  },
  {
    id: 'gl-draw-drag-vertex-stroke-inactive',
    type: 'circle',
    filter: ['all',
      ['==', 'meta', 'dragVertex'],
      ['==', '$type', 'Point'],

    ],
    paint: {
      'circle-radius': 7,
      'circle-color': '#fff',
    },
  },
  {
    id: 'gl-draw-drag-vertex-inactive',
    type: 'circle',
    filter: ['all',
      ['==', 'meta', 'dragVertex'],
      ['==', '$type', 'Point'],
    ],
    paint: {
      'circle-radius': 5,
      'circle-color': '#fbb03b',
    },
  },
  {
    id: 'gl-draw-vertex-stroke-inactive',
    type: 'circle',
    filter: ['all',
      ['==', 'meta', 'vertex'],
      ['==', '$type', 'Point'],

    ],
    paint: {
      'circle-radius': 5,
      'circle-color': '#fff',
    },
  },
  {
    id: 'gl-draw-vertex-inactive',
    type: 'circle',
    filter: ['all',
      ['==', 'meta', 'vertex'],
      ['==', '$type', 'Point'],
    ],
    paint: {
      'circle-radius': 3,
      'circle-color': '#fbb03b',
    },
  },
  {
    id: 'gl-draw-point-point-stroke-inactive',
    type: 'circle',
    filter: ['all',
      ['==', 'active', 'cold'],
      ['==', '$type', 'Point'],
      ['==', 'meta', 'feature'],

    ],
    paint: {
      'circle-radius': ['coalesce', ['get', 'circle-radius'], 5],
      'circle-opacity': ['coalesce', ['get', 'circle-opacity'], 1],
      'circle-color': ['coalesce', ['get', 'circle-color'], '#fff'],
    },
  },
  {
    id: 'gl-draw-point-inactive',
    type: 'circle',
    filter: ['all',
      ['==', 'active', 'cold'],
      ['==', '$type', 'Point'],
      ['==', 'meta', 'feature'],

    ],
    paint: {
      'circle-radius': ['coalesce', ['get', 'circle-radius'], 3],
      'circle-color': ['coalesce', ['get', 'circle-color'], coldColor],
    },
  },
  {
    id: 'gl-draw-point-stroke-active',
    type: 'circle',
    filter: ['all',
      ['==', '$type', 'Point'],
      ['==', 'active', 'hot'],
      ['==', 'meta', 'feature'],
    ],
    paint: {
      'circle-radius': ['coalesce', ['get', 'circle-radius'], 7],
      'circle-color': ['coalesce', ['get', 'circle-color'], '#fff'],
    },
  },
  {
    id: 'gl-draw-point-active',
    type: 'circle',
    filter: ['all',
      ['==', '$type', 'Point'],
      ['==', 'meta', 'feature'],
      ['==', 'active', 'hot']],
    paint: {
      'circle-radius': ['coalesce', ['get', 'circle-radius'], 5],
      'circle-color': ['coalesce', ['get', 'circle-color'], hotColor],
    },
  },

];
