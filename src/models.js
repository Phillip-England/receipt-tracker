

export class ReceiptUpload {

    constructor(name, reason) {
        this.name = name
        this.reason = reason
    }
    
    static createTable(db) {
        let query = db.query(`CREATE TABLE IF NOT EXISTS receipt_upload (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255),
            reason VARCHAR(255)
        )`)
        query.run()
    }   

}







export class PhotoPath {
    
    constructor(file) {
        this.file = file
        this.ext = "." + file.name.split('.')[1]
    }

    static createTable(db) {
        let query = db.query(`CREATE TABLE IF NOT EXISTS photo_path (
            id SERIAL PRIMARY KEY,
            receipt_id INT REFERENCES receipt_upload(id),
            path VARCHAR(255)
        )`)
        query.run()
    }  

}