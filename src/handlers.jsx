import { AppHome, Home, AppNewReceipts } from "./components";
import { ReceiptUpload, PhotoPath } from "./models";



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

export async function newReceipts(c) {
    let db = c.getGlobal('db')
    let query = ReceiptUpload.selectAll(db)
    let receiptResult = await query.all()
    for (let i = 0; i < receiptResult.length; i++) {
        let receiptUpload = receiptResult[i]
        let photoQuery = PhotoPath.selectAllByReceiptUpload(db)
        let photoResult = await photoQuery.all({
            $receipt_id: receiptUpload.id
        })
        receiptUpload.photo = photoResult
    }
    c.jsx(<AppNewReceipts receipts={receiptResult} />)
}