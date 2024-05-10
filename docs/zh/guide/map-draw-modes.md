---
outline: deep
---

## 快速安装

### @chmpr/map-draw-modes 包的安装

> 添加此包能绘制箭头、矩形，正五边形，五角星，圆

@chmpr/map-draw-modes 下载安装：

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

## 如何使用

#### 1. 演示

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
//创建一个 Mapdraw实例
const mapDraw = new MapboxDraw({ map });
```

#### 2. 绘制矩形

```ts
const rect = new DrawRect();
mapDraw.changeMode(rect);
```

#### 3. 绘制圆

```ts
const circle = new DrawCircle();
mapDraw.changeMode(circle);
```

#### 4. 绘制箭头

```ts
const arrow = new DrawArrow();
mapDraw.changeMode(arrow);
```

#### 5. 绘制五边形

```ts
const pentagon = new Pentagon();
mapDraw.changeMode(pentagon);
```

#### 5. 绘制五角星

```ts
const fiveStart = new FivePointedStar();
mapDraw.changeMode(fiveStart);
```

## 欢迎大家来补充各种图形
