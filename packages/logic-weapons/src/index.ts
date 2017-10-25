/////////////////////

import { Random, Engine } from '@offirmo/random'
import { ItemQuality, InventorySlot } from '@oh-my-rpg/definitions'

import * as static_weapon_data from '@oh-my-rpg/data/src/weapon_component'

import {
	WeaponPartType,
	Weapon,
} from './types'

import { get_interval } from './constants'

const WEAPON_BASES: {type: 'base', hid: string}[] =
	static_weapon_data.filter((weapon_component: any) => weapon_component.type === WeaponPartType.base)
const WEAPON_QUALIFIERS1: {type: 'qualifier1', hid: string}[] =
	static_weapon_data.filter((weapon_component: any) => weapon_component.type === WeaponPartType.qualifier1)
const WEAPON_QUALIFIERS2: {type: 'qualifier2', hid: string}[] =
	static_weapon_data.filter((weapon_component: any) => weapon_component.type === WeaponPartType.qualifier2)

const MIN_ENHANCEMENT_LEVEL = 0
const MAX_ENHANCEMENT_LEVEL = 8
const MIN_STRENGTH = 1
const MAX_STRENGTH = 20

/////////////////////

function pick_random_quality(rng: Engine): ItemQuality {
	// legendary =    1/1000
	// epic:     =   10/1000
	// rare:     =  200/1000
	// uncommon  =  389/1000
	// common    =  400/1000
	return Random.bool(400, 1000)(rng)
		? ItemQuality.common
		: Random.bool(389, 600)(rng)
			? ItemQuality.uncommon
			: Random.bool(200, 211)(rng)
				? ItemQuality.rare
				: Random.bool(10, 11)(rng)
					? ItemQuality.epic
					: ItemQuality.legendary
}
function pick_random_base(rng: Engine): string {
	return Random.pick(rng, WEAPON_BASES).hid
}
function pick_random_qualifier1(rng: Engine): string {
	return Random.pick(rng, WEAPON_QUALIFIERS1).hid
}
function pick_random_qualifier2(rng: Engine): string {
	return Random.pick(rng, WEAPON_QUALIFIERS2).hid
}
const pick_random_base_strength = Random.integer(MIN_STRENGTH, MAX_STRENGTH)

/////////////////////

function factory(rng: Engine, hints: Partial<Weapon> = {}): Weapon {
	// TODO add a check for hints to be in existing components
	return {
		slot: InventorySlot.weapon,
		base_hid: hints.base_hid || pick_random_base(rng),
		qualifier1_hid: hints.qualifier1_hid || pick_random_qualifier1(rng),
		qualifier2_hid: hints.qualifier2_hid || pick_random_qualifier2(rng),
		quality: hints.quality || pick_random_quality(rng),
		base_strength: hints.base_strength || pick_random_base_strength(rng),
		enhancement_level: hints.enhancement_level || 0,
	}
}

/////////////////////

// for demo purpose, all attributes having the same probability + also random enhancement level
function generate_random_demo_weapon(): Weapon {
	const rng: Engine = Random.engines.mt19937().autoSeed()
	return factory(rng, {
		enhancement_level: Random.integer(0, MAX_ENHANCEMENT_LEVEL)(rng)
	})
}

/////////////////////

function enhance(weapon: Weapon): Weapon {
	if (weapon.enhancement_level >= MAX_ENHANCEMENT_LEVEL)
		throw new Error(`can't enhance a weapon above the maximal enhancement level!`)

	weapon.enhancement_level++
	return weapon
}

///////

function get_damage_interval(weapon: Weapon): [number, number] {
	return get_interval(
		weapon.base_strength,
		weapon.quality,
		weapon.enhancement_level
	)
}

function get_medium_damage(weapon: Weapon): number {
	const damage_range = get_damage_interval(weapon)
	return Math.round((damage_range[0] + damage_range[1]) / 2)
}

/////////////////////

const DEMO_WEAPON_1: Weapon = {
	slot: InventorySlot.weapon,
	base_hid: WEAPON_BASES[0].hid,
	qualifier1_hid: WEAPON_QUALIFIERS1[0].hid,
	qualifier2_hid: WEAPON_QUALIFIERS2[0].hid,
	quality: ItemQuality.uncommon,
	base_strength: MIN_STRENGTH + 1,
	enhancement_level: MIN_ENHANCEMENT_LEVEL,
}

const DEMO_WEAPON_2: Weapon = {
	slot: InventorySlot.weapon,
	base_hid: WEAPON_BASES[1].hid,
	qualifier1_hid: WEAPON_QUALIFIERS1[1].hid,
	qualifier2_hid: WEAPON_QUALIFIERS2[1].hid,
	quality: ItemQuality.legendary,
	base_strength: MAX_STRENGTH - 1,
	enhancement_level: MAX_ENHANCEMENT_LEVEL,
}

/////////////////////

export {
	WeaponPartType,
	Weapon,
	MIN_ENHANCEMENT_LEVEL,
	MAX_ENHANCEMENT_LEVEL,
	MIN_STRENGTH,
	MAX_STRENGTH,
	factory,
	generate_random_demo_weapon,
	enhance,
	get_damage_interval,
	get_medium_damage,

	DEMO_WEAPON_1,
	DEMO_WEAPON_2,
}

/////////////////////
