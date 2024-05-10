import { LngLat } from 'mapbox-gl';
import {
  GeoJsonProperties, Geometry, Position,
} from 'geojson';
import { uid } from 'uid';
import { IDMAX, MetaType } from '@chmpr/utils';
import { Tips } from '@chmpr/map-tips';
import {
  Coords, DrawGeometryType, ModeStateType,
} from '../types';
import { ModeObject } from './modeObject';
import { MapFeature } from '../mapFeature';
import { DrawRender } from '../DrawRender';
import { DrawPoint } from './drawPoint';

export class DrawLineString extends ModeObject {
  tips: Tips | undefined;

  name: 'LineString' = 'LineString';

  coordinates!:GeoJSON.Position[];

  vertexPoint!:DrawPoint;

  curId!: string;

  vertexGeo!: DrawGeometryType;

  curDraw!: DrawGeometryType;

  lastGeo!: DrawGeometryType;

  startDraw() {
    this.coordinates = [];
    this.curId = uid(IDMAX);
    this.curDraw = MapFeature.pushDrawHotGeometry(this.getGeometry({
      id: this.curId, active: 'hot', meta: MetaType.FEATURE, coordinates: [],
    }));
    const vertexPoint = new DrawPoint();
    const geo = vertexPoint.getGeometry({
      parent: this.curId, active: 'hot', meta: MetaType.VERTEX, coordinates: [],
    });
    this.vertexGeo = MapFeature.pushDrawHotGeometry(geo);
    if (this.tips) this.tips.changeTip('step1');
    return this.curDraw;
  }

  updateCoordinate(path: number, lng:number, lat:number) {
    this.curDraw.coordinates[path] = [lng, lat];
    DrawRender.drawRender.run();
  }

  click(path: number, lng: number, lat: number) {
    if (this.tips) this.tips.changeTip('step2');
    this.updateCoordinate(path, lng, lat);
    this.vertexGeo.coordinates = [lng, lat];
    MapFeature.pushDrawHotGeometry(this.vertexGeo);
  }

  // 复制数据
  getCoordinates():Position[] {
    return JSON.parse(JSON.stringify(this.coordinates));
  }

  getGeometry(options:DrawGeometryType): DrawGeometryType {
    const {
      meta, id, parent, coordinates,
      active,
    } = options;
    return {
      meta,
      active,
      type: this.name,
      id,
      parent,
      coordinates,
    };
  }

  internal(modeState:ModeStateType) {
    // const properties = {
    //   active: modeState === 'hot' ? 'true' : 'false',
    //   meta: 'feature',
    //   'meta:type': 'LineString',
    // };
  }
}
