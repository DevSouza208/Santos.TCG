// Pegando os elementos da tela
const btnAbrir = document.getElementById('btn-abrir');
const saldoElement = document.getElementById('saldo');
const gridCartas = document.querySelector('.grid-cartas');

// A URL mágica da sua API do Google
const API_URL = "https://script.google.com/macros/s/AKfycbyxG_ix80WMPVcVJWv5EjgGMDqt2r9HEkx1aDga1UH3vmFomr3RjR4VJ8TGR5JpqbNrcQ/exec";

// Banco de dados temporário do usuário logado
const nomeUsuario = "teste"; 
let moedas = 50; 
const custoPacote = 10;

// MVP do Santos TCG
const cartasDisponiveis = [
    "Neymar Jr", "Pelé", "Ganso", "Rodrygo", 
    "Soteldo", "João Paulo", "Gabigol", 
    "Léo Bastos", "Giovanni", "Diego"
];

// Atualiza o saldo inicial na tela
saldoElement.innerText = moedas;

btnAbrir.addEventListener('click', () => {
    // 1. Verifica se tem moeda
    if (moedas >= custoPacote) {
        
        // 2. Atualização Otimista: Desconta e atualiza a tela instantaneamente
        moedas -= custoPacote;
        saldoElement.innerText = moedas;
        
        // Desativa o botão para evitar cliques duplos
        btnAbrir.innerText = "⏳ Sorteando...";
        btnAbrir.style.backgroundColor = "#888";
        btnAbrir.disabled = true;

        // 3. Sorteia a carta
        const cartaSorteada = cartasDisponiveis[Math.floor(Math.random() * cartasDisponiveis.length)];
        
        // 4. Mostra a carta na tela
        const novaCarta = document.createElement('div');
        novaCarta.className = 'carta';
        novaCarta.style.fontSize = '1rem'; 
        novaCarta.style.textAlign = 'center';
        novaCarta.style.fontWeight = 'bold';
        novaCarta.style.border = '2px solid #ffd700'; 
        novaCarta.innerText = cartaSorteada;

        const cartaVazia = document.querySelector('.carta.vazia');
        if (cartaVazia) {
            cartaVazia.remove();
        }
        gridCartas.prepend(novaCarta);

        // 5. Envia o pacote para o Google Planilhas em segundo plano
        const pacoteDeDados = {
            acao: "salvar_carta",
            usuario: nomeUsuario,
            carta: cartaSorteada
        };

        fetch(API_URL, {
            method: 'POST',
            // Usamos text/plain para evitar que o navegador bloqueie a requisição (erro de CORS)
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            },
            body: JSON.stringify(pacoteDeDados)
        })
        .then(resposta => {
            console.log("Sucesso! Carta gravada na planilha.");
        })
        .catch(erro => {
            console.error("Erro na hora de salvar:", erro);
        });

        // 6. Restaura o botão após meio segundo de "cooldown"
        setTimeout(() => {
            btnAbrir.innerText = "Abrir Pacote";
            btnAbrir.style.backgroundColor = "#4CAF50";
            btnAbrir.disabled = false;
        }, 500);

    } else {
        alert('❌ Moedas insuficientes! Cumpra suas metas para ganhar mais.');
    }
});