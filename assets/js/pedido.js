/* =========================================================
   GYM STORE
   PEDIDO.JS
   =========================================================
   FUNCIONES:
   - Mostrar carrito
   - Aumentar cantidad
   - Disminuir cantidad
   - Eliminar productos
   - Vaciar carrito
   - Confirmación con Bootstrap Modal
   - Alertas Bootstrap
   - Actualizar contador
   - Actualizar resumen
   - Validar formulario
   - Guardar pedido actual
   - Generar número consecutivo
   - Calcular total
   - Generar comprobante PDF
   ========================================================= */


/* =========================================================
   INICIO
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("GYM STORE - pedido.js iniciado");

    mostrarCarritoPedido();

    activarBotonVaciar();

    activarFormulario();

});


/* =========================================================
   OBTENER CARRITO
   ========================================================= */

function obtenerCarritoPedido() {

    try {

        const carritoGuardado =
            localStorage.getItem("carrito");

        if (!carritoGuardado) {
            return [];
        }

        const carrito =
            JSON.parse(carritoGuardado);

        if (!Array.isArray(carrito)) {
            return [];
        }

        return carrito;

    } catch (error) {

        console.error(
            "Error al leer el carrito:",
            error
        );

        return [];

    }

}


/* =========================================================
   GUARDAR CARRITO
   ========================================================= */

function guardarCarritoPedido(carrito) {

    try {

        localStorage.setItem(
            "carrito",
            JSON.stringify(carrito)
        );

        return true;

    } catch (error) {

        console.error(
            "Error al guardar el carrito:",
            error
        );

        mostrarAlertaPedido(
            "No fue posible actualizar el pedido.",
            "danger"
        );

        return false;

    }

}


/* =========================================================
   MOSTRAR CARRITO
   ========================================================= */

function mostrarCarritoPedido() {

    const contenedor =
        document.getElementById(
            "pedidoProductos"
        );


    if (!contenedor) {

        console.error(
            "No existe el elemento #pedidoProductos"
        );

        return;

    }


    const carrito =
        obtenerCarritoPedido();


    contenedor.innerHTML = "";


    /* =====================================================
       CARRITO VACÍO
       ===================================================== */

    if (carrito.length === 0) {

        contenedor.innerHTML = `

            <div class="pedido-vacio">

                <div class="pedido-vacio-icon">
                    🛒
                </div>

                <h2>
                    TU PEDIDO ESTÁ VACÍO
                </h2>

                <p>
                    Agrega productos desde nuestro
                    catálogo para comenzar tu pedido.
                </p>

                <a
                    href="catalogo.html"
                    class="btn btn-primary"
                >
                    VER CATÁLOGO
                </a>

            </div>

        `;


        const formulario =
            document.getElementById(
                "clienteFormulario"
            );


        if (formulario) {

            formulario.style.display =
                "none";

        }


        actualizarResumenPedido();

        actualizarContadorPedido();

        return;

    }


    /* =====================================================
       MOSTRAR FORMULARIO
       ===================================================== */

    const formulario =
        document.getElementById(
            "clienteFormulario"
        );


    if (formulario) {

        formulario.style.display =
            "block";

    }


    /* =====================================================
       CREAR PRODUCTOS
       ===================================================== */

    carrito.forEach(
        function (producto, indice) {

            const tarjeta =
                document.createElement(
                    "article"
                );


            tarjeta.className =
                "pedido-item";


            const precio =
                Number(
                    producto.precio || 0
                );


            const cantidad =
                Number(
                    producto.cantidad || 1
                );


            const subtotal =
                precio * cantidad;


            tarjeta.innerHTML = `

                <div class="pedido-item-imagen">

                    <img
                        src="${producto.imagen || ""}"
                        alt="${producto.nombre || "Producto"}"
                    >

                    <div
                        class="pedido-item-placeholder"
                        style="display:none;"
                    >
                        GYM
                    </div>

                </div>


                <div class="pedido-item-info">

                    <span class="producto-categoria">
                        ${producto.id || ""}
                    </span>

                    <h3>
                        ${producto.nombre || "Producto"}
                    </h3>

                    <p>
                        Talla:
                        <strong>
                            ${producto.talla || "N/A"}
                        </strong>
                    </p>

                    <p class="pedido-item-precio">
                        $${precio.toLocaleString("es-MX")}
                        MXN
                    </p>

                </div>


                <div class="pedido-item-cantidad">

                    <span>
                        CANTIDAD
                    </span>

                    <div class="cantidad-control">

                        <button
                            type="button"
                            class="cantidad-btn"
                            data-accion="menos"
                            data-indice="${indice}"
                        >
                            −
                        </button>


                        <strong>
                            ${cantidad}
                        </strong>


                        <button
                            type="button"
                            class="cantidad-btn"
                            data-accion="mas"
                            data-indice="${indice}"
                        >
                            +
                        </button>

                    </div>

                </div>


                <div class="pedido-item-subtotal">

                    <span>
                        SUBTOTAL
                    </span>

                    <strong>
                        $${subtotal.toLocaleString("es-MX")}
                        MXN
                    </strong>

                </div>


                <button
                    type="button"
                    class="pedido-item-eliminar"
                    data-indice="${indice}"
                    aria-label="Eliminar producto"
                >
                    ×
                </button>

            `;


            /* =================================================
               ERROR DE IMAGEN
               ================================================= */

            const imagen =
                tarjeta.querySelector("img");


            if (imagen) {

                imagen.addEventListener(
                    "error",
                    function () {

                        imagen.style.display =
                            "none";


                        const placeholder =
                            imagen.nextElementSibling;


                        if (placeholder) {

                            placeholder.style.display =
                                "flex";

                        }

                    }
                );

            }


            contenedor.appendChild(
                tarjeta
            );

        }
    );


    activarControlesCantidad();

    actualizarResumenPedido();

    actualizarContadorPedido();

}


