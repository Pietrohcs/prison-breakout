
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Jogador
const jogador = {
    x: 375,
    y: 200,
    largura: 40,
    altura: 40
};

// Desenhar o jogo
function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar jogador
    ctx.fillStyle = "blue";
    ctx.fillRect(
        jogador.x,
        jogador.y,
        jogador.largura,
        jogador.altura
    );

    requestAnimationFrame(desenhar);
}

desenhar();
