import { Draggable } from '@chmpr/draggable';
import './operator.scss';
import {
  Map, MapMouseEvent, MapTouchEvent, MapboxGeoJSONFeature,
} from 'mapbox-gl';

import { DrawRender, MapFeature } from '@chmpr/map-draw';
import {
  FeatureType, bearing, distance, getCentroid,
} from '@chmpr/utils';
import dcopy from 'deep-copy';
import { polygon } from '@turf/helpers';
import transformRotate from '@turf/transform-rotate';
import transformScale from '@turf/transform-scale';

type EditButton = {
  id:string,
  title:string,
  icon:string,
  parent?:HTMLElement,
  className:string
};
export class Operator {
  operatorDom: HTMLDivElement;

  // deleteDom: HTMLDivElement;
  isCanRotate:boolean = false;

  isCanScale:boolean = false;

  rotateNumber: number | null;

  scaleNumber: number | null;

  Centroid: number[] = [];

  coordinates:number[][] = [];

  curGeo: any;

  constructor() {
    console.log('Operator');
    this.createLink();
    this.operatorDom = document.createElement('div');
    this.operatorDom.id = 'operator';

    // this.deleteDom = this.createButtonDelete();
  }

  createLink() {
    // 创建 <link> 元素
    const linkElement = document.createElement('link');
    // 设置 <link> 元素的属性
    linkElement.rel = 'stylesheet'; // 设置 rel 属性
    linkElement.href = '//at.alicdn.com/t/c/font_4520304_tpd89y85ju.css'; // 设置 href 属性
    linkElement.type = 'text/css'; // 设置 type 属性（可选）

    // 将 <link> 元素插入到 <head> 中
    const headElement = document.getElementsByTagName('head')[0];
    headElement.appendChild(linkElement);
  }

  createButton(button:EditButton, parent:HTMLElement) {
    const btnElement = document.createElement('div');
    btnElement.id = button.id;
    btnElement.title = button.title;
    btnElement.innerHTML = `<i class="${button.className} iconfont icon-${button.icon}"></i>`;
    parent.appendChild(btnElement);
    return btnElement;
  }

  // showDeleteButton(x:number, y:number) {
  //   if (!this.deleteDom) return;
  //   this.deleteDom.style.display = 'flex';
  //   this.deleteDom.style.top = `${y}px`;
  //   this.deleteDom.style.left = `${x}px`;
  // }

  // hideDeleteButton() {
  //   if (!this.deleteDom) return;
  //   this.deleteDom.style.display = 'none';
  // }

  // createButtonDelete() {
  //   const map = document.getElementById('map') as HTMLElement;
  //   return this.createButton({
  //     icon: 'shuidi',
  //     className: 'operator-delete',
  //     id: 'vertex-delete',
  //     title: '删除顶点',
  //   }, map);
  // }
  rotateEnd() {
    if (this.isCanRotate) {
      this.isCanRotate = false;
      DrawRender.drawRender.selectedStartDraw(MapFeature.SelectedHotGeometryList[0]);
      DrawRender.drawRender.seletctedRender();
    }
  }

  rotateFeature(event: MapMouseEvent | MapTouchEvent) {
    if (this.coordinates.length) {
      // @ts-ignore
      const poly = polygon([this.coordinates]);
      const dist = bearing(this.Centroid, [event.lngLat.lng, event.lngLat.lat]);
      if (!this.rotateNumber) this.rotateNumber = dist;
      const angle = ((dist - this.rotateNumber)) % 360;
      const roPoly = transformRotate(poly, angle);
      const { curGeo } = this;
      if (curGeo.type === FeatureType.LINESTRING) {
        // eslint-disable-next-line prefer-destructuring
        curGeo.coordinates = roPoly.geometry.coordinates[0];
        const geo = dcopy(curGeo);
        geo.coordinates.pop();
        MapFeature.SelectedHotGeometryList = [geo];
      }
      if (curGeo.type === FeatureType.POLYGON) {
        curGeo.coordinates = roPoly.geometry.coordinates;
        MapFeature.SelectedHotGeometryList = [curGeo];
      }
      DrawRender.drawRender.seletctedRender();
    }
  }

  showOperator(event:MapMouseEvent | MapTouchEvent, featureList:MapboxGeoJSONFeature[]) {
    if (!this.operatorDom) return;
    if (featureList.length) {
      if (this.operatorDom.style.visibility === 'visible') return;
      this.operatorDom.style.top = `${event.point.y}px`;
      this.operatorDom.style.left = `${event.point.x}px`;
      if (MapFeature.SelectId) {
        this.curGeo = MapFeature.SelectedHotGeometryList.find((e) => e.id);

        this.operatorDom.style.visibility = 'visible';
      }
    } else {
      this.operatorDom.style.visibility = 'hidden';
    }
  }

