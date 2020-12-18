export default class RedrawStack {
  constructor() {
    this.stack = []
  }

  clearStack() {
    this.stack = []
  }

  addLine(offsetX, offsetY, canvasW, canvasH, colorSelected, lineSelected) {
    const newLine = {
      x: offsetX * 2,
      y: offsetY * 2,
      path: [],
      width: canvasW,
      height: canvasH,
      colorSelected,
      lineSelected,
    }

    this.stack.push(newLine)
  }

  trackPath(offsetX, offsetY) {
    const line = this.stack[this.stack.length - 1]
    if (line) line.path.push({ x: offsetX * 2, y: offsetY * 2 })
  }

  getStack() {
    return this.stack
  }

  setStack(stack) {
    this.stack = stack
  }
}
