#!/bin/sh
':' //# http://sambal.org/?p=1014 ; exec /usr/bin/env node "$0" "$@"
"use strict";

console.log('Hello world!')

const { walk } = require('../src')

const callbacks_render_ascii = require('../src/to_ascii')
const callbacks_render_html = require('../src/to_html')
const callbacks_debug = require('../src/to_debug')

const WEAPON_01_NAME = {
	$classes: ['item-name', 'item-weapon-name'],
	$content: '{{qualifier2|Capitalize}} {{qualifier1|Capitalize}} {{base|Capitalize}}',
	qualifier2: {
		$type: 'span',
		$classes: ['weapon-qualifier-2'],
		$content: 'warfield king’s',
	},
	qualifier1: {
		$type: 'span',
		$classes: ['weapon-qualifier-1'],
		$content: 'onyx',
	},
	base: {
		$type: 'span',
		$classes: ['weapon-base'],
		$content: 'longsword',
	},
}

const WEAPON_01 = {
	$type: 'span',
	$classes: ['item', 'item-weapon', 'item-quality-legendary'],
	$content: '{{weapon_name}} {{enhancement}}',
	weapon_name: WEAPON_01_NAME,
	enhancement: {
		$type: 'span',
		$content: '+3',
	},
}

const PLACE_01 = {
	$type: 'span',
	$classes: ['place'],
	$content: 'the country of {{name}}',
	name: {
		$classes: ['place-name'],
		$content: 'Foo',
	}
}

const NPC_01 = {
	$type: 'span',
	$classes: ['person', 'npc', 'boss'],
	$content: 'John Smith',
}

const MSG_01 = {
	$v: 1,
	$type: 'p',
	$content: 'You are in {{place}}. You meet {{npc}}.{{br}}He gives you a {{item}}.{{hr}}',
	place: PLACE_01,
	npc: NPC_01,
	item: WEAPON_01,
}

const MSG_02 = {
	$v: 1,
	$type: 'ol',
	1: WEAPON_01,
	2: PLACE_01,
	3: NPC_01
}

const msg = MSG_02

console.log('\n' + walk(msg, callbacks_render_ascii))
//console.log('\n' + walk(msg, callbacks_render_html))
//console.log('\n' + walk(msg, callbacks_debug))


// TODO uuid

// TODO links

// TODO micro-format clickables?

// TODO list

// TODO text