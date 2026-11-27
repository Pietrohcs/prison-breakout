
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Estados do jogo: "MENU", "JOGANDO", "GAME_OVER", "VITORIA"
let estadoJogo = "MENU";
let nivelAtual = 1;
let framesCongelado = 0; // 120 frames = 2 segundos
let tentativas = 1; // Conta quantas tentativas o jogador precisou para escapar

// Jogador (Prisioneiro)
const jogador = {
    x: 90,
    y: 350,
    largura: 36,
    altura: 36,
    velocidade: 5
};

// Chave da cela
const chave = {
    x: 380,
    y: 210,
    tamanho: 20,
    coletada: false
};

// Símbolo do IFSP (do tamanho da chave, ativo só no Nível 3)
const simboloIF = {
    x: 100,
    y: 60,
    largura: 20,
    altura: 24,
    usado: false
};

// Porta/Saída no topo da cela
const saida = {
    x: 340,
    y: 0,
    largura: 120,
    altura: 30
};

let guardas = [];
let moveis = [];    

// Configura os 3 cenários diferentes
function carregarNivel(nivel) {
    nivelAtual = nivel;
    chave.coletada = false;
    framesCongelado = 0;
    simboloIF.usado = false;

    if (nivel === 1) {
        // CELA 1 (Fácil - 1 Guarda)
        jogador.x = 90;
        jogador.y = 350;
        chave.x = 380;
        chave.y = 210;

        moveis = [
            { x: 35, y: 35, largura: 130, altura: 65, tipo: "cama" },
            { x: 655, y: 35, largura: 105, altura: 50, tipo: "banheiro" },
            { x: 470, y: 170, largura: 110, altura: 50, tipo: "mesa" },
            { x: 600, y: 340, largura: 120, altura: 55, tipo: "mesa" }
        ];

        guardas = [
            { x: 690, y: 110, largura: 36, altura: 36, velocidade: 1.6 }
        ];
    } else if (nivel === 2) {
        // CELA 2 (Médio - 2 Guardas e mesas no meio)
        jogador.x = 380;
        jogador.y = 360;
        chave.x = 690;
        chave.y = 75;

        moveis = [
            { x: 35, y: 35, largura: 130, altura: 65, tipo: "cama" },
            { x: 160, y: 180, largura: 110, altura: 50, tipo: "mesa" },
            { x: 520, y: 240, largura: 110, altura: 50, tipo: "mesa" }
        ];

        guardas = [
            { x: 90, y: 120, largura: 36, altura: 36, velocidade: 1.8 },
            { x: 680, y: 150, largura: 36, altura: 36, velocidade: 1.7 }
        ];
    } else if (nivel === 3) {
        // CELA 3 (Difícil - 3 Guardas + Símbolo do IF)
        jogador.x = 680;
        jogador.y = 350;
        chave.x = 80;
        chave.y = 350;

        moveis = [
            { x: 190, y: 130, largura: 110, altura: 50, tipo: "mesa" },
            { x: 500, y: 130, largura: 110, altura: 50, tipo: "mesa" },
            { x: 345, y: 285, largura: 110, altura: 50, tipo: "mesa" }
        ];

        guardas = [
            { x: 90, y: 80, largura: 36, altura: 36, velocidade: 1.8 },
            { x: 380, y: 90, largura: 36, altura: 36, velocidade: 2.0 },
            { x: 680, y: 80, largura: 36, altura: 36, velocidade: 2.0 }
        ];
    }
}

// Teclas pressionadas
const teclas = {};

document.addEventListener("keydown", function(event) {
    const tecla = event.key.toLowerCase();
    teclas[tecla] = true;

    if (estadoJogo === "MENU" && (tecla === " " || tecla === "enter")) {
        reiniciarJogo();
    }

    if (tecla === "r" && (estadoJogo === "VITORIA" || estadoJogo === "GAME_OVER")) {
        reiniciarJogo();
    }
});

document.addEventListener("keyup", function(event) {
    teclas[event.key.toLowerCase()] = false;
});

