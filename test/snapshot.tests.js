/* eslint-env mocha */
const assert = require('assert');
const jsdom = require('jsdom');
const snapshot = require('..');


describe('@wildpeaks/snapshot', () => {
	before(() => {
		global.document = jsdom.jsdom('');
		global.window = document.defaultView;
		Object.keys(document.defaultView).forEach(property => {
			if (typeof global[property] === 'undefined'){
				global[property] = document.defaultView[property];
			}
		});
		global.navigator = {
			userAgent: 'mocha'
		};
	});

	it('Missing element', () => {
		assert.deepStrictEqual(snapshot(), {});
	});
	it('Invalid element (0)', () => {
		assert.deepStrictEqual(snapshot(0), {});
	});
	it('Invalid element (1)', () => {
		assert.deepStrictEqual(snapshot(1), {});
	});
	it('Invalid element (false)', () => {
		assert.deepStrictEqual(snapshot(false), {});
	});
	it('Invalid element (true)', () => {
		assert.deepStrictEqual(snapshot(true), {});
	});
	it('Invalid element (null)', () => {
		assert.deepStrictEqual(snapshot(null), {});
	});
	it('Invalid element (undefined)', () => {
		assert.deepStrictEqual(snapshot(undefined), {}); // eslint-disable-line no-undefined
	});

	it('Empty body', () => {
		document.body.innerHTML = '';
		assert.deepStrictEqual(
			snapshot(document.body),
			{
				tagName: 'body'
			}
		);
	});

	it('Single paragraph in body', () => {
		document.body.innerHTML = '<p class="test1"></p>';
		assert.deepStrictEqual(
			snapshot(document.body),
			{
				tagName: 'body',
				children: [
					{
						tagName: 'p',
						className: 'test1'
					}
				]
			}
		);
	});

	it('Single paragraph in detached element', () => {
		const element = document.createElement('p');
		element.className = 'test2';
		assert.deepStrictEqual(
			snapshot(element),
			{
				tagName: 'p',
				className: 'test2'
			}
		);
	});

	it('Nested elements in body', () => {
		document.body.innerHTML = '<div class="outer"><div class="inner"></div><p></p></div>';
		assert.deepStrictEqual(
			snapshot(document.body),
			{
				tagName: 'body',
				children: [
					{
						tagName: 'div',
						className: 'outer',
						children: [
							{
								tagName: 'div',
								className: 'inner'
							},
							{
								tagName: 'p'
							}
						]
					}
				]
			}
		);
	});
});
