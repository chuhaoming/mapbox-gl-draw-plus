import {
  DrawRender, MapFeature, DrawPolygon,
} from '@chmpr/map-draw';
import {
  radiansToDegrees, degreesToRadians, MetaType, distance, bearing,
  destination,
} from '@chmpr/utils';

export class DrawArrow extends DrawPolygon {
  first: number[] = [];

  click(path: number, lng: number, lat: number) {
    if (!this.first.length) {
      this.first = [lng, lat];
      this.curVertexPointGeo.coordinates = this.first;
      DrawRender.drawRender.run();
      if (this.tips) this.tips.changeTip('step6');
    } else {
      this.createArrow(path, lng, lat);
      this.endDraw();
      this.first = [];
    }
  }

  createArrow(path: number, lng: number, lat: number) {
    if (!this.first.length) return;
    // 计算两点之间的距离和方位角
    const dist = distance(this.first, [lng, lat]);
    const curBearing = bearing(this.first, [lng, lat]);
    // 箭头参数(单位为米)
    const arrowBodyLength = dist; // 箭头长度
    const arrowHeadLength = dist * 0.25; // 箭头长度
    const arrowBodyWidth = dist / 15; // 箭身宽度
    const arrowHeadWidth = dist / 8; // 箭头头部底边宽度

    // 计算箭头各部分的坐标点
    const arrowStart = this.first;
    // 三角箭头左右坐标
    const arrowHeadTip = destination([lng, lat], arrowHeadLength, curBearing);

    // 右边躯干坐标
    const arrowBodyRight1 = destination(arrowStart, arrowBodyWidth, curBearing - 90);
    const arrowBodyRight2 = destination(arrowBodyRight1, arrowBodyLength, curBearing);

    // 左边躯干坐标
    const arrowBodyLeft1 = destination(arrowStart, arrowBodyWidth, curBearing + 90);
    const arrowBodyLeft2 = destination(arrowBodyLeft1, arrowBodyLength, curBearing);
    // 三角箭头左右坐标
    const arrowHeadRight = destination(arrowBodyRight2, arrowHeadWidth, curBearing - 90);
    const arrowHeadLeft = destination(arrowBodyLeft2, arrowHeadWidth, curBearing + 90);

    const coord = [[
      arrowHeadTip,

      arrowHeadRight,

      arrowBodyRight2,
      arrowBodyRight1,

      arrowBodyLeft1,
      arrowBodyLeft2,

      arrowHeadLeft,

      arrowHeadTip,

    ]];

    MapFeature.SelectedHotGeometryList[0] = this.getGeometry({
      id: this.curId, meta: MetaType.FEATURE, active: 'hot', coordinates: coord,
    });
    DrawRender.drawRender.run();
  }

  toRadians(degrees: number) {
    return (degrees * Math.PI) / 180;
  }

  fromRadians(radians: number) {
    return (radians * 180) / Math.PI;
  }

  updateCoordinate(path: number, lng: number, lat: number): void {
    this.createArrow(path, lng, lat);
  }
}
