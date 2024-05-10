import { MapDrawLayer } from '@chmpr/map-draw-layer';
import { Operator } from '@chmpr/operator';
import { Tips } from '@chmpr/map-tips';
import {
  Map,
} from 'mapbox-gl';

export type ModeStateType = 'hot' | 'cold' | 'dragVertex';
export type FeatureType = {
  type: string;
  properties: any;
  geometry: {
    type: string;
    coordinates: number[];
  };
};
export type EventOptions = {
  map: Map;
  keybindings?: boolean;
  mapLayer?:MapDrawLayer
  operator?: Operator,
  tips?: Tips
};
export type DrawGeometryType = {
  id?: string,
  parent?: string,
  meta: string,
  properties?:any;
  path?: number | string;
  type?: string;
  active?:string
  children?:string[] ;
  coordinates: number[] | number[][] | number[][][];
};
export type Coords<T> = Extract<T, GeoJSON.Position[][] | GeoJSON.Position | GeoJSON.Position[]>;
