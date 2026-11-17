const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Estado do jogo
let escapou = false;

// Jogador (Prisioneiro)
const jogador = {
    x: 380,
    y: 230,
    largura: 36,
    altura: 36,
    velocidade: 5
};

// Chave da cela
const chave = {
    x: 560,
    y: 355,
    tamanho: 20,
    coletada: false
};

// Porta/Saída no topo da cela
const saida = {
    x: 340,
    y: 0,
    largura: 120,
    altura: 30
};

// Teclas pressionadas
const teclas = {};

document.addEventListener("keydown", function(event) {
    const tecla = event.key.toLowerCase();
    teclas[tecla] = true;

    // Reiniciar o jogo quando apertar R após escapar
    if (tecla === "r" && escapou) {
        reiniciarJogo();
    }
});

document.addEventListener("keyup", function(event) {
    teclas[event.key.toLowerCase()] = false;
});

function reiniciarJogo() {
    escapou = false;
    chave.coletada = false;
    jogador.x = 380;
    jogador.y = 230;
}

// Movimentar jogador
function movimentar() {
    if (escapou) return; // Para o movimento se já venceu

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

    // Limites das paredes laterais e inferior
    if (jogador.x < 30) jogador.x = 30;
    if (jogador.x + jogador.largura > canvas.width - 30) {
        jogador.x = canvas.width - 30 - jogador.largura;
    }
    if (jogador.y + jogador.altura > canvas.height - 30) {
        jogador.y = canvas.height - 30 - jogador.altura;
    }

    // Parede superior: só deixa passar se pegou a chave e estiver alinhado com a porta
    const naDirecaoDaPorta =
        jogador.x >= saida.x &&
        jogador.x + jogador.largura <= saida.x + saida.largura;

    if (chave.coletada && naDirecaoDaPorta) {
        // Se passar totalmente pela saída no topo, escapou!
        if (jogador.y <= 5) {
            escapou = true;
        }
    } else {
        // Caso contrário, bate na parede ou na grade trancada
        if (jogador.y < 30) jogador.y = 30;
    }
}

function verificarChave() {
    if (
        !chave.coletada &&
        jogador.x < chave.x + chave.tamanho &&
        jogador.x + jogador.largura > chave.x &&
        jogador.y < chave.y + chave.tamanho &&
        jogador.y + jogador.altura > chave.y
    ) {
        chave.coletada = true;
    }
}

