import type { ImageSegmenter, ImageSegmenterResult } from '@mediapipe/tasks-vision';

const WASM_BASE = '/mediapipe/wasm';
const SELFIE_SEGMENTER_MODEL = '/mediapipe/selfie_segmenter_landscape.tflite';

const BLUR_PX = 16;

/**
 * Runs MediaPipe Image Segmenter on a camera stream and composites the person
 * over a blurred copy of the same frame.
 */
export class VirtualBackground {
  private segmenter: ImageSegmenter | null = null;
  private segmenterPromise: Promise<ImageSegmenter> | null = null;
  private readonly video = document.createElement('video');
  private readonly outputCanvas = document.createElement('canvas');
  private readonly maskCanvas = document.createElement('canvas');
  private readonly personCanvas = document.createElement('canvas');
  private readonly outputCtx: CanvasRenderingContext2D;
  private readonly maskCtx: CanvasRenderingContext2D;
  private readonly personCtx: CanvasRenderingContext2D;
  private maskImageData: ImageData | null = null;
  private outputStream: MediaStream | null = null;
  private running = false;
  private frameHandle: number | null = null;
  private lastTimestamp = -1;

  constructor() {
    const outputCtx = this.outputCanvas.getContext('2d', { alpha: false });
    const maskCtx = this.maskCanvas.getContext('2d', { willReadFrequently: true });
    const personCtx = this.personCanvas.getContext('2d');

    if (!outputCtx || !maskCtx || !personCtx) {
      throw new Error('Canvas 2D context is not available');
    }

    this.outputCtx = outputCtx;
    this.maskCtx = maskCtx;
    this.personCtx = personCtx;
    this.video.muted = true;
    this.video.playsInline = true;
    this.video.setAttribute('playsinline', 'true');
    this.video.setAttribute('aria-hidden', 'true');
    this.outputCanvas.setAttribute('aria-hidden', 'true');
    this.hideElement(this.video);
    this.hideElement(this.outputCanvas);
    document.body.append(this.video, this.outputCanvas);
  }

  private hideElement(element: HTMLElement) {
    element.style.position = 'fixed';
    element.style.left = '-9999px';
    element.style.width = '1px';
    element.style.height = '1px';
    element.style.pointerEvents = 'none';
  }

  getStream() {
    return this.outputStream;
  }

  async start(input: MediaStream): Promise<MediaStream> {
    this.stopLoop();
    this.segmenter ??= await this.getSegmenter();

    this.video.srcObject = input;
    await this.video.play();

    this.running = true;
    this.lastTimestamp = -1;
    this.outputStream ??= this.outputCanvas.captureStream(30);
    this.scheduleFrame();
    return this.outputStream;
  }

  stop() {
    this.stopLoop();
    this.video.srcObject = null;
    this.outputStream?.getTracks().forEach((track) => {
      track.stop();
    });
    this.outputStream = null;
    this.maskImageData = null;
  }

  dispose() {
    this.stop();
    this.video.remove();
    this.outputCanvas.remove();
    this.segmenter?.close();
    this.segmenter = null;
    this.segmenterPromise = null;
  }

  private async getSegmenter() {
    this.segmenterPromise ??= this.createSegmenter().catch((error: unknown) => {
      this.segmenterPromise = null;
      throw error;
    });
    return this.segmenterPromise;
  }

  private async createSegmenter() {
    const { FilesetResolver, ImageSegmenter } = await import('@mediapipe/tasks-vision');
    const wasm = await FilesetResolver.forVisionTasks(WASM_BASE);

    try {
      return await ImageSegmenter.createFromOptions(wasm, {
        baseOptions: {
          modelAssetPath: SELFIE_SEGMENTER_MODEL,
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        outputConfidenceMasks: true,
        outputCategoryMask: false,
      });
    } catch {
      return await ImageSegmenter.createFromOptions(wasm, {
        baseOptions: {
          modelAssetPath: SELFIE_SEGMENTER_MODEL,
          delegate: 'CPU',
        },
        runningMode: 'VIDEO',
        outputConfidenceMasks: true,
        outputCategoryMask: false,
      });
    }
  }

  private stopLoop() {
    this.running = false;
    if (this.frameHandle !== null) {
      this.video.cancelVideoFrameCallback?.(this.frameHandle);
      cancelAnimationFrame(this.frameHandle);
      this.frameHandle = null;
    }
  }

  private scheduleFrame() {
    if (!this.running) {
      return;
    }

    if (typeof this.video.requestVideoFrameCallback === 'function') {
      this.frameHandle = this.video.requestVideoFrameCallback((_now, metadata) => {
        this.onFrame(metadata.mediaTime * 1000);
      });
      return;
    }

    this.frameHandle = requestAnimationFrame(() => {
      this.onFrame(performance.now());
    });
  }

  private onFrame(timestamp: number) {
    if (!this.running || !this.segmenter) {
      return;
    }

    if (!this.syncCanvasSize()) {
      this.scheduleFrame();
      return;
    }

    const monotonic = timestamp <= this.lastTimestamp ? this.lastTimestamp + 1 : timestamp;
    this.lastTimestamp = monotonic;

    this.segmenter.segmentForVideo(this.video, monotonic, this.drawResult);
    this.scheduleFrame();
  }

  private syncCanvasSize() {
    const width = this.video.videoWidth;
    const height = this.video.videoHeight;
    if (!width || !height) {
      return false;
    }

    if (this.outputCanvas.width !== width || this.outputCanvas.height !== height) {
      this.outputCanvas.width = width;
      this.outputCanvas.height = height;
      this.personCanvas.width = width;
      this.personCanvas.height = height;
    }

    return true;
  }

  private drawResult = (result: ImageSegmenterResult) => {
    const mask = result.confidenceMasks?.[0];
    const width = this.outputCanvas.width;
    const height = this.outputCanvas.height;

    if (!mask) {
      this.outputCtx.drawImage(this.video, 0, 0, width, height);
      result.close();
      return;
    }

    this.writeMask(mask);

    this.personCtx.globalCompositeOperation = 'copy';
    this.personCtx.drawImage(this.video, 0, 0, width, height);
    this.personCtx.globalCompositeOperation = 'destination-in';
    this.personCtx.drawImage(this.maskCanvas, 0, 0, width, height);
    this.personCtx.globalCompositeOperation = 'source-over';

    this.outputCtx.filter = `blur(${BLUR_PX}px)`;
    this.outputCtx.drawImage(this.video, 0, 0, width, height);
    this.outputCtx.filter = 'none';
    this.outputCtx.drawImage(this.personCanvas, 0, 0, width, height);

    result.close();
  };

  private writeMask(mask: { width: number; height: number; getAsFloat32Array: () => Float32Array }) {
    if (this.maskCanvas.width !== mask.width || this.maskCanvas.height !== mask.height) {
      this.maskCanvas.width = mask.width;
      this.maskCanvas.height = mask.height;
      this.maskImageData = null;
    }

    const confidence = mask.getAsFloat32Array();
    const imageData = this.maskImageData ?? this.maskCtx.createImageData(mask.width, mask.height);
    this.maskImageData = imageData;

    const pixels = imageData.data;
    for (let i = 0; i < confidence.length; i += 1) {
      const offset = i * 4;
      const alpha = confidence[i] * 255;
      pixels[offset] = 255;
      pixels[offset + 1] = 255;
      pixels[offset + 2] = 255;
      pixels[offset + 3] = alpha;
    }

    this.maskCtx.putImageData(imageData, 0, 0);
  }
}
