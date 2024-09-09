

export async function login(c) {
    let data = await c.form()
    let username = data.get('username')
    let password = data.get('password')
    let appUsername = Bun.env.USERNAME
    let appPassword = Bun.env.PASSWORD
    if (username == appUsername && password == appPassword) {
        c.redirect(`/app?token=${Bun.env.URL_SECRET_TOKEN}`)
        return
    }
    c.redirect('/?err=invalid credentials')
}


export async function uploadReceipt(c) {
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
}