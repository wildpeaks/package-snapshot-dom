# Snapshot

[![Build Status](https://travis-ci.org/wildpeaks/package-snapshot-dom.svg?branch=master)](https://travis-ci.org/wildpeaks/package-snapshot-dom)

Converts an HTMLElement to a JSON tree, useful for automated DOM tests.

Install:

	npm install @wildpeaks/snapshot-dom

Usage:

	document.body.innerHTML = '<div class="class1"><div class="class2"></div><p>Hello World</p></div>';

	assert.deepStrictEqual(
		snapshot.toJSON(document.body),
		{
			tagName: 'body',
			childNodes: [
				{
					tagName: 'div',
					attributes: {
						class: 'class1'
					},
					childNodes: [
						{
							tagName: 'div',
							attributes: {
								class: 'class2'
							}
						},
						{
							tagName: 'p',
							childNodes: [
								{
									nodeName: '#text',
									nodeValue: 'Hello World'
								}
							]
						}
					]
				}
			]
		}
	);
