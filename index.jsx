import { Xerus } from "xerus/Xerus";
import { logger, timeout } from "xerus/XerusMiddleware";
import { Database } from "bun:sqlite"

import { appHome, home } from "./src/handlers";
import { login } from "./src/forms";
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
app.at('GET /logout', async (c) => {
    c.redirect('/')
})

app.at('POST /form/login', login)

app.at('POST /form/receipt', async (c) => {
    let data = await c.form();
    let receiptUpload = new ReceiptUpload(data.get('name'), data.get('reason'));
    let photos = data.getAll('files');

    if (photos[0] == "") {
        c.redirect(`/app?token=${Bun.env.URL_SECRET_TOKEN}&err=no photos provided`);
        return
    }

    let photoPaths = [];

    for (let i = 0; i < photos.length; i++) {
        let photo = photos[i];
        let photoPath = new PhotoPath(photo);
        photoPaths.push(photoPath);
    }

    let db = c.getGlobal('db');

    // Prepare queries
    const insertReceipt = db.prepare(`INSERT INTO receipt_upload (name, reason) VALUES ($name, $reason)`);
    const insertPhoto = db.prepare(`INSERT INTO photo_path (receipt_id, path) VALUES ($receipt_id, $path)`);

    // Start transaction
    const saveTransaction = db.transaction(async () => {
        let receiptResult = insertReceipt.run({
            $name: receiptUpload.name,
            $reason: receiptUpload.reason
        });

        let receiptId = receiptResult.lastInsertRowid; 

        
        // Save each photo path in the db and file on disk
        for (let photoPath of photoPaths) {
            let finalPath = './static/img/uploads/receipts/'+photoPath.file.name+photoPath.ext
            insertPhoto.run({
                $receipt_id: receiptId,
                $path: finalPath
            });
            
            Bun.write(finalPath, photoPath.file)

        }
    });

    try {
        // Execute the transaction
        saveTransaction();
        c.redirect(`/app?token=${Bun.env.URL_SECRET_TOKEN}`);
    } catch (error) {
        // Handle any errors (transaction is automatically rolled back)
        console.error("Transaction failed:", error);
        c.status(500).send("Something went wrong");
    }
})


console.log('running on port 8080')
await app.run(8080)
