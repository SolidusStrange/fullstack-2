const usuarios = [
    { usuario: "admin", contrasena: "admin", nombre: "Paciente de prueba" }
];

const medicos = [
    { id: 1, nombre: "Dra. Ana Morales", especialidad: "Medicina general" },
    { id: 2, nombre: "Dr. Pablo Rojas", especialidad: "Medicina general" },
    { id: 3, nombre: "Dra. Camila Soto", especialidad: "Pediatría" },
    { id: 4, nombre: "Dr. Diego Fuentes", especialidad: "Cardiología" }
];

// Horas que cada médico atiende por fecha.
const disponibilidad = {
    1: {
        "2026-10-24": ["09:00", "10:00", "11:00"],
        "2026-10-26": ["14:00", "15:00"]
    },
    2: {
        "2026-10-24": ["12:00", "15:00"],
        "2026-10-27": ["09:00", "10:00"]
    },
    3: {
        "2026-10-25": ["09:30", "10:30", "11:30"],
        "2026-10-28": ["14:30", "15:30"]
    },
    4: {
        "2026-10-26": ["08:30", "09:30"],
        "2026-10-29": ["16:00", "17:00"]
    }
};

// Estas citas existen antes de que la persona use la página.
const citasIniciales = [
    { medicoId: 1, fecha: "2026-10-24", hora: "09:00", paciente: "Otro paciente" },
    { medicoId: 3, fecha: "2026-10-25", hora: "10:30", paciente: "Otro paciente" },
    { medicoId: 4, fecha: "2026-10-26", hora: "08:30", paciente: "Otro paciente" }
];

const CLAVE_CITAS = "clinicaSaludCitas";
const CLAVE_USUARIO = "clinicaSaludUsuario";
const CLAVE_USUARIOS_REGISTRADOS = "clinicaSaludUsuariosRegistrados";

// -------------------- Funciones generales --------------------

function validarInputVacio() {
    for (let i = 0; i < arguments.length; i++) {
        if (arguments[i] === "") {
            alert("Ningún campo puede quedar vacío.");
            return true;
        }
    }

    return false;
}

function obtenerCitas() {
    const citasLocalStorage = localStorage.getItem(CLAVE_CITAS);

    if (citasLocalStorage === null) {
        return citasIniciales;
    }

    return JSON.parse(citasLocalStorage);
}

function guardarCitas(citas) {
    localStorage.setItem(CLAVE_CITAS, JSON.stringify(citas));
}

function obtenerUsuarioActual() {
    const usuarioLocalStorage = localStorage.getItem(CLAVE_USUARIO);

    if (usuarioLocalStorage === null) {
        return null;
    }

    return JSON.parse(usuarioLocalStorage);
}

function obtenerUsuariosRegistrados() {
    const usuariosLocalStorage = localStorage.getItem(CLAVE_USUARIOS_REGISTRADOS);

    if (usuariosLocalStorage === null) {
        return [];
    }

    return JSON.parse(usuariosLocalStorage);
}

function obtenerTodosLosUsuarios() {
    const usuariosRegistrados = obtenerUsuariosRegistrados();
    const todosLosUsuarios = [];

    for (let i = 0; i < usuarios.length; i++) {
        todosLosUsuarios.push(usuarios[i]);
    }

    for (let i = 0; i < usuariosRegistrados.length; i++) {
        todosLosUsuarios.push(usuariosRegistrados[i]);
    }

    return todosLosUsuarios;
}

function validarContrasena(contrasena) {
    let tieneMayuscula = false;
    let tieneMinuscula = false;

    if (contrasena.length < 8) {
        alert("La contraseña debe tener al menos 8 caracteres.");
        return true;
    }

    for (let i = 0; i < contrasena.length; i++) {
        if (contrasena[i] >= "A" && contrasena[i] <= "Z") {
            tieneMayuscula = true;
        }

        if (contrasena[i] >= "a" && contrasena[i] <= "z") {
            tieneMinuscula = true;
        }
    }

    if (tieneMayuscula === false || tieneMinuscula === false) {
        alert("La contraseña debe incluir una mayúscula y una minúscula.");
        return true;
    }

    return false;
}

