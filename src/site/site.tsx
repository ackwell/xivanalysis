import {StrictMode} from 'react'
import {createBrowserRouter, Navigate, Outlet, RouteObject, RouterProvider, useLocation} from 'react-router-dom'
import {reportSources2} from 'reportSources'
import {Text} from 'ui'
import {container, sidebar} from './site.css'

export const Site = () => (
	<StrictMode>
		<RouterProvider router={router}/>
	</StrictMode>
)

const router = createBrowserRouter([
	{
		// TODO: Should this be moved down to the layout? it doesn't impact home anyway
		element: <TrailingSlashRedirect/>,
		children: [
			// TODO: should home use the shared layout too?
			{index: true, element: <Home/>},
			{
				element: <Layout/>,
				children: reportSources2.map((source): RouteObject => (
					{path: source.path, children: source.routes}
				)),
			},
		],
	},
], {
	future: {
		v7_relativeSplatPath: true,
	},
})

function TrailingSlashRedirect() {
	const {pathname} = useLocation()

	// Strip trailing slashes for everything beyond home.
	if (pathname !== '/' && pathname.endsWith('/')) {
		return (
			<Navigate
				to={pathname.substring(0, pathname.length - 1)}
				replace={true}
			/>
		)
	}

	return <Outlet/>
}

function Home() {
	return <>home</>
}

function Layout() {
	return (
		<div className={container}>
			{/* TODO: should sidebar be moved to discrete file? */}
			<aside className={sidebar}>
				<Text>sidebar content</Text>

				{/* for testing */}
				<div style={{width: '2rem', height: 300, background: 'rgba(255, 0, 0, 0.2)'}}/>
			</aside>

			<main>
				<Outlet/>
			</main>
		</div>
	)
}