/* =========================================================
   CONTROLES DE CANTIDAD
   ========================================================= */

function activarControlesCantidad() {

    const botones =
        document.querySelectorAll(
            ".cantidad-btn, .pedido-item-eliminar"
        );


    botones.forEach(
        function (boton) {

            if (
                boton.dataset.eventoActivo ===
                "true"
            ) {

                return;

            }


            boton.dataset.eventoActivo =
                "true";


            boton.addEventListener(
                "click",
                function () {

                    const indice =
                        Number(
                            boton.dataset.indice
                        );


                    if (
                        !Number.isInteger(
                            indice
                        )
                    ) {

                        return;

                    }


                    const carrito =
                        obtenerCarritoPedido();


                    if (
                        !carrito[indice]
                    ) {

                        return;

                    }


                    /* =====================================
                       ELIMINAR
                       ===================================== */

                    if (
                        boton.classList.contains(
                            "pedido-item-eliminar"
                        )
                    ) {

                        carrito.splice(
                            indice,
                            1
                        );


                        guardarCarritoPedido(
                            carrito
                        );


                        mostrarCarritoPedido();


                        mostrarAlertaPedido(
                            "Producto eliminado del pedido.",
                            "success"
                        );


                        return;

                    }


                    /* =====================================
                       AUMENTAR
                       ===================================== */

                    if (
                        boton.dataset.accion ===
                        "mas"
                    ) {

                        carrito[indice].cantidad =
                            Number(
                                carrito[indice].cantidad || 1
                            ) + 1;

                    }


                    /* =====================================
                       DISMINUIR
                       ===================================== */

                    if (
                        boton.dataset.accion ===
                        "menos"
                    ) {

                        carrito[indice].cantidad =
                            Number(
                                carrito[indice].cantidad || 1
                            ) - 1;


                        if (
                            carrito[indice].cantidad <= 0
                        ) {

                            carrito.splice(
                                indice,
                                1
                            );

                        }

                    }


                    guardarCarritoPedido(
                        carrito
                    );


                    mostrarCarritoPedido();

                }
            );

        }
    );

}


/* =========================================================
   BOTÓN VACIAR PEDIDO
   ========================================================= */

function activarBotonVaciar() {

    const boton =
        document.getElementById(
            "btnVaciar"
        );


    if (!boton) {

        console.warn(
            "No existe #btnVaciar"
        );

        return;

    }


    if (
        boton.dataset.eventoActivo ===
        "true"
    ) {

        return;

    }


    boton.dataset.eventoActivo =
        "true";


    boton.addEventListener(
        "click",
        function (evento) {

            evento.preventDefault();

            evento.stopPropagation();


            const carrito =
                obtenerCarritoPedido();


            if (
                carrito.length === 0
            ) {

                mostrarAlertaPedido(
                    "El pedido ya está vacío.",
                    "warning"
                );

                return;

            }


            abrirModalVaciarPedido();

        }
    );

}


/* =========================================================
   MODAL BOOTSTRAP PARA VACIAR
   ========================================================= */

