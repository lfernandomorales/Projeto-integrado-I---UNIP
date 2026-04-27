const express = require("express");
const cors = require("cors");
const db = require("./db");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;
const sessions = {};

/*app.get("/", (req, res) => {
    res.send("API funcionando");
})*/

app.post("/register", async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        const hash = await bcrypt.hash(senha, SALT_ROUNDS);

        db.run(
            "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
            [nome, email, hash],
            function(err) {
                if (err) {
                    return res.status(400).send("Usuário já existe");
                }
                res.send({ id: this.lastID });
            }
        );
    } catch (err) {
        res.status(500).send("Erro ao registrar");
    }
});


app.post("/login", (req, res) => {
    const { nome, senha } = req.body;

    db.get(
        "SELECT * FROM usuarios WHERE nome = ?",
        [nome],
        async (err, user) => {
            if (err || !user) {
                return res.status(401).send("Login inválido");
            }

            const senhaValida = await bcrypt.compare(senha, user.senha);

            if (!senhaValida) {
                return res.status(401).send("Login inválido");
            }

            const token = crypto.randomBytes(16).toString("hex");
            sessions[token] = user;

            res.json({ token });
        }
    );
});

app.post("/logout", (req, res) => {
    const token = req.headers.authorization;

    delete sessions[token];

    res.send("Logout realizado");
});

function authMiddleware(req, res, next) {
    const token = req.headers.authorization;

    if (!token || !sessions[token]) {
        return res.status(401).send("Não autorizado");
    }

    req.user = sessions[token];
    next();
}

app.post("/descarte", authMiddleware, (req, res) => {
    const { tipo, quantidade } = req.body;
    const usuario = req.user.nome;

    const query = `
        INSERT INTO descartes (usuario, tipo, quantidade)
        VALUES (?, ?, ?)
    `;

    db.run(query, [usuario, tipo, quantidade], function(err) {
        if (err) {
            return res.status(500).send(err);
        }
        res.send({ id: this.lastID });
    });
});

app.get("/ranking", (req, res) => {
    const query = `
        SELECT usuario, SUM(quantidade) as total
        FROM descartes
        GROUP BY usuario
        ORDER BY total DESC
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});