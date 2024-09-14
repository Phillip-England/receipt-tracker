import { Xerus, logger, timeout } from "xerus";

const app = new Xerus();

app.use("*", logger, timeout);

function Layout(props) {
  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{props.title}</title>
      </head>
      <body>{props.children}</body>
    </html>
  );
}

function LoginForm(props) {
  return (
    <form action="/form/login" method="POST">
      <label>username</label>
      <input name="username" type="text" defaultValue="username" />
      <label>password</label>
      <input name="password" type="password" defaultValue="password" />
      <input type="submit" />
    </form>
  );
}

function Nav(props) {
  return (
    <nav>
      <li>
        <a href="/app">Packages</a>
      </li>
      <li>
        <a href="/logout">Logout</a>
      </li>
    </nav>,
  );
}

app.get("/", async (c) => {
  c.jsx(
    <Layout title="Receipt Tracker">
      <LoginForm />
    </Layout>,
  );
});

app.post("/form/login", async (c) => {
  let data = await c.form();
  let username = data.get("username");
  let password = data.get("password");
  if (username == Bun.env.USERNAME && password == Bun.env.PASSWORD) {
    c.redirect("/app");
    return;
  }
  c.redirect("/?loginErr=invalid credentials");
});

app.get("/logout", async (c) => {
  c.redirect("/");
});

app.get("/app", async (c) => {
  c.jsx(
    <Layout title="Receipt Tracker">
      <Nav />
    </Layout>,
  );
});

await app.run(8080);
