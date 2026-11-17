
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


function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    movimentar();

    // Piso de concreto
    ctx.fillStyle = "#777777";
    ctx.fillRect(20, 20, 760, 410);

    // Detalhes do piso
    ctx.strokeStyle = "#696969";
    ctx.lineWidth = 1;

    for (let x = 40; x < 780; x += 80) {
        ctx.beginPath();
        ctx.moveTo(x, 20);
        ctx.lineTo(x, 430);
        ctx.stroke();
    }

    for (let y = 60; y < 430; y += 80) {
        ctx.beginPath();
        ctx.moveTo(20, y);
        ctx.lineTo(780, y);
        ctx.stroke();
    }

    // Cama
    ctx.fillStyle = "#333333";
    ctx.fillRect(55, 65, 130, 65);

    ctx.fillStyle = "#b5b5b5";
    ctx.fillRect(65, 75, 110, 45);

    ctx.fillStyle = "#eeeeee";
    ctx.fillRect(70, 80, 35, 30);

    // Vaso sanitário
    ctx.fillStyle = "#dddddd";
    ctx.fillRect(650, 65, 65, 75);

    ctx.fillStyle = "#888888";
    ctx.fillRect(660, 85, 45, 35);

    // Mesa
    ctx.fillStyle = "#654321";
    ctx.fillRect(600, 330, 110, 55);

    // Paredes externas
    ctx.fillStyle = "#292929";
    ctx.fillRect(0, 0, 800, 20);
    ctx.fillRect(0, 0, 20, 450);
    ctx.fillRect(780, 0, 20, 450);
    ctx.fillRect(0, 430, 800, 20);

    // Entrada da cela
    ctx.fillStyle = "#9b713f";
    ctx.fillRect(350, 20, 100, 15);

    // Grades de ferro
    ctx.fillStyle = "#171717";

    for (let x = 350; x <= 450; x += 10) {
        ctx.fillRect(x, 20, 4, 90);
    }

    // Texto da porta
    ctx.fillStyle = "white";
    ctx.font = "12px Arial";
    ctx.fillText("SAÍDA", 375, 125);

    // Personagem
    ctx.fillStyle = "#2455cc";
    ctx.fillRect(
        jogador.x,
        jogador.y,
        jogador.largura,
        jogador.altura
    );

    // Cabeça
    ctx.fillStyle = "#e8b98c";
    ctx.fillRect(
        jogador.x + 10,
        jogador.y - 8,
        20,
        10
    );

    requestAnimationFrame(desenhar);
}

desenhar();