import {
  DrawRender, MapFeature, DrawPolygon,
} from '@chmpr/map-draw';
import { MetaType } from '@chmpr/utils';

export class DrawRect extends DrawPolygon {
  first:number[] = [];

  constructor() {
    super();
    console.log('DrawRect');
  }

  click(path: number, lng: number, lat: number) {
    if (!this.first.length) {
      this.first = [lng, lat];
      this.curVertexPointGeo.coordinates = this.first;
      if (this.tips) this.tips.changeTip('step4');

      DrawRender.drawRender.run();
    } else {
      this.createRect(lng, lat);
      this.endDraw();
      this.first = [];
    }
  }

  createRect(lng: number, lat: number) {
    if (!this.first.length) return;
    // @ts-ignore
    this.coordinates = [[this.first, [lng, this.first[1]], [lng, lat], [this.first[0], lat], this.first]];
    MapFeature.SelectedHotGeometryList[0] = this.getGeometry({
      id: this.curId, meta: MetaType.FEATURE, active: 'hot', coordinates: this.coordinates,
    });
    DrawRender.drawRender.run();
  }

  updateCoordinate(path: number, lng: number, lat: number): void {
    this.createRect(lng, lat);
  }
}
