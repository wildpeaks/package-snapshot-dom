/* eslint-env node, mocha */
/* global document */
'use strict';
const {deepStrictEqual} = require('assert');
const {JSDOM} = require('jsdom');
const snapshot = require('..');


describe('toJSON', () => {

	// Reset DOM
	before(() => {
		const dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>');
		global.document = dom.window.document;
	});

	it('Missing element', () => {
		deepStrictEqual(snapshot.toJSON(), {});
	});
	it('Invalid element (0)', () => {
		deepStrictEqual(snapshot.toJSON(0), {});
	});
	it('Invalid element (1)', () => {
		deepStrictEqual(snapshot.toJSON(1), {});
	});
	it('Invalid element (false)', () => {
		deepStrictEqual(snapshot.toJSON(false), {});
	});
	it('Invalid element (true)', () => {
		deepStrictEqual(snapshot.toJSON(true), {});
	});
	it('Invalid element (null)', () => {
		deepStrictEqual(snapshot.toJSON(null), {});
	});
	it('Invalid element (undefined)', () => {
		deepStrictEqual(snapshot.toJSON(undefined), {}); // eslint-disable-line no-undefined
	});

	it('Empty body', () => {
		document.body.innerHTML = '';
		deepStrictEqual(
			snapshot.toJSON(document.body),
			{
				tagName: 'body'
			}
		);
	});

	it('Single paragraph in body', () => {
		document.body.innerHTML = '<p class="test1"></p>';
		deepStrictEqual(
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
		deepStrictEqual(
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
		deepStrictEqual(
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
		deepStrictEqual(
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
		deepStrictEqual(
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
		deepStrictEqual(
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
		deepStrictEqual(
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

	it('Empty attributes (default behavior)', () => {
		document.body.innerHTML = '<img data-param1 data-param2="" data-param3="  " data-param4="false" data-param5=false />';
		deepStrictEqual(
			snapshot.toJSON(document.body),
			{
				tagName: 'body',
				childNodes: [
					{
						tagName: 'img',
						attributes: {
							'data-param1': '',
							'data-param2': '',
							'data-param3': '  ',
							'data-param4': 'false',
							'data-param5': 'false'
						}
					}
				]
			}
		);
	});
	it('Empty attributes (skip: false)', () => {
		document.body.innerHTML = '<img data-param1 data-param2="" data-param3="  " data-param4="false" data-param5=false />';
		deepStrictEqual(
			snapshot.toJSON(document.body, false),
			{
				tagName: 'body',
				childNodes: [
					{
						tagName: 'img',
						attributes: {
							'data-param1': '',
							'data-param2': '',
							'data-param3': '  ',
							'data-param4': 'false',
							'data-param5': 'false'
						}
					}
				]
			}
		);
	});
	it('Empty attributes (skip: true)', () => {
		document.body.innerHTML = '<img data-param1 data-param2="" data-param3="  " data-param4="false" data-param5=false />';
		deepStrictEqual(
			snapshot.toJSON(document.body, true),
			{
				tagName: 'body',
				childNodes: [
					{
						tagName: 'img',
						attributes: {
							'data-param3': '  ',
							'data-param4': 'false',
							'data-param5': 'false'
						}
					}
				]
			}
		);
	});
});