function protegerPagina() {
    if (obtenerUsuarioActual() === null) {
        window.location = "login.html";
        return false;
    }

    return true;
}

function obtenerMedicoPorId(idMedico) {
    for (let i = 0; i < medicos.length; i++) {
        if (medicos[i].id === idMedico) {
            return medicos[i];
        }
    }

    return null;
}

function estaOcupado(idMedico, fecha, hora) {
    const citas = obtenerCitas();

    for (let i = 0; i < citas.length; i++) {
        if (
            citas[i].medicoId === idMedico &&
            citas[i].fecha === fecha &&
            citas[i].hora === hora
        ) {
            return true;
        }
    }

    return false;
}

function obtenerHorasLibres(idMedico, fecha) {
    const horasLibres = [];
    const horasDelMedico = disponibilidad[idMedico][fecha];

    if (horasDelMedico === undefined) {
        return horasLibres;
    }

    for (let i = 0; i < horasDelMedico.length; i++) {
        if (estaOcupado(idMedico, fecha, horasDelMedico[i]) === false) {
            horasLibres.push(horasDelMedico[i]);
        }
    }

    return horasLibres;
}

function formatoFecha(fecha) {
    const fechaSeparada = fecha.split("-");
    return fechaSeparada[2] + "/" + fechaSeparada[1] + "/" + fechaSeparada[0];
}

// -------------------- Login --------------------

function iniciarLogin() {
    if (obtenerUsuarioActual() !== null) {
        window.location = "index.html";
        return;
    }

    const formularioJS = document.getElementById("form-login");

    formularioJS.addEventListener("submit", function (event) {
        event.preventDefault();

        const usuarioIngresado = document.getElementById("usuario").value.trim();
        const contrasenaIngresada = document.getElementById("contrasena").value.trim();
        const mensajeLogin = document.getElementById("mensaje-login");

        // Si la función devuelve true, detenemos el proceso.
        if (validarInputVacio(usuarioIngresado, contrasenaIngresada)) {
            return;
        }

        let usuarioValido = null;

        const todosLosUsuarios = obtenerTodosLosUsuarios();

        for (let i = 0; i < todosLosUsuarios.length; i++) {
            if (
                todosLosUsuarios[i].usuario === usuarioIngresado &&
                todosLosUsuarios[i].contrasena === contrasenaIngresada
            ) {
                usuarioValido = todosLosUsuarios[i];
            }
        }

        if (usuarioValido === null) {
            mensajeLogin.textContent = "Usuario o contraseña incorrectos.";
            return;
        }

        const usuario = {
            usuario: usuarioValido.usuario,
            nombre: usuarioValido.nombre
        };

        console.log("El usuario es:", usuario);
        localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
        window.location = "index.html";
    });
}

// -------------------- Registro --------------------

function iniciarRegistro() {
    const formularioJS = document.getElementById("form-registro");

    formularioJS.addEventListener("submit", function (event) {
        event.preventDefault();

        const nombre = document.getElementById("nombre-registro").value.trim();
        const usuarioIngresado = document.getElementById("usuario-registro").value.trim();
        const contrasena = document.getElementById("contrasena-registro").value.trim();
        const confirmarContrasena = document.getElementById("confirmar-contrasena").value.trim();
        const mensajeRegistro = document.getElementById("mensaje-registro");

        if (validarInputVacio(nombre, usuarioIngresado, contrasena, confirmarContrasena)) {
            return;
        }

        if (validarContrasena(contrasena)) {
            return;
        }

        if (contrasena !== confirmarContrasena) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        const todosLosUsuarios = obtenerTodosLosUsuarios();

        for (let i = 0; i < todosLosUsuarios.length; i++) {
            if (todosLosUsuarios[i].usuario === usuarioIngresado) {
                mensajeRegistro.textContent = "Ese usuario ya existe. Elige otro.";
                return;
            }
        }

        const usuario = {
            nombre: nombre,
            usuario: usuarioIngresado,
            contrasena: contrasena
        };
        const usuariosRegistrados = obtenerUsuariosRegistrados();

        usuariosRegistrados.push(usuario);
        localStorage.setItem(CLAVE_USUARIOS_REGISTRADOS, JSON.stringify(usuariosRegistrados));
        console.log("Usuario registrado:", usuario);

        mensajeRegistro.textContent = "Registro exitoso. Ahora puedes iniciar sesión.";
        formularioJS.reset();
    });
}

