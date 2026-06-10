const CODIGO_SECRETO = "0704";
const CODIGO_MINIJUEGO = "0906";

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

/* RUTA EXTRA - CÓDIGO 0906 ANIVERSARIO */

function mostrarNivelExtra() {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  document.getElementById("nivelExtra1").classList.add("active");
  iniciarConstelacion();
}

function mostrarNivelExtraNumero(numero) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  document.getElementById("nivelExtra" + numero).classList.add("active");

  if (numero === 1) iniciarConstelacion();
  if (numero === 2) iniciarMedidorAmor();
  if (numero === 5) iniciarPuzzlePerdon();
}

/* MINIJUEGO 1 - CONSTELACIÓN EN FORMA DE C */
let constelacionOrden = [1, 2, 3, 4, 5];
let constelacionJugador = [];

let constelacionPuntos = {
  1: "230,65",
  2: "120,55",
  3: "65,145",
  4: "120,235",
  5: "230,225"
};

function iniciarConstelacion() {
  constelacionJugador = [];

  document.getElementById("constelacionMensaje").innerText = "";
  document.getElementById("lineaConstelacion").setAttribute("points", "");

  document.querySelectorAll(".estrella").forEach(estrella => {
    estrella.classList.remove("activa", "error-star");
  });
}

function tocarEstrella(numero) {
  const posicionActual = constelacionJugador.length;
  const esperado = constelacionOrden[posicionActual];
  const estrella = document.querySelector(".estrella" + numero);

  if (numero === esperado) {
    constelacionJugador.push(numero);
    estrella.classList.add("activa");

    actualizarLineaConstelacion();

    if (constelacionJugador.length === constelacionOrden.length) {
      document.getElementById("constelacionMensaje").innerText =
        "Constelación completada ✨ La letra C brilla por nuestro mes 💖";

      setTimeout(() => mostrarNivelExtraNumero(2), 1300);
    }
  } else {
    estrella.classList.add("error-star");
    document.getElementById("constelacionMensaje").innerText =
      "Esa estrella no iba todavía 😅 Intenta de nuevo.";

    setTimeout(() => {
      reiniciarConstelacion();
    }, 900);
  }
}

function actualizarLineaConstelacion() {
  const puntos = constelacionJugador
    .map(numero => constelacionPuntos[numero])
    .join(" ");

  document.getElementById("lineaConstelacion").setAttribute("points", puntos);
}

function reiniciarConstelacion() {
  iniciarConstelacion();
}

/* MINIJUEGO 2 - MEDIDOR DE AMOR */
let amorActual = 0;

function iniciarMedidorAmor() {
  amorActual = 0;
  document.getElementById("barraAmor").style.width = "0%";
  document.getElementById("porcentajeAmor").innerText = "0%";
  document.getElementById("medidorMensaje").innerText = "";
  document.getElementById("efectosAmor").innerHTML = "";
}

function cargarAmor() {
  if (amorActual >= 100) return;

  amorActual += 10;

  if (amorActual > 100) {
    amorActual = 100;
  }

  document.getElementById("barraAmor").style.width = amorActual + "%";
  document.getElementById("porcentajeAmor").innerText = amorActual + "%";

  crearCorazonFlotante();

  if (amorActual === 100) {
    document.getElementById("medidorMensaje").innerText =
      "Medidor completo 💖 Amor cargado al máximo.";

    setTimeout(() => mostrarNivelExtraNumero(3), 1200);
  }
}

function crearCorazonFlotante() {
  const efectos = document.getElementById("efectosAmor");
  const corazon = document.createElement("span");

  corazon.classList.add("corazon-flotante");
  corazon.innerText = "💖";

  corazon.style.left = Math.random() * 80 + 10 + "%";

  efectos.appendChild(corazon);

  setTimeout(() => {
    corazon.remove();
  }, 1000);
}

function reiniciarMedidorAmor() {
  iniciarMedidorAmor();
}

/* MINIJUEGO 3 - QUIZ DE ANIVERSARIO */
function respuestaAniversarioCorrecta() {
  document.getElementById("quizAniversarioMensaje").innerText =
    "Correcto, hoy celebramos nuestro primer mes 💖";

  setTimeout(() => mostrarNivelExtraNumero(4), 1200);
}

function respuestaAniversarioIncorrecta() {
  document.getElementById("quizAniversarioMensaje").innerText =
    "Casi... piensa en algo bonito que cumplimos hoy 😅";
}

/* MINIJUEGO 4 - ORDENAR FRASE */
let fraseAniversario = [];
const fraseAniversarioCorrecta = ["FELIZ", "PRIMER", "MES", "CONTIGO"];

function elegirPalabraAniversario(palabra) {
  fraseAniversario.push(palabra);

  document.getElementById("fraseAniversarioArmada").innerText =
    fraseAniversario.join(" ");

  if (fraseAniversario.length === fraseAniversarioCorrecta.length) {
    if (JSON.stringify(fraseAniversario) === JSON.stringify(fraseAniversarioCorrecta)) {
      document.getElementById("fraseAniversarioMensaje").innerText =
        "Frase correcta 💖";

      setTimeout(() => mostrarNivelExtraNumero(5), 1200);
    } else {
      document.getElementById("fraseAniversarioMensaje").innerText =
        "Casi... intenta ordenarla mejor 💕";
    }
  }
}

function reiniciarFraseAniversario() {
  fraseAniversario = [];
  document.getElementById("fraseAniversarioArmada").innerText = "";
  document.getElementById("fraseAniversarioMensaje").innerText = "";
}

/* MINIJUEGO 5 - ROMPECABEZAS DE ANIVERSARIO */
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
      "🧩 ¡Imagen completada! Feliz primer mes 💖";

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

/* CUADRITO FINAL */
function mostrarMensajeMes() {
  const mensaje = document.getElementById("mensajeMes");

  mensaje.innerText = "Feliz mes juntos amor 💖";
  mensaje.classList.add("mostrar-mensaje");
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