function abrirModalVaciarPedido() {

    let modalElemento =
        document.getElementById(
            "modalVaciarPedido"
        );


    if (!modalElemento) {

        modalElemento =
            document.createElement(
                "div"
            );


        modalElemento.id =
            "modalVaciarPedido";


        modalElemento.className =
            "modal fade";


        modalElemento.tabIndex =
            -1;


        modalElemento.setAttribute(
            "aria-labelledby",
            "modalVaciarPedidoLabel"
        );


        modalElemento.setAttribute(
            "aria-hidden",
            "true"
        );


        modalElemento.innerHTML = `

            <div class="modal-dialog modal-dialog-centered">

                <div class="modal-content gym-modal-vaciar">

                    <div class="modal-header">

                        <h5
                            class="modal-title"
                            id="modalVaciarPedidoLabel"
                        >
                            ¿VACIAR PEDIDO?
                        </h5>

                        <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Cerrar"
                        ></button>

                    </div>


                    <div class="modal-body text-center">

                        <div class="gym-modal-icon">
                            !
                        </div>

                        <p class="mb-0">

                            Se eliminarán todos los
                            productos de tu pedido.

                            <br>

                            Esta acción no se puede deshacer.

                        </p>

                    </div>


                    <div class="modal-footer">

                        <button
                            type="button"
                            class="btn btn-secondary"
                            data-bs-dismiss="modal"
                        >
                            CANCELAR
                        </button>


                        <button
                            type="button"
                            class="btn btn-danger"
                            id="btnConfirmarVaciado"
                        >
                            SÍ, VACIAR PEDIDO
                        </button>

                    </div>

                </div>

            </div>

        `;


        document.body.appendChild(
            modalElemento
        );

    }


    if (
        typeof bootstrap ===
        "undefined"
    ) {

        console.error(
            "Bootstrap JS no está cargado."
        );


        mostrarAlertaPedido(
            "No se pudo abrir la confirmación. Verifica que Bootstrap JS esté cargado.",
            "danger"
        );


        return;

    }


    const modal =
        bootstrap.Modal.getOrCreateInstance(
            modalElemento
        );


    const botonConfirmar =
        document.getElementById(
            "btnConfirmarVaciado"
        );


    if (botonConfirmar) {

        botonConfirmar.onclick =
            function () {

                vaciarCarritoCompleto(
                    modal
                );

            };

    }


    modal.show();

}


/* =========================================================
   VACIAR CARRITO
   ========================================================= */

function vaciarCarritoCompleto(modal) {

    try {

        localStorage.setItem(
            "carrito",
            JSON.stringify([])
        );


        const carritoVerificacion =
            localStorage.getItem(
                "carrito"
            );


        const carrito =
            JSON.parse(
                carritoVerificacion ||
                "[]"
            );


        if (
            !Array.isArray(carrito) ||
            carrito.length !== 0
        ) {

            throw new Error(
                "El carrito no pudo vaciarse."
            );

        }


        if (modal) {

            modal.hide();

        }


        mostrarCarritoPedido();

        actualizarContadorPedido();

        actualizarResumenPedido();


        mostrarAlertaPedido(
            "El pedido ha sido vaciado correctamente.",
            "success"
        );


        console.log(
            "Carrito vaciado correctamente."
        );


    } catch (error) {

        console.error(
            "Error al vaciar el carrito:",
            error
        );


        mostrarAlertaPedido(
            "No fue posible vaciar el pedido.",
            "danger"
        );

    }

}


/* =========================================================
   ACTUALIZAR CONTADOR
   ========================================================= */

function actualizarContadorPedido() {

    const carrito =
        obtenerCarritoPedido();


    const cantidad =
        carrito.reduce(
            function (
                total,
                producto
            ) {

                return total +
                    Number(
                        producto.cantidad || 1
                    );

            },
            0
        );


    const contador =
        document.getElementById(
            "contadorPedido"
        ) ||
        document.getElementById(
            "cartCount"
        );


    if (contador) {

        /*
         * El HTML actualmente utiliza:
         * <span id="cartCount">(0)</span>
         *
         * Por eso conservamos los paréntesis.
         */

        contador.textContent =
            `(${cantidad})`;

    }

}


/* =========================================================
   ACTUALIZAR RESUMEN
   ========================================================= */

function actualizarResumenPedido() {

    const carrito =
        obtenerCarritoPedido();


    let cantidad =
        0;


    let subtotal =
        0;


    carrito.forEach(
        function (producto) {

            const cantidadProducto =
                Number(
                    producto.cantidad || 1
                );


            const precio =
                Number(
                    producto.precio || 0
                );


            cantidad +=
                cantidadProducto;


            subtotal +=
                precio *
                cantidadProducto;

        }
    );


    const cantidadElemento =
        document.getElementById(
            "resumenCantidad"
        );


    const subtotalElemento =
        document.getElementById(
            "resumenSubtotal"
        );


    const totalElemento =
        document.getElementById(
            "resumenTotal"
        );


    if (cantidadElemento) {

        cantidadElemento.textContent =
            cantidad;

    }


    if (subtotalElemento) {

        subtotalElemento.textContent =
            `$${subtotal.toLocaleString("es-MX")} MXN`;

    }


    if (totalElemento) {

        totalElemento.textContent =
            `$${subtotal.toLocaleString("es-MX")} MXN`;

    }


    actualizarContadorPedido();

}