function desenharCenario() {
    // 1. PISO DE CONCRETO DA CELA
    ctx.fillStyle = "#5c6066";
    ctx.fillRect(30, 30, canvas.width - 60, canvas.height - 60);

    // Rejunte do piso (blocos grandes e sutis)
    ctx.strokeStyle = "#4e5257";
    ctx.lineWidth = 2;
    for (let x = 30; x <= canvas.width - 30; x += 74) {
        ctx.beginPath();
        ctx.moveTo(x, 30);
        ctx.lineTo(x, canvas.height - 30);
        ctx.stroke();
    }
    for (let y = 30; y <= canvas.height - 30; y += 78) {
        ctx.beginPath();
        ctx.moveTo(30, y);
        ctx.lineTo(canvas.width - 30, y);
        ctx.stroke();
    }

    // 2. PAREDES DE TIJOLO/CONCRETO GROSSO
    ctx.fillStyle = "#26282b";
    ctx.fillRect(0, 0, 340, 30);          // Parede topo esquerda
    ctx.fillRect(460, 0, 340, 30);         // Parede topo direita
    ctx.fillRect(0, 0, 30, canvas.height); // Parede esquerda
    ctx.fillRect(canvas.width - 30, 0, 30, canvas.height); // Parede direita
    ctx.fillRect(0, canvas.height - 30, canvas.width, 30); // Parede baixo

    // 3. PORTA DA CELA (Vão da saída no topo)
    // Fundo do corredor externo (verde escuro se destrancada, escuro se trancada)
    ctx.fillStyle = chave.coletada ? "#2d6a4f" : "#16181a";
    ctx.fillRect(saida.x, saida.y, saida.largura, saida.altura);

    // Desenha as grades APENAS se a chave ainda NÃO foi coletada
    if (!chave.coletada) {
        ctx.fillStyle = "#adb5bd";
        for (let x = saida.x + 8; x < saida.x + saida.largura; x += 14) {
            ctx.fillRect(x, 0, 5, 30);
        }
        // Trava vermelha no meio da grade
        ctx.fillStyle = "#d90429";
        ctx.fillRect(saida.x + 48, 10, 24, 10);
    } else {
        // Seta indicando saída
        ctx.fillStyle = "#95d5b2";
        ctx.font = "bold 14px Arial";
        ctx.fillText("▲ SAÍDA LIVRE ▲", saida.x + 4, 21);
    }

    // 4. CAMA (Canto superior esquerdo encostada na parede)
    ctx.fillStyle = "#1f2124"; // Estrutura de ferro
    ctx.fillRect(35, 35, 130, 65);
    ctx.fillStyle = "#d8dee9"; // Lençol
    ctx.fillRect(40, 40, 120, 55);
    ctx.fillStyle = "#4361ee"; // Cobertor dobrado
    ctx.fillRect(95, 40, 65, 55);
    ctx.fillStyle = "#ffffff"; // Travesseiro
    ctx.fillRect(45, 48, 30, 38);

    // 5. PIA E VASO SANITÁRIO (Canto superior direito encostados na parede)
    // Vaso
    ctx.fillStyle = "#e5e9f0";
    ctx.fillRect(710, 40, 50, 45);
    ctx.fillStyle = "#4c566a";
    ctx.beginPath();
    ctx.arc(730, 62, 12, 0, Math.PI * 2);
    ctx.fill();

    // Pia metálica ao lado
    ctx.fillStyle = "#9aa5b1";
    ctx.fillRect(655, 35, 45, 35);
    ctx.fillStyle = "#52606d";
    ctx.fillRect(663, 42, 29, 20);

    // 6. MESA E BANCO (Canto inferior direito)
    // Banco
    ctx.fillStyle = "#4a3219";
    ctx.fillRect(635, 315, 40, 20);
    // Mesa
    ctx.fillStyle = "#7f5539";
    ctx.fillRect(600, 340, 120, 55);
    ctx.strokeStyle = "#582f0e";
    ctx.lineWidth = 3;
    ctx.strokeRect(600, 340, 120, 55);
}

function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    movimentar();
    verificarChave();
    desenharCenario();

    // Desenhar Chave (se ainda não pegou)
    if (!chave.coletada) {
        ctx.fillStyle = "#ffd60a";
        ctx.beginPath();
        ctx.arc(chave.x + 6, chave.y + 8, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(chave.x + 11, chave.y + 6, 14, 4);
        ctx.fillRect(chave.x + 18, chave.y + 10, 4, 5);
    }

    // Desenhar Prisioneiro (Uniforme Laranja de Presídio)
    ctx.fillStyle = "#f77f00";
    ctx.fillRect(jogador.x, jogador.y, jogador.largura, jogador.altura);
    ctx.strokeStyle = "#d62828";
    ctx.lineWidth = 2;
    ctx.strokeRect(jogador.x, jogador.y, jogador.largura, jogador.altura);

    // Cabeça do Prisioneiro
    ctx.fillStyle = "#f1c27d";
    ctx.fillRect(jogador.x + 8, jogador.y + 6, 20, 18);

    // Cabelo
    ctx.fillStyle = "#2b2d42";
    ctx.fillRect(jogador.x + 8, jogador.y + 4, 20, 6);

    // Objetivo no canto inferior esquerdo
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(35, canvas.height - 65, 290, 28);
    ctx.fillStyle = chave.coletada ? "#80ed99" : "#ffffff";
    ctx.font = "bold 14px Arial";
    ctx.fillText(
        chave.coletada ? "✔ Porta aberta! Saia pelo topo!" : "Objetivo: Pegue a chave dourada",
        45,
        canvas.height - 46
    );

    // Tela de Vitória quando escapar
    if (escapou) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#80ed99";
        ctx.font = "bold 36px Arial";
        ctx.textAlign = "center";
        ctx.fillText("VOCÊ ESCAPOU DA PRISÃO!", canvas.width / 2, 200);

        ctx.fillStyle = "#ffffff";
        ctx.font = "18px Arial";
        ctx.fillText("Pressione R para jogar novamente", canvas.width / 2, 250);
        ctx.textAlign = "start";
    }

    requestAnimationFrame(desenhar);
}

desenhar();