---
outline: deep
---

## 快速安装

### @chmpr/map-draw 包的安装

> 创建基础点、线、面操作基础包，相对于使用ts+monorepo重写了mapbox-gl-draw的功能

@chmpr/map-draw 下载安装：

::: code-group

```sh [npm]
 npm add @chmpr/map-draw
```

```sh [pnpm]
 pnpm add @chmpr/map-draw
```

```sh [yarn]
 yarn add @chmpr/map-draw
```

:::

## 如何使用

#### 1. 创建Mapdraw实例 并将mapbox-gl的实例map传入

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
//创建一个 Mapdraw实例
//isMeasure: true => 添加测绘功能  多边形：面积   线：长度  默认单位是 平方米  米  默认不添加将关闭测绘功能
const mapDraw = new MapboxDraw({ map });
```

#### 2. 绘制点

```ts
const point = new DrawPoint();
mapDraw.changeMode(point);
```

#### 3. 绘制线

```ts
const line = new DrawLineString();
mapDraw.changeMode(line);
```

#### 4. 绘制面

```ts
const polygon = new DrawPolygon();
mapDraw.changeMode(polygon);
```

## 回调函数

#### 1. draw.create

> 创建feature完成时触发回调 返回当前features数组

```ts
map.on('load', () => {
  map.on('draw.create', e => {
    console.log('create', e);
  });
});
```

#### 2. draw.update

> 在编辑feature数据时触发回调 返回当前features数组

```ts
map.on('load', () => {
  map.on('draw.update', e => {
    console.log('update', e);
  });
});
```

## 方法

#### 1. setProperties

> 整体设置属性值

:::warning 注意：必须先选中对应的点、线、面才能修改属性
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

> 设置单个属性值

:::warning 注意：必须先选中对应的点、线、面才能修改属性
:::

```ts
const geo = mapDraw.setProperty('fill-color', 'green');
console.log(geo);
```

#### 3.getSelectedFeature

> 获取选中的SelectedFeature

```ts
const Feature = mapDraw.getSelectedFeature();
console.log(Feature);
```

#### 4. getAllFeatures

> 获取所有features

```ts
const Features = mapDraw.getAllFeatures();
console.log(Features);
```

#### 5. addGeojson

> 加载geojson

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
