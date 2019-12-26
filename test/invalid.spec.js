/* eslint-env node, mocha */
"use strict";
const {deepStrictEqual} = require("assert");
const snapshot = require("..");

describe("Invalid", () => {
	it("Missing element", () => {
		deepStrictEqual(snapshot.toJSON(), {});
	});
	it("Invalid element (0)", () => {
		deepStrictEqual(snapshot.toJSON(0), {});
	});
	it("Invalid element (1)", () => {
		deepStrictEqual(snapshot.toJSON(1), {});
	});
	it("Invalid element (false)", () => {
		deepStrictEqual(snapshot.toJSON(false), {});
	});
	it("Invalid element (true)", () => {
		deepStrictEqual(snapshot.toJSON(true), {});
	});
	it("Invalid element (null)", () => {
		deepStrictEqual(snapshot.toJSON(null), {});
	});
	it("Invalid element (undefined)", () => {
		deepStrictEqual(snapshot.toJSON(undefined), {});
	});
});
