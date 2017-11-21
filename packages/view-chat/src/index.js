"use strict";

// TODO remove prettify_json dependency
const { PromiseWithProgress, prettify_json } = require('./libs')
const { prettify_params_for_debug } = require('./utils')

const LIB = '@oh-my-rpg/view-chat'

function create({DEBUG, gen_next_step, ui, inter_msg_delay_ms = 700}) {
	if (DEBUG) console.log('↘ create()')

	function create_dummy_progress_promise({DURATION_MS = 2000, PERIOD_MS = 100} = {}) {
		return new PromiseWithProgress((resolve, reject, progress) => {
			let count = 0
			const auto_pulse = setInterval(() => {
				count++
				const completion_rate = 1. * (count * PERIOD_MS) / DURATION_MS
				progress(completion_rate)

				if (completion_rate >= 1) {
					clearInterval(auto_pulse)
					resolve()
				}
			}, PERIOD_MS)
		})
	}

	function normalize_step(step) {
		try {
			if (step.type === 'ask_for_confirmation' && step !== STEP_CONFIRM)
				step = Object.assign(
					{},
					STEP_CONFIRM,
					step,
				)

			if (!step.msg_main)
				throw new Error(`${LIB}: Step is missing main message!`)

			if (!step.type) {
				if (!step.choices)
					throw new Error(`${LIB}: Step type is unknown and not inferrable!`)

				step.type = 'ask_for_choice'
			}

			step = Object.assign(
				{
					validator: null,
					choices: [],
				},
				step,
			)

			step.choices = step.choices.map(normalize_choice)

			if (step.choices.length) {
				const known_values = new Set()
				step.choices.forEach((choice, index) => {
					if (known_values.has(choice.value)) {
						const err = new Error(`${LIB}: colliding choices with the same value!`)
						err.details = {
							choice,
							value: choice.value,
							index,
						}
						throw err
					}
					known_values.add(choice.value)
				})
			}


			return step
		}
		catch (e) {
			console.error(prettify_json(step))
			throw e
		}
	}

	function normalize_choice(choice) {
		// TODO auto-id
		try {
			if (!choice.hasOwnProperty('value') || typeof choice.value === 'undefined')
				throw new Error('Choice has no value!')
			choice.msg_cta = choice.msg_cta || String(choice.value)
			return choice
		}
		catch (e) {
			console.error(prettify_json(choice))
			throw e
		}
	}

	async function ask_user(step) {
		if (DEBUG) console.log(`↘ ask_user(\n${prettify_params_for_debug(step)}\n)`)

		let answer = ''
		let ok = true // TODO used for confirmation
		do {
			await ui.display_message({msg: step.msg_main, choices: step.choices})
			answer = await ui.read_answer(step)
			if (DEBUG) console.log(`↖ ask_user(…) answer = "${answer}"`)
		} while (!ok)

		let acknowledged = false
		if (step.choices.length) {
			const selected_choice = step.choices.find(choice => choice.value === answer)
			if (selected_choice.msgg_acknowledge) {
				await ui.pretend_to_think(inter_msg_delay_ms)
				await ui.display_message({msg: selected_choice.msgg_acknowledge(answer)})
				acknowledged = true
			}
		}
		if (!acknowledged && step.msgg_acknowledge) {
			await ui.pretend_to_think(inter_msg_delay_ms)
			await ui.display_message({msg: step.msgg_acknowledge(answer)})
			acknowledged = true
		}
		if (!acknowledged) {
			// Fine! It's optional.
			if (DEBUG) console.warn('You may want to add an acknowledge message to this step.')
		}

		return answer
	}

	async function execute_step(step) {
		if (DEBUG) console.log(`↘ execute_step(\n${prettify_params_for_debug(step)}\n)`)

		switch (step.type) {
			case 'simple_message':
				await ui.pretend_to_think(inter_msg_delay_ms)
				await ui.display_message({ msg: step.msg_main })
				break

			case 'progress':
				await ui.display_progress({
						progress_promise: step.progress_promise || create_dummy_progress_promise({
							DURATION_MS: step.duration_ms
						}),
						msg: step.msg_main,
						msgg_acknowledge: step.msgg_acknowledge
					})
					.then(() => true, () => false)
					.then(success => {
						if (step.callback)
							step.callback(success)
					})
				break

			case 'ask_for_confirmation':
			case 'ask_for_string':
			case 'ask_for_choice': {
				await ui.pretend_to_think(inter_msg_delay_ms)
				const answer = await ask_user(step)

				let reported = false
				if (step.choices.length) {
					const selected_choice = step.choices.find(choice => choice.value === answer)
					if (selected_choice.callback) {
						await selected_choice.callback(answer)
						reported = true
					}
				}
				if (!reported && step.callback) {
					await step.callback(answer)
					reported = true
				}
				if (!reported) {
					const err = new Error('CNF reporting callback in ask for result!')
					err.step = step
					throw err
				}

				break
			}
			default:
				throw new Error(`Unsupported step type: "${step.type}"!`)
		}
	}

	async function start() {
		if (DEBUG) console.log('↘ start()')
		try {
			await ui.setup()
			let should_exit = false
			let last_step = undefined
			let last_answer = undefined
			do {
				const {value: raw_step, done} = await ui.spin_until_resolution(gen_next_step.next({last_step, last_answer}))
				if (done) {
					should_exit = true
					continue
				}

				const step = normalize_step(raw_step)
				await execute_step(step)
			} while(!should_exit)
			await ui.teardown()
		}
		catch (e) {
			await ui.teardown()
			throw e
		}
	}

	return {
		start,
	}
}



module.exports = {
	PromiseWithProgress,
	create,
}
