//const API_URL = "http://localhost:3000";

function buscarMapa() {
    const endereco = document.getElementById("endereco").value;
    document.getElementById("mapa").src =
        `https://www.google.com/maps?q=reciclagem+${encodeURIComponent(endereco)}&output=embed`;
}

async function carregarRanking() {
    const res = await fetch(`${API_URL}/ranking`);
    const dados = await res.json();

    const lista = document.getElementById("ranking");
    lista.innerHTML = "";

    dados.forEach(user => {
        const li = document.createElement("li");
        li.textContent = `${user.usuario}: ${user.total}`;
        lista.appendChild(li);
    });
}


carregarRanking();