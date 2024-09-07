

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