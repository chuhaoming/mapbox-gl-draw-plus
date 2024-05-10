---
outline: deep
---

## Quick install

### @chmpr/map-tips package install

> Tips for creating geojson action text

@chmpr/map-tips download and install

::: code-group

```sh [npm]
 npm add @chmpr/map-tips
```

```sh [pnpm]
 pnpm add @chmpr/map-tips
```

```sh [yarn]
 yarn add @chmpr/map-tips
```

:::

## How to use

![demo](/tips.gif)

#### 1.Show demo

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

:::warning Note: textList of tips is the corresponding prompt text description
:::

```ts
//  default is:
//   textList:any = {
//     step1: '右键单击开始绘制',
//     step2: '左键继续绘制，右键结束绘制',
//     step3: '左键双击或右键单击结束绘制',
//     step4: '单击确定左下顶点',
//     step5: '单击确定半径长度',
//     step6: '单击确定箭头方向',
//   };

// can `tips.textList= {

//     step1: 'Right-click to start drawing',
//     step2: 'Left key to continue drawing, right key to end drawing',
//     step3: 'Left or right click to end drawing',
//     step4: 'Click OK to lower left vertex',
//     step5: 'Click OK Radius Length',
//     step6: 'Click OK arrow direction',
//   };
// to change it into English.
```
