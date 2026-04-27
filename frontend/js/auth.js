const API_URL = "http://localhost:3000";

function renderNavbar() {
    const navbar = document.getElementById("navbar");
    const token = localStorage.getItem("token");
    const nome = localStorage.getItem("nome");

    if (!token) {
        navbar.innerHTML = `
            <nav>
                <a href="./index.html">iRecycle</a>
                <button onclick="goToLogin()">Login</button>
            </nav>
        `;
    } else {
        navbar.innerHTML = `
            <nav>
                <div>
                <a href="./index.html">iRecycle</a>
                </div>
                <div>
                    <span>Olá, ${nome}</span>
                    <button onclick="goToDescarte()">Registrar Descarte</button>
                    <button onclick="logout()">Sair</button>
                </div>
            </nav>
        `;
    }
}

function goToLogin() {
    window.location.href = "login.html";
}

function goToDescarte() {
    window.location.href = "descarte.html";
}

async function logout() {
    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: { "Authorization": token }
    });

    localStorage.clear();
    window.location.href = "index.html";
}

async function login() {
    const nome = document.getElementById("nome").value;
    const senha = document.getElementById("senha").value;

    const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ nome, senha })
    });

    if (!res.ok) {
        alert("Login inválido");
        return;
    }

    const data = await res.json();

    localStorage.setItem("token", data.token);
    localStorage.setItem("nome", nome);

    window.location.href = "index.html";
}

async function register() {
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ nome,email, senha })
    });

    alert("Usuário cadastrado!");
    //Precisa fazer validações dos campos e verificar se o usuário não existe
}
