import { Map } from 'mapbox-gl';
import { ModeStateType } from './types';
import { MapFeature } from './mapFeature';

export const cursors = {
  HAND: 'grab',
  MOVE: 'move',
  ADD: 'crosshair',
  DRAG: 'drag',
  POINTER: 'pointer',
  NONE: 'none',
};

export class Cursor {
  static cursor:Cursor;

  mapCanvas: HTMLCanvasElement;

  constructor() {
    console.log('cursor');
  }

  static getInstance() {
    if (!Cursor.cursor) {
      Cursor.cursor = new Cursor();
    }
    return Cursor.cursor;
  }

  setMap(map:Map) {
    this.mapCanvas = map.getCanvas();
  }

  handleCursor(state:ModeStateType) {
    let curCursor = '';
    if (state === 'hot') {
      if (MapFeature.SelectedHotGeometryList.length) {
        curCursor = cursors.MOVE;
      } else {
        curCursor = cursors.ADD;
      }
    }

    if (state === 'cold') {
      // // 重置当前选中,和绘制数据
      curCursor = cursors.HAND;
    }
    this.mapCanvas.style.cursor = curCursor;
  }
}
