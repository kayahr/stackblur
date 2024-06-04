import { configureToMatchImageSnapshot } from "jest-image-snapshot";

const toMatchImageSnapshot = configureToMatchImageSnapshot({
    customSnapshotsDir: "src/test/image-snapshots"
});
expect.extend({ toMatchImageSnapshot });
