---
outline: deep
---

## Quick install

### @chmpr/map-draw-modes package install

> Add this package to draw arrows, rectangles, pentagons, pentagons, circles

@chmpr/map-draw-modes download and install

::: code-group

```sh [npm]
 npm add @chmpr/map-draw-modes
```

```sh [pnpm]
 pnpm add @chmpr/map-draw-modes
```

```sh [yarn]
 yarn add @chmpr/map-draw-modes
```

:::

## How to use

#### 1. Demo code

```ts
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { MapboxDraw } from '@chmpr/map-draw';
import { DrawRect, DrawCircle, DrawArrow, FivePointedStar, Pentagon } from '@chmpr/map-draw-modes';
mapboxgl.accessToken =
  'pk.eyJ1IjoidHVzaGFyLWZ1ZWxidWRkeSIsImEiOiJjbGIzYml6OWswY3EzM3dweDA1am82OGhqIn0.dQ99KMNUXLKu6MXi1VlwxA';
const map = new mapboxgl.Map({
  container: 'map',
  projection: { name: 'globe' },
  style: 'mapbox://styles/mapbox/streets-v9',
  zoom: 3,
});
//Create a Mapdraw instance
const mapDraw = new MapboxDraw({ map });
```

#### 2. Draw a rectangle

```ts
const rect = new DrawRect();
mapDraw.changeMode(rect);
```

#### 3. Draw a circle

```ts
const circle = new DrawCircle();
mapDraw.changeMode(circle);
```

#### 4. Draw arrows

```ts
const arrow = new DrawArrow();
mapDraw.changeMode(arrow);
```

#### 5. Draw pentagons

```ts
const pentagon = new Pentagon();
mapDraw.changeMode(pentagon);
```

#### 5. Draw a pentagram

```ts
const fiveStart = new FivePointedStar();
mapDraw.changeMode(fiveStart);
```

## Welcome to add all kinds of graphics
