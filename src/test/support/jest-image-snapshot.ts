import { configureToMatchImageSnapshot } from "jest-image-snapshot";
import { expect } from "vitest";

const toMatchImageSnapshot = configureToMatchImageSnapshot({
    customSnapshotsDir: "src/test/image-snapshots"
});
expect.extend({ toMatchImageSnapshot });