// -------------------- Página principal --------------------

function iniciarInicio() {
    if (protegerPagina() === false) {
        return;
    }

    const usuario = obtenerUsuarioActual();
    const selectorEspecialidad = document.getElementById("especialidad");
    const listaMedicos = document.getElementById("lista-medicos");
    const mensajeMedicos = document.getElementById("mensaje-medicos");
    const misCitas = document.getElementById("mis-citas");

    document.getElementById("saludo-usuario").textContent = "Hola, " + usuario.nombre + ".";

    cargarEspecialidades(selectorEspecialidad);
    mostrarMisCitas(usuario.nombre, misCitas);

    selectorEspecialidad.addEventListener("change", function () {
        mostrarMedicos(selectorEspecialidad.value, listaMedicos, mensajeMedicos);
    });

    document.getElementById("cerrar-sesion").addEventListener("click", function () {
        localStorage.removeItem(CLAVE_USUARIO);
        window.location = "login.html";
    });
}

function cargarEspecialidades(selectorEspecialidad) {
    for (let i = 0; i < medicos.length; i++) {
        let especialidadRepetida = false;

        for (let j = 0; j < i; j++) {
            if (medicos[i].especialidad === medicos[j].especialidad) {
                especialidadRepetida = true;
            }
        }

        if (especialidadRepetida === false) {
            const opcion = document.createElement("option");
            opcion.value = medicos[i].especialidad;
            opcion.textContent = medicos[i].especialidad;
            selectorEspecialidad.appendChild(opcion);
        }
    }
}

function mostrarMedicos(especialidad, listaMedicos, mensajeMedicos) {
    listaMedicos.innerHTML = "";

    if (especialidad === "") {
        mensajeMedicos.textContent = "Selecciona una especialidad para ver los médicos.";
        return;
    }

    let cantidadMedicos = 0;

    for (let i = 0; i < medicos.length; i++) {
        if (medicos[i].especialidad === especialidad) {
            cantidadMedicos++;

            const articulo = document.createElement("article");
            const icono = document.createElement("i");
            const titulo = document.createElement("h3");
            const texto = document.createElement("p");
            const enlace = document.createElement("a");

            icono.className = "fa-solid fa-user-doctor icono-medico";
            icono.setAttribute("aria-hidden", "true");
            titulo.textContent = medicos[i].nombre;
            texto.textContent = medicos[i].especialidad;
            enlace.textContent = "Ver disponibilidad y reservar";
            enlace.href = "citas.html?medico=" + medicos[i].id;

            articulo.appendChild(icono);
            articulo.appendChild(titulo);
            articulo.appendChild(texto);
            articulo.appendChild(enlace);
            listaMedicos.appendChild(articulo);
        }
    }

    mensajeMedicos.textContent = "Se encontraron " + cantidadMedicos + " médico(s).";
}

function mostrarMisCitas(nombreUsuario, contenedor) {
    const citas = obtenerCitas();
    const lista = document.createElement("ul");
    let tieneCitas = false;

    contenedor.innerHTML = "";

    for (let i = 0; i < citas.length; i++) {
        if (citas[i].paciente === nombreUsuario) {
            const medico = obtenerMedicoPorId(citas[i].medicoId);
            const elemento = document.createElement("li");

            elemento.textContent = formatoFecha(citas[i].fecha) + " a las " +
                citas[i].hora + " con " + medico.nombre + ".";
            lista.appendChild(elemento);
            tieneCitas = true;
        }
    }

    if (tieneCitas) {
        contenedor.appendChild(lista);
    } else {
        contenedor.textContent = "Aún no tienes citas reservadas.";
    }
}

// -------------------- Reserva de citas --------------------

