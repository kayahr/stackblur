import * as sharp from "sharp";

import type { ImageDataLike } from "../../main/ImageDataLike";

export async function loadImageData(file: string): Promise<ImageDataLike> {
    const pixels = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    return {
        data: new Uint8Array(pixels.data),
        width: pixels.info.width,
        height: pixels.info.height
    };
}

export function cloneImageData(imageData: ImageDataLike): ImageDataLike {
    return {
        data: new Uint8Array(imageData.data),
        width: imageData.width,
        height: imageData.height
    };
}

export async function createPNG(imageData: ImageDataLike): Promise<Uint8Array> {
    return sharp(imageData.data, {
        raw: {
            width: imageData.width,
            height: imageData.height,
            channels: 4
        }
    }).png().toBuffer();
}
