# Snapshot

Converts an HTMLElement to a JSON tree, useful for DOM automated tests.

Install:

	npm install @wildpeaks/snapshot

Usage:

	assert.deepStrictEqual(
		snapshot(document.body),
		{
			tagName: 'body',
			children: [
				{
					tagName: 'p',
					className: 'myclass'
				}
			]
		}
	);
