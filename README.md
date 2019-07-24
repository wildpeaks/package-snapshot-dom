# Snapshot

[![Greenkeeper badge](https://badges.greenkeeper.io/wildpeaks/package-snapshot-dom.svg)](https://greenkeeper.io/)

Converts an HTMLElement to a JSON tree, useful for automated DOM tests.

Install:

	npm install @wildpeaks/snapshot-dom

Usage:

````js
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
````

---
## Skip empty values

It can optionally exclude empty values using the second parameter (default: `false`).


````js
document.body.innerHTML = '<img param1 param2="" param3="hello" />;

// Without skipping
assert.deepStrictEqual(
	snapshot.toJSON(document.body, false),
	{
		tagName: 'body',
		childNodes: [
			{
				tagName: 'img',
				attributes: {
					param1: '',
					param2: '',
					param3: 'hello'
				}
			}
		]
	}
);

// With skipping
assert.deepStrictEqual(
	snapshot.toJSON(document.body, true),
	{
		tagName: 'body',
		childNodes: [
			{
				tagName: 'img',
				attributes: {
					param3: 'hello'
				}
			}
		]
	}
);
````

Note that strings containing only whitespace are not empty.

