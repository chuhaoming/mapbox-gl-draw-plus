import { DrawPolygon, ModeObject } from '@chmpr/map-draw';
import { GeoJSONSource, LngLat, Map } from 'mapbox-gl';

export class Tips {
  renderRequest: number | null;

  tipsSource: GeoJSONSource;

  text:string = '';

  isMove: boolean = false;

  coordinates:number[] = [];

  constructor(tipsContent?:any) {
    console.log(tipsContent);
  }

  textList:any = {
    step1: '右键单击开始绘制',
    step2: '左键继续绘制，右键结束绘制',
    step3: '左键双击或右键单击结束绘制',
    step4: '单击确定左下顶点',
    step5: '单击确定半径长度',
    step6: '单击确定箭头方向',
  };

  run() {
    if (!this.renderRequest) {
      this.renderRequest = requestAnimationFrame(() => {
        this.renderRequest = null;
        this.render();
      });
    }
  }

  changeTip(textName:string = 'step1') {
    this.text = this.textList[textName];
    this.isMove = true;
  }

  updateCoordinate(lngLat:LngLat) {
    if (!this.isMove) return;
    this.coordinates = [lngLat.lng, lngLat.lat];
    this.render();
  }

  endDraw() {
    this.isMove = false;
    this.text = '';
    this.coordinates = [];
    this.render();
  }

  render() {
    this.tipsSource.setData({
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: {
          'text-field': this.text,
        },
        geometry: {
          coordinates: this.coordinates,
          type: 'Point',
        },
      }],
    });
  }

  init(map:Map) {
    map.on('load', () => {
      map.addSource('tip-data', {
        data: {
          type: 'FeatureCollection',
          features: [],
        },
        type: 'geojson',
      });
      map.addLayer(
        {
          id: 'map-data-tip',
          source: 'tip-data',
          type: 'symbol',
          layout: {
            'text-field': '{text-field}',
            'text-anchor': 'left',
            'text-max-width': 60,
            // "text-offset": ['coalesce', ['get', 'text-offset'],  [0,-1]],
            'text-offset': [2, 0],
            'text-font': [
              'Open Sans Regular ',
            ],
            'text-size': 12,
            'text-line-height': 2.2,
          },
          paint: {
            'text-halo-width': 60,
            // 'text-halo-color': '#fff',
            'text-color': '#000000',
          },
        },
      );
      this.tipsSource = map.getSource('tip-data') as GeoJSONSource;
    });
  }
}
