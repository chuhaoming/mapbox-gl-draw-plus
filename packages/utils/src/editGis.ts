import {
  Point, PointLike,
} from 'mapbox-gl';

const FINE_TOLERANCE = 4;
const GROSS_TOLERANCE = 12;
const INTERVAL = 500;
export function euclideanDistance(a: { x: number; y: number; }, b: { x: number; y: number; }) {
  const x = a.x - b.x;
  const y = a.y - b.y;
  return Math.sqrt((x * x) + (y * y));
}
export function isClick(start: { point: any; time: number; }, end: { point: any; time: number; }, options:any = {}) {
  const fineTolerance = (options.fineTolerance != null) ? options.fineTolerance : FINE_TOLERANCE;
  const grossTolerance = (options.grossTolerance != null) ? options.grossTolerance : GROSS_TOLERANCE;
  const interval = (options.interval != null) ? options.interval : INTERVAL;

  start.point = start.point || end.point;
  start.time = start.time || end.time;
  const moveDistance = euclideanDistance(start.point, end.point);

  return moveDistance < fineTolerance ||
    (moveDistance < grossTolerance && (end.time - start.time) < interval);
}

// 深拷贝任意数据类型
export function deepClone<T>(obj: any): T {
  if (obj === null) return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item)) as unknown as T;
  } if (typeof obj === 'object') {
    const clone:any = {};

    Object.keys(obj).forEach((key:string) => {
      clone[key] = deepClone(obj[key]);
    });

    return clone as T;
  }
  return obj;
}

// 画一个用户点击区域
export function mapEventToBoundingBox<T extends { point:Point }>(mapEvent:T, buffer = 0): [PointLike, PointLike] {
  return [
    [mapEvent.point.x - buffer, mapEvent.point.y - buffer],
    [mapEvent.point.x + buffer, mapEvent.point.y + buffer],
  ];
}
