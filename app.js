const CODIGO_SECRETO = "0704";
const CODIGO_MINIJUEGO = "0106";

function activarMusica() {
  const musica = document.getElementById("musicaFondo");
  const error = document.getElementById("error");

  if (!musica) {
    if (error) error.innerText = "No se encontró el audio en el HTML 💔";
    return;
  }

  musica.volume = 0.6;
  musica.muted = false;

  musica.play()
    .then(() => {
      if (error) error.innerText = "Música activada 🎵💖";
    })
    .catch(() => {
      if (error) {
        error.innerText = "Toca otra vez el botón de música. Revisa que exista audio/musica.mp3";
      }
    });
}

function mostrarNivel(numero) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  document.getElementById("nivel" + numero).classList.add("active");

  if (numero === 5) iniciarMemoria();
  if (numero === 6) iniciarPuzzle();
}

/* NIVEL 1 */
function verificarCodigo() {
  const codigo = document.getElementById("codigo").value.trim();

  activarMusica();

  if (codigo === CODIGO_SECRETO) {
    mostrarNivel(2);
    iniciarJuego();
  } else if (codigo === CODIGO_MINIJUEGO) {
    mostrarNivelExtra();
  } else {
    document.getElementById("error").innerText = "Código incorrecto 💔";
  }
}

/* NIVEL 2 */
let corazones = 0;
let juegoIniciado = false;

function iniciarJuego() {
  if (juegoIniciado) return;

  juegoIniciado = true;
  const area = document.getElementById("gameArea");

  const intervalo = setInterval(() => {
    const heart = document.createElement("div");
    heart.classList.add("corazon");
    heart.innerHTML = "💖";

    heart.style.left = Math.random() * 82 + "%";
    heart.style.top = Math.random() * 82 + "%";

    heart.onclick = () => {
      heart.remove();
      corazones++;

      document.getElementById("contador").innerText = corazones + " / 10";

      if (corazones >= 10) {
        clearInterval(intervalo);
        setTimeout(() => mostrarNivel(3), 600);
      }
    };

    area.appendChild(heart);

    setTimeout(() => heart.remove(), 1600);
  }, 650);
}

/* NIVEL 3 */
function respuestaCorrecta() {
  document.getElementById("quizMensaje").innerText = "Correcto, eres tú 💕";
  setTimeout(() => mostrarNivel(4), 1000);
}

function respuestaIncorrecta() {
  document.getElementById("quizMensaje").innerText = "Mmm... intenta otra vez 😅";
}

/* NIVEL 4 */
let frase = [];
const fraseCorrecta = ["QUIERO", "ESTAR", "CONTIGO"];

function elegirPalabra(palabra) {
  frase.push(palabra);
  document.getElementById("fraseArmada").innerText = frase.join(" ");

  if (frase.length === 3) {
    if (JSON.stringify(frase) === JSON.stringify(fraseCorrecta)) {
      document.getElementById("fraseMensaje").innerText = "Frase desbloqueada 💖";
      setTimeout(() => mostrarNivel(5), 1000);
    } else {
      document.getElementById("fraseMensaje").innerText = "Casi... intenta ordenarla mejor 💕";
    }
  }
}

function reiniciarFrase() {
  frase = [];
  document.getElementById("fraseArmada").innerText = "";
  document.getElementById("fraseMensaje").innerText = "";
}

/* NIVEL 5 MEMORIA */
let memoriaIniciada = false;
let primeraCarta = null;
let segundaCarta = null;
let parejasEncontradas = 0;

function iniciarMemoria() {
  if (memoriaIniciada) return;

  memoriaIniciada = true;

  const emojis = ["💖", "💖", "🌹", "🌹", "✨", "✨"];
  const mezclados = emojis.sort(() => Math.random() - 0.5);

  const board = document.getElementById("memoryBoard");
  board.innerHTML = "";

  mezclados.forEach(emoji => {
    const card = document.createElement("div");
    card.classList.add("memory-card");
    card.dataset.emoji = emoji;
    card.innerText = "❓";

    card.onclick = () => voltearCarta(card);
    board.appendChild(card);
  });
}

function voltearCarta(card) {
  if (card.classList.contains("flipped") || card.classList.contains("matched")) return;

  card.classList.add("flipped");
  card.innerText = card.dataset.emoji;

  if (!primeraCarta) {
    primeraCarta = card;
    return;
  }

  segundaCarta = card;

  if (primeraCarta.dataset.emoji === segundaCarta.dataset.emoji) {
    primeraCarta.classList.add("matched");
    segundaCarta.classList.add("matched");

    parejasEncontradas++;

    primeraCarta = null;
    segundaCarta = null;

    if (parejasEncontradas === 3) {
      document.getElementById("memoryMensaje").innerText = "Memoria completada 💖";
      setTimeout(() => mostrarNivel(6), 1200);
    }
  } else {
    setTimeout(() => {
      primeraCarta.classList.remove("flipped");
      segundaCarta.classList.remove("flipped");

      primeraCarta.innerText = "❓";
      segundaCarta.innerText = "❓";

      primeraCarta = null;
      segundaCarta = null;
    }, 700);
  }
}