function iniciarCitas() {
    if (protegerPagina() === false) {
        return;
    }

    const parametros = new URLSearchParams(window.location.search);
    const idMedico = Number(parametros.get("medico"));
    const medico = obtenerMedicoPorId(idMedico);
    const datosMedico = document.getElementById("datos-medico");
    const tituloMes = document.getElementById("mes-actual");
    const calendario = document.getElementById("calendario");
    const mensajeFecha = document.getElementById("mensaje-fecha");
    const mensajeHorarios = document.getElementById("mensaje-horarios");
    const contenedorHorarios = document.getElementById("horarios-disponibles");
    const botonConfirmar = document.getElementById("confirmar-cita");
    const formularioJS = document.getElementById("form-cita");
    let fechaSeleccionada = "";
    let horaSeleccionada = "";

    if (medico === null || disponibilidad[idMedico] === undefined) {
        datosMedico.textContent = "No se encontró el médico solicitado.";
        mensajeHorarios.textContent = "Vuelve a la página principal y selecciona un médico válido.";
        return;
    }

    datosMedico.textContent = medico.nombre + " · " + medico.especialidad;
    const primeraFecha = obtenerPrimeraFecha(idMedico);
    const fechaSeparada = primeraFecha.split("-");
    const mesCalendario = new Date(Number(fechaSeparada[0]), Number(fechaSeparada[1]) - 1, 1);

    function dibujarCalendario() {
        const nombresMeses = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];
        const anio = mesCalendario.getFullYear();
        const mes = mesCalendario.getMonth();
        const primerDiaSemana = new Date(anio, mes, 1).getDay();
        const cantidadDiasMes = new Date(anio, mes + 1, 0).getDate();
        let numeroDia = 1;

        tituloMes.textContent = nombresMeses[mes] + " " + anio;
        calendario.innerHTML = "";

        // Se forman seis filas de siete días, como un calendario convencional.
        for (let fila = 0; fila < 6; fila++) {
            const filaCalendario = document.createElement("tr");

            for (let columna = 0; columna < 7; columna++) {
                const celda = document.createElement("td");
                const posicion = fila * 7 + columna;

                if (posicion < primerDiaSemana || numeroDia > cantidadDiasMes) {
                    celda.textContent = "";
                } else {
                    const fecha = crearFecha(anio, mes + 1, numeroDia);
                    const botonDia = document.createElement("button");
                    const tieneHoras = disponibilidad[idMedico][fecha] !== undefined;
                    const horasLibres = obtenerHorasLibres(idMedico, fecha);

                    botonDia.type = "button";
                    botonDia.className = "boton-dia";
                    botonDia.setAttribute("data-fecha", fecha);
                    botonDia.textContent = numeroDia;

                    if (fecha === fechaSeleccionada) {
                        botonDia.textContent = numeroDia + " (seleccionado)";
                        botonDia.setAttribute("aria-pressed", "true");
                    }

                    // Un día sin agenda o con todas sus horas tomadas no puede seleccionarse.
                    if (tieneHoras === false || horasLibres.length === 0) {
                        botonDia.disabled = true;
                        botonDia.title = "No hay horas disponibles este día.";
                    } else {
                        botonDia.addEventListener("click", function (event) {
                            fechaSeleccionada = event.target.getAttribute("data-fecha");
                            horaSeleccionada = "";
                            botonConfirmar.disabled = true;
                            mensajeFecha.textContent = "Fecha elegida: " + formatoFecha(fechaSeleccionada) + ".";

                            dibujarCalendario();
                            mostrarHorarios(idMedico, fechaSeleccionada, contenedorHorarios, mensajeHorarios, botonConfirmar, function (hora) {
                                horaSeleccionada = hora;
                            });
                        });
                    }

                    celda.appendChild(botonDia);
                    numeroDia++;
                }

                filaCalendario.appendChild(celda);
            }

            calendario.appendChild(filaCalendario);
        }
    }

    document.getElementById("mes-anterior").addEventListener("click", function () {
        mesCalendario.setMonth(mesCalendario.getMonth() - 1);
        dibujarCalendario();
    });

    document.getElementById("mes-siguiente").addEventListener("click", function () {
        mesCalendario.setMonth(mesCalendario.getMonth() + 1);
        dibujarCalendario();
    });

    formularioJS.addEventListener("submit", function (event) {
        event.preventDefault();

        const motivo = document.getElementById("motivo").value.trim();
        const mensajeCita = document.getElementById("mensaje-cita");

        if (validarInputVacio(fechaSeleccionada, horaSeleccionada, motivo)) {
            return;
        }

        // Comprobamos una vez más antes de guardar la cita.
        if (estaOcupado(idMedico, fechaSeleccionada, horaSeleccionada)) {
            mensajeCita.textContent = "Ese horario ya fue tomado. Selecciona otro.";
            botonConfirmar.disabled = true;
            dibujarCalendario();
            mostrarHorarios(idMedico, fechaSeleccionada, contenedorHorarios, mensajeHorarios, botonConfirmar, function (hora) {
                horaSeleccionada = hora;
            });
            return;
        }

        const usuario = obtenerUsuarioActual();
        const cita = {
            medicoId: idMedico,
            fecha: fechaSeleccionada,
            hora: horaSeleccionada,
            motivo: motivo,
            paciente: usuario.nombre
        };
        const citas = obtenerCitas();

        citas.push(cita);
        console.log("La cita es:", cita);
        guardarCitas(citas);

        mensajeCita.textContent = "Cita confirmada para el " + formatoFecha(fechaSeleccionada) +
            " a las " + horaSeleccionada + " con " + medico.nombre + ".";
        formularioJS.reset();
        horaSeleccionada = "";
        botonConfirmar.disabled = true;
        dibujarCalendario();
        mostrarHorarios(idMedico, fechaSeleccionada, contenedorHorarios, mensajeHorarios, botonConfirmar, function (hora) {
            horaSeleccionada = hora;
        });
    });

    dibujarCalendario();
}

