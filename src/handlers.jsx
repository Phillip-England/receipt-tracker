import { AppHome, Home, Layout } from "./components";



export function home(c) {
    c.jsx(<Home err={c.param('err')} />)
}


export function appHome(c) {
    c.jsx(<AppHome />)
}