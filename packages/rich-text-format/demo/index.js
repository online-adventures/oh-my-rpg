#!/bin/sh
':' //# http://sambal.org/?p=1014 ; exec /usr/bin/env node "$0" "$@"
"use strict";

console.log('Hello world!')

const RichText = require('../dist/src.es7.cjs')

const callbacks_debug = require('./to_debug')
const callbacks_ansi = require('./to_ansi')

const WEAPON_01_NAME = {
	$classes: ['item-name', 'item-weapon-name'],
	$content: '{{qualifier2|Capitalize}} {{qualifier1|Capitalize}} {{base|Capitalize}}',
	$sub: {
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
	},
}

const WEAPON_01 = {
	$type: 'span',
	$classes: ['item', 'item-weapon', 'item-quality-legendary'],
	$content: '{{weapon_name}} {{enhancement}}',
	$sub: {
		weapon_name: WEAPON_01_NAME,
		enhancement: {
			$type: 'span',
			$content: '+3',
		},
	},
}

const PLACE_01 = {
	$type: 'span',
	$classes: ['place'],
	$content: 'the country of {{name}}',
	$sub: {
		name: {
			$classes: ['place-name'],
			$content: 'Foo',
		}
	},
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
	$sub: {
		place: PLACE_01,
		npc: NPC_01,
		item: WEAPON_01,
	},
}

const MSG_02 = {
	$v: 1,
	$type: 'ol',
	$sub: {
		1: WEAPON_01,
		2: PLACE_01,
		3: NPC_01
	},
}



////////////////////////////////////
console.log('\n------- 1 -------\n')
const doc1 = MSG_02

console.log('\n------- to text -------\n' + RichText.to_text(doc1))
console.log('\n------- to ansi -------\n' + RichText.walk(doc1, callbacks_ansi))
console.log('\n------- to html -------\n' + RichText.to_html(doc1))
console.log('\n------- to debug -------\n' + RichText.walk(doc1, callbacks_debug))


// TODO actions
// TODO links
// TODO micro-format clickables?

// TODO uuid

// TODO strong / emphasis


////////////////////////////////////

console.log('\n------- 2 -------\n')
const doc2 = RichText.paragraph()
	.pushText(''
		+ 'Great sages prophetized your coming,{{br}}'
		+ 'commoners are waiting for their hero{{br}}'
		+ 'and kings are trembling from fear of change...{{br}}'
		+ '…undoubtly, you’ll make a name in this world and fulfill your destiny!{{br}}'
	)
	.pushStrong('A great saga just started...')
	.done()

console.log('\n------- to text -------\n' + RichText.to_text(doc2))
console.log('\n------- to ansi -------\n' + RichText.walk(doc2, callbacks_ansi))
console.log('\n------- to html -------\n' + RichText.to_html(doc2))