// Reiniciar o jogo
function reiniciarJogo() {
    if (estadoJogo === "GAME_OVER") {
        tentativas++;
    } else if (estadoJogo === "VITORIA") {
        tentativas = 1;
    }

    estadoJogo = "JOGANDO";
    carregarNivel(1);
}

// Colisão simples entre dois retângulos
function colidiu(a, b) {
    return (
        a.x < b.x + b.largura &&
        a.x + a.largura > b.x &&
        a.y < b.y + b.altura &&
        a.y + a.altura > b.y
    );
}

function encostouNosMoveis(personagem) {
    for (let i = 0; i < moveis.length; i++) {
        if (colidiu(personagem, moveis[i])) {
            return true;
        }
    }
    return false;
}

// Movimentar jogador e guardas
function movimentar() {
    if (estadoJogo !== "JOGANDO") return;

    if (framesCongelado > 0) framesCongelado--;

    // Movimento do Jogador
    const xAnt = jogador.x;
    const yAnt = jogador.y;

    if (teclas["arrowleft"] || teclas["a"]) jogador.x -= jogador.velocidade;
    if (teclas["arrowright"] || teclas["d"]) jogador.x += jogador.velocidade;
    if (encostouNosMoveis(jogador)) jogador.x = xAnt;

    if (teclas["arrowup"] || teclas["w"]) jogador.y -= jogador.velocidade;
    if (teclas["arrowdown"] || teclas["s"]) jogador.y += jogador.velocidade;
    if (encostouNosMoveis(jogador)) jogador.y = yAnt;

    // Limites das paredes laterais e inferior
    if (jogador.x < 30) jogador.x = 30;
    if (jogador.x + jogador.largura > canvas.width - 30) {
        jogador.x = canvas.width - 30 - jogador.largura;
    }
    if (jogador.y + jogador.altura > canvas.height - 30) {
        jogador.y = canvas.height - 30 - jogador.altura;
    }

    // Parede superior / Saída
    const naDirecaoDaPorta =
        jogador.x >= saida.x &&
        jogador.x + jogador.largura <= saida.x + saida.largura;

    if (chave.coletada && naDirecaoDaPorta) {
        if (jogador.y <= 5) {
            if (nivelAtual < 3) {
                carregarNivel(nivelAtual + 1);
            } else {
                estadoJogo = "VITORIA";
            }
        }
    } else {
        if (jogador.y < 30) jogador.y = 30;
    }

    // Verifica se passou pelo símbolo do IF no Nível 3
    if (nivelAtual === 3 && !simboloIF.usado && colidiu(jogador, simboloIF)) {
        simboloIF.usado = true;
        framesCongelado = 120; // Congela guardas por 2 segundos
    }

    // Movimento dos Guardas
    for (let i = 0; i < guardas.length; i++) {
        const g = guardas[i];

        if (framesCongelado <= 0) {
            const gXAnt = g.x;
            const gYAnt = g.y;

            if (g.x < jogador.x - 2) g.x += g.velocidade;
            else if (g.x > jogador.x + 2) g.x -= g.velocidade;
            if (encostouNosMoveis(g)) g.x = gXAnt;

            if (g.y < jogador.y - 2) g.y += g.velocidade;
            else if (g.y > jogador.y + 2) g.y -= g.velocidade;
            if (encostouNosMoveis(g)) g.y = gYAnt;

            if (g.x < 30) g.x = 30;
            if (g.x + g.largura > canvas.width - 30) g.x = canvas.width - 30 - g.largura;
            if (g.y < 30) g.y = 30;
            if (g.y + g.altura > canvas.height - 30) g.y = canvas.height - 30 - g.altura;
        }

        if (colidiu(jogador, g)) {
            estadoJogo = "GAME_OVER";
        }
    }
}

function verificarChave() {
    if (estadoJogo !== "JOGANDO") return;

    if (
        !chave.coletada &&
        jogador.x < chave.x + chave.tamanho &&
        jogador.x + jogador.largura > chave.x &&
        jogador.y < chave.y + chave.tamanho &&
        jogador.y + jogador.altura > chave.y
    ) {
        chave.coletada = true;
        for (let i = 0; i < guardas.length; i++) {
            guardas[i].velocidade += 0.3;
        }
    }
}

