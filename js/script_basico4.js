if (localStorage.getItem("vidas_heladeria") === null) localStorage.setItem("vidas_heladeria", "3");
if (localStorage.getItem("puntaje_heladeria") === null) localStorage.setItem("puntaje_heladeria", "0");

function inicializarEstadoJuego() {
    actualizarBarraEstado();
    ejecutarLecturaVoz();
    configurarDragAndDrop();
    configurarAudioLecturaTarjetas(); // Punto 10: Audio al presionar elementos
}

function actualizarBarraEstado() {
    const contenedorVidas = document.getElementById("vidas-box");
    const contenedorPuntos = document.getElementById("puntos-box");
    
    const vidasRestantes = parseInt(localStorage.getItem("vidas_heladeria"));
    const puntajeActual = parseInt(localStorage.getItem("puntaje_heladeria")) || 0;
    
    if (contenedorVidas) {
        contenedorVidas.innerHTML = vidasRestantes <= 0 ? "❌ Sin vidas" : "💜".repeat(vidasRestantes);
    }
    if (contenedorPuntos) {
        contenedorPuntos.innerHTML = `⭐ ${puntajeActual} Pts`;
    }
}

function configurarAudioLecturaTarjetas() {
    // Cuando el niño interactúa con la tarjeta, esta dice su valor en voz alta
    document.querySelectorAll(".tarjeta-helado").forEach(tarjeta => {
        tarjeta.addEventListener("click", () => {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const u = new SpeechSynthesisUtterance(tarjeta.innerText.replace('$', '') + " pesos");
                u.lang = 'es-CL';
                window.speechSynthesis.speak(u);
            }
        });
    });
}

function hablarYPasarNivel(fraseAVoz, siguienteUrl, recargarMismoNivel = false) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        
        const u = new SpeechSynthesisUtterance(fraseAVoz);
        u.lang = 'es-CL';
        u.rate = 1.0; 

        let yaCambioPagina = false;

        // Se ejecuta exactamente cuando la voz termina la frase
        u.onend = function() {
            if (!yaCambioPagina) {
                yaCambioPagina = true;
                if (recargarMismoNivel) window.location.reload();
                else window.location.href = siguienteUrl;
            }
        };

        // Respaldo por si el navegador se queda mudo de imprevisto
        setTimeout(() => {
            if (!yaCambioPagina) {
                yaCambioPagina = true;
                if (recargarMismoNivel) window.location.reload();
                else window.location.href = siguienteUrl;
            }
        }, 4500); 

        window.speechSynthesis.speak(u);
    } else {
        if (recargarMismoNivel) window.location.reload();
        else window.location.href = siguienteUrl;
    }
}

function procesarResultado(esCorrecto, siguienteUrl) {
    let fraseAReproducir = "";
    let recargarMismoNivel = false;

    if (esCorrecto) {
        let puntos = parseInt(localStorage.getItem("puntaje_heladeria")) || 0;
        puntos += 100;
        localStorage.setItem("puntaje_heladeria", puntos);
        fraseAReproducir = "¡Excelente! Respuesta correcta. Pasemos al siguiente nivel.";
        
        // Muestra estrellas/celebración visual en la tarjeta
        const confeti = document.getElementById("animacion-alerta-confeti");
        if (confeti) confeti.classList.add("mostrar-confeti");
    } else {
        let vidas = parseInt(localStorage.getItem("vidas_heladeria")) || 0;
        vidas--;
        localStorage.setItem("vidas_heladeria", vidas);
        
        fraseAReproducir = "Te has equivocado, perderás una vida pero puedes volver a intentarlo.";
        recargarMismoNivel = true; 
    }

    const vidasFinales = parseInt(localStorage.getItem("vidas_heladeria"));
    if (vidasFinales <= 0) {
        fraseAReproducir = "¡Oh, no! Te has quedado sin vidas. Vamos a ver tu puntuación final.";
        // Mantiene tu nombre original de archivo de cierre
        hablarYPasarNivel(fraseAReproducir, "felicitaciones2.html", false);
    } else {
        hablarYPasarNivel(fraseAReproducir, siguienteUrl, recargarMismoNivel);
    }
}

function ejecutarLecturaVoz() {
    const contenedorTexto = document.getElementById("texto-instruccion");
    if (!contenedorTexto) return;

    const textoCompleto = contenedorTexto.getAttribute("data-texto");
    const palabras = textoCompleto.split(" ");
    
    contenedorTexto.innerHTML = palabras.map((palabra, index) => {
        return `<span class="palabra-karaoke" id="palabra-${index}">${palabra}</span>`;
    }).join(" ");

    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); 
        const utterance = new SpeechSynthesisUtterance(textoCompleto);
        utterance.lang = 'es-CL';
        utterance.rate = 0.98; 

        let palabraIndex = 0;
        utterance.onboundary = function(event) {
            if (event.name === 'word') {
                const anterior = document.getElementById(`palabra-${palabraIndex - 1}`);
                if (anterior) anterior.classList.remove("activa");

                const actual = document.getElementById(`palabra-${palabraIndex}`);
                if (actual) actual.classList.add("activa");

                palabraIndex++;
            }
        };
        window.speechSynthesis.speak(utterance);
    }
}

function configurarDragAndDrop() {
    const tarjetas = document.querySelectorAll(".tarjeta-helado");
    const zonasDestino = document.querySelectorAll(".bloque-destino, .bloque-opciones");

    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", e.target.id);
        });
    });

    zonasDestino.forEach(zona => {
        zona.addEventListener("dragover", (e) => { e.preventDefault(); });
        zona.addEventListener("drop", (e) => {
            e.preventDefault();
            const idElemento = e.dataTransfer.getData("text/plain");
            const elementoArrastrado = document.getElementById(idElemento);
            if (elementoArrastrado) {
                if (zona.classList.contains("bloque-destino")) {
                    const viejo = zona.querySelector(".tarjeta-helado");
                    if (viejo) document.querySelector(".bloque-opciones").appendChild(viejo);
                }
                zona.appendChild(elementoArrastrado);
            }
        });
    });
}

function recargarNivel() { window.location.reload(); }