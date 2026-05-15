const CODIGO_SECRETO = "0704";

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

  if (codigo === CODIGO_SECRETO) {
    mostrarNivel(2);
    iniciarJuego();
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

/* NIVEL 6 ROMPECABEZAS REAL */

let puzzleIniciado = false;

const posicionesCorrectas = [0,1,2,3,4,5,6,7,8];

let piezas = [];
let primeraSeleccion = null;

function iniciarPuzzle() {

  if (puzzleIniciado) return;

  puzzleIniciado = true;

  piezas = [...posicionesCorrectas]
    .sort(() => Math.random() - 0.5);

  renderPuzzle();
}

function renderPuzzle() {

  const puzzle =
    document.getElementById("puzzle");

  puzzle.innerHTML = "";

  piezas.forEach((pieza, index) => {

    const piece =
      document.createElement("div");

    piece.classList.add("puzzle-piece");

    const x = (pieza % 3) * -100;
    const y = Math.floor(pieza / 3) * -100;

    piece.style.backgroundPosition =
      `${x}px ${y}px`;

    piece.dataset.index = index;

    piece.onclick = () =>
      seleccionarPieza(index);

    puzzle.appendChild(piece);
  });

  verificarPuzzleCompleto();
}

function seleccionarPieza(index) {

  const piezasDOM =
    document.querySelectorAll(".puzzle-piece");

  if (primeraSeleccion === null) {

    primeraSeleccion = index;

    piezasDOM[index].style.border =
      "4px solid #fff200";

  } else {

    // intercambiar piezas
    [piezas[primeraSeleccion], piezas[index]]
      =
    [piezas[index], piezas[primeraSeleccion]];

    primeraSeleccion = null;

    renderPuzzle();
  }
}

function verificarPuzzleCompleto() {

  const completo =
    piezas.every((pieza, index) =>
      pieza === posicionesCorrectas[index]
    );

  if (completo) {

    document.getElementById("puzzleMensaje")
      .innerText =
      "🧩 ¡Rompecabezas completado! 💖";

    setTimeout(() => {
      mostrarNivel(7);
    }, 1500);
  }
}

function reiniciarPuzzle() {

  puzzleIniciado = false;

  primeraSeleccion = null;

  document.getElementById("puzzleMensaje")
    .innerText = "";

  iniciarPuzzle();
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