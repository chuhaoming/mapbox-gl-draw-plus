---
outline: deep
---

## 快速安装

### @chmpr/operator 包的安装

> 操作面板 默认包含旋转、缩放、删除、导出功能

@chmpr/operator 下载安装：

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

## 如何使用

![demo](/operator.gif)

#### 1. 演示

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
//创建一个 Mapdraw实例
const mapDraw = new MapboxDraw({ map, operator: new Operator() });
```
