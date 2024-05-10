export enum MetaType {
  FEATURE = 'feature',
  MIDPOINT = 'midpoint',
  VERTEX = 'vertex',
  DRAGVERTEX = 'dragVertex',
}
export const SourceIds = {
  HOT: 'mapbox-gl-draw-hot',
  COLD: 'mapbox-gl-draw-cold',
};
export enum FeatureType {
  POINT = 'Point',
  LINESTRING = 'LineString',
  POLYGON = 'Polygon',
}
export const eventData = {
  CREATE: 'draw.create',
  DELETE: 'draw.delete',
  UPDATE: 'draw.update',
  SELECTION_CHANGE: 'draw.selectionchange',
  MODE_CHANGE: 'draw.modechange',
  ACTIONABLE: 'draw.actionable',
  RENDER: 'draw.render',
  COMBINE_FEATURES: 'draw.combine',
  UNCOMBINE_FEATURES: 'draw.uncombine',
};
export const geojsonTypes = {
  FEATURE: 'Feature',
  POLYGON: 'Polygon',
  LINE_STRING: 'LineString',
  POINT: 'Point',
  FEATURE_COLLECTION: 'FeatureCollection',
  MULTI_PREFIX: 'Multi',
  MULTI_POINT: 'MultiPoint',
  MULTI_LINE_STRING: 'MultiLineString',
  MULTI_POLYGON: 'MultiPolygon',
};
export const LAT_MIN = -90;
export const LAT_RENDERED_MIN = -85;
export const LAT_MAX = 90;
export const LAT_RENDERED_MAX = 85;
export const LNG_MIN = -270;
export const LNG_MAX = 270;

export const clickBuffer = 2;
export const touchBuffer = 25;

export const IDMAX = 16;
