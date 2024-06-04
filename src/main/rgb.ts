/*
 * Copyright (c) 2024 Klaus Reimer, k@ailis.de
 * Copyright (c) 2010 Mario Klingemann, mario@quasimondo.com
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

import { BlurStack } from "./BlurStack";
import type { ImageDataLike } from "./ImageDataLike";
import { mulTable, shgTable } from "./tables";

/**
 * Blurs image data with given blur radius. Alpha channel is not modified.
 *
 * @param imageData - The image data object obtained from a canvas.
 * @param radius    - The blur radius (0-254)
 */
export function blurImageDataRGB(imageData: ImageDataLike, radius: number): void {
    const { data, width, height } = imageData;
    const widthMinus1 = width - 1;
    const heightMinus1 = height - 1;
    const radiusPlus1 = radius + 1;
    const sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2;

    const stackStart = new BlurStack();
    let stackEnd = stackStart;
    let stack = stackStart;
    for (let i = 1, div = radius + radius + 1; i < div; i++) {
        stack = stack.next = new BlurStack();
        if (i === radiusPlus1) {
            stackEnd = stack;
        }
    }
    stack.next = stackStart;

    let yw = 0;
    let yi = 0;

    const mulSum = mulTable[radius];
    const shgSum = shgTable[radius];

    for (let y = 0; y < height; y++) {
        let rInSum = 0;
        let gInSum = 0;
        let bInSum = 0;
        let rSum = 0;
        let gSum = 0;
        let bSum = 0;

        const pr = data[yi];
        const pg = data[yi + 1];
        const pb = data[yi + 2];

        let rOutSum = radiusPlus1 * pr;
        let gOutSum = radiusPlus1 * pg;
        let bOutSum = radiusPlus1 * pb;

        rSum += sumFactor * pr;
        gSum += sumFactor * pg;
        bSum += sumFactor * pb;

        stack = stackStart;

        for (let i = 0; i < radiusPlus1; i++) {
            stack.r = pr;
            stack.g = pg;
            stack.b = pb;
            stack = stack.getNext();
        }

        for (let i = 1; i < radiusPlus1; i++) {
            const p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);

            const pr = data[p];
            const pg = data[p + 1];
            const pb = data[p + 2];
            const rbs = radiusPlus1 - i;

            rSum += (stack.r = pr) * rbs;
            gSum += (stack.g = pg) * rbs;
            bSum += (stack.b = pb) * rbs;

            rInSum += pr;
            gInSum += pg;
            bInSum += pb;

            stack = stack.getNext();
        }

        let stackIn = stackStart;
        let stackOut = stackEnd;
        for (let x = 0; x < width; x++) {
            data[yi] = (rSum * mulSum) >>> shgSum;
            data[yi + 1] = (gSum * mulSum) >>> shgSum;
            data[yi + 2] = (bSum * mulSum) >>> shgSum;

            rSum -= rOutSum;
            gSum -= gOutSum;
            bSum -= bOutSum;

            rOutSum -= stackIn.r;
            gOutSum -= stackIn.g;
            bOutSum -= stackIn.b;

            let p = x + radius + 1;
            p = (yw + (p < widthMinus1 ? p : widthMinus1)) << 2;

            rInSum += (stackIn.r = data[p]);
            gInSum += (stackIn.g = data[p + 1]);
            bInSum += (stackIn.b = data[p + 2]);

            rSum += rInSum;
            gSum += gInSum;
            bSum += bInSum;

            stackIn = stackIn.getNext();

            const pr = stackOut.r;
            const pg = stackOut.g;
            const pb = stackOut.b;

            rOutSum += pr;
            gOutSum += pg;
            bOutSum += pb;

            rInSum -= pr;
            gInSum -= pg;
            bInSum -= pb;

            stackOut = stackOut.getNext();

            yi += 4;
        }
        yw += width;
    }

    for (let x = 0; x < width; x++) {
        let gInSum = 0;
        let bInSum = 0;
        let rInSum = 0;
        let gSum = 0;
        let bSum = 0;
        let rSum = 0;

        let yi = x << 2;

        const pr = data[yi];
        const pg = data[yi + 1];
        const pb = data[yi + 2];

        let rOutSum = radiusPlus1 * pr;
        let gOutSum = radiusPlus1 * pg;
        let bOutSum = radiusPlus1 * pb;

        rSum += sumFactor * pr;
        gSum += sumFactor * pg;
        bSum += sumFactor * pb;

        stack = stackStart;

        for (let i = 0; i < radiusPlus1; i++) {
            stack.r = pr;
            stack.g = pg;
            stack.b = pb;
            stack = stack.getNext();
        }

        let yp = width;

        for (let i = 1; i <= radius; i++) {
            yi = (yp + x) << 2;

            const pr = data[yi] ?? 0;
            const pg = data[yi + 1] ?? 0;
            const pb = data[yi + 2] ?? 0;

            const rbs = radiusPlus1 - i;

            rSum += (stack.r = pr) * rbs;
            gSum += (stack.g = pg) * rbs;
            bSum += (stack.b = pb) * rbs;

            rInSum += pr;
            gInSum += pg;
            bInSum += pb;

            stack = stack.getNext();

            if (i < heightMinus1) {
                yp += width;
            }
        }

        yi = x;
        let stackIn = stackStart;
        let stackOut = stackEnd;
        for (let y = 0; y < height; y++) {
            let p = yi << 2;
            data[p] = (rSum * mulSum) >>> shgSum;
            data[p + 1] = (gSum * mulSum) >>> shgSum;
            data[p + 2] = (bSum * mulSum) >>> shgSum;

            rSum -= rOutSum;
            gSum -= gOutSum;
            bSum -= bOutSum;

            rOutSum -= stackIn.r;
            gOutSum -= stackIn.g;
            bOutSum -= stackIn.b;

            p = (x + (((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width)) << 2;

            rSum += (rInSum += (stackIn.r = data[p]));
            gSum += (gInSum += (stackIn.g = data[p + 1]));
            bSum += (bInSum += (stackIn.b = data[p + 2]));

            stackIn = stackIn.getNext();

            const pr = stackOut.r;
            const pg = stackOut.g;
            const pb = stackOut.b;

            rOutSum += pr;
            gOutSum += pg;
            bOutSum += pb;

            rInSum -= pr;
            gInSum -= pg;
            bInSum -= pb;

            stackOut = stackOut.getNext();

            yi += width;
        }
    }
}
