<script setup lang="ts">
import { onMounted, ref } from 'vue';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import {
  DrawLineString, DrawPoint, DrawPolygon, MapboxDraw,
} from '@chmpr/map-draw';

defineOptions({
  name: 'MapboxDraw',
});
mapboxgl.accessToken =
  'pk.eyJ1IjoidHVzaGFyLWZ1ZWxidWRkeSIsImEiOiJjbGIzYml6OWswY3EzM3dweDA1am82OGhqIn0.dQ99KMNUXLKu6MXi1VlwxA';
let mapDraw: MapboxDraw;
onMounted(async () => {
  const map = new mapboxgl.Map({
    container: 'map',
    projection: { name: 'globe' },
    style: 'mapbox://styles/mapbox/streets-v9',
    zoom: 3,
  });
  // callback function
  // map.on('load', async () => {
  //   map.on('draw.create', (e) => {
  //     console.log('create', e);
  //   });
  //   map.on('draw.update', (e) => {
  //     console.log('update', e);
  //   });
  // });
  mapDraw = new MapboxDraw({ map });
});

const line = new DrawLineString();
const drawFreedom = () => {
  mapDraw.changeMode(line);
};
const point = new DrawPoint();
const drawPoint = () => {
  mapDraw.changeMode(point);
};
const polygon = new DrawPolygon();
const drawPolygon = () => {
  mapDraw.changeMode(polygon);
};

</script>

<template>
  <div class="mapDom">
    <div id="map" ref="mapboxDom" />
    <div class="btns">
      <div class="div-button" @click="drawFreedom()">
        画线
      </div>
      <div class="div-button" @click="drawPoint()">
        画点
      </div>
      <div class="div-button" @click="drawPolygon()">
        多边形
      </div>
    </div>
  </div>
</template>

<style scoped>
.mapDom {
  position: relative;
  width: 100%;
  height: 600px;

}

#map {
  position: relative;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 600px;

}

.btns {
  position: absolute;
  top: 200px;
  left: 100px;
  display: flex;
  flex-direction: column;
}

.div-button {
  margin: 10px 0;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  border-color: var(--vp-button-alt-border);
  color: #fff;
  background-color: #3c30df;

}

.div-button:active {
  transform: scale(0.85);
}
</style>
