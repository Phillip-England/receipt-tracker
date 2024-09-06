import { Xerus } from "xerus/Xerus";
import { logger, timeout } from "xerus/XerusMiddleware";

import { appHome, home } from "./src/handlers";
import { login } from "./src/forms";


const app = new Xerus()

app.use('*', timeout, logger)

app.at('GET /', home)
app.at('GET /app', appHome)
app.at('GET /logout', async (c) => {
    c.redirect('/')
})

app.at('POST /form/login', login)


console.log('running on port 8080')
Bun.serve({
    port: 8080,
    async fetch(req) {
        return await app.handleRequest(req)
    },
});
