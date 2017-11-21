import React from 'react'
import { NavLink } from 'react-router-dom'

import { ROUTES } from "../routes"

function Nav() {
	return (
		<nav>
			<ul className='nav'>
				<li>
					<NavLink exact activeClassName='active' to={ROUTES.home}>Home</NavLink>
				</li>
				<li>
					<NavLink activeClassName='active' to={ROUTES.inventory}>Inventory</NavLink>
				</li>
				<li>
					<NavLink activeClassName='active' to={ROUTES.character}>Character</NavLink>
				</li>
			</ul>
		</nav>
	)
}

export {
	Nav,
}
