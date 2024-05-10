import {
  GeoJSONSource, LngLat, Map, MapMouseEvent,
} from 'mapbox-gl';
import {
  FeatureType, MetaType, eventData, SourceIds,
} from '@chmpr/utils';
import { MapFeature } from './mapFeature';
import { DrawGeometryType } from './types';

export class DrawRender {
  static renderRequest: number | null;

  map: Map;

  coldSource: GeoJSONSource;

  static drawRender: DrawRender;

  hotSource: GeoJSONSource;

  constructor() {
    console.log('render');
  }

  updateEvent(name:string) {
    this.map.fire(name, {
      features: MapFeature.getPureFeatureList(MapFeature.SelectedHotGeometryList.filter((e) => e.id)),
    });
  }

  setMap(map: Map) {
    this.map = map;
    this.hotSource = this.map.getSource(SourceIds.HOT) as GeoJSONSource;
    this.coldSource = this.map.getSource(SourceIds.COLD) as GeoJSONSource;
  }

  static getInstance(): DrawRender {
    if (!DrawRender.drawRender) {
      DrawRender.drawRender = new DrawRender();
    }
    return DrawRender.drawRender;
  }

  run() {
    if (!DrawRender.renderRequest) {
      DrawRender.renderRequest = requestAnimationFrame(() => {
        DrawRender.renderRequest = null;
        this.render();
      });
    }
  }

  runRender(cb:Function) {
    if (!DrawRender.renderRequest) {
      DrawRender.renderRequest = requestAnimationFrame(() => {
        DrawRender.renderRequest = null;
        cb();
      });
    }
  }

  handleCoord(coord: number[], delta: { lat: number, lng: number }) {
    return [coord[0] + delta.lng, coord[1] + delta.lat];
  }

  curGeo!:DrawGeometryType | undefined;

  curDragVertecGeo:DrawGeometryType | undefined;

  curPath:string | number | undefined;

  curMidpointList:DrawGeometryType[] = [];

  startDrag() {

  }

  endDrag() {
    console.log('endDrag');
    this.updateEvent(eventData.UPDATE);
  }

  startDragVertex() {
    console.log('startDragVertex');
    if (!MapFeature.CurSelectedHotGeometry) return;
    const { path } = MapFeature.CurSelectedHotGeometry;
    this.curPath = path as number;
    this.curGeo = MapFeature.SelectedHotGeometryList.find((e) => e.id);
    this.curDragVertecGeo = MapFeature.SelectedHotGeometryList.find((e) => e.path === path);
    if (!this.curGeo || !this.curDragVertecGeo) return;
    // 获取中心点
    this.curMidpointList = MapFeature.SelectedHotGeometryList.filter((e) => !e.children && this.curDragVertecGeo?.children && this.curDragVertecGeo.children.includes(e.path as string));
    if (this.curGeo.type === FeatureType.POLYGON) {
      if (this.curPath === 0) {
        // @ts-ignore
        const geo = MapFeature.SelectedHotGeometryList.find((e) => e.path === `0${this.curGeo.coordinates[0].length - 2}`);
        if (geo) this.curMidpointList.push(geo);
      }
    }
    this.curMidpointList.forEach((e) => {
      e.active = 'cold';
    });
  }

  endDragVertex() {
    console.log('endDragVertex');
    if (this.curGeo?.type === FeatureType.POLYGON) {
      this.curMidpointList?.forEach((e) => {
        e.active = 'hot';
        const path = Number((e.path as string).slice(1));
        // @ts-ignore
        const startCoord = this.curGeo?.coordinates[0][path];
        // @ts-ignore
        const endCoord = this.curGeo?.coordinates[0][path + 1];
        // @ts-ignore
        e.coordinates = [(startCoord[0] + endCoord[0]) / 2, (startCoord[1] + endCoord[1]) / 2];
      });
    } else {
      this.curMidpointList?.forEach((e) => {
        e.active = 'hot';
        const path = Number((e.path as string).slice(1));
        // @ts-ignore
        const startCoord = this.curGeo?.coordinates[path];
        // @ts-ignore
        const endCoord = this.curGeo?.coordinates[path + 1];
        // @ts-ignore
        e.coordinates = [(startCoord[0] + endCoord[0]) / 2, (startCoord[1] + endCoord[1]) / 2];
      });
    }

    this.curMidpointList = [];
    this.curGeo = undefined;
    this.curPath = undefined;
    this.curDragVertecGeo = undefined;
    this.updateEvent(eventData.UPDATE);
    this.runRender(this.seletctedRender.bind(this));
  }

  deleteVertex() {
    if (!MapFeature.CurSelectedHotGeometry) return;
    const { path } = MapFeature.CurSelectedHotGeometry;
    const curGeo = MapFeature.SelectedHotGeometryList.find((e) => e.id);
    if (!curGeo) return;
    let isDelete = false;

    if (curGeo.type === FeatureType.POINT) {
      MapFeature.SelectedHotGeometryList = [];
    }
    if (curGeo.type === FeatureType.LINESTRING) {
      if (curGeo.coordinates.length > 2) {
        isDelete = true;
        curGeo.coordinates.splice(path as number, 1);
      }
    }
    if (curGeo.type === FeatureType.POLYGON) {
      // @ts-ignore
      if (path !== 0 && curGeo.coordinates[0].length > 4) {
        isDelete = true;
        // @ts-ignore
        curGeo.coordinates[0].splice(path as number, 1);
      }
    }
    if (isDelete) this.selectedStartDraw(curGeo);
    this.runRender(this.seletctedRender.bind(this));
  }