/* NIVEL 6 ROMPECABEZAS PRINCIPAL */
let puzzleIniciado = false;
const posicionesCorrectas = [0,1,2,3,4,5,6,7,8];
let piezas = [];
let primeraSeleccion = null;

function iniciarPuzzle() {
  if (puzzleIniciado) return;

  puzzleIniciado = true;

  piezas = [...posicionesCorrectas].sort(() => Math.random() - 0.5);

  renderPuzzle();
}

function renderPuzzle() {
  const puzzle = document.getElementById("puzzle");

  puzzle.innerHTML = "";

  piezas.forEach((pieza, index) => {
    const piece = document.createElement("div");

    piece.classList.add("puzzle-piece");

    const x = (pieza % 3) * -100;
    const y = Math.floor(pieza / 3) * -100;

    piece.style.backgroundPosition = `${x}px ${y}px`;
    piece.dataset.index = index;

    piece.onclick = () => seleccionarPieza(index);

    puzzle.appendChild(piece);
  });

  verificarPuzzleCompleto();
}

function seleccionarPieza(index) {
  const piezasDOM = document.querySelectorAll(".puzzle-piece");

  if (primeraSeleccion === null) {
    primeraSeleccion = index;
    piezasDOM[index].style.border = "4px solid #fff200";
  } else {
    [piezas[primeraSeleccion], piezas[index]] =
    [piezas[index], piezas[primeraSeleccion]];

    primeraSeleccion = null;

    renderPuzzle();
  }
}

function verificarPuzzleCompleto() {
  const completo = piezas.every((pieza, index) =>
    pieza === posicionesCorrectas[index]
  );

  if (completo) {
    document.getElementById("puzzleMensaje").innerText =
      "🧩 ¡Rompecabezas completado! 💖";

    setTimeout(() => {
      mostrarNivel(7);
    }, 1500);
  }
}

function reiniciarPuzzle() {
  puzzleIniciado = false;
  primeraSeleccion = null;

  document.getElementById("puzzleMensaje").innerText = "";

  iniciarPuzzle();
}

/* MINIJUEGOS EXTRA - CÓDIGO 0106 */
let perdonIniciado = false;
let perdonContador = 0;
let intervaloPerdon = null;

function mostrarNivelExtra() {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  document.getElementById("nivelExtra1").classList.add("active");
  iniciarPerdon();
}

/* MINIJUEGO 1 */
function iniciarPerdon() {
  if (perdonIniciado) return;

  perdonIniciado = true;
  perdonContador = 0;

  const area = document.getElementById("perdonArea");
  area.innerHTML = "";

  document.getElementById("contadorPerdon").innerText = "0 / 6";
  document.getElementById("perdonMensaje").innerText = "";

  const mensajes = [
    "Perdón",
    "Lo siento",
    "De corazón",
    "Te valoro",
    "Me importas",
    "Quiero mejorar"
  ];

  intervaloPerdon = setInterval(() => {
    const item = document.createElement("div");
    item.classList.add("perdon-item");
    item.innerHTML = mensajes[Math.floor(Math.random() * mensajes.length)] + " 💖";

    item.style.left = Math.random() * 62 + "%";
    item.style.top = Math.random() * 82 + "%";

    item.onclick = () => {
      item.remove();
      perdonContador++;

      document.getElementById("contadorPerdon").innerText = perdonContador + " / 6";

      if (perdonContador >= 6) {
        clearInterval(intervaloPerdon);

        document.getElementById("perdonMensaje").innerText =
          "Disculpa enviada con el corazón 💌";

        setTimeout(() => mostrarNivelExtraNumero(2), 1200);
      }
    };

    area.appendChild(item);

    setTimeout(() => item.remove(), 1700);
  }, 700);
}

function reiniciarPerdon() {
  clearInterval(intervaloPerdon);
  perdonIniciado = false;
  iniciarPerdon();
}

function mostrarNivelExtraNumero(numero) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  document.getElementById("nivelExtra" + numero).classList.add("active");

  if (numero === 4) {
    iniciarPuzzlePerdon();
  }
}

/* MINIJUEGO 2 */
let frasePerdon = [];
const frasePerdonCorrecta = ["TE", "PIDO", "PERDÓN", "DE", "CORAZÓN"];

function elegirPalabraPerdon(palabra) {
  frasePerdon.push(palabra);
  document.getElementById("frasePerdonArmada").innerText = frasePerdon.join(" ");

  if (frasePerdon.length === frasePerdonCorrecta.length) {
    if (JSON.stringify(frasePerdon) === JSON.stringify(frasePerdonCorrecta)) {
      document.getElementById("frasePerdonMensaje").innerText = "Frase correcta 💖";

      setTimeout(() => mostrarNivelExtraNumero(3), 1000);
    } else {
      document.getElementById("frasePerdonMensaje").innerText =
        "Casi... intenta ordenarla con calma 💕";
    }
  }
}

