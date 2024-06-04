/*
 * Copyright (c) 2024 Klaus Reimer, k@ailis.de
 * See LICENSE.md for licensing information.
 */

export interface ImageDataLike {
    width: number;
    height: number;
    data: Uint8Array | Uint8ClampedArray;
}