/* =========================================================
   FORMULARIO
   ========================================================= */

function activarFormulario() {

    const formulario =
        document.getElementById(
            "pedidoForm"
        );


    if (!formulario) {

        console.warn(
            "No existe #pedidoForm"
        );

        return;

    }


    if (
        formulario.dataset.eventoActivo ===
        "true"
    ) {

        return;

    }


    formulario.dataset.eventoActivo =
        "true";


    formulario.addEventListener(
        "submit",
        function (evento) {

            evento.preventDefault();


            const carrito =
                obtenerCarritoPedido();


            /* =========================================
               VALIDAR CARRITO
               ========================================= */

            if (
                carrito.length === 0
            ) {

                mostrarAlertaPedido(
                    "No puedes generar un pedido vacío.",
                    "warning"
                );

                return;

            }


            /* =========================================
               VALIDAR FORMULARIO
               ========================================= */

            if (
                !validarFormulario()
            ) {

                mostrarAlertaPedido(
                    "Revisa los datos marcados en el formulario.",
                    "warning"
                );

                return;

            }


            /* =========================================
               DATOS DEL CLIENTE
               ========================================= */

            const datosCliente = {

                nombre:
                    obtenerValorCampo(
                        "nombre"
                    ),

                telefono:
                    obtenerValorCampo(
                        "telefono"
                    ),

                correo:
                    obtenerValorCampo(
                        "correo"
                    ),

                direccion:
                    obtenerValorCampo(
                        "direccion"
                    ),

                municipio:
                    obtenerValorCampo(
                        "municipio"
                    ),

                estado:
                    obtenerValorCampo(
                        "estado"
                    ),

                codigoPostal:
                    obtenerValorCampo(
                        "codigoPostal"
                    ),

                comentarios:
                    obtenerValorCampo(
                        "comentarios"
                    )

            };


            /* =========================================
               NÚMERO DE PEDIDO
               ========================================= */

            const numeroPedido =
                generarNumeroPedido();


            /* =========================================
               TOTAL
               ========================================= */

            const total =
                calcularTotalPedido(
                    carrito
                );


            /* =========================================
               CREAR PEDIDO
               ========================================= */

            const pedido = {

                numero:
                    numeroPedido,

                cliente:
                    datosCliente,

                productos:
                    carrito,

                fecha:
                    new Date().toISOString(),

                total:
                    total

            };


            /* =========================================
               GUARDAR Y GENERAR PDF
               ========================================= */

            try {

                localStorage.setItem(
                    "pedidoActual",
                    JSON.stringify(
                        pedido
                    )
                );


                /*
                 * Generar PDF antes de vaciar
                 * el carrito.
                 */

                const pdfGenerado =
                    generarPDFPedido(
                        pedido
                    );


                /*
                 * Si jsPDF no está cargado,
                 * NO perdemos el pedido.
                 */

                if (!pdfGenerado) {

                    mostrarAlertaPedido(
                        `El pedido #${numeroPedido} fue registrado, pero no se pudo generar el PDF.`,
                        "warning"
                    );

                    return;

                }


                /* =====================================
                   VACIAR CARRITO
                   ===================================== */

                localStorage.setItem(
                    "carrito",
                    JSON.stringify([])
                );


                /* =====================================
                   ACTUALIZAR INTERFAZ
                   ===================================== */

                mostrarCarritoPedido();

                actualizarContadorPedido();

                actualizarResumenPedido();


                /* =====================================
                   ALERTA
                   ===================================== */

                mostrarAlertaPedido(
                    `¡Pedido #${numeroPedido} generado correctamente! El comprobante PDF fue descargado.`,
                    "success"
                );


                console.log(
                    "Pedido generado:",
                    pedido
                );


            } catch (error) {

                console.error(
                    "Error al generar pedido:",
                    error
                );


                mostrarAlertaPedido(
                    "No fue posible generar el pedido.",
                    "danger"
                );

            }

        }
    );

}


/* =========================================================
   OBTENER VALOR DE CAMPO
   ========================================================= */

function obtenerValorCampo(id) {

    const elemento =
        document.getElementById(id);


    if (!elemento) {

        return "";

    }


    return elemento.value.trim();

}

/* =========================================================
   VALIDAR FORMULARIO
   ========================================================= */

