//const API_URL = "http://localhost:3000";

function checkAuth() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Você precisa estar logado!");
        window.location.href = "login.html";
    }
}

checkAuth();


function adicionarLinha() {
    const tbody = document.getElementById("tbody");

    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td>
            <select onchange="atualizarTotal()">
                <option value="papel">Papel</option>
                <option value="metal">Metal</option>
                <option value="plastico">Plástico</option>
                <option value="pilhas">Pilhas</option>
                <option value="outros">Outros</option>
            </select>
        </td>
        <td>
            <input type="number" value="0" min="0" onchange="atualizarTotal()">
        </td>
        <td>
            <button onclick="removerLinha(this)">Remover</button>
        </td>
    `;

    tbody.appendChild(tr);
}

function removerLinha(btn) {
    btn.parentElement.parentElement.remove();
    atualizarTotal();
}

function atualizarTotal() {
    const inputs = document.querySelectorAll("#tbody input");
    let total = 0;

    inputs.forEach(input => {
        total += parseInt(input.value) || 0;
    });

    document.getElementById("total").innerText = total;
}

async function registrarDescarte() {
    const token = localStorage.getItem("token");
    const total = document.getElementById("total").innerText;

    const res = await fetch("http://localhost:3000/descarte", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({
            tipo: "multiplo",
            quantidade: total
        })
    });

    if (!res.ok) {
        alert("Erro ao registrar");
        return;
    }

    alert("Descarte registrado!");
}

// inicia com uma linha
adicionarLinha();