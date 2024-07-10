---
outline: deep
---

## Quick install

### @chmpr/operator package install

> The operation panel includes rotation, zoom, delete and export functions by default.

@chmpr/operator download and install

::: code-group

```sh [npm]
 npm i @chmpr/operator
```

```sh [pnpm]
 pnpm add @chmpr/operator
```

```sh [yarn]
 yarn add @chmpr/operator
```

:::

## How to use

![demo](/operator.gif)

#### 1. Demo code

```ts
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { DrawLineString, DrawPoint, DrawPolygon, MapboxDraw } from '@chmpr/map-draw';
import { Operator } from '@chmpr/operator';
mapboxgl.accessToken =
  'pk.eyJ1IjoidHVzaGFyLWZ1ZWxidWRkeSIsImEiOiJjbGIzYml6OWswY3EzM3dweDA1am82OGhqIn0.dQ99KMNUXLKu6MXi1VlwxA';
const map = new mapboxgl.Map({
  container: 'map',
  projection: { name: 'globe' },
  style: 'mapbox://styles/mapbox/streets-v9',
  zoom: 3,
});
//Create a Mapdraw instance
const mapDraw = new MapboxDraw({ map, operator: new Operator() });
```
