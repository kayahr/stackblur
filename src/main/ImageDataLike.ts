/*
 * Copyright (c) 2024 Klaus Reimer, k@ailis.de
 * See LICENSE.md for licensing information.
 */

/**
 * Minimal interface for an ImageData compatible object.
 */
export interface ImageDataLike {
    /** The width in pixels. */
    width: number;

    /** The height in pixels. */
    height: number;

    /** The RGBA pixel data. */
    data: Uint8Array | Uint8ClampedArray;
}
