import { CharacterAttribute, CharacterClass, CharacterAttributes, State } from './types';
import { SoftExecutionContext } from './sec';
declare const CHARACTER_STATS: ("agility" | "health" | "level" | "luck" | "mana" | "strength" | "charisma" | "wisdom")[];
declare const CHARACTER_STATS_SORTED: CharacterAttribute[];
declare const CHARACTER_CLASSES: ("novice" | "warrior" | "barbarian" | "paladin" | "sculptor" | "pirate" | "ninja" | "rogue" | "wizard" | "hunter" | "druid" | "priest")[];
declare function create(SEC: SoftExecutionContext): State;
declare function rename(SEC: SoftExecutionContext, state: State, new_name: string): State;
declare function switch_class(SEC: SoftExecutionContext, state: State, klass: CharacterClass): State;
declare function increase_stat(SEC: SoftExecutionContext, state: State, stat: CharacterAttribute, amount?: number): State;
declare function instantiate_lib(SEC: SoftExecutionContext): void;
declare const DEMO_STATE: State;
declare const OLDEST_LEGACY_STATE_FOR_TESTS: any;
declare const MIGRATION_HINTS_FOR_TESTS: any;
export { CharacterAttribute, CharacterClass, CharacterAttributes, State, CHARACTER_STATS, CHARACTER_STATS_SORTED, CHARACTER_CLASSES, create, rename, switch_class, increase_stat, instantiate_lib, DEMO_STATE, OLDEST_LEGACY_STATE_FOR_TESTS, MIGRATION_HINTS_FOR_TESTS };
