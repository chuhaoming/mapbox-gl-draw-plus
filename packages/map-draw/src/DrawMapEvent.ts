import {
  Map, MapMouseEvent, MapEventType, MapTouchEvent, LngLat, GeoJSONSource, MapboxGeoJSONFeature, Point,
} from 'mapbox-gl';
import { Operator } from '@chmpr/operator';
import {
  clickBuffer, isClick,

} from '@chmpr/utils';
import { MapDrawLayer } from '@chmpr/map-draw-layer';
import { Tips } from '@chmpr/map-tips';
import { DrawRender } from './DrawRender';
import { Status } from './Status';
import { ModeObject } from './modes/modeObject';
import { UserAction } from './action';
import { MapFeature } from './mapFeature';
import { EventOptions } from './types';

export class DrawMapEvent {
  map: Map;

  container: HTMLElement;

  options: EventOptions;

  _canDragMove: boolean = false;

  curNumber = 0;

  _isCanMove: boolean = false;

  dragMoveLocation!: LngLat;

  mouseDownInfo!: {
    time: number,
    point: Point,
  };

  curModeObject!: ModeObject;

  operator: Operator | undefined;

  mapLayer:MapDrawLayer | undefined;

  tips: Tips | undefined;

  constructor(options: EventOptions) {
    this.options = options;
    this.map = options.map;
    this.tips = options.tips;
    this.container = this.map.getContainer();
    this.operator = options.operator;
    this.mapLayer = options.mapLayer;
    this.initMapLayer();
    this.initOperator();
    this.tips?.init(this.map);
  }

  set isCanMove(val: boolean) {
    if (val !== undefined && val !== this._isCanMove) {
      this._isCanMove = val;
      if (this._isCanMove) {
        DrawRender.drawRender.startDrag();
      } else if (new Date().getTime() - this.mouseDownInfo.time > 200) {
        DrawRender.drawRender.endDrag();
      }
    }
  }

  get isCanMove(): boolean {
    return this._isCanMove;
  }

  set canDragMove(val: boolean) {
    if (val !== undefined && val !== this._canDragMove) {
      this._canDragMove = val;
      if (this._canDragMove) {
        DrawRender.drawRender.startDragVertex();
      } else if (new Date().getTime() - this.mouseDownInfo.time > 100) {
        DrawRender.drawRender.endDragVertex();
      }
    }
  }

  get canDragMove(): boolean {
    return this._canDragMove;
  }

  initHot() {
    Status.modeState = 'hot';
    Status.isDrawing = true;
    this.curNumber = 0;
  }

  setMode<T extends ModeObject>(mode: T) {
    // 如果本来就是hot 说明是在绘制的中途切换mode 绘制点未清除
    if (Status.modeState !== 'cold') {
      MapFeature.pushDrawGeometry();
      DrawRender.drawRender?.run();
    }

    this.curModeObject = mode;
    if (this.tips) this.curModeObject.tips = this.tips;
    this.initHot();
    this.curModeObject.startDraw();
  }

  addEventListeners() {
    this.map.on('mousemove', this.mousemove.bind(this));
    this.map.on('mousedown', this.mousedown.bind(this));
    this.map.on('mouseup', this.mouseup.bind(this));

    this.map.on('touchmove', this.touchmove.bind(this));
    this.map.on('touchstart', this.touchstart.bind(this));
    this.map.on('touchend', this.touchend.bind(this));

    // this.container.addEventListener('mouseout', this.mouseout.bind(this));

    if (this.options.keybindings) {
      this.container.addEventListener('keyup', this.keyup.bind(this));
    }
  }

  initOperator() {
    if (!this.operator) return;
    this.operator.createOperator(this.map);
  }

  initMapLayer() {
    if (!this.mapLayer) return;
    this.mapLayer.addMap(this.map);
  }

  mousedown(event: MapMouseEvent) {
    this.start(event);
  }

  mouseup(event: MapMouseEvent) {
    this.end(event);
  }

  addPoint(event: MapMouseEvent | MapTouchEvent) {
    if (Status.isDrawing) {
      this.curModeObject.click(this.curNumber, event.lngLat.lng, event.lngLat.lat);
      this.curNumber++;
    }
  }

