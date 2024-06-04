import { blurImageData, type ImageDataLike } from "../main/stackblur";
import { cloneImageData, createPNG, loadImageData } from "./support/image";

describe("stackblur", () => {
    describe("blurImageData", () => {
        let rgb: ImageDataLike;
        let rgba: ImageDataLike;

        beforeAll(async () => {
            rgb = await loadImageData(`src/test/data/rgb.png`);
            rgba = await loadImageData(`src/test/data/rgba.png`);
        });

        it(`defaults to blurring with alpha channel`, async () => {
            const image = cloneImageData(rgba);
            blurImageData(image, 10);
            expect(await createPNG(image)).toMatchImageSnapshot();
        });

        for (const alpha of [ false, true ]) {
            describe(`${alpha ? "with" : "without"} alpha`, () => {
                for (const radius of [ 0, 5, 63, 254 ]) {
                    it(`blurs image with radius ${radius}`, async () => {
                        const image = cloneImageData(alpha ? rgba : rgb);
                        blurImageData(image, radius, alpha);
                        expect(await createPNG(image)).toMatchImageSnapshot();
                    });
                }

                it("works with image with size 1x1", () => {
                    const imageData: ImageDataLike = { data: new Uint8ClampedArray([ 10, 20, 30, alpha ? 40 : 255 ]), width: 1, height: 1 };
                    blurImageData(imageData, 1, alpha);
                    expect(imageData.data).toEqual(new Uint8ClampedArray([ 7, 15, 22, alpha ? 30 : 255 ]));
                });

                it(`blurs image with radius larger than image`, async () => {
                    const image = await loadImageData(`src/test/data/${alpha ? "rgba" : "rgb"}-small.png`);
                    blurImageData(image, 100, alpha);
                    expect(await createPNG(image)).toMatchImageSnapshot();
                });
            });
        }
    });
});
