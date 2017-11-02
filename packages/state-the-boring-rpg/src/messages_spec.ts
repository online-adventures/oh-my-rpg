import { LIB_ID, SCHEMA_VERSION } from './consts'
import { xxx_internal_reset_prng_cache } from '@oh-my-rpg/state-prng'

import * as RichText from '@oh-my-rpg/rich-text-format'


import {
	factory,
	get_recap,
	get_tip,
} from '.'


describe.only('⚔ 👑 😪  The Boring RPG - contextual messages', function() {
	beforeEach(() => xxx_internal_reset_prng_cache())

	describe('get recap', function() {

		context('when the user has just started a new game', function() {

			it('should return an intro', () => {
				const state = factory()
				const doc = get_recap(state)
				const str = RichText.to_text(doc)
				expect(str).to.include('A great saga just started')
			})
		})
	})

	describe('get tip', function() {

		context('when the user has just started a new game', function() {

			it('should suggest to play', () => {
				const state = factory()
				const doc = get_tip(state)
				const str = RichText.to_text(doc!)
				console.log(str)
				expect('' + str).to.include('Tip:')
				expect('' + str).to.include('select play')
			})
		})
	})
})