"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const random_1 = require("@offirmo/random");
const definitions_1 = require("@oh-my-rpg/definitions");
const data_1 = require("./data");
exports.i18n_messages = data_1.i18n_messages;
exports.static_armor_data = data_1.ENTRIES;
const types_1 = require("./types");
exports.ArmorPartType = types_1.ArmorPartType;
const constants_1 = require("./constants");
const ARMOR_BASES = data_1.ENTRIES.filter((armor_component) => armor_component.type === types_1.ArmorPartType.base);
const ARMOR_QUALIFIERS1 = data_1.ENTRIES.filter((armor_component) => armor_component.type === types_1.ArmorPartType.qualifier1);
const ARMOR_QUALIFIERS2 = data_1.ENTRIES.filter((armor_component) => armor_component.type === types_1.ArmorPartType.qualifier2);
const MAX_ENHANCEMENT_LEVEL = 8;
exports.MAX_ENHANCEMENT_LEVEL = MAX_ENHANCEMENT_LEVEL;
const MIN_STRENGTH = 1;
exports.MIN_STRENGTH = MIN_STRENGTH;
const MAX_STRENGTH = 20;
exports.MAX_STRENGTH = MAX_STRENGTH;
/////////////////////
function pick_random_quality(rng) {
    // TODO make high qualities rarer
    return random_1.Random.pick(rng, [
        definitions_1.ItemQuality.common,
        definitions_1.ItemQuality.uncommon,
        definitions_1.ItemQuality.rare,
        definitions_1.ItemQuality.epic,
        definitions_1.ItemQuality.legendary,
        definitions_1.ItemQuality.artifact,
    ]);
}
function pick_random_base(rng) {
    return random_1.Random.pick(rng, ARMOR_BASES).hid;
}
function pick_random_qualifier1(rng) {
    return random_1.Random.pick(rng, ARMOR_QUALIFIERS1).hid;
}
function pick_random_qualifier2(rng) {
    return random_1.Random.pick(rng, ARMOR_QUALIFIERS2).hid;
}
const pick_random_base_strength = random_1.Random.integer(MIN_STRENGTH, MAX_STRENGTH);
/////////////////////
function factory(rng, hints = {}) {
    // TODO add a check for hints to be in existing components
    return {
        slot: definitions_1.InventorySlot.armor,
        base_hid: hints.base_hid || pick_random_base(rng),
        qualifier1_hid: hints.qualifier1_hid || pick_random_qualifier1(rng),
        qualifier2_hid: hints.qualifier2_hid || pick_random_qualifier2(rng),
        quality: hints.quality || pick_random_quality(rng),
        base_strength: hints.base_strength || pick_random_base_strength(rng),
        enhancement_level: hints.enhancement_level || 0,
    };
}
exports.factory = factory;
/////////////////////
// for demo purpose, all characteristics having the same probability + also random enhancement level
function generate_random_demo_armor() {
    const rng = random_1.Random.engines.mt19937().autoSeed();
    return factory(rng, {
        enhancement_level: random_1.Random.integer(0, MAX_ENHANCEMENT_LEVEL)(rng)
    });
}
exports.generate_random_demo_armor = generate_random_demo_armor;
/////////////////////
function enhance(armor) {
    if (armor.enhancement_level >= MAX_ENHANCEMENT_LEVEL)
        throw new Error(`can't enhance an armor above the maximal enhancement level!`);
    armor.enhancement_level++;
    return armor;
}
exports.enhance = enhance;
function get_damage_reduction_interval(armor) {
    const ATTACK_VS_DEFENSE_RATIO = 0.5;
    return constants_1.get_interval(armor.base_strength, armor.quality, armor.enhancement_level, ATTACK_VS_DEFENSE_RATIO);
}
exports.get_damage_reduction_interval = get_damage_reduction_interval;
function get_medium_damage_reduction(armor) {
    const reduction_range = get_damage_reduction_interval(armor);
    return Math.round((reduction_range[0] + reduction_range[1]) / 2);
}
exports.get_medium_damage_reduction = get_medium_damage_reduction;
/////////////////////
//# sourceMappingURL=index.js.map