import {StrictMode} from 'react'
import {createBrowserRouter, Navigate, Outlet,  RouteObject, RouterProvider, useLocation} from 'react-router-dom'
import {reportSources2} from 'reportSources'

export const Site = () => (
	<StrictMode>
		<RouterProvider router={router}/>
	</StrictMode>
)

const router = createBrowserRouter([
	{
		element: <TrailingSlashRedirect/>,
		children: [
			{index: true, element: <Home/>},
			...reportSources2.map((source): RouteObject => (
				{path: source.path, children: source.routes}
			)),
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
