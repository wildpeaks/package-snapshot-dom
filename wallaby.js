"use strict";

module.exports = () => ({
	debug: true,
	testFramework: "mocha",
	files: [
		"packages/**/index.js",
		{pattern: "test/fixtures/**/*.*", load: false}
	],
	tests: [
		"test/invalid.spec.js",
		"test/jsdom.spec.js"
	],
	env: {
		type: "node"
	}
});
