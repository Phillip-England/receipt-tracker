import { Xerus } from "xerus/Xerus";
import { logger, timeout } from "xerus/XerusMiddleware";
import { Database } from "bun:sqlite"

import { appHome, home, logout } from "./src/handlers";
import { login, uploadReceipt } from "./src/forms";
import { PhotoPath, ReceiptUpload } from "./src/models";

const app = new Xerus()

let db = new Database("main.sqlite", {create: true})
db.exec("PRAGMA journal_mode = WAL;");
ReceiptUpload.createTable(db)
PhotoPath.createTable(db)

app.global('db', db)


app.use('*', timeout, logger)

app.at('GET /', home)
app.at('GET /app', appHome)
app.at('GET /logout', logout)

app.at('POST /form/login', login)
app.at('POST /form/receipt', uploadReceipt)


console.log('running on port 8080')
await app.run(8080)
