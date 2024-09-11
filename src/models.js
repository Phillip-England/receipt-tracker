

export class ReceiptUpload {

    constructor(name, reason) {
        this.name = name
        this.reason = reason
    }
    
    static createTable(db) {
        let query = db.query(`CREATE TABLE IF NOT EXISTS receipt_upload (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(255),
            reason VARCHAR(255)
        )`)
        query.run()
    }

    static insert(db) {
        return db.prepare(`INSERT INTO receipt_upload (name, reason) VALUES ($name, $reason)`)
    }

    static selectAll(db) {
        return db.prepare(`SELECT * FROM receipt_upload`)
    }



}



export class PhotoPath {
    
    constructor(file) {
        this.file = file
        this.ext = "." + file.name.split('.')[1]
    }

    static createTable(db) {
        let query = db.query(`CREATE TABLE IF NOT EXISTS photo_path (
            iid INTEGER PRIMARY KEY AUTOINCREMENT,
            receipt_id INT REFERENCES receipt_upload(id),
            path VARCHAR(255)
        )`)
        query.run()
    }  

    static insert(db) {
        return db.prepare(`INSERT INTO photo_path (receipt_id, path) VALUES ($receipt_id, $path)`)
    }

    static selectAllByReceiptUpload(db) {
        return db.prepare(`SELECT * FROM photo_path WHERE receipt_id = $receipt_id`)
    }
    

}