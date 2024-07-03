import { uid } from 'uid';
import { IDMAX, MetaType } from '@chmpr/utils';
import { Tips } from '@chmpr/map-tips';
import { ModeObject } from './modeObject';
import { Coords, DrawGeometryType } from '../types';
import { MapFeature } from '../mapFeature';
import { DrawRender } from '../DrawRender';
import { DrawLineString } from './drawLineString';

export class DrawPolygon extends ModeObject {
  name: 'Polygon' = 'Polygon';

  coordinates!: Coords<GeoJSON.Position[][]>;

  drawLine: DrawLineString;

  curDraw!: DrawGeometryType;

  curId!: string;

  tips: Tips | undefined;

  curVertexPointGeo!: DrawGeometryType;

  constructor() {
    super();
    this.drawLine = new DrawLineString();
  }

  startDraw(): void {
    this.coordinates = [[]];
    this.drawLine.coordinates = [];
    this.curId = uid(IDMAX);
    this.curDraw = this.drawLine.startDraw();
    this.curVertexPointGeo = MapFeature.pushDrawHotGeometry({
      parent: this.curId, active: 'hot', meta: MetaType.VERTEX, coordinates: [], type: 'Point',
    });
    if (this.tips) this.tips.changeTip('step1');
  }

  getGeometry(options: DrawGeometryType): DrawGeometryType {
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

  updateCoordinate(path: number, lng: number, lat: number): void {
    this.coordinates[0][path] = [lng, lat];
    if (path > 1) {
      this.threePointUpdate(path, lng, lat);
    } else {
      this.drawLine.updateCoordinate(path, lng, lat);
    }
  }

  threePointUpdate(path: number, lng: number, lat: number) {
    if (this.tips) this.tips.changeTip('step3');
    MapFeature.SelectedHotGeometryList[0] = this.getGeometry({
      id: this.curId, meta: MetaType.FEATURE, active: 'hot', coordinates: this.getCoordinates(),
    });
    DrawRender.drawRender.run();
  }

  click(path: number, lng: number, lat: number) {
    this.coordinates[0][path] = [lng, lat];
    if (path > 1) {
      this.threePointUpdate(path, lng, lat);
    } else {
      this.drawLine.updateCoordinate(path, lng, lat);
    }
    this.curVertexPointGeo.coordinates = [lng, lat];
  }

  getCoordinates(): Coords<GeoJSON.Position[][]> {
    return this.coordinates.map((coords) => coords.concat([coords[0]]));
  }
}
