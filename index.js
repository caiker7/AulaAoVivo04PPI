import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";

const server = express();
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(express.static("public"));

server.use(session({
    secret: "MinhaChave123",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 15 }
}));

function verificarLogin(req, res, next) {
    if (req.session.usuarioLogado) {
        next();
    } else {
        res.redirect("/login");
    }
}

let listaProdutos = [];

server.get("/", verificarLogin, (req, res) => {
    let html = `
    <html>
    <head>
        <meta charset="UTF-8">
        <link rel="stylesheet" 
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
        <title>Sistema</title>
    </head>

    <body class="container mt-4">

        <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
            <div class="container-fluid">
                <a class="navbar-brand" href="/">Sistema</a>

                <div class="collapse navbar-collapse">
                    <ul class="navbar-nav me-auto">
                        <li class="nav-item"><a class="nav-link" href="/cadProduto">Cadastrar Produto</a></li>
                        <li class="nav-item"><a class="nav-link" href="/cadUsuario">Cadastrar Usuário</a></li>
                    </ul>
                    <a class="btn btn-outline-light" href="/logout">Sair</a>
                </div>
            </div>
        </nav>

        <h2>Produtos Cadastrados</h2>
        <table class="table table-bordered table-striped mt-3">
            <thead class="table-dark">
                <tr>
                    <th>Nome</th>
                    <th>Preço</th>
                    <th>Quantidade</th>
                </tr>
            </thead>
            <tbody>
    `;

    for (let prod of listaProdutos) {
        html += `
        <tr>
            <td>${prod.nome}</td>
            <td>R$ ${prod.preco}</td>
            <td>${prod.quantidade}</td>
        </tr>`;
    }

    html += `
            </tbody>
        </table>
    </body>
    </html>
    `;

    res.send(html);
});

server.get("/login", (req, res) => {
    let msg = req.query.erro ? 
        `<div class="alert alert-danger">Usuário ou senha incorretos!</div>` 
        : ``;

    res.send(`
    <html>
    <head>
        <meta charset="UTF-8">
        <link rel="stylesheet" 
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
        <title>Login</title>
    </head>
    <body class="container mt-5" style="max-width: 500px;">

        <h3>Login</h3>
        ${msg}

        <form method="POST" action="/login">
            <div class="mb-3">
                <label class="form-label">Usuário:</label>
                <input name="usuario" class="form-control">
            </div>

            <div class="mb-3">
                <label class="form-label">Senha:</label>
                <input type="password" name="senha" class="form-control">
            </div>

            <button class="btn btn-dark">Entrar</button>
        </form>
    </body>
    </html>
    `);
});

server.post("/login", (req, res) => {
    let usuario = req.body.usuario;
    let senha = req.body.senha;

    if (usuario === "admin" && senha === "admin") {
        req.session.usuarioLogado = true;
        res.redirect("/");
    } else {
        res.redirect("/login?erro=1");
    }
});

server.get("/cadProduto", verificarLogin, (req, res) => {
    res.send(`
    <html>
    <head>
        <meta charset="UTF-8">
        <link rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
        <title>Cadastrar Produto</title>
    </head>
    <body class="container mt-4">

        <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
            <div class="container-fluid">
                <a class="navbar-brand" href="/">Sistema</a>
                <div class="collapse navbar-collapse">
                    <ul class="navbar-nav me-auto">
                        <li class="nav-item"><a class="nav-link" href="/cadProduto">Cadastrar Produto</a></li>
                        <li class="nav-item"><a class="nav-link" href="/cadUsuario">Cadastrar Usuário</a></li>
                    </ul>
                    <a class="btn btn-outline-light" href="/logout">Sair</a>
                </div>
            </div>
        </nav>

        <h3>Cadastrar Produto</h3>

        <form method="POST" action="/cadProduto">
            <div class="mb-3">
                <label class="form-label">Nome do Produto</label>
                <input name="nome" class="form-control" required>
            </div>

            <div class="mb-3">
                <label class="form-label">Preço</label>
                <input name="preco" type="number" step="0.01" class="form-control" required>
            </div>

            <div class="mb-3">
                <label class="form-label">Quantidade</label>
                <input name="quantidade" type="number" class="form-control" required>
            </div>

            <button class="btn btn-primary">Cadastrar</button>
        </form>

    </body>
    </html>
    `);
});

server.post("/cadProduto", verificarLogin, (req, res) => {
    let nome = req.body.nome;
    let preco = req.body.preco;
    let quantidade = req.body.quantidade;

    if (!nome || !preco || !quantidade) {
        return res.send("Erro: Todos os campos são obrigatórios.");
    }

    listaProdutos.push({ nome, preco, quantidade });

    res.redirect("/");
});

server.get("/cadUsuario", verificarLogin, (req, res) => {
    res.send(`
    <html>
    <head>
        <meta charset="UTF-8">
        <link rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
        <title>cad usuario</title>
    </head>
    <body class="container mt-4">

        <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
            <div class="container-fluid">
                <a class="navbar-brand" href="/">Sistema</a>
                <div class="collapse navbar-collapse">
                    <ul class="navbar-nav me-auto">
                        <li class="nav-item"><a class="nav-link" href="/cadProduto">Cadastrar Produto</a></li>
                        <li class="nav-item"><a class="nav-link" href="/cadUsuario">Cadastrar Usuário</a></li>
                    </ul>
                    <a class="btn btn-outline-light" href="/logout">Sair</a>
                </div>
            </div>
        </nav>

        <h3>Cadastrar Usuário</h3>

        <form method="POST" action="/cadUsuario">
            <div class="mb-3">
                <input name="user" class="form-control" placeholder="usuario">
            </div>

            <div class="mb-3">
                <input type="password" name="senha" class="form-control" placeholder="senha">
            </div>

            <button class="btn btn-primary">salvar</button>
        </form>

    </body>
    </html>
    `);
});

server.post("/cadUsuario", verificarLogin, (req, res) => {
    res.redirect("/");
});

server.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login");
});

server.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));
