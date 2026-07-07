const btnAbrir = document.getElementById('btn-abrir');
const saldoElement = document.getElementById('saldo');
const gridCartas = document.querySelector('.grid-cartas');

// Use O MESMO link que você já tinha gerado antes
const API_URL = "https://script.google.com/macros/s/AKfycbyxG_ix80WMPVcVJWv5EjgGMDqt2r9HEkx1aDga1UH3vmFomr3RjR4VJ8TGR5JpqbNrcQ/exec";

const nomeUsuario = "teste"; 
let moedas = 50; 
const custoPacote = 10;

// Agora a lista começa vazia. A planilha vai preencher isso!
let cartasDisponiveis = []; 

saldoElement.innerText = moedas;

// --- FUNÇÃO NOVA: Busca as cartas lá na planilha ao carregar a página ---
function carregarColecao() {
    btnAbrir.innerText = "Carregando Álbum...";
    btnAbrir.disabled = true;

    fetch(API_URL, {
        method: 'POST',
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ acao: "buscar_colecao" })
    })
    .then(resposta => resposta.json())
    .then(dados => {
        cartasDisponiveis = dados;
        console.log("Cartas baixadas da planilha:", cartasDisponiveis);
        
        btnAbrir.innerText = "Abrir Pacote";
        btnAbrir.disabled = false;
    })
    .catch(erro => console.error("Erro ao carregar coleção:", erro));
}

// Chama a função assim que o JS carregar
carregarColecao();

btnAbrir.addEventListener('click', () => {
    // Agora ele também checa se as cartas já terminaram de carregar da planilha
    if (moedas >= custoPacote && cartasDisponiveis.length > 0) {
        
        moedas -= custoPacote;
        saldoElement.innerText = moedas;
        
        btnAbrir.innerText = "⏳ Sorteando...";
        btnAbrir.style.backgroundColor = "#888";
        btnAbrir.disabled = true;

        // Sorteia um objeto inteiro da carta (agora ela tem nome, descricao, imagem...)
        const cartaSorteada = cartasDisponiveis[Math.floor(Math.random() * cartasDisponiveis.length)];
        
        const novaCarta = document.createElement('div');
        novaCarta.className = 'carta';
        novaCarta.style.fontSize = '1rem'; 
        novaCarta.style.textAlign = 'center';
        novaCarta.style.fontWeight = 'bold';
        novaCarta.style.border = '2px solid #ffd700'; 
        // Pega o NOME de dentro do objeto da carta
        novaCarta.innerText = cartaSorteada.nome; 

        const cartaVazia = document.querySelector('.carta.vazia');
        if (cartaVazia) {
            cartaVazia.remove();
        }
        gridCartas.prepend(novaCarta);

        const pacoteDeDados = {
            acao: "salvar_carta",
            usuario: nomeUsuario,
            // Salva o nome da carta no inventário
            carta: cartaSorteada.nome 
        };

        fetch(API_URL, {
            method: 'POST',
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(pacoteDeDados)
        }).then(res => console.log("Salvo no inventário."));

        setTimeout(() => {
            btnAbrir.innerText = "Abrir Pacote";
            btnAbrir.style.backgroundColor = "#4CAF50";
            btnAbrir.disabled = false;
        }, 500);

    } else if (cartasDisponiveis.length === 0) {
        alert('Ainda estamos carregando o álbum, aguarde um segundo!');
    } else {
        alert('❌ Moedas insuficientes!');
    }
});