// VARIABLES DEL JUEGO
let ordenDelCliente = 0;
let heladosEntregados = 0;
let buenasLlevas = 0; 

// ELEMENTOS DE LA PANTALLA
const elPedidoTexto = document.getElementById("pedido-texto");
const elConoHeladosDados = document.getElementById("cono-helados-dados");

// 🌟 NUEVA FUNCIÓN: Habla y subraya el texto en la burbuja del cliente al mismo tiempo
function hablarConKaraoke(textoAHechicero, funcionAlTerminar = null) {
    if (!('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel(); 

    // 1. Dividir el texto en palabras individuales dentro de la burbuja
    const palabras = textoAHechicero.split(" ");
    elPedidoTexto.innerHTML = palabras.map((palabra, indice) => {
        return `<span class="palabra-juego" id="palabra-juego-${indice}">${palabra}</span>`;
    }).join(" ");

    // 2. Configurar el enunciado de voz
    const mensaje = new SpeechSynthesisUtterance(textoAHechicero);
    mensaje.lang = 'es-CL';
    mensaje.rate = 1.0; 
    mensaje.pitch = 1.2;

    let palabraIndice = 0;

    // Evento que se ejecuta palabra por palabra
    mensaje.onboundary = function(event) {
        if (event.name === 'word') {
            const anterior = document.getElementById(`palabra-juego-${palabraIndice - 1}`);
            if (anterior) anterior.classList.remove("resaltada");

            const actual = document.getElementById(`palabra-juego-${palabraIndice}`);
            if (actual) actual.classList.add("resaltada");
            
            palabraIndice++;
        }
    };

    // 🌟 LA CLAVE: Espera a que termine de hablar para ejecutar la acción siguiente
    mensaje.onend = function() {
        const ultima = document.getElementById(`palabra-juego-${palabraIndice - 1}`);
        if (ultima) ultima.classList.remove("resaltada");
        
        // Si hay una acción programada (como pasar de nivel), se ejecuta AQUÍ
        if (funcionAlTerminar) {
            setTimeout(funcionAlTerminar, 400); // Pequeña pausa natural antes del cambio
        }
    };

    window.speechSynthesis.speak(mensaje);
}

// Genera una orden al iniciar o cambiar de cliente
function generarNuevaOrden() {
    ordenDelCliente = Math.floor(Math.random() * 10) + 1;
    const fraseInicial = `¡Hola! Quiero ${ordenDelCliente} helados por favor.`;
    hablarConKaraoke(fraseInicial);
}

function repetirPedido() {
    const fraseRepetir = `Quiero ${ordenDelCliente} helados.`;
    hablarConKaraoke(fraseRepetir);
}

// MECÁNICA DRAG AND DROP / CLICK
function iniciarArrastre(evento) {
    evento.dataTransfer.setData("text/plain", evento.target.id);
}

function permitirSoltar(evento) {
    evento.preventDefault(); 
}

function soltarHelado(evento) {
    evento.preventDefault();
    agregarBolaVisual();
}

function servirPorClick() {
    agregarBolaVisual();
}

function agregarBolaVisual() {
    if (heladosEntregados < 10) {
        heladosEntregados++;

        const nuevaBola = document.createElement("div");
        nuevaBola.classList.add("bola-helado-juego");
        nuevaBola.innerText = heladosEntregados; 
        
        const saboresColores = ["#ffb7b2", "#ffdac1", "#e2f0cb", "#b5ead7", "#c7ceea", "#ff9aa2", "#f8ebb2"];
        nuevaBola.style.backgroundColor = saboresColores[heladosEntregados % saboresColores.length];

        elConoHeladosDados.appendChild(nuevaBola);
    }
}

// Actualiza visualmente el marcador de estrellas superior
function actualizarEstrellasGraficas() {
    document.getElementById("texto-contador").innerText = `(${buenasLlevas} / 3)`;
    for (let i = 1; i <= 3; i++) {
        const estrella = document.getElementById(`estrella-${i}`);
        if (i <= buenasLlevas) {
            estrella.classList.add("activa");
        } else {
            estrella.classList.remove("activa");
        }
    }
}

// VALIDACIÓN CON ESPERA DE VOZ (Rúbrica)
function verificarPedido() {
    if (heladosEntregados === ordenDelCliente) {
        buenasLlevas++; 
        actualizarEstrellasGraficas();

        // Lanzar una ráfaga de confeti intermedia
        confetti({ particleCount: 50, spread: 40, origin: { y: 0.6 } });

        // Sonido corto de acierto
        const audioVictoria = new Audio('sonidos/correcto.mp3');
        audioVictoria.play().catch(e => console.log("Nota: Archivo 'correcto.mp3' listo."));

        if (buenasLlevas >= 3) {
            // 🌟 ESPERA A QUE TERMINE DE HABLAR para ir a felicitaciones.html
            const fraseFin = "¡Felicidades! Completaste todos los pedidos de la heladería.";
            hablarConKaraoke(fraseFin, () => {
                window.location.href = "felicitaciones.html";
            });
        } else {
            // 🌟 ESPERA A QUE TERMINE DE HABLAR para traer al siguiente cliente
            const fraseSiguiente = `¡Muy bien! ¡Llevas ${buenasLlevas} buena! Atendamos al siguiente cliente.`;
            hablarConKaraoke(fraseSiguiente, () => {
                heladosEntregados = 0;
                elConoHeladosDados.innerHTML = ""; 
                generarNuevaOrden(); 
            });
        }

    } else {
        // ERROR: Reinicia la racha y espera que termine el reto
        buenasLlevas = 0; 
        actualizarEstrellasGraficas();

        const audioError = new Audio('sonidos/incorrecto.mp3');
        audioError.play().catch(e => console.log("Nota: Archivo 'incorrecto.mp3' listo."));

        const fraseError = "Ups, esa no es la cantidad. Tu racha volvió a cero, inténtalo de nuevo.";
        hablarConKaraoke(fraseError, () => {
            // Opcional: Limpiar el helado incorrecto automáticamente al terminar de hablar para que lo intente de nuevo limpia la mesa
            heladosEntregados = 0;
            elConoHeladosDados.innerHTML = "";
        });
    }
}

function reiniciarJuego() {
    heladosEntregados = 0;
    buenasLlevas = 0;
    actualizarEstrellasGraficas();
    elConoHeladosDados.innerHTML = "";
    generarNuevaOrden();
}

window.onload = generarNuevaOrden;