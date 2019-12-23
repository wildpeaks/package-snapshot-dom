"use strict";

module.exports = () => ({
	debug: true,
	testFramework: "mocha",
	files: [
		"package.json",
		"src/**/*.js"
	],
	tests: [
		"test/*.spec.js"
	],
	env: {
		type: "node"
	}
});