function validarFormulario() {

    let valido =
        true;


    const campos = [

        {
            id: "nombre",
            mensaje:
                "Ingresa tu nombre completo."
        },

        {
            id: "telefono",
            mensaje:
                "Ingresa un teléfono válido."
        },

        {
            id: "correo",
            mensaje:
                "Ingresa un correo electrónico válido."
        },

        {
            id: "direccion",
            mensaje:
                "Ingresa tu dirección."
        },

        {
            id: "municipio",
            mensaje:
                "Ingresa tu municipio."
        },

        {
            id: "estado",
            mensaje:
                "Ingresa tu estado."
        },

        {
            id: "codigoPostal",
            mensaje:
                "Ingresa un código postal válido."
        }

    ];


    campos.forEach(
        function (campo) {

            const elemento =
                document.getElementById(
                    campo.id
                );


            if (!elemento) {

                console.warn(
                    `No existe #${campo.id}`
                );

                return;

            }


            const valor =
                elemento.value.trim();


            const contenedor =
                elemento.parentElement;


            const error =
                contenedor
                    ? contenedor.querySelector(
                        ".form-error"
                    )
                    : null;


            elemento.classList.remove(
                "input-error",
                "input-valid"
            );


            /* =========================================
               CAMPO VACÍO
               ========================================= */

            if (
                valor === ""
            ) {

                elemento.classList.add(
                    "input-error"
                );


                if (error) {

                    error.textContent =
                        campo.mensaje;

                }


                valido =
                    false;


                return;

            }


            /* =========================================
               TELÉFONO
               ========================================= */

            if (
                campo.id === "telefono"
            ) {

                if (
                    !/^[0-9]{10}$/.test(
                        valor
                    )
                ) {

                    elemento.classList.add(
                        "input-error"
                    );


                    if (error) {

                        error.textContent =
                            "El teléfono debe contener 10 dígitos.";

                    }


                    valido =
                        false;


                    return;

                }

            }


            /* =========================================
               CORREO
               ========================================= */

            if (
                campo.id === "correo"
            ) {

                if (
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                        valor
                    )
                ) {

                    elemento.classList.add(
                        "input-error"
                    );


                    if (error) {

                        error.textContent =
                            "Ingresa un correo válido.";

                    }


                    valido =
                        false;


                    return;

                }

            }


            /* =========================================
               CÓDIGO POSTAL
               ========================================= */

            if (
                campo.id === "codigoPostal"
            ) {

                if (
                    !/^[0-9]{5}$/.test(
                        valor
                    )
                ) {

                    elemento.classList.add(
                        "input-error"
                    );


                    if (error) {

                        error.textContent =
                            "El código postal debe contener 5 dígitos.";

                    }


                    valido =
                        false;


                    return;

                }

            }


            /* =========================================
               CAMPO CORRECTO
               ========================================= */

            elemento.classList.add(
                "input-valid"
            );


            if (error) {

                error.textContent =
                    "";

            }

        }
    );


    return valido;

}


/* =========================================================
   GENERAR NÚMERO CONSECUTIVO DE PEDIDO
   ========================================================= */

function generarNumeroPedido() {

    let ultimoNumero =
        Number(
            localStorage.getItem(
                "ultimoNumeroPedido"
            )
        );


    /*
     * Si todavía no existe,
     * comenzamos desde cero.
     */

    if (
        !Number.isInteger(
            ultimoNumero
        ) ||
        ultimoNumero < 0
    ) {

        ultimoNumero =
            0;

    }


    const nuevoNumero =
        ultimoNumero + 1;


    localStorage.setItem(
        "ultimoNumeroPedido",
        nuevoNumero.toString()
    );


    return nuevoNumero;

}


/* =========================================================
   CALCULAR TOTAL DEL PEDIDO
   ========================================================= */

function calcularTotalPedido(carrito) {

    if (
        !Array.isArray(carrito)
    ) {

        return 0;

    }


    let total =
        0;


    carrito.forEach(
        function (producto) {

            const precio =
                Number(
                    producto.precio || 0
                );


            const cantidad =
                Number(
                    producto.cantidad || 1
                );


            total +=
                precio *
                cantidad;

        }
    );


    return total;

}


/* =========================================================
   FORMATEAR FECHA
   ========================================================= */