  selectedStartDraw(drawGeometry: DrawGeometryType) {
    if (!drawGeometry) return;
    MapFeature.SelectedHotGeometryList = [];
    switch (drawGeometry.type) {
      case FeatureType.POINT:
        MapFeature.SelectedHotGeometryList = [drawGeometry];
        break;
      case FeatureType.LINESTRING:
        this.handleLineString(drawGeometry);
        break;
      case FeatureType.POLYGON:
        this.handlePolygon(drawGeometry);
        break;
      default:
        break;
    }
  }

  handlePolygon(drawGeometry: DrawGeometryType) {
    MapFeature.SelectedHotGeometryList.push(drawGeometry);
    const curlist = drawGeometry.coordinates[0] as number[];
    let lastVertex: any = null;
    curlist.forEach((point: any, i: number) => {
      const vertex:DrawGeometryType = {
        parent: drawGeometry.id,
        active: 'hot',
        meta: MetaType.VERTEX,
        path: i,
        type: 'Point',
        coordinates: point,
      };
      if (lastVertex) {
        this.createMidPoint(lastVertex, vertex, drawGeometry.coordinates.length - 1 === i);
      } else {
        vertex.children = [`0${i}`]; // 初始第一个点也需要给一个标记 好后面查询到midpoint
      }
      lastVertex = vertex;
      if (i !== curlist.length - 1) {
        MapFeature.SelectedHotGeometryList.push(vertex);
      }
    });
  }

  createMidPoint(startVertex: DrawGeometryType, endVertex: DrawGeometryType, lastPoint:boolean) {
    const { parent, path } = startVertex;
    endVertex.children = lastPoint ? [`0${path}`] : [`0${path}`, `0${path as number + 1}`];
    const startCoord = startVertex.coordinates as number[];
    const endCoord = endVertex.coordinates as number[];
    const midpoint = {
      parent,
      active: 'hot',
      meta: MetaType.MIDPOINT,
      path: `0${path}`,
      type: 'Point',
      coordinates: [(startCoord[0] + endCoord[0]) / 2, (startCoord[1] + endCoord[1]) / 2],
    };

    MapFeature.SelectedHotGeometryList.push(midpoint);
  }

  handleLineString(drawGeometry: DrawGeometryType) {
    MapFeature.SelectedHotGeometryList.push(drawGeometry);
    // const firstPointString = '';
    let lastVertex: any = null;
    drawGeometry.coordinates.forEach((point: any, i: number) => {
      const vertex:DrawGeometryType = {
        parent: drawGeometry.id,
        active: 'hot',
        path: i,
        meta: MetaType.VERTEX,
        type: 'Point',
        coordinates: point,
      };

      if (lastVertex) {
        this.createMidPoint(lastVertex, vertex, drawGeometry.coordinates.length - 1 === i);
      } else {
        vertex.children = [`0${i}`]; // 初始第一个点也需要给一个标记 好后面查询到midpoint
      }
      lastVertex = vertex;
      MapFeature.SelectedHotGeometryList.push(vertex);
    });
  }

  onDragVertex(delta: { lat: number, lng: number }) {
    const {
      curMidpointList, curGeo, curDragVertecGeo, curPath,
    } = this;
    if (!curMidpointList.length || !curGeo || !curDragVertecGeo) return;
    // 获取中心点
    // @ts-ignore
    curDragVertecGeo.coordinates = this.handleCoord(curDragVertecGeo.coordinates, delta);
    // 不会走到单个点！！注销
    // if (curGeo.type === FeatureType.POINT) {
    //   // @ts-ignore
    //   curGeo.coordinates = curDragVertecGeo.coordinates;
    // }
    if (curGeo.type === FeatureType.LINESTRING) {
      // @ts-ignore
      curGeo.coordinates[curPath] = curDragVertecGeo.coordinates;
    }
    if (curGeo.type === FeatureType.POLYGON) {
      const coord = curDragVertecGeo.coordinates;
      if (curPath === 0) {
        // @ts-ignore
        curGeo.coordinates[0][curGeo.coordinates[0].length - 1] = coord;
      }
      // @ts-ignore
      curGeo.coordinates[0][curPath] = coord;
    }

    this.runRender(this.seletctedRender.bind(this));
  }

  onDrag(delta: { lat: number, lng: number }) {
    MapFeature.SelectedHotGeometryList.forEach((geo: any) => {
      if (geo.type === FeatureType.POINT) {
        geo.coordinates = this.handleCoord(geo.coordinates, delta);
      }
      if (geo.type === FeatureType.LINESTRING) {
        geo.coordinates.forEach((coord: number[], i: number) => {
          geo.coordinates[i] = this.handleCoord(coord, delta);
        });
      }
      if (geo.type === FeatureType.POLYGON) {
        geo.coordinates[0].forEach((coord: number[], i: number) => {
          geo.coordinates[0][i] = this.handleCoord(coord, delta);
        });
      }
    });
    this.runRender(this.seletctedRender.bind(this));
  }

  render() {
    this.seletctedRender();
    this.coldRender();
  }

  seletctedRender() {
    const features = MapFeature.getFeatureList(MapFeature.SelectedHotGeometryList);
    this.hotSource.setData({
      type: 'FeatureCollection',
      features,
    });
  }

  coldRender() {
    const features = MapFeature.getFeatureList(MapFeature.DrawColdGeometryList);
    this.coldSource.setData({
      type: 'FeatureCollection',
      features,
    });
  }
}
