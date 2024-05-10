import { FeatureType, eventData } from '@chmpr/utils';
import { Tips } from '@chmpr/map-tips';
import { DrawRender } from '../DrawRender';
import { Status } from '../Status';
import { Cursor } from '../cursor';
import { MapFeature } from '../mapFeature';
import { Coords, DrawGeometryType } from '../types';

export abstract class ModeObject {
  abstract coordinates: GeoJSON.Position[][] | GeoJSON.Position | GeoJSON.Position[];

  abstract name: GeoJSON.GeoJsonTypes;

  abstract curDraw: DrawGeometryType;

  abstract tips: Tips | undefined;

  properties!: GeoJSON.GeoJsonProperties;

  geojson!: GeoJSON.Feature;

  abstract startDraw(): void;
  abstract updateCoordinate(path: number, lng: number, lat: number): void;

  abstract getGeometry(options:DrawGeometryType): DrawGeometryType ;
  // abstract getCoordinates(): GeoJSON.Position[] | GeoJSON.Position | GeoJSON.Position[][];
  // 添加操作样式
  // abstract internal(modeState: ModeStateType): GeoJSON.Feature;
  abstract click(path: number, lng: number, lat: number):void;
  endDraw() {
    if (this.tips) this.tips.endDraw();
    if (this.name === FeatureType.LINESTRING) {
      // @ts-ignore
      const { length } = MapFeature.SelectedHotGeometryList[0].coordinates;
      if (length < 2) MapFeature.SelectedHotGeometryList = [];
    }
    if (this.name === FeatureType.POLYGON) {
      // @ts-ignore
      const { length } = MapFeature.SelectedHotGeometryList[0].coordinates[0];
      if (length < 4) MapFeature.SelectedHotGeometryList = [];
    }
    DrawRender.drawRender.updateEvent(eventData.CREATE);

    Status.modeState = 'cold';
    Status.isDrawing = false;
    MapFeature.pushDrawGeometry();

    DrawRender.drawRender.run();
  }
}
