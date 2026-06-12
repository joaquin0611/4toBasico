function reproducirSeleccion() {
    const saludo = new SpeechSynthesisUtterance("¡Me gusta ese avatar!");
    saludo.lang = 'es-ES';
    window.speechSynthesis.speak(saludo);
}

function ingresar() {
    const nombre = document.getElementById("nombre").value;
    const avatarSeleccionado = document.querySelector('input[name="avatar"]:checked');

    if (nombre.trim() === "") {
        alert("Por favor, escribe tu nombre");
        const mensaje = new SpeechSynthesisUtterance("Por favor, escribe tu nombre para comenzar");
        mensaje.lang = 'es-ES';
        window.speechSynthesis.speak(mensaje);
        return;
    }

    if (!avatarSeleccionado) {
        alert("¡No olvides elegir tu avatar!");
        return;
    }

    // Guardamos los datos para usarlos en las otras páginas
    localStorage.setItem("usuario", nombre);
    localStorage.setItem("foto", avatarSeleccionado.value);

    // Redirigir a la página de bienvenida
    window.location.href = "bienvenida.html";
}


