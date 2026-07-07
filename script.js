// Pegando os elementos da tela
const btnAbrir = document.getElementById('btn-abrir');
const saldoElement = document.getElementById('saldo');
const gridCartas = document.querySelector('.grid-cartas');

// A nova URL mágica da sua API do Google
const API_URL = "https://script.google.com/macros/s/AKfycbztrIJhJr3qmCncHGzrKZ5C-8a0JdB9yXBoQmVDyDAo4VQhQ6105B2CmuIWg0cJFKI/exec";

// Banco de dados temporário do usuário logado
const nomeUsuario = "teste"; 
let moedas = 50; 
const custoPacote = 10;

// A lista começa vazia. A planilha vai preencher isso!
let cartasDisponiveis = []; 

// Atualiza o saldo inicial na tela
saldoElement.innerText = moedas;

// Busca as cartas lá na planilha ao carregar a página
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
    .catch(erro => {
        console.error("Erro ao carregar coleção:", erro);
        btnAbrir.innerText = "Erro ao carregar";
    });
}

// Chama a função assim que o JS carregar
carregarColecao();

// Lógica de clicar e abrir o pacote
btnAbrir.addEventListener('click', () => {
    // Checa se tem moedas e se as cartas já terminaram de carregar
    if (moedas >= custoPacote && cartasDisponiveis.length > 0) {
        
        // Atualização Otimista: Desconta e atualiza a tela na hora
        moedas -= custoPacote;
        saldoElement.innerText = moedas;
        
        btnAbrir.innerText = "⏳ Sorteando...";
        btnAbrir.style.backgroundColor = "#888";
        btnAbrir.disabled = true;

        // Sorteia um objeto inteiro da carta da lista baixada da planilha
        const cartaSorteada = cartasDisponiveis[Math.floor(Math.random() * cartasDisponiveis.length)];
        
        // Cria o visual da nova carta na tela
        const novaCarta = document.createElement('div');
        novaCarta.className = 'carta';
        novaCarta.style.fontSize = '1rem'; 
        novaCarta.style.textAlign = 'center';
        novaCarta.style.fontWeight = 'bold';
        novaCarta.style.border = '2px solid #ffd700'; 
        
        // Pega o NOME de dentro do objeto da carta
        novaCarta.innerText = cartaSorteada.nome; 

        // Remove o espaço vazio se houver e adiciona a nova carta
        const cartaVazia = document.querySelector('.carta.vazia');
        if (cartaVazia) {
            cartaVazia.remove();
        }
        gridCartas.prepend(novaCarta);

        // Prepara os dados para salvar na planilha (Aba Inventario)
        const pacoteDeDados = {
            acao: "salvar_carta",
            usuario: nomeUsuario,
            carta: cartaSorteada.nome 
        };

        // Envia para a planilha em segundo plano
        fetch(API_URL, {
            method: 'POST',
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(pacoteDeDados)
        })
        .then(res => console.log("Salvo no inventário com sucesso."))
        .catch(erro => console.error("Erro ao salvar no inventário:", erro));

        // Volta o botão ao normal depois de meio segundo
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