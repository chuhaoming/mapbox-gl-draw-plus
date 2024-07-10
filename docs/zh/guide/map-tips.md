---
outline: deep
---

## 快速安装

### @chmpr/map-tips 包的安装

> 创建geojson时的提示操作文字

@chmpr/map-tips 下载安装：

::: code-group

```sh [npm]
 npm i @chmpr/map-tips
```

```sh [pnpm]
 pnpm add @chmpr/map-tips
```

```sh [yarn]
 yarn add @chmpr/map-tips
```

:::

## 如何使用

![demo](/tips.gif)

#### 1. 演示

```ts
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { DrawLineString, DrawPoint, DrawPolygon, MapboxDraw } from '@chmpr/map-draw';
import { Tips } from '@chmpr/map-tips';

mapboxgl.accessToken =
  'pk.eyJ1IjoidHVzaGFyLWZ1ZWxidWRkeSIsImEiOiJjbGIzYml6OWswY3EzM3dweDA1am82OGhqIn0.dQ99KMNUXLKu6MXi1VlwxA';
const map = new mapboxgl.Map({
  container: 'map',
  projection: { name: 'globe' },
  style: 'mapbox://styles/mapbox/streets-v9',
  zoom: 3,
});
const tips = new Tips();
// tips.textList
const mapDraw = new MapboxDraw({ map, tips });
```

:::warning 注意：tips的textList是对应的提示文字描述
:::

```ts
//  默认是：
//   textList:any = {
//     step1: '右键单击开始绘制',
//     step2: '左键继续绘制，右键结束绘制',
//     step3: '左键双击或右键单击结束绘制',
//     step4: '单击确定左下顶点',
//     step5: '单击确定半径长度',
//     step6: '单击确定箭头方向',
//   };

// 可以通过`tips.textList= {

//     step1: 'Right-click to start drawing',
//     step2: 'Left key to continue drawing, right key to end drawing',
//     step3: 'Left or right click to end drawing',
//     step4: 'Click OK to lower left vertex',
//     step5: 'Click OK Radius Length',
//     step6: 'Click OK arrow direction',
//   };
// 来修改变成英文版本
```
