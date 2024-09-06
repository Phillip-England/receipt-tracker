

export async function login(c) {
    let data = await c.form()
    let username = data.get('username')
    let password = data.get('password')
    let appUsername = Bun.env.USERNAME
    let appPassword = Bun.env.PASSWORD
    if (username == appUsername && password == appPassword) {
        c.redirect('/app')
        return
    }
    c.redirect('/?err=invalid credentials')
}