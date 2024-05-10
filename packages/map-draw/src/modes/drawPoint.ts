import {
  Geometry, GeoJsonProperties, Position, Point,
} from 'geojson';
import { uid } from 'uid';
import { IDMAX, MetaType } from '@chmpr/utils';
import { Tips } from '@chmpr/map-tips';
import {
  Coords, DrawGeometryType,
} from '../types';
import { ModeObject } from './modeObject';
import { MapFeature } from '../mapFeature';

export class DrawPoint extends ModeObject {
  tips: Tips | undefined;

  name: 'Point' = 'Point';

  coordinates!:Coords<GeoJSON.Position>;

  curId!: string;

  curDraw!:DrawGeometryType;

  isClick: boolean = false;

  startDraw(): void {
    this.isClick = false;
    this.coordinates = [];
    this.curId = uid(IDMAX);
    this.curDraw = MapFeature.pushDrawHotGeometry(this.getGeometry({
      id: this.curId, active: 'hot', meta: MetaType.FEATURE, coordinates: this.coordinates,
    }));
    if (this.tips) this.tips.changeTip('step1');
  }

  getGeometry(options:DrawGeometryType): DrawGeometryType {
    const {
      meta, active, id, parent, coordinates,
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

  updateCoordinate(path: number, lng: number, lat: number): void {
    this.coordinates = [lng, lat];
  }

  click(path: number, lng: number, lat: number) {
    if (this.isClick) return;
    this.isClick = true;
    this.coordinates = [lng, lat];
    this.curDraw.coordinates = this.coordinates;
    this.endDraw();
  }

  getCoordinates(): Position {
    return JSON.parse(JSON.stringify(this.coordinates));
  }
}
