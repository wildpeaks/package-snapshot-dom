"use strict";

module.exports = () => ({
	debug: true,
	testFramework: "mocha",
	files: [
		"packages/**/*.js",
		"src/**/*.js"
	],
	tests: [
		"test/*.spec.js"
	],
	env: {
		type: "node"
	}
});
