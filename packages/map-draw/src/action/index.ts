import {
  Map, MapEventType, MapMouseEvent, MapTouchEvent, MapboxEvent, MapboxGeoJSONFeature, Point, PointLike,
} from 'mapbox-gl';
import { FeatureType, MetaType, mapEventToBoundingBox } from '@chmpr/utils';
import { MapFeature } from '../mapFeature';
import { DrawGeometryType } from '../types';
import { Status } from '../Status';
import { DrawRender } from '../DrawRender';

export class UserAction {
  constructor() {
    console.log('userAction');
  }

  static userAction: UserAction;

  layerIdList: string[] = [];

  static getInstance() {
    if (!UserAction.userAction) {
      UserAction.userAction = new UserAction();
    }
    return UserAction.userAction;
  }

  clickAnyWhere<T extends { point: Point }>(event: T, map:Map, buffer: number = 0) {
    const box = mapEventToBoundingBox(event, buffer);
    const featureList = map.queryRenderedFeatures(box, { layers: this.layerIdList });

    return featureList;
  }

  handleFeatureList(featureList: MapboxGeoJSONFeature[]) {
    // 已经选中的情况下
    if (MapFeature.SelectId) {
      // 如果存在的话 需要判断是否再次点击就在这里
      if (!featureList.length) {
        MapFeature.pushDrawGeometry();
        Status.modeState = 'cold';
      } else {
        // 当在选中状态的时候 又选中了另一个单独的图形的时候需要触发替换或者点中某个vertex顶点
        const { properties: { parent, path, id } }: any = featureList[0];
        console.log(MapFeature.SelectId, id, parent);
        if (MapFeature.SelectId !== (id || parent)) {
          MapFeature.pushDrawGeometry();
          this.createSelectedGeo(featureList);
        } else {
          this.handleSelectedHotGeometry(path);
        }
      }
    } else {
      this.createSelectedGeo(featureList);
    }
  }

  // 已经选中了对应的feature
  handleSelectedHotGeometry(path: number | string) {
    if (path !== undefined) {
      if (MapFeature.CurSelectedHotGeometry?.path === path) return;
      this.initCurSelectedHotGeometry();
      const feature = MapFeature.SelectedHotGeometryList.find((e) => e.path === path);
      if (feature) {
        if (typeof feature.path === 'string') {
          const curPath = Number((feature.path as string).slice(1));
          const curGeo = MapFeature.SelectedHotGeometryList.find((e) => e.id);
          if (curGeo) {
            let { coordinates } = curGeo; // 默认是 lineString 类型
            if (curGeo.type === FeatureType.POLYGON) {
              coordinates = curGeo.coordinates[0] as number[][];
            }
            coordinates.splice(curPath + 1, 0, feature.coordinates as number[]);
            MapFeature.SelectedHotGeometryList = [];
            DrawRender.drawRender.selectedStartDraw(curGeo);
          }
        }
        MapFeature.CurSelectedHotGeometry = feature;
        MapFeature.CurSelectedHotGeometry.meta = MetaType.DRAGVERTEX;
        Status.modeState = 'dragVertex';
      }
    } else if (path === undefined) {
      this.initCurSelectedHotGeometry();
      Status.modeState = 'hot';
    }
  }

  createSelectedGeo(featureList: MapboxGeoJSONFeature[]) {
    this.initCurSelectedHotGeometry();
    if (!featureList.length) return;
    // 当没有任何选中的时候需要触发选中
    const { properties: { id } }: any = featureList[0];
    const index = MapFeature.DrawColdGeometryList.findIndex((e) => e.id === id);
    if (index > -1) {
      const drawGeometryList = MapFeature.DrawColdGeometryList.splice(index, 1);
      // eslint-disable-next-line prefer-destructuring
      if (drawGeometryList.length) {
        const drawGeometry = drawGeometryList[0];
        drawGeometry.active = 'hot';
        MapFeature.SelectId = id;
        DrawRender.drawRender.selectedStartDraw(drawGeometry);
      }
    }
    Status.modeState = 'hot';
  }

  initCurSelectedHotGeometry() {
    // 重置已渲染的点
    if (MapFeature.CurSelectedHotGeometry) {
      MapFeature.CurSelectedHotGeometry.meta = MetaType.VERTEX;
      MapFeature.CurSelectedHotGeometry = null;
    }
  }
}
