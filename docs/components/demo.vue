<script setup lang="ts">
import { onMounted, ref } from 'vue';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@chmpr/operator/dist/style.css';
import {
  DrawLineString, DrawPoint, DrawPolygon, MapboxDraw,
} from '@chmpr/map-draw';
import {
  Operator,
} from '@chmpr/operator';
import {
  Tips,
} from '@chmpr/map-tips';
import {
  DrawRect,
  DrawCircle,
  DrawArrow,
  FivePointedStar,
  Pentagon,
} from '@chmpr/map-draw-modes';

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
    zoom: 2,
  });

  map.on('load', async () => {
    // callback function
    // map.on('draw.create', (e) => {
    //   // eslint-disable-next-line no-console
    //   console.log('create', e);
    // });
    map.on('draw.update', (e) => {
      // eslint-disable-next-line no-console
      console.log('update', e);
    });
  });
  const tips = new Tips();
  mapDraw = new MapboxDraw({ map, operator: new Operator(), tips });
});
const line = new DrawLineString();
const drawLine = () => {
  console.log('click线');
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
const rect = new DrawRect();
const drawRect = () => {
  mapDraw.changeMode(rect);
};
const circle = new DrawCircle();
const drawCircle = () => {
  mapDraw.changeMode(circle);
};
const arrow = new DrawArrow();
const drawArrow = () => {
  mapDraw.changeMode(arrow);
};

const pentagon = new Pentagon();
const drawPentagonArrow = () => {
  mapDraw.changeMode(pentagon);
};
const fiveStart = new FivePointedStar();
const fivePointedStar = () => {
  mapDraw.changeMode(fiveStart);
};

const setProperties = () => {
  const geo = mapDraw.setProperties({
    'fill-color': 'red',
    'fill-outline-color': '#000',
    'fill-opacity': 1,
    'line-color': 'blue',
    'line-width': 10,
  });
  console.log(geo);
};
const setProperty = () => {
  const geo = mapDraw.setProperty('fill-color', 'green');
  console.log(geo);
};

const geo = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        coordinates: [
          [
            10.288255172152247,
            -4.821242044756701,
          ],
          [
            21.626599316477524,
            5.549804618938921,
          ],
          [
            34.024179802921196,
            14.300449150399743,
          ],
          [
            46.595953579268894,
            4.846567955359291,
          ],
          [
            39.45856618590719,
            -4.128284546852257,
          ],
          [
            33.24025599313154,
            -8.660682769438424,
          ],
          [
            28.668178314961466,
            -3.686742761835035,
          ],
        ],
        type: 'LineString',
      },
    },
    {
      type: 'Feature',
      properties: {},
      geometry: {
        coordinates: [
          [
            [
              20.52835117108893,
              17.106382770045585,
            ],
            [
              20.52835117108893,
              7.19455863042171,
            ],
            [
              24.785374796288494,
              7.19455863042171,
            ],
            [
              24.785374796288494,
              17.106382770045585,
            ],
            [
              20.52835117108893,
              17.106382770045585,
            ],
          ],
        ],
        type: 'Polygon',
      },
    },
  ],
};
const addGeojson = () => {
  mapDraw.addGeojson(geo);
};
const getSelectedFeature = () => {
  alert(JSON.stringify(mapDraw.getSelectedFeature(), null, 2));
};
const getAllFeatures = () => {
  alert(JSON.stringify(mapDraw.getAllFeatures(), null, 2));
};
const deleteSelectedFeature = () => {
  mapDraw.deleteSelectedFeature();
};
</script>

<template>
  <div class="mapDom">
    <div id="map" ref="mapboxDom" />
    <div class="btn1">
      <div class="div-button" type="primary" @click="drawPoint()">
        画点
      </div>
      <div class="div-button" type="primary" @click="drawLine()">
        画线
      </div>
      <div class="div-button" type="primary" @click="drawPolygon()">
        多边形
      </div>
      <div class="div-button" type="primary" @click="drawRect()">
        矩形
      </div>
      <div class="div-button" type="primary" @click="drawArrow()">
        画箭头
      </div>

      <div class="div-button" type="primary" @click="drawCircle()">
        画圆
      </div>
      <div class="div-button" type="primary" @click="fivePointedStar()">
        画五角星
      </div>
      <div class="div-button" type="primary" @click="drawPentagonArrow()">
        画五边星
      </div>
    </div>

    <div class="btn2">
      <div class="div-button" type="primary" @click="setProperties()">
        setProperties
      </div>
      <div class="div-button" type="primary" @click="setProperty()">
        setProperty
      </div>
      <div class="div-button" type="primary" @click="addGeojson()">
        addGeojson
      </div>
      <div class="div-button" type="primary" @click="getSelectedFeature()">
        getSelectFeature
      </div>
      <div class="div-button" type="primary" @click="getAllFeatures()">
        getAllFeatures
      </div>
      <div class="div-button" type="primary" @click="deleteSelectedFeature()">
        deleteSelectedFeature
      </div>
    </div>
  </div>
</template>

<style scoped>
.mapDom {
  position: relative;
  width: 800px;
  height: 800px;

}

#map {
  position: relative;
  top: 0px;
  left: 0px;
  width: 800px;
  height: 800px;

}

.btn1 {
  position: absolute;
  top: 100px;
  left: 30px;
  display: flex;
  flex-direction: column;
}
.btn2 {
  position: absolute;
  top: 100px;
  left: 200px;
  display: flex;
  flex-direction: column;
}

.div-button {
  margin: 10px 0;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  border-color: #fff;
  color: #fff;
  background-color: #3c30df;

}

.div-button:active {
  transform: scale(0.85);
}
</style>
