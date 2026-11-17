
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Jogador
const jogador = {
    x: 375,
    y: 200,
    largura: 40,
    altura: 40,
    velocidade: 4
};

// Teclas pressionadas
const teclas = {};

// Detectar quando uma tecla é pressionada
document.addEventListener("keydown", function(event) {
    teclas[event.key.toLowerCase()] = true;
});

// Detectar quando uma tecla é solta
document.addEventListener("keyup", function(event) {
    teclas[event.key.toLowerCase()] = false;
});

// Movimentar jogador
function movimentar() {
    if (teclas["arrowup"] || teclas["w"]) {
        jogador.y -= jogador.velocidade;
    }

    if (teclas["arrowdown"] || teclas["s"]) {
        jogador.y += jogador.velocidade;
    }

    if (teclas["arrowleft"] || teclas["a"]) {
        jogador.x -= jogador.velocidade;
    }

    if (teclas["arrowright"] || teclas["d"]) {
        jogador.x += jogador.velocidade;
    }

    // Impedir que o jogador saia do cenário
    if (jogador.x < 0) jogador.x = 0;
    if (jogador.y < 0) jogador.y = 0;

    if (jogador.x + jogador.largura > canvas.width) {
        jogador.x = canvas.width - jogador.largura;
    }

    if (jogador.y + jogador.altura > canvas.height) {
        jogador.y = canvas.height - jogador.altura;
    }
}

// Desenhar jogo
function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    movimentar();

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
