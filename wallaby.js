"use strict";

module.exports = () => ({
	debug: true,
	testFramework: "mocha",
	files: [
		"packages/**/index.js",
		{pattern: "test/fixtures/**/*.*", load: false}
	],
	tests: [
		"test/node.spec.js"
	],
	env: {
		type: "node"
	}
});
