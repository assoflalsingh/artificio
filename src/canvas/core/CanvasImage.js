export class CanvasImage {
  image;
  onloadCallbacks = [];

  constructor(src) {
    this.image = new Image();
    this.image.src = src;

    this.image.addEventListener("load", () => {
      this.onloadCallbacks.forEach((cb) => {
        cb(this.image);
      });
    });

    this.image.addEventListener("error", (err) => {
      alert("Failed to load image");
    });
  }

  onLoad(cb) {
    this.onloadCallbacks.push(cb);
  }
}
