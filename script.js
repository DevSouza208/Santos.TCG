// Pegando os elementos da tela
const btnAbrir = document.getElementById('btn-abrir');
const saldoElement = document.getElementById('saldo');
const gridCartas = document.querySelector('.grid-cartas');

// Nosso "banco de dados" temporário
let moedas = 50; 
const custoPacote = 10;

// O MVP de 10 cartas do Santos TCG
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
        
        // 2. Desconta a moeda e atualiza a tela na hora
        moedas -= custoPacote;
        saldoElement.innerText = moedas;
        
        // 3. Efeito visual de carregamento no botão
        btnAbrir.innerText = "⏳ Abrindo...";
        btnAbrir.style.backgroundColor = "#888";
        btnAbrir.disabled = true;

        // 4. Simula o tempo de resposta do Google Planilhas (1 segundo)
        setTimeout(() => {
            // Sorteia um jogador aleatório da nossa lista
            const cartaSorteada = cartasDisponiveis[Math.floor(Math.random() * cartasDisponiveis.length)];
            
            // Cria a carta no HTML via JavaScript
            const novaCarta = document.createElement('div');
            novaCarta.className = 'carta';
            novaCarta.style.fontSize = '1rem'; // Letra menor pra caber o nome
            novaCarta.style.textAlign = 'center';
            novaCarta.style.fontWeight = 'bold';
            novaCarta.style.border = '2px solid #ffd700'; // Borda dourada de carta nova
            novaCarta.innerText = cartaSorteada;

            // Remove a primeira carta "vazia" com interrogação (se houver)
            const cartaVazia = document.querySelector('.carta.vazia');
            if (cartaVazia) {
                cartaVazia.remove();
            }

            // Adiciona a nova carta no topo da lista
            gridCartas.prepend(novaCarta);

            // Volta o botão ao normal
            btnAbrir.innerText = "Abrir Pacote";
            btnAbrir.style.backgroundColor = "#4CAF50";
            btnAbrir.disabled = false;

        }, 1000); // 1000 milissegundos = 1 segundo de suspense

    } else {
        alert('❌ Moedas insuficientes! Cumpra suas metas com o grupo para ganhar mais.');
    }
});