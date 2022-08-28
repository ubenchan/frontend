import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, RouteObject, useRoutes } from 'react-router-dom'

import { Modal } from 'ui/Modal'
import { Suite } from 'page/Suite'
import { Landing } from 'page/Landing'
import { NotFound } from 'page/NotFound'
import { UnderConstruction } from 'page/UnderConstruction'

import './App.module.styl'

const routes: RouteObject[] = [
	{ path: '/', element: <Landing /> },
	{ path: '/suite', element: <Suite /> },
	{ path: '/browse', element: <UnderConstruction /> },
	{ path: '*', element: <NotFound /> },
]

function App() {
	return useRoutes(routes)
}

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>

		<Modal.List />
	</StrictMode>,
)
