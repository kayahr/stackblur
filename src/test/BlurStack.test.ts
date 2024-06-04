import "jest-extended";

import { BlurStack } from "../main/BlurStack";

describe("BlurStack", () => {
    describe("getNext", () => {
        it("returns next entry if present", () => {
            const a = new BlurStack();
            const b = new BlurStack();
            b.next = a;
            expect(b.getNext()).toBe(a);
        });
        it("throws error if no next entry exists", () => {
            const a = new BlurStack();
            expect(() => a.getNext()).toThrowWithMessage(Error, "Unexpected end of blur stack");
        });
    });
});
