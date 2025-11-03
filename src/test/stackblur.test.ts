import { before, describe, it } from "node:test";

import { type ImageDataLike, blurImageData } from "../main/stackblur.ts";
import { assertMatchImage, cloneImageData, loadImageData } from "./support/image.ts";
import { assertEquals } from "@kayahr/assert";

describe("stackblur", () => {
    describe("blurImageData", () => {
        let rgb: ImageDataLike;
        let rgba: ImageDataLike;

        before(async () => {
            rgb = await loadImageData(`src/test/data/rgb.png`);
            rgba = await loadImageData(`src/test/data/rgba.png`);
        });

        it(`defaults to blurring with alpha channel`, async () => {
            const image = cloneImageData(rgba);
            blurImageData(image, 10);
            await assertMatchImage(image, "defaults-to-blurring-with-alpha-channel");
        });

        for (const alpha of [ false, true ]) {
            describe(`${alpha ? "with" : "without"} alpha`, () => {
                for (const radius of [ 0, 5, 63, 254 ]) {
                    it(`blurs image with radius ${radius}`, async () => {
                        const image = cloneImageData(alpha ? rgba : rgb);
                        blurImageData(image, radius, alpha);
                        await assertMatchImage(image, `${alpha ? "with" : "without"}-alpha-blurs-image-with-radius-${radius}`);
                    });
                }

                it("works with image with size 1x1", () => {
                    const imageData: ImageDataLike = { data: new Uint8ClampedArray([ 10, 20, 30, alpha ? 40 : 255 ]), width: 1, height: 1 };
                    blurImageData(imageData, 1, alpha);
                    assertEquals(imageData.data, new Uint8ClampedArray([ 7, 15, 22, alpha ? 30 : 255 ]));
                });

                it(`blurs image with radius larger than image`, async () => {
                    const image = await loadImageData(`src/test/data/${alpha ? "rgba" : "rgb"}-small.png`);
                    blurImageData(image, 100, alpha);
                    await assertMatchImage(image, `${alpha ? "with" : "without"}-alpha-blurs-image-with-radius-larger-than-image`);
                });
            });
        }
    });
});