function reiniciarFrasePerdon() {
  frasePerdon = [];
  document.getElementById("frasePerdonArmada").innerText = "";
  document.getElementById("frasePerdonMensaje").innerText = "";
}

/* MINIJUEGO 3 */
let fraseFinalExtra = [];
const fraseFinalCorrecta = ["QUIERO", "HACER", "LAS", "COSAS", "BIEN"];

function elegirPalabraFinal(palabra) {
  fraseFinalExtra.push(palabra);
  document.getElementById("fraseFinalArmada").innerText = fraseFinalExtra.join(" ");

  if (fraseFinalExtra.length === fraseFinalCorrecta.length) {
    if (JSON.stringify(fraseFinalExtra) === JSON.stringify(fraseFinalCorrecta)) {
      document.getElementById("fraseFinalMensaje").innerText =
        "Mensaje completado con amor 💌";

      setTimeout(() => mostrarNivelExtraNumero(4), 1000);
    } else {
      document.getElementById("fraseFinalMensaje").innerText =
        "Intenta otra vez, la frase tiene un mensaje bonito 💖";
    }
  }
}

function reiniciarFraseFinal() {
  fraseFinalExtra = [];
  document.getElementById("fraseFinalArmada").innerText = "";
  document.getElementById("fraseFinalMensaje").innerText = "";
}

/* MINIJUEGO 4 - ROMPECABEZAS DEL PERDÓN */
let puzzlePerdonIniciado = false;
const posicionesPerdonCorrectas = [0,1,2,3,4,5,6,7,8];
let piezasPerdon = [];
let primeraSeleccionPerdon = null;

function iniciarPuzzlePerdon() {
  if (puzzlePerdonIniciado) return;

  puzzlePerdonIniciado = true;

  piezasPerdon = [...posicionesPerdonCorrectas].sort(() => Math.random() - 0.5);

  renderPuzzlePerdon();
}

function renderPuzzlePerdon() {
  const puzzle = document.getElementById("puzzlePerdon");

  puzzle.innerHTML = "";

  piezasPerdon.forEach((pieza, index) => {
    const piece = document.createElement("div");

    piece.classList.add("puzzle-extra-piece");

    const x = (pieza % 3) * -100;
    const y = Math.floor(pieza / 3) * -100;

    piece.style.backgroundPosition = `${x}px ${y}px`;
    piece.dataset.index = index;

    piece.onclick = () => seleccionarPiezaPerdon(index);

    puzzle.appendChild(piece);
  });

  verificarPuzzlePerdonCompleto();
}

function seleccionarPiezaPerdon(index) {
  const piezasDOM = document.querySelectorAll(".puzzle-extra-piece");

  if (primeraSeleccionPerdon === null) {
    primeraSeleccionPerdon = index;
    piezasDOM[index].style.border = "4px solid #fff200";
  } else {
    [piezasPerdon[primeraSeleccionPerdon], piezasPerdon[index]] =
    [piezasPerdon[index], piezasPerdon[primeraSeleccionPerdon]];

    primeraSeleccionPerdon = null;

    renderPuzzlePerdon();
  }
}

function verificarPuzzlePerdonCompleto() {
  const completo = piezasPerdon.every((pieza, index) =>
    pieza === posicionesPerdonCorrectas[index]
  );

  if (completo) {
    document.getElementById("puzzlePerdonMensaje").innerText =
      "🧩 Imagen completada. Gracias por llegar hasta aquí 💖";

    setTimeout(() => {
      mostrarNivelExtraFinal();
    }, 1500);
  }
}

function reiniciarPuzzlePerdon() {
  puzzlePerdonIniciado = false;
  primeraSeleccionPerdon = null;

  document.getElementById("puzzlePerdonMensaje").innerText = "";

  iniciarPuzzlePerdon();
}

function mostrarNivelExtraFinal() {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  document.getElementById("nivelExtraFinal").classList.add("active");
}

/* NIVEL FINAL */
function acepto() {
  document.getElementById("final").innerHTML =
    "💖 ¡Ahora empieza nuestra historia más bonita! 💖";
}

const btnNo = document.getElementById("btnNo");

btnNo.addEventListener("touchstart", moverBoton);
btnNo.addEventListener("mouseover", moverBoton);
btnNo.addEventListener("click", moverBoton);

function moverBoton() {
  const zona = document.querySelector(".botones");

  const maxX = zona.offsetWidth - btnNo.offsetWidth;
  const maxY = zona.offsetHeight - btnNo.offsetHeight;

  const randomX = Math.random() * maxX;
  const randomY = Math.random() * maxY;

  btnNo.style.transition = "0.18s";
  btnNo.style.left = randomX + "px";
  btnNo.style.top = randomY + "px";

  const rotate = Math.random() * 50 - 25;
  btnNo.style.transform = `rotate(${rotate}deg)`;
}