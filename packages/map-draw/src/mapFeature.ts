import { uid } from 'uid';
import { Feature } from 'geojson';
import {
  distance, areaFactors, ringArea, textFactors,
} from '@chmpr/utils';
import { Units } from '@turf/helpers';
import { DrawGeometryType, ModeStateType } from './types';

export class MapFeature {
  // 绘制完成状态
  static DrawColdGeometryList: DrawGeometryType[] = [];

  static UNITS: Units | undefined;

  static isMeasure: Boolean = false;

  // 选中的点
  static CurSelectedHotGeometry: DrawGeometryType | null;

  // 创建、选中操作状态   中间点，等一系列辅助点
  static SelectedHotGeometryList: DrawGeometryType[] = [];

  static SelectId: string | undefined;
  // // 提示，中间点，等一系列辅助点
  // static SelectedHotMidPointGeometryList:DrawGeometryType[] = [];

  static pushDrawHotGeometry(drawGeo: DrawGeometryType): DrawGeometryType {
    MapFeature.SelectedHotGeometryList.push(drawGeo);
    return drawGeo;
  }

  static pushDrawGeometry() {
    const curList = MapFeature.SelectedHotGeometryList.filter((g) => {
      if (g.id) {
        g.active = 'cold';
      }
      return g.id;
    });
    MapFeature.SelectedHotGeometryList = [];
    MapFeature.SelectId = undefined;
    MapFeature.DrawColdGeometryList.push(...curList);
  }

  // setHotFeature类型的数据
  static getFeatureList(drawGeometryList: DrawGeometryType[]): Feature[] {
    return drawGeometryList.map((feature) => {
      const {
        id, coordinates, meta, type, parent,
        path,
        active,
        properties,
      } = feature;
      let total = 0;
      let unit = '';
      if (id && MapFeature.isMeasure) {
        if (type === 'LineString') {
          coordinates.reduce((pre: any, cur: any) => {
            total += distance(pre, cur, { units: MapFeature.UNITS });
            return cur;
          }, coordinates[0] as number[]);
          unit = textFactors[MapFeature.UNITS || 'meters'];
        } else if (type === 'Polygon') {
          total = ringArea(coordinates[0] as number[][]) * areaFactors[MapFeature.UNITS || 'meters'];
          unit = `${textFactors[MapFeature.UNITS || 'meters']}2`;
        }
      }
      return {
        type: 'Feature',
        properties: {
          ...properties,
          active,
          meta,
          id,
          total,
          unit,
          path,
          parent,
        },
        geometry: {
          type,
          coordinates,
        },

      };
    }) as Feature[];
  }

  // setHotFeature类型的数据
  static getPureFeatureList(drawGeometryList: DrawGeometryType[]): Feature[] {
    return drawGeometryList.map((feature) => {
      const {
        coordinates, type,
        properties,
      } = feature;
      return {
        type: 'Feature',
        properties: properties || {},
        geometry: {
          type,
          coordinates,
        },

      };
    }) as Feature[];
  }
}
