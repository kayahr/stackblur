/*
 * Copyright (c) 2024 Klaus Reimer, k@ailis.de
 * See LICENSE.md for licensing information.
 */

import type { ImageDataLike } from "./ImageDataLike";
import { blurImageDataRGB } from "./rgb";
import { blurImageDataRGBA } from "./rgba";
import { mulTable } from "./tables";

export { ImageDataLike };

/**
 * Applies blurring to the given image.
 *
 * @param imageData - The image data to blur.
 * @param radius    - The blur radius (0-254). Automatically clamped to a valid value.
 * @param alpha     - True (default) to also blur the alpha channel. False to only blur RGB.
 */
export function blurImageData(imageData: ImageDataLike, radius: number, alpha = true): void {
    radius = Math.max(0, Math.min(mulTable.length - 1, radius));
    if (alpha) {
        blurImageDataRGBA(imageData, radius);
    } else {
        blurImageDataRGB(imageData, radius);
    }
}
