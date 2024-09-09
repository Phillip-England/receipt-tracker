import { AppHome, Home, Layout } from "./components";



export function home(c) {
    c.jsx(<Home err={c.param('err')} />)
}


export function appHome(c) {
    let token = c.param('token')
    if (token != Bun.env.URL_SECRET_TOKEN) {
        c.redirect('/')
    }
    c.jsx(<AppHome />)
}


export function logout(c) {
	c.redirect('/')
}