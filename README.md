StackBlur
=========

[GitHub] | [NPM] | [API Doc]

A fast almost Gaussian Blur. Based on Mario Klingemann's original [StackBlur v0.5](http://web.archive.org/web/20110707030516/http://www.quasimondo.com/StackBlurForCanvas/StackBlur.js) from 2011 with the following changes:

* Ported to modern TypeScript.
* Converted to a NPM module.
* Fixed bit-shifting error preventing the usage of blur radius larger than 180.
* Fix problems with blur radius larger than image.
* Improved alpha channel blurring.

Usage
-----

Install the library as a dependency in your project:

```
npm install @kayahr/stackblur
```

And then use it like this:

```typescript
import { blurImageData } from "@kayahr/stackblur";

// Get image data from some canvas
// ...
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

// Blur image data
const radius = 10; // Valid range: 0-254
const withAlpha = false; // Optional, defaults to true
blurImageData(imageData, radius, withAlpha);

// Draw image data back onto canvas
ctx.putImageData(imageData, 0, 0);
```

The blur function itself has no dependency on `Canvas` or a real `ImageData` object. The passed image data simply must have a `data` property containing the raw RGBA pixels as a `Uint8Array` or `ClampedUint8Array` and a `width` and `height` property. So it should work fine with libraries like [node-canvas], [sharp] or [jimp].

[API Doc]: https://kayahr.github.io/stackblur/
[GitHub]: https://github.com/kayahr/stackblur
[NPM]: https://www.npmjs.com/package/@kayahr/stackblur
[node-canvas]: https://www.npmjs.com/package/canvas
[sharp]: https://www.npmjs.com/package/sharp
[jimp]: https://www.npmjs.com/package/jimp