  mousemove(event: MapMouseEvent) {
    this.moveTo(event);
  }

  start(event: MapMouseEvent | MapTouchEvent) {
    this.dragMoveLocation = event.lngLat;
    if (!Status.isDrawing && Status.modeState !== 'cold') {
      const featureList = UserAction.userAction.clickAnyWhere<MapMouseEvent | MapTouchEvent>(event, this.map, clickBuffer);
      if (featureList.length) {
        this.map.dragPan.disable();
        const { properties: { parent, path, id } }: any = featureList[0];
        if (parent) UserAction.userAction.handleSelectedHotGeometry(path);
        this.canDragMove = parent && !!MapFeature.SelectId;
        this.isCanMove = id && !!MapFeature.SelectId;
      }
    }
    this.mouseDownInfo = {
      time: new Date().getTime(),
      point: event.point,
    };
  }

  end(event: MapMouseEvent | MapTouchEvent) {
    this.isCanMove = false;
    this.canDragMove = false;
    this.map.dragPan.enable();
    if (isClick(this.mouseDownInfo, {
      point: event.point,
      time: new Date().getTime(),
    })) {
      const featureList = UserAction.userAction.clickAnyWhere<MapMouseEvent | MapTouchEvent>(event, this.map, clickBuffer);
      // 绘制的时候加点用
      if (Status.isDrawing) {
        // 如果点道理自己的点的时候结束绘制
        if (featureList.length && featureList[0].properties!.parent) {
          this.curModeObject.endDraw();
        } else {
          this.addPoint(event);
        }
        return;
      }
      UserAction.userAction.handleFeatureList(featureList);// 选中状态
      this.operator?.showOperator(event, featureList);
    }
    this.operator?.rotateEnd();
    this.operator?.scaleEnd();
  }

  moveTo(event: MapMouseEvent | MapTouchEvent) {
    this.tips?.updateCoordinate(event.lngLat);
    if (!this.dragMoveLocation) return;

    if (this.operator?.isCanRotate) {
      this.operator.rotateFeature(event);
      return;
    } if (this.operator?.isCanScale) {
      this.operator.scaleFeature(event);
      return;
    }
    const delta = {
      lng: event.lngLat.lng - this.dragMoveLocation.lng,
      lat: event.lngLat.lat - this.dragMoveLocation.lat,
    };
    if (this.isCanMove && Status.modeState === 'hot') {
      // bug: 当多边形图形在下面 拖拽线拖拽不了
      DrawRender.drawRender.onDrag(delta);
    }

    if (this.canDragMove && Status.modeState === 'dragVertex') {
      DrawRender.drawRender.onDragVertex(delta);
    }
    if (Status.isDrawing) {
      this.curModeObject.updateCoordinate(this.curNumber, event.lngLat.lng, event.lngLat.lat);
    }
    // 阻止事件冒泡
    this.dragMoveLocation = event.lngLat;
  }

  touchmove(event: MapTouchEvent) {
    this.moveTo(event);
  }

  touchstart(event: MapTouchEvent) {
    this.map.dragPan.disable();
    this.start(event);
  }

  touchend(event: MapTouchEvent) {
    this.end(event);
  }

  // mouseout() {
  //   // console.log('当鼠标离开浏览器窗口时,会触发window对象的mouseout事件。');
  // }

  // keydown(event: Event) {
  //   console.log('keydown', event);
  // }

  keyup(event: KeyboardEvent) {
    if (event.key === 'Delete') {
      DrawRender.drawRender.deleteVertex();
    }
    console.log('keyup', event);
  }

  removeEventListeners() {
    this.map.off('mousemove', this.mousemove);
    this.map.off('mousedown', this.mousedown);
    this.map.off('mouseup', this.mouseup);

    this.map.off('touchmove', this.touchmove);
    this.map.off('touchstart', this.touchstart);
    this.map.off('touchend', this.touchend);

    // this.container.addEventListener('mouseout', this.mouseout);

    // if (this.options.keybindings) {
    //   this.container.removeEventListener('keydown', this.keydown);
    //   this.container.removeEventListener('keyup', this.keyup);
    // }
  }
}
