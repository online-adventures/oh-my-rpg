import { InventorySlot } from '@oh-my-rpg/definitions';
import { InventoryCoordinates } from '@oh-my-rpg/state-inventory';
import { State, Adventure } from './types';
declare function factory(): State;
declare function play(state: State, explicit_adventure_archetype_hid?: string): State;
declare function equip_item(state: State, coordinates: InventoryCoordinates): State;
declare function unequip_item(state: State, slot: InventorySlot): State;
declare function sell_item(state: State, coordinates: InventoryCoordinates): State;
export { Adventure, State, factory, play, equip_item, unequip_item, sell_item };