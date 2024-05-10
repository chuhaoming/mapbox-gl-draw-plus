import { Map } from 'mapbox-gl';
import { DrawRender, MapFeature } from '@chmpr/map-draw';

export class MapDrawLayer {
  map: Map;

  constructor() {
    console.log('Mapdraw');
  }

  addMap(map: Map): void {
    this.map = map;
  }

  createPointProperties() {
    const pointProperties = {
      'circle-radius': 8,
      fill: '#fff',
      label: '标绘点',
      size: 14,
      'text-width': 1,
      'text-color': '#ffffff',
      'text-halo-color': '#000',
      // "text-offset": [0,-1],
      opacity: 1,
    };
  }

  createLineProperties() {
    const LineProperties = {
      fill: '#ffffff',
      width: 8,
      opacity: 1,
      label: '标绘线',
      size: 14,
      'text-width': 1,
      'text-color': '#ffffff',
      'text-halo-color': '#000',
    };
  }

  createPolygonProperties() {
    const Polygon = {
      fill: '#ffffff',
      opacity: 0.3,
      'halo-width': 1,
      'halo-color': '#000',
      label: '标绘面',
      size: 14,
      'halo-opacity': 1,
      'text-width': 1,
      'text-color': '#ffffff',
      'text-halo-color': '#000',
    };
  }
}