function obtenerPrimeraFecha(idMedico) {
    for (let fecha in disponibilidad[idMedico]) {
        return fecha;
    }

    return "2026-01-01";
}

function crearFecha(anio, mes, dia) {
    let mesTexto = mes;
    let diaTexto = dia;

    if (mes < 10) {
        mesTexto = "0" + mes;
    }

    if (dia < 10) {
        diaTexto = "0" + dia;
    }

    return anio + "-" + mesTexto + "-" + diaTexto;
}

function mostrarHorarios(idMedico, fecha, contenedorHorarios, mensajeHorarios, botonConfirmar, guardarHoraSeleccionada) {
    contenedorHorarios.innerHTML = "";
    botonConfirmar.disabled = true;

    if (fecha === "") {
        mensajeHorarios.textContent = "Elige una fecha para consultar los horarios.";
        return;
    }

    const horasLibres = obtenerHorasLibres(idMedico, fecha);

    if (horasLibres.length === 0) {
        mensajeHorarios.textContent = "El médico no tiene horarios disponibles en esta fecha.";
        return;
    }

    mensajeHorarios.textContent = "Selecciona un horario disponible:";

    for (let i = 0; i < horasLibres.length; i++) {
        const botonHora = document.createElement("button");
        botonHora.type = "button";
        botonHora.className = "boton-hora";
        botonHora.textContent = horasLibres[i];
        botonHora.setAttribute("data-hora", horasLibres[i]);

        botonHora.addEventListener("click", function (event) {
            const botones = contenedorHorarios.getElementsByTagName("button");

            for (let j = 0; j < botones.length; j++) {
                botones[j].setAttribute("aria-pressed", "false");
            }

            event.target.setAttribute("aria-pressed", "true");
            guardarHoraSeleccionada(event.target.getAttribute("data-hora"));
            botonConfirmar.disabled = false;
        });

        contenedorHorarios.appendChild(botonHora);
        contenedorHorarios.appendChild(document.createTextNode(" "));
    }
}

// Reconocemos la página abierta y ejecutamos la función que corresponde.
document.addEventListener("DOMContentLoaded", function () {
    const pagina = document.body.getAttribute("data-page");

    if (pagina === "login") {
        iniciarLogin();
    }

    if (pagina === "registro") {
        iniciarRegistro();
    }

    if (pagina === "inicio") {
        iniciarInicio();
    }

    if (pagina === "citas") {
        iniciarCitas();
    }
});
