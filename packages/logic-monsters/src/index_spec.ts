import { Random, Engine } from '@offirmo/random'

import {
	Monster,
	MonsterRank,
	factory,
	generate_random_demo_monster,
} from '.'

describe('🐀 🐉  monster logic - logic:', function() {

	describe('creation', function() {

		it('should allow creating a random monster', function() {
			const rng: Engine = Random.engines.mt19937().seed(789)
			const monster1 = factory(rng)
			expect(monster1).to.deep.equal({
				name: 'drop bear',
				level: 808,
				rank: MonsterRank.common,
				possible_emoji: '🐨',
			})
			expect((rng as any).getUseCount(), '# rng draws 1').to.equal(2)

			const monster2 = factory(rng)
			expect((rng as any).getUseCount(), '# rng draws 2').to.equal(4)
			expect(monster2).not.to.deep.equal(monster1)
		})

		it('should allow creating a partially predefined monster', function() {
			const rng: Engine = Random.engines.mt19937().seed(123)
			const monster = factory(rng, {
				name: 'crab',
				level: 12,
			})
			expect(monster).to.deep.equal({
				name: 'crab',
				level: 12,
				rank: MonsterRank.common,
				possible_emoji: '🦀',
			})
			expect((rng as any).getUseCount(), '# rng draws').to.equal(1) // less random picks
		})
	})
})
