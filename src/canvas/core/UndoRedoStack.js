import { cloneNestedObject } from "./utilities";

export class UndoRedoStack {
  undoStack = [];
  redoStack = [];
  stackLimit = 8;

  push(annotations) {
    const data = annotations.map((ann) => {
      return cloneNestedObject(ann, 2);
    });
    this.undoStack.push(data);
    if (this.undoStack.length > this.stackLimit) {
      this.undoStack.shift();
    }
  }

  pushToRedoStack(annotations) {
    this.redoStack.push(
      annotations.map((ann) => {
        return cloneNestedObject(ann, 2);
      })
    );
    if (this.redoStack.length > this.stackLimit) {
      this.redoStack.shift();
    }
  }

  undo() {
    if (this.undoStack.length > 0) {
      const data = this.undoStack.pop();
      this.pushToRedoStack(data);
      return this.undoStack[this.undoStack.length - 1];
    }
  }

  redo() {
    if (this.redoStack.length > 0) {
      const data = this.redoStack.pop();
      this.push(data);
      return data;
    }
  }

  reset() {
    this.undoStack = [];
    this.redoStack = [];
  }
}
