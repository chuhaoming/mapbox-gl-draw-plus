export class Draggable {
  dragDiv: HTMLElement;

  isCanMove: boolean = false;

  target: HTMLElement;

  dragEndFun:Function | undefined;

  constructor(opt:{
    dragDiv: HTMLElement,
    target: HTMLElement,
  }) {
    this.dragDiv = opt.dragDiv;
    this.target = opt.target;
    this.initEvents();
  }

  initEvents(): void {
    this.dragDiv.addEventListener('mousedown', this.dragStart.bind(this));
  }

  dx: number = 0;

  dy: number = 0;

  startX: number = 0;

  startY: number = 0;

  // 鼠标按下事件处理函数
  dragStart(e:MouseEvent) {
    e.stopPropagation();
    this.isCanMove = true;
    this.startX = e.pageX - this.dx;
    this.startY = e.pageY - this.dy;
    // 鼠标移动事件
    document.addEventListener('mousemove', this.dragMove.bind(this));

    // 鼠标松开事件
    document.addEventListener('mouseup', this.dragEnd.bind(this));
  }

  // 鼠标移动事件处理函数
  dragMove(e:MouseEvent) {
    if (!this.isCanMove) return;
    this.dx = e.pageX - this.startX;
    this.dy = e.pageY - this.startY;
    this.target.style.transform = `translateX(${this.dx}px) translateY(${this.dy}px)`;
  }

  // 鼠标松开事件处理函数
  dragEnd(e:MouseEvent) {
    this.isCanMove = false;
    // 鼠标移动事件
    document.removeEventListener('mousemove', this.dragMove);

    // 鼠标松开事件
    document.removeEventListener('mouseup', this.dragEnd);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.dragEndFun && this.dragEndFun(e);
  }

  remove() {
    this.dragDiv.removeEventListener('mousedown', this.dragStart);
  }
}