function formatearFechaPedido(
    fecha
) {

    const fechaObjeto =
        new Date(
            fecha
        );


    if (
        Number.isNaN(
            fechaObjeto.getTime()
        )
    ) {

        return "";

    }


    const dia =
        String(
            fechaObjeto.getDate()
        ).padStart(
            2,
            "0"
        );


    const mes =
        String(
            fechaObjeto.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const anio =
        fechaObjeto.getFullYear();


    return `${dia}/${mes}/${anio}`;

}


/* =========================================================
   FORMATEAR PRECIO
   ========================================================= */

function formatearPrecioPedido(
    cantidad
) {

    return Number(
        cantidad || 0
    ).toLocaleString(
        "es-MX",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

}


/* =========================================================
   ESCAPAR TEXTO PARA PDF
   ========================================================= */

function limpiarTextoPDF(
    texto
) {

    if (
        texto === null ||
        texto === undefined
    ) {

        return "";

    }


    return String(
        texto
    );

}


/* =========================================================
   GENERAR PDF DEL PEDIDO
   ========================================================= */

function generarPDFPedido(
    pedido
) {

    /*
     * jsPDF se carga desde pedido.html.
     */

    if (
        typeof window.jspdf ===
        "undefined"
    ) {

        console.error(
            "jsPDF no está cargado."
        );


        mostrarAlertaPedido(
            "La biblioteca PDF no está cargada. Revisa el script de jsPDF en pedido.html.",
            "danger"
        );


        return false;

    }


    try {

        const {
            jsPDF
        } = window.jspdf;


        const doc =
            new jsPDF();


        /* =================================================
           CONFIGURACIÓN
           ================================================= */

        const margenIzquierdo =
            15;


        const margenDerecho =
            195;


        const anchoPagina =
            210;


        const altoPagina =
            297;


        let posicionY =
            20;


        const cliente =
            pedido.cliente ||
            {};


        const productos =
            Array.isArray(
                pedido.productos
            )
                ? pedido.productos
                : [];


        const total =
            Number(
                pedido.total || 0
            );


        /* =================================================
           ENCABEZADO
           ================================================= */

        doc.setFont(
            "helvetica",
            "bold"
        );


        doc.setFontSize(
            22
        );


        doc.text(
            "GYM STORE",
            margenIzquierdo,
            posicionY
        );


        posicionY +=
            8;


        doc.setFont(
            "helvetica",
            "normal"
        );


        doc.setFontSize(
            10
        );


        doc.text(
            "ROPA DEPORTIVA",
            margenIzquierdo,
            posicionY
        );


        /* =================================================
           NÚMERO DE PEDIDO
           ================================================= */

        doc.setFont(
            "helvetica",
            "bold"
        );


        doc.setFontSize(
            13
        );


        doc.text(
            `PEDIDO #${pedido.numero}`,
            margenDerecho,
            20,
            {
                align: "right"
            }
        );


        doc.setFont(
            "helvetica",
            "normal"
        );


        doc.setFontSize(
            9
        );


        doc.text(
            `Fecha: ${formatearFechaPedido(
                pedido.fecha
            )}`,
            margenDerecho,
            27,
            {
                align: "right"
            }
        );


        /* =================================================
           LÍNEA
           ================================================= */

        posicionY +=
            8;


        doc.line(
            margenIzquierdo,
            posicionY,
            margenDerecho,
            posicionY
        );


        posicionY +=
            10;


        /* =================================================
           DATOS DEL CLIENTE
           ================================================= */

        doc.setFont(
            "helvetica",
            "bold"
        );


        doc.setFontSize(
            12
        );


        doc.text(
            "DATOS DEL CLIENTE",
            margenIzquierdo,
            posicionY
        );


        posicionY +=
            7;


        doc.setFont(
            "helvetica",
            "normal"
        );


        doc.setFontSize(
            10
        );


        doc.text(
            `Nombre: ${limpiarTextoPDF(
                cliente.nombre
            )}`,
            margenIzquierdo,
            posicionY
        );


        posicionY +=
            6;


        doc.text(
            `Teléfono: ${limpiarTextoPDF(
                cliente.telefono
            )}`,
            margenIzquierdo,
            posicionY
        );


        posicionY +=
            6;


        doc.text(
            `Correo: ${limpiarTextoPDF(
                cliente.correo
            )}`,
            margenIzquierdo,
            posicionY
        );


        posicionY +=
            6;


        doc.text(
            `Dirección: ${limpiarTextoPDF(
                cliente.direccion
            )}`,
            margenIzquierdo,
            posicionY
        );


        posicionY +=
            6;


        doc.text(
            `Municipio: ${limpiarTextoPDF(
                cliente.municipio
            )}`,
            margenIzquierdo,
            posicionY
        );


        posicionY +=
            6;


        doc.text(
            `Estado: ${limpiarTextoPDF(
                cliente.estado
            )}`,
            margenIzquierdo,
            posicionY
        );


        posicionY +=
            6;


        doc.text(
            `Código Postal: ${limpiarTextoPDF(
                cliente.codigoPostal
            )}`,
            margenIzquierdo,
            posicionY
        );


        /* =================================================
           PRODUCTOS
           ================================================= */

        posicionY +=
            12;


        doc.setFont(
            "helvetica",
            "bold"
        );


        doc.setFontSize(
            12
        );


        doc.text(
            "DETALLE DEL PEDIDO",
            margenIzquierdo,
            posicionY
        );


        posicionY +=
            8;


        /* =================================================
           CABECERA DE TABLA
           ================================================= */

        const columnaProducto =
            15;


        const columnaTalla =
            100;


        const columnaCantidad =
            125;


        const columnaPrecio =
            150;


        const columnaSubtotal =
            180;


        doc.setFont(
            "helvetica",
            "bold"
        );


        doc.setFontSize(
            8
        );


        doc.text(
            "PRODUCTO",
            columnaProducto,
            posicionY
        );


        doc.text(
            "TALLA",
            columnaTalla,
            posicionY
        );


        doc.text(
            "CANT.",
            columnaCantidad,
            posicionY
        );


        doc.text(
            "PRECIO",
            columnaPrecio,
            posicionY
        );


        doc.text(
            "SUBTOTAL",
            columnaSubtotal,
            posicionY
        );


        posicionY +=
            3;


        doc.line(
            margenIzquierdo,
            posicionY,
            margenDerecho,
            posicionY
        );


        posicionY +=
            7;


        /* =================================================
           PRODUCTOS
           ================================================= */

        doc.setFont(
            "helvetica",
            "normal"
        );


        doc.setFontSize(
            8
        );


        productos.forEach(
            function (producto) {

                /*
                 * Si estamos cerca del final,
                 * creamos otra página.
                 */

                if (
                    posicionY >
                    260
                ) {

                    agregarPiePDF(
                        doc,
                        altoPagina
                    );


                    doc.addPage();


                    posicionY =
                        20;


                    doc.setFont(
                        "helvetica",
                        "bold"
                    );


                    doc.setFontSize(
                        12
                    );


                    doc.text(
                        "DETALLE DEL PEDIDO — CONTINUACIÓN",
                        margenIzquierdo,
                        posicionY
                    );


                    posicionY +=
                        10;


                    doc.setFont(
                        "helvetica",
                        "bold"
                    );


                    doc.setFontSize(
                        8
                    );


                    doc.text(
                        "PRODUCTO",
                        columnaProducto,
                        posicionY
                    );


                    doc.text(
                        "TALLA",
                        columnaTalla,
                        posicionY
                    );


                    doc.text(
                        "CANT.",
                        columnaCantidad,
                        posicionY
                    );


                    doc.text(
                        "PRECIO",
                        columnaPrecio,
                        posicionY
                    );


                    doc.text(
                        "SUBTOTAL",
                        columnaSubtotal,
                        posicionY
                    );


                    posicionY +=
                        7;


                    doc.setFont(
                        "helvetica",
                        "normal"
                    );

                }


                const nombre =
                    limpiarTextoPDF(
                        producto.nombre ||
                        "Producto"
                    );


                const talla =
                    limpiarTextoPDF(
                        producto.talla ||
                        "N/A"
                    );


                const cantidad =
                    Number(
                        producto.cantidad ||
                        1
                    );


                const precio =
                    Number(
                        producto.precio ||
                        0
                    );


                const subtotal =
                    cantidad *
                    precio;


                /*
                 * Limitamos el nombre para
                 * evitar que invada otras columnas.
                 */

                const nombreCorto =
                    nombre.length > 38
                        ? nombre.substring(
                            0,
                            35
                        ) + "..."
                        : nombre;


                doc.text(
                    nombreCorto,
                    columnaProducto,
                    posicionY
                );


                doc.text(
                    talla,
                    columnaTalla,
                    posicionY
                );


                doc.text(
                    String(cantidad),
                    columnaCantidad,
                    posicionY
                );


                doc.text(
                    `$${formatearPrecioPedido(
                        precio
                    )}`,
                    columnaPrecio,
                    posicionY
                );


                doc.text(
                    `$${formatearPrecioPedido(
                        subtotal
                    )}`,
                    columnaSubtotal,
                    posicionY
                );


                posicionY +=
                    7;


                doc.setDrawColor(
                    220
                );


                doc.line(
                    margenIzquierdo,
                    posicionY - 3,
                    margenDerecho,
                    posicionY - 3
                );


                doc.setDrawColor(
                    0
                );

            }
        );


        /* =================================================
           TOTAL
           ================================================= */

        posicionY +=
            8;


        if (
            posicionY >
            250
        ) {

            agregarPiePDF(
                doc,
                altoPagina
            );


            doc.addPage();


            posicionY =
                25;

        }


        doc.setFont(
            "helvetica",
            "bold"
        );


        doc.setFontSize(
            14
        );


        doc.text(
            "TOTAL:",
            140,
            posicionY
        );


        doc.text(
            `$${formatearPrecioPedido(
                total
            )} MXN`,
            margenDerecho,
            posicionY,
            {
                align: "right"
            }
        );


        /* =================================================
           COMENTARIOS
           ================================================= */

        if (
            cliente.comentarios
        ) {

            posicionY +=
                15;


            doc.setFontSize(
                11
            );


            doc.text(
                "COMENTARIOS",
                margenIzquierdo,
                posicionY
            );


            posicionY +=
                6;


            doc.setFont(
                "helvetica",
                "normal"
            );


            doc.setFontSize(
                9
            );


            const comentarios =
                doc.splitTextToSize(
                    limpiarTextoPDF(
                        cliente.comentarios
                    ),
                    175
                );


            doc.text(
                comentarios,
                margenIzquierdo,
                posicionY
            );

        }


        /* =================================================
           PIE DE PÁGINA
           ================================================= */

        agregarPiePDF(
            doc,
            altoPagina
        );


        /* =================================================
           DESCARGAR
           ================================================= */

        const nombreArchivo =
            `GYM-STORE-PEDIDO-${pedido.numero}.pdf`;


        doc.save(
            nombreArchivo
        );


        console.log(
            "PDF generado:",
            nombreArchivo
        );


        return true;

    } catch (error) {

        console.error(
            "Error al generar PDF:",
            error
        );


        mostrarAlertaPedido(
            "Ocurrió un error al generar el comprobante PDF.",
            "danger"
        );


        return false;

    }

}


/* =========================================================
   PIE DE PÁGINA DEL PDF
   ========================================================= */

function agregarPiePDF(
    doc,
    altoPagina
) {

    const pagina =
        doc.internal.getNumberOfPages();


    doc.setFont(
        "helvetica",
        "normal"
    );


    doc.setFontSize(
        8
    );


    doc.setTextColor(
        120
    );


    doc.text(
        "GYM STORE — ROPA DEPORTIVA",
        15,
        altoPagina - 12
    );


    doc.text(
        `Página ${pagina}`,
        195,
        altoPagina - 12,
        {
            align: "right"
        }
    );


    doc.setTextColor(
        0
    );

}


/* =========================================================
   ALERTAS BOOTSTRAP
   ========================================================= */

function mostrarAlertaPedido(
    mensaje,
    tipo = "info"
) {

    let contenedor =
        document.getElementById(
            "gymAlertContainer"
        );


    /* =====================================================
       CREAR CONTENEDOR
       ===================================================== */

    if (!contenedor) {

        contenedor =
            document.createElement(
                "div"
            );


        contenedor.id =
            "gymAlertContainer";


        contenedor.className =
            "gym-alert-container";


        /*
         * Lo colocamos al principio de la página
         * para que sea visible.
         */

        document.body.appendChild(
            contenedor
        );

    }


    /* =====================================================
       TIPOS PERMITIDOS
       ===================================================== */

    const tiposPermitidos = [

        "primary",
        "secondary",
        "success",
        "danger",
        "warning",
        "info",
        "light",
        "dark"

    ];


    if (
        !tiposPermitidos.includes(
            tipo
        )
    ) {

        tipo =
            "info";

    }


    /* =====================================================
       ICONO
       ===================================================== */

    let icono =
        "ⓘ";


    switch (tipo) {

        case "success":

            icono =
                "✓";

            break;


        case "warning":

            icono =
                "!";

            break;


        case "danger":

            icono =
                "×";

            break;


        case "info":

            icono =
                "ⓘ";

            break;


        default:

            icono =
                "•";

    }


    /* =====================================================
       CREAR ALERTA
       ===================================================== */

    const alerta =
        document.createElement(
            "div"
        );


    alerta.className =
        `alert alert-${tipo} alert-dismissible fade show gym-alert mb-3`;


    alerta.setAttribute(
        "role",
        "alert"
    );


    alerta.innerHTML = `

        <div class="d-flex align-items-center gap-2">

            <span
                class="gym-alert-icon"
                aria-hidden="true"
            >
                ${icono}
            </span>

            <span>
                ${mensaje}
            </span>

        </div>


        <button
            type="button"
            class="btn-close"
            data-bs-dismiss="alert"
            aria-label="Cerrar"
        ></button>

    `;


    contenedor.appendChild(
        alerta
    );


    /* =====================================================
       AUTO CIERRE
       ===================================================== */

    setTimeout(
        function () {

            if (
                !alerta ||
                !alerta.parentNode
            ) {

                return;

            }


            if (
                typeof bootstrap !==
                "undefined"
            ) {

                const instancia =
                    bootstrap.Alert.getOrCreateInstance(
                        alerta
                    );


                instancia.close();

            } else {

                alerta.remove();

            }

        },
        4000
    );

}


/* =========================================================
   FINAL
   ========================================================= */

console.log(
    "GYM STORE - pedido.js cargado correctamente"
);