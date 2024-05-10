import {
  DrawRender, MapFeature, DrawPolygon,
} from '@chmpr/map-draw';
import {
  MetaType, degreesToRadians, distance, bearing,
  destination,
} from '@chmpr/utils';

export class Pentagon extends DrawPolygon {
  first: number[] = [];

  click(path: number, lng: number, lat: number) {
    if (!this.first.length) {
      this.first = [lng, lat];
      this.curVertexPointGeo.coordinates = this.first;
      if (this.tips) this.tips.changeTip('step5');
      DrawRender.drawRender.run();
    } else {
      this.createArrow(path, lng, lat);
      this.endDraw();
      this.first = [];
    }
  }

  vertexAngles = [0, 72, 144, 216, 288].map((deg) => degreesToRadians(deg));

  createArrow(path: number, lng: number, lat: number) {
    if (!this.first.length) return;
    // 计算两点之间的距离
    const dist = distance(this.first, [lng, lat]) / 100;

    // 计算五角星的顶点坐标
    const points = this.vertexAngles.map((angle: number, i: number) => {
      const x = this.first[0] + dist * Math.cos(angle);
      const y = this.first[1] + dist * Math.sin(angle);
      return [x, y];
    });
    const coord = [[
      ...points, points[0],
    ]];

    MapFeature.SelectedHotGeometryList[0] = this.getGeometry({
      id: this.curId, meta: MetaType.FEATURE, active: 'hot', coordinates: coord,
    });
    DrawRender.drawRender.run();
  }

  updateCoordinate(path: number, lng: number, lat: number): void {
    this.createArrow(path, lng, lat);
  }
}
