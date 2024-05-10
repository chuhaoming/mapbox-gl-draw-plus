import {
  DrawRender, MapFeature, DrawPolygon,
} from '@chmpr/map-draw';
import { destination, distance, MetaType } from '@chmpr/utils';

export class DrawCircle extends DrawPolygon {
  center:number[] = [];

  click(path: number, lng: number, lat: number) {
    if (!this.center.length) {
      this.center = [lng, lat];
      this.curVertexPointGeo.coordinates = this.center;
      if (this.tips) this.tips.changeTip('step5');
      DrawRender.drawRender.run();
    } else {
      this.createCircle(lng, lat);
      this.endDraw();
      this.center = [];
    }
  }

  createCircle(lng: number, lat: number) {
    if (!this.center.length) return;
    const radius = distance(this.center, [lng, lat]);
    const coordinates = [];
    for (let i = 0; i < 16; i++) {
      coordinates.push(destination(this.center, radius, (i * -360) / 16));
    }
    coordinates.push(coordinates[0]);
    MapFeature.SelectedHotGeometryList[0] = this.getGeometry({
      id: this.curId, meta: MetaType.FEATURE, active: 'hot', coordinates: [coordinates],
    });
    DrawRender.drawRender.run();
  }

  updateCoordinate(path: number, lng: number, lat: number): void {
    this.createCircle(lng, lat);
  }
}
