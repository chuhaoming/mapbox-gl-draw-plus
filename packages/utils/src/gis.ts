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
