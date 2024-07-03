import { Units, radiansToLength, lengthToRadians } from '@turf/helpers';

/**
 * Converts an angle in radians to degrees
 *
 * @name radiansToDegrees
 * @param {number} radians angle in radians
 * @returns {number} degrees between 0 and 360 degrees
 */
export function radiansToDegrees(radians: number): number {
  const degrees = radians % (2 * Math.PI);
  return (degrees * 180) / Math.PI;
}

/**
 * Converts an angle in degrees to radians
 *
 * @name degreesToRadians
 * @param {number} degrees angle between 0 and 360 degrees
 * @returns {number} angle in radians
 */
export function degreesToRadians(degrees: number): number {
  const radians = degrees % 360;
  return (radians * Math.PI) / 180;
}

export function distance(coordinates1:number[], coordinates2:number[], options: {
  units?: Units;
} = {}) {
  const dLat = degreesToRadians(coordinates2[1] - coordinates1[1]);
  const dLon = degreesToRadians(coordinates2[0] - coordinates1[0]);
  const lat1 = degreesToRadians(coordinates1[1]);
  const lat2 = degreesToRadians(coordinates2[1]);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);

  return radiansToLength(
    2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)),
    options.units,
  );
}
export function getCentroid(points:any[]) {
  let area = 0;
  let centroidX = 0;
  let centroidY = 0;

  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    const crossProduct = points[i][0] * points[j][1] - points[j][0] * points[i][1];
    area += crossProduct;
    centroidX += (points[i][0] + points[j][0]) * crossProduct;
    centroidY += (points[i][1] + points[j][1]) * crossProduct;
  }

  area /= 2;
  centroidX /= (6 * area);
  centroidY /= (6 * area);

  return [centroidX, centroidY];
}
// bearing in decimal degrees, between -180 and 180 degrees (positive clockwise)
export function bearing(coordinates1:number[], coordinates2:number[]) {
  const lon1 = degreesToRadians(coordinates1[0]);
  const lon2 = degreesToRadians(coordinates2[0]);
  const lat1 = degreesToRadians(coordinates1[1]);
  const lat2 = degreesToRadians(coordinates2[1]);
  const a = Math.sin(lon2 - lon1) * Math.cos(lat2);
  const b =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);

  return radiansToDegrees(Math.atan2(a, b));
}

export function destination(
  origin: number[],
  d: number,
  b: number,
) {
  // Handle input
  const longitude1 = degreesToRadians(origin[0]);
  const latitude1 = degreesToRadians(origin[1]);
  const bearingRad = degreesToRadians(b);
  const radians = lengthToRadians(d);

  // Main
  const latitude2 = Math.asin(
    Math.sin(latitude1) * Math.cos(radians) +
      Math.cos(latitude1) * Math.sin(radians) * Math.cos(bearingRad),
  );
  const longitude2 =
    longitude1 +
    Math.atan2(
      Math.sin(bearingRad) * Math.sin(radians) * Math.cos(latitude1),
      Math.cos(radians) - Math.sin(latitude1) * Math.sin(latitude2),
    );
  const lng = radiansToDegrees(longitude2);
  const lat = radiansToDegrees(latitude2);

  return [lng, lat];
}
const earthRadius = 6371008.8;

// index.ts
export const textFactors:any = {
  acres: 'acre',
  centimeters: 'cm',
  centimetres: 'cm',
  feet: 'feet',
  hectares: 'hectare',
  inches: 'in',
  kilometers: 'km',
  kilometres: 'km',
  meters: 'm',
  metres: 'm',
  miles: 'mi',
  millimeters: 'mm',
  millimetres: 'mm',
  yards: 'yards',
};
export const areaFactors:any = {
  acres: 247105e-9,
  centimeters: 1e4,
  centimetres: 1e4,
  feet: 10.763910417,
  hectares: 1e-4,
  inches: 1550.003100006,
  kilometers: 1e-6,
  kilometres: 1e-6,
  meters: 1,
  metres: 1,
  miles: 386e-9,
  nauticalmiles: 29155334959812285e-23,
  millimeters: 1e6,
  millimetres: 1e6,
  yards: 1.195990046,
};
/**
 * @private
 * A constant used for converting degrees to radians.
 * Represents the ratio of PI to 180.
 *
 * @type {number}
 */
const PI_OVER_180 = Math.PI / 180;

/**
 * @private
 * A constant factor used to compute the area of a polygon.
 * It's derived from the square of the Earth's radius divided by 2.
 *
 * @type {number}
 */
const FACTOR = (earthRadius * earthRadius) / 2;

export function ringArea(coords: number[][]): number {
  const coordsLength = coords.length;

  if (coordsLength <= 2) return 0;
  let total = 0;

  let i = 0;
  while (i < coordsLength) {
    const lower = coords[i];
    const middle = coords[i + 1 === coordsLength ? 0 : i + 1];
    const upper =
      coords[i + 2 >= coordsLength ? (i + 2) % coordsLength : i + 2];

    const lowerX = lower[0] * PI_OVER_180;
    const middleY = middle[1] * PI_OVER_180;
    const upperX = upper[0] * PI_OVER_180;

    total += (upperX - lowerX) * Math.sin(middleY);

    i++;
  }

  return Math.abs(total * FACTOR);
}
