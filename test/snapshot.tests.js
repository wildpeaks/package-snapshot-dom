/* eslint-env mocha */
const assert = require('assert');
const jsdom = require('jsdom');
const snapshot = require('..');


function resetDOM(){
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
}


describe('@wildpeaks/snapshot-dom', () => {
	describe('toJSON', () => {
		before(resetDOM);

		it('Missing element', () => {
			assert.deepStrictEqual(snapshot.toJSON(), {});
		});
		it('Invalid element (0)', () => {
			assert.deepStrictEqual(snapshot.toJSON(0), {});
		});
		it('Invalid element (1)', () => {
			assert.deepStrictEqual(snapshot.toJSON(1), {});
		});
		it('Invalid element (false)', () => {
			assert.deepStrictEqual(snapshot.toJSON(false), {});
		});
		it('Invalid element (true)', () => {
			assert.deepStrictEqual(snapshot.toJSON(true), {});
		});
		it('Invalid element (null)', () => {
			assert.deepStrictEqual(snapshot.toJSON(null), {});
		});
		it('Invalid element (undefined)', () => {
			assert.deepStrictEqual(snapshot.toJSON(undefined), {}); // eslint-disable-line no-undefined
		});

		it('Empty body', () => {
			document.body.innerHTML = '';
			assert.deepStrictEqual(
				snapshot.toJSON(document.body),
				{
					tagName: 'body'
				}
			);
		});

		it('Single paragraph in body', () => {
			document.body.innerHTML = '<p class="test1"></p>';
			assert.deepStrictEqual(
				snapshot.toJSON(document.body),
				{
					tagName: 'body',
					childNodes: [
						{
							tagName: 'p',
							attributes: {
								class: 'test1'
							}
						}
					]
				}
			);
		});

		it('Single paragraph in detached element', () => {
			const element = document.createElement('p');
			element.className = 'test2';
			assert.deepStrictEqual(
				snapshot.toJSON(element),
				{
					tagName: 'p',
					attributes: {
						class: 'test2'
					}
				}
			);
		});

		it('Nested elements in body', () => {
			document.body.innerHTML = '<div class="outer"><div class="inner"></div><p></p></div>';
			assert.deepStrictEqual(
				snapshot.toJSON(document.body),
				{
					tagName: 'body',
					childNodes: [
						{
							tagName: 'div',
							attributes: {
								class: 'outer'
							},
							childNodes: [
								{
									tagName: 'div',
									attributes: {
										class: 'inner'
									}
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

		it('Text fragment', () => {
			document.body.innerHTML = '<p>Hello World</p>';
			assert.deepStrictEqual(
				snapshot.toJSON(document.body),
				{
					tagName: 'body',
					childNodes: [
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
			);
		});

		it('Attributes', () => {
			document.body.innerHTML = '<button role="heading" style="color: green">Search</button>';
			assert.deepStrictEqual(
				snapshot.toJSON(document.body),
				{
					tagName: 'body',
					childNodes: [
						{
							tagName: 'button',
							attributes: {
								role: 'heading',
								style: 'color: green'
							},
							childNodes: [
								{
									nodeName: '#text',
									nodeValue: 'Search'
								}
							]
						}
					]
				}
			);
		});

		it('Duplicated attribute (alphabetic order)', () => {
			document.body.innerHTML = '<div class="AAA" class="ZZZ"></div>';
			assert.deepStrictEqual(
				snapshot.toJSON(document.body),
				{
					tagName: 'body',
					childNodes: [
						{
							tagName: 'div',
							attributes: {
								class: 'AAA'
							}
						}
					]
				}
			);
		});
		it('Duplicated attribute (reverse order)', () => {
			document.body.innerHTML = '<div class="ZZZ" class="AAA"></div>';
			assert.deepStrictEqual(
				snapshot.toJSON(document.body),
				{
					tagName: 'body',
					childNodes: [
						{
							tagName: 'div',
							attributes: {
								class: 'ZZZ'
							}
						}
					]
				}
			);
		});
	});
});
