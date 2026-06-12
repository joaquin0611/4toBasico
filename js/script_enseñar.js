// VARIABLES DE LA PANTALLA ENSEÑAR
let numeroSeleccionado = 0;
let textoVoz = "¡Selecciona un número para aprender a contar!";

// Colección para guardar los números únicos que el niño ya presionó
let numerosVistos = new Set();

// ELEMENTOS DE LA PANTALLA
const elNumeroPantalla = document.getElementById("numero-pantalla");
const elTextoInstruccion = document.getElementById("texto-instruccion");
const elBtnVoz = document.getElementById("btn-reproducir-voz");
const elContenedorHelados = document.getElementById("contenedor-helados-visibles");
const elBtnIrAlJuego = document.getElementById("btn-ir-al-juego"); 

// 1. FUNCIÓN PARA REPRODUCIR LA VOZ DE FORMA INMEDIATA
function hablarNumero() {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); 
        
        const enunciado = new SpeechSynthesisUtterance(textoVoz);
        enunciado.lang = 'es-CL'; 
        enunciado.rate = 1.2;     
        enunciado.pitch = 1.2;    
        
        window.speechSynthesis.speak(enunciado);
    }
}

elBtnVoz.addEventListener("click", hablarNumero);

// 2. FUNCIÓN PRINCIPAL: MUESTRA LOS HELADOS CON SUS NÚMEROS Y MARCA EL BOTÓN EN VERDE
function presionarNumeroDirecto(numero, botonElemento) {
    numeroSeleccionado = numero;
    
    // Guardamos el número en la lista de completados
    numerosVistos.add(numero);
    
    // PINTAR EN VERDE PERMANENTE: Agregamos la clase activa al botón presionado
    botonElemento.classList.add("activo");
    
    // Si ya completó los 10 números, se revela el botón de la heladería
    if (numerosVistos.size === 10) {
        elBtnIrAlJuego.style.display = "block";
    }
    
    elNumeroPantalla.innerText = numeroSeleccionado;
    elTextoInstruccion.innerText = `¡Aquí tienes ${numeroSeleccionado} helados!`;
    
    textoVoz = `${numeroSeleccionado}`;
    hablarNumero();
    
    // Limpiamos los helados anteriores
    elContenedorHelados.innerHTML = "";
    
    // Dibujamos la cantidad de helados con sus números internos correspondientes
    for (let i = 0; i < numeroSeleccionado; i++) {
        const numeroHelado = i + 1;

        // Creamos un contenedor especial para agrupar la imagen y el texto del número
        const contenedorIndividual = document.createElement("div");
        contenedorIndividual.classList.add("helado-individual-contenedor");

        // Creamos la etiqueta de texto que irá sobre el helado
        const textoNumero = document.createElement("span");
        textoNumero.classList.add("numero-sobre-helado");
        textoNumero.innerText = numeroHelado;

        // Creamos la imagen del helado original
        const imgHelado = document.createElement("img");
        imgHelado.src = "img/nvhelado.pmg.avif";
        imgHelado.classList.add("helado-generado");
        imgHelado.alt = "Helado";
        
        // Al hacer clic en el helado o en su número, dice el conteo correspondiente
        contenedorIndividual.addEventListener("click", function(evento) {
            evento.stopPropagation(); 
            textoVoz = `${numeroHelado}`;
            hablarNumero();
        });
        
        // Montamos el número y la imagen dentro de su contenedor de forma ordenada
        contenedorIndividual.appendChild(imgHelado);
        contenedorIndividual.appendChild(textoNumero);
        
        // Lo añadimos a la pantalla principal
        elContenedorHelados.appendChild(contenedorIndividual);
    }
}

// 3. REINICIAR LA PANTALLA
function reiniciarContador() {
    numeroSeleccionado = 0;
    numerosVistos.clear(); 
    elBtnIrAlJuego.style.display = "none"; 
    
    // Quitamos el color verde de TODOS los botones del panel
    const botones = document.querySelectorAll(".btn-num");
    botones.forEach(btn => btn.classList.remove("activo"));
    
    elNumeroPantalla.innerText = "0";
    elContenedorHelados.innerHTML = ""; 
    textoVoz = "¡Selecciona un número para aprender a contar!";
    elTextoInstruccion.innerText = textoVoz;
    hablarNumero();
}