// Símbolo do Instituto Federal bem pequeno (20x24 px)
function desenharSimboloIF(x, y) {
    const tam = 5;
    const esp = 1;

    // Bolinha vermelha
    ctx.fillStyle = "#c8191e";
    ctx.beginPath();
    ctx.arc(x + 2.5, y + 2.5, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Quadrados verdes do "F"
    ctx.fillStyle = "#2f9e41";
    const blocos = [
        [1, 0], [2, 0],
        [0, 1], [1, 1],
        [0, 2], [1, 2], [2, 2],
        [0, 3], [1, 3]
    ];

    for (let i = 0; i < blocos.length; i++) {
        ctx.fillRect(
            x + blocos[i][0] * (tam + esp),
            y + blocos[i][1] * (tam + esp),
            tam,
            tam
        );
    }
}

function desenharCenario() {
    // 1. PISO DE CONCRETO DA CELA
    ctx.fillStyle = "#5c6066";
    ctx.fillRect(30, 30, canvas.width - 60, canvas.height - 60);

    // 2. PAREDES EXTERNAS
    ctx.fillStyle = "#26282b";
    ctx.fillRect(0, 0, 340, 30);
    ctx.fillRect(460, 0, 340, 30);
    ctx.fillRect(0, 0, 30, canvas.height);
    ctx.fillRect(canvas.width - 30, 0, 30, canvas.height);
    ctx.fillRect(0, canvas.height - 30, canvas.width, 30);

    // 3. PORTA DA CELA
    ctx.fillStyle = chave.coletada ? "#2d6a4f" : "#16181a";
    ctx.fillRect(saida.x, saida.y, saida.largura, saida.altura);

    if (!chave.coletada) {
        ctx.fillStyle = "#adb5bd";
        for (let x = saida.x + 8; x < saida.x + saida.largura; x += 14) {
            ctx.fillRect(x, 0, 5, 30);
        }
        ctx.fillStyle = "#d90429";
        ctx.fillRect(saida.x + 48, 10, 24, 10);
    } else {
        ctx.fillStyle = "#95d5b2";
        ctx.font = "bold 14px Arial";
        ctx.fillText("▲ SAÍDA LIVRE ▲", saida.x + 4, 21);
    }

    // 4. MÓVEIS DA CELA ATUAL
    for (let i = 0; i < moveis.length; i++) {
        const m = moveis[i];

        if (m.tipo === "cama") {
            ctx.fillStyle = "#1f2124";
            ctx.fillRect(m.x, m.y, m.largura, m.altura);
            ctx.fillStyle = "#d8dee9";
            ctx.fillRect(m.x + 5, m.y + 5, m.largura - 10, m.altura - 10);
            ctx.fillStyle = "#4361ee";
            ctx.fillRect(m.x + 60, m.y + 5, m.largura - 65, m.altura - 10);
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(m.x + 10, m.y + 13, 30, 38);
        } else if (m.tipo === "banheiro") {
            ctx.fillStyle = "#e5e9f0";
            ctx.fillRect(m.x + 55, m.y + 5, 50, 45);
            ctx.fillStyle = "#4c566a";
            ctx.beginPath();
            ctx.arc(m.x + 75, m.y + 27, 12, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#9aa5b1";
            ctx.fillRect(m.x, m.y, 45, 35);
            ctx.fillStyle = "#52606d";
            ctx.fillRect(m.x + 8, m.y + 7, 29, 20);
        } else {
            ctx.fillStyle = "#7f5539";
            ctx.fillRect(m.x, m.y, m.largura, m.altura);
            ctx.strokeStyle = "#582f0e";
            ctx.lineWidth = 3;
            ctx.strokeRect(m.x, m.y, m.largura, m.altura);
        }
    }

    // 5. SÍMBOLO DO IF (Somente no Nível 3)
    if (nivelAtual === 3 && !simboloIF.usado) {
        desenharSimboloIF(simboloIF.x, simboloIF.y);
    }
}

function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    movimentar();
    verificarChave();
    desenharCenario();

    // Desenhar Chave
    if (!chave.coletada) {
        ctx.fillStyle = "#ffd60a";
        ctx.beginPath();
        ctx.arc(chave.x + 6, chave.y + 8, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(chave.x + 11, chave.y + 6, 14, 4);
        ctx.fillRect(chave.x + 18, chave.y + 10, 4, 5);
    }

    // Desenhar Prisioneiro
    ctx.fillStyle = "#f77f00";
    ctx.fillRect(jogador.x, jogador.y, jogador.largura, jogador.altura);
    ctx.strokeStyle = "#d62828";
    ctx.lineWidth = 2;
    ctx.strokeRect(jogador.x, jogador.y, jogador.largura, jogador.altura);

    ctx.fillStyle = "#f1c27d";
    ctx.fillRect(jogador.x + 8, jogador.y + 6, 20, 18);
    ctx.fillStyle = "#2b2d42";
    ctx.fillRect(jogador.x + 8, jogador.y + 4, 20, 6);

    // Desenhar Guardas
    for (let i = 0; i < guardas.length; i++) {
        const g = guardas[i];
        ctx.fillStyle = framesCongelado > 0 ? "#4cc9f0" : "#1d3557";
        ctx.fillRect(g.x, g.y, g.largura, g.altura);
        ctx.strokeStyle = "#e63946";
        ctx.lineWidth = 2;
        ctx.strokeRect(g.x, g.y, g.largura, g.altura);

        ctx.fillStyle = "#f1c27d";
        ctx.fillRect(g.x + 8, g.y + 8, 20, 14);
        ctx.fillStyle = "#0b132b";
        ctx.fillRect(g.x + 6, g.y + 3, 24, 7);
    }

    // Objetivo no canto inferior esquerdo
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(35, canvas.height - 65, 340, 28);
    ctx.fillStyle = chave.coletada ? "#80ed99" : "#ffffff";
    ctx.font = "bold 14px Arial";
    ctx.fillText(
        chave.coletada
            ? `Nível ${nivelAtual}/3: ✔ Porta aberta! Saia pelo topo!`
            : `Nível ${nivelAtual}/3: Pegue a chave dourada`,
        45,
        canvas.height - 46
    );

    // Telas de Menu, Game Over e Vitória
    ctx.textAlign = "center";

    if (estadoJogo === "MENU") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#ff4d4d";
        ctx.font = "bold 36px Arial";
        ctx.fillText("PRISON BREAKOUT", canvas.width / 2, 180);

        ctx.fillStyle = "#ffffff";
        ctx.font = "18px Arial";
        ctx.fillText("Pressione ESPAÇO ou ENTER para jogar", canvas.width / 2, 235);
    }

    if (estadoJogo === "GAME_OVER") {
        ctx.fillStyle = "rgba(110, 0, 0, 0.85)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 36px Arial";
        ctx.fillText("VOCÊ FOI CAPTURADO!", canvas.width / 2, 185);

        ctx.font = "18px Arial";
        ctx.fillText("Tentativa atual: " + tentativas, canvas.width / 2, 225);
        ctx.fillText("Pressione R para tentar novamente", canvas.width / 2, 260);
    }

    if (estadoJogo === "VITORIA") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#80ed99";
        ctx.font = "bold 36px Arial";
        ctx.fillText("VOCÊ ESCAPOU DA PRISÃO!", canvas.width / 2, 185);

        ctx.fillStyle = "#ffffff";
        ctx.font = "18px Arial";
        ctx.fillText("Você escapou na tentativa nº " + tentativas + "!", canvas.width / 2, 225);
        ctx.fillText("Pressione R para jogar novamente", canvas.width / 2, 260);
    }

    ctx.textAlign = "start";

    requestAnimationFrame(desenhar);
}

carregarNivel(1);
desenhar();
