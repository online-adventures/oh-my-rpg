"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_string_enums_1 = require("typescript-string-enums");
/////////////////////
const GainType = typescript_string_enums_1.Enum('level', 'health', 'mana', 'strength', 'agility', 'charisma', 'wisdom', 'luck', 'coins', 'tokens', 'weapon', 'armor', 'weapon_improvement', 'armor_improvement');
exports.GainType = GainType;
const VERSION = 8;
exports.VERSION = VERSION;
/////////////////////
//# sourceMappingURL=types.js.map