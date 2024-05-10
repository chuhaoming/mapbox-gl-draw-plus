import { DrawRender } from '../DrawRender';
import { Cursor } from '../cursor';
import { ModeStateType } from '../types';

export class Status {
  static curModeState: ModeStateType = 'cold';

  static isDrawing:boolean = false;

  static set modeState(state: ModeStateType) {
    DrawRender.drawRender?.run();

    if (Status.curModeState !== state) {
      Status.curModeState = state;
      if (Cursor.cursor) Cursor.cursor.handleCursor(Status.curModeState);
    }
  }

  static get modeState() {
    return Status.curModeState;
  }

  constructor() {
    console.log('status');
  }
}
