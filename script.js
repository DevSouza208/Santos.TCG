// Pegando os elementos que criamos no HTML
const btnAbrir = document.getElementById('btn-abrir');
const saldoElement = document.getElementById('saldo');

// Nosso "banco de dados" temporário
let moedas = 50; 
const custoPacote = 10;

// Atualiza o valor na tela logo que a página carrega
saldoElement.innerText = moedas;

// Adiciona a ação de clique no botão
btnAbrir.addEventListener('click', () => {
    // Verifica se o jovem tem moedas suficientes
    if (moedas >= custoPacote) {
        moedas -= custoPacote;
        saldoElement.innerText = moedas; // Atualiza a tela instantaneamente (Atualização Otimista!)
        
        // Aqui no futuro vai entrar o código que busca no Google Planilhas
        alert('📦 Pacote aberto com sucesso! (-10 moedas)');
    } else {
        alert('❌ Moedas insuficientes! Cumpra suas metas para ganhar mais.');
    }
});