---
outline: deep
---

## Quick install

### @chmpr/map-draw package install

> Create basic point, line, and surface operations base package, overriding mapbox-gl-draw functionality relative to using ts+monorepo

@chmpr/map-draw download and install

::: code-group

```sh [npm]
 npm i @chmpr/map-draw
```

```sh [pnpm]
 pnpm add @chmpr/map-draw
```

```sh [yarn]
 yarn add @chmpr/map-draw
```

:::

## How to use

#### 1. Create a Mapdraw instance and pass in an instance map of mapbox-gl

```ts
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { DrawLineString, DrawPoint, DrawPolygon, MapboxDraw } from '@chmpr/map-draw';

mapboxgl.accessToken =
  'pk.eyJ1IjoidHVzaGFyLWZ1ZWxidWRkeSIsImEiOiJjbGIzYml6OWswY3EzM3dweDA1am82OGhqIn0.dQ99KMNUXLKu6MXi1VlwxA';
const map = new mapboxgl.Map({
  container: 'map',
  projection: { name: 'globe' },
  style: 'mapbox://styles/mapbox/streets-v9',
  zoom: 3,
});
//Create a Mapdraw instance
//isMeasure: true => add measure   default:false
const mapDraw = new MapboxDraw({ map, isMeasure: true });
```

#### 2. plotted points

```ts
const point = new DrawPoint();
mapDraw.changeMode(point);
```

#### 3. sketch lines

```ts
const line = new DrawLineString();
mapDraw.changeMode(line);
```

#### 4. Draw a surface

```ts
const polygon = new DrawPolygon();
mapDraw.changeMode(polygon);
```

## callback function

#### 1. draw.create

> Trigger a callback when feature creation is complete to return the current features array

```ts
map.on('load', () => {
  map.on('draw.create', e => {
    console.log('create', e);
  });
});
```

#### 2. draw.update

> Trigger a callback when editing feature data to return to the current features array

```ts
map.on('load', () => {
  map.on('draw.update', e => {
    console.log('update', e);
  });
});
```

## Methods

#### 1. setProperties

> Overall setting attribute values

:::warning Note: You must select the corresponding points, lines and faces before modifying the attributes.
:::

```ts
const geo = mapDraw.setProperties({
  'fill-color': 'red',
  'fill-outline-color': '#000',
  'fill-opacity': 1,
  'line-color': 'blue',
  'line-width': 10,
});
console.log(geo);
```

![改变选中的圆](/setProperties.gif)

#### 2. setProperty

> Set individual attribute values

:::warning Note: You must select the corresponding points, lines and faces before modifying the attributes.
:::

```ts
const geo = mapDraw.setProperty('fill-color', 'green');
console.log(geo);
```

#### 3.getSelectedFeature

> Get Selected Feature

```ts
const Feature = mapDraw.getSelectedFeature();
console.log(Feature);
```

#### 4. getAllFeatures

> get All Features

```ts
const Features = mapDraw.getAllFeatures();
console.log(Features);
```

#### 5. addGeojson

> add Geojson

```ts
const geo = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        coordinates: [
          [16.83593749999909, 29.458731185354324],

          [61.484374999999176, 35.8178131586959],
        ],
        type: 'LineString',
      },
    },
  ],
};
mapDraw.addGeojson(geo);
```

#### 6. deleteSelectedFeature

> deleteSelectedFeature

```ts
const Features = mapDraw.deleteSelectedFeature();
console.log(Features);
```