  createOperator(map:Map) {
    const dragDiv = this.createButton({
      icon: 'tuodong',
      className: 'operator-div-move',
      id: 'move-operator',
      title: '',
    }, this.operatorDom);
    const parentDom = map.getContainer() || document.body;
    const drag = new Draggable({
      dragDiv,
      target: this.operatorDom,
    });
    parentDom?.appendChild(this.operatorDom);
    this.createRotateButton();
    this.createScaleButton();

    this.createExportButton();
    this.createDeleteButton();
  }

  createDeleteButton() {
    const deleteDom = this.createButton({
      icon: 'shanchu',
      className: 'operator-btn',
      id: 'delete-plot',
      title: '删除选中项',
    }, this.operatorDom);
    deleteDom.onclick = (e:MouseEvent) => {
      e.stopPropagation();
      MapFeature.SelectedHotGeometryList = [];
      DrawRender.drawRender?.run();
    };
  }

  createExportButton() {
    const exportDom = this.createButton({
      icon: 'daochu',
      className: 'operator-btn',
      id: 'export-plot',
      title: '选中项导出',
    }, this.operatorDom);
    exportDom.onclick = () => this.parseGeometry();
  }

  parseGeometry() {
    if (!this.curGeo) return console.error('please select a geometry');
    const geojsonData = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: this.curGeo?.properties || {},
          geometry: {
            coordinates: this.curGeo?.coordinates,
            type: this.curGeo?.type,
          },
        },
      ],
    };
    const json = JSON.stringify(geojsonData);
    // 创建a标签下载链接
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
    link.download = `${this.curGeo?.type || 'file'}.geojson`;
    document.body.appendChild(link);
    // 点击实现下载
    link.click();
    document.body.removeChild(link);
    return geojsonData;
  }

  createScaleButton() {
    const scaleDom = this.createButton({
      icon: 'suofang',
      className: 'operator-btn',
      id: 'scale-plot',
      title: '缩放选中项',
    }, this.operatorDom);
    scaleDom.onmousedown = (e:MouseEvent) => {
      this.isCanScale = true;
      this.scaleNumber = null;
      this.operatorDom.style.visibility = 'hidden';
      if (!this.curGeo) return;
      if (this.curGeo.type === FeatureType.LINESTRING) {
        console.log(this.curGeo.coordinates);
        this.curGeo.coordinates.push(this.curGeo.coordinates[0]);
        this.coordinates = this.curGeo.coordinates as number[][];
        this.Centroid = getCentroid(this.curGeo.coordinates);
      }
      if (this.curGeo.type === FeatureType.POLYGON) {
        this.coordinates = this.curGeo.coordinates[0] as number[][];
        this.Centroid = getCentroid(this.coordinates);
      }

      console.log(this.Centroid);
    };
  }

  scaleEnd() {
    if (this.isCanScale) {
      this.isCanScale = false;
      DrawRender.drawRender.selectedStartDraw(MapFeature.SelectedHotGeometryList[0]);
      DrawRender.drawRender.seletctedRender();
    }
  }

  scaleFeature(event: MapMouseEvent | MapTouchEvent) {
    if (this.coordinates.length) {
      // @ts-ignore
      const poly = polygon([this.coordinates]);
      if (!this.scaleNumber) this.scaleNumber = event.lngLat.lng;
      const dist = event.lngLat.lng - this.scaleNumber;
      const scale = dist / 10 + 1;
      const roPoly = transformScale(poly, scale);
      const { curGeo } = this;
      if (curGeo.type === FeatureType.LINESTRING) {
        // eslint-disable-next-line prefer-destructuring
        curGeo.coordinates = roPoly.geometry.coordinates[0];
        const geo = dcopy(curGeo);
        geo.coordinates.pop();
        MapFeature.SelectedHotGeometryList = [geo];
      }
      if (curGeo.type === FeatureType.POLYGON) {
        curGeo.coordinates = roPoly.geometry.coordinates;
        MapFeature.SelectedHotGeometryList = [curGeo];
      }
      DrawRender.drawRender.seletctedRender();
    }
  }

  createRotateButton() {
    const rotateDom = this.createButton({
      icon: 'rotateZ',
      className: 'operator-btn',
      id: 'rotate-plot',
      title: '旋转选中项',
    }, this.operatorDom);
    rotateDom.onmousedown = (e:MouseEvent) => {
      this.isCanRotate = true;
      this.rotateNumber = null;
      this.operatorDom.style.visibility = 'hidden';
      if (!this.curGeo) return;
      if (this.curGeo.type === FeatureType.LINESTRING) {
        console.log(this.curGeo.coordinates);
        this.curGeo.coordinates.push(this.curGeo.coordinates[0]);
        this.coordinates = this.curGeo.coordinates as number[][];
        this.Centroid = getCentroid(this.curGeo.coordinates);
      }
      if (this.curGeo.type === FeatureType.POLYGON) {
        this.coordinates = this.curGeo.coordinates[0] as number[][];
        this.Centroid = getCentroid(this.coordinates);
      }

      console.log(this.Centroid);
    };
  }
}
