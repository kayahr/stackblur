import { describe, it } from "node:test";
import { assertSame, assertThrowWithMessage } from "@kayahr/assert";
import { BlurStack } from "../main/BlurStack.ts";

describe("BlurStack", () => {
    describe("getNext", () => {
        it("returns next entry if present", () => {
            const a = new BlurStack();
            const b = new BlurStack();
            b.next = a;
            assertSame(b.getNext(), a);
        });
        it("throws error if no next entry exists", () => {
            const a = new BlurStack();
            assertThrowWithMessage(() => a.getNext(), Error, "Unexpected end of blur stack");
        });
    });
});
