/* =========================================================
   GYM STORE
   CARRITO / PEDIDO
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    mostrarCarrito();

});


/* =========================================================
   OBTENER CARRITO
   ========================================================= */

function obtenerCarrito() {

    try {

        const carrito =
            JSON.parse(
                localStorage.getItem("carrito")
            );

        return Array.isArray(carrito)
            ? carrito
            : [];

    } catch (error) {

        console.error(
            "Error al obtener el carrito:",
            error
        );

        return [];
    }
}


/* =========================================================
   GUARDAR CARRITO
   ========================================================= */

function guardarCarrito(carrito) {

    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );

}


/* =========================================================
   MOSTRAR CARRITO
   ========================================================= */

function mostrarCarrito() {

    const contenedor =
        document.getElementById("pedidoProductos");

    const resumen =
        document.getElementById("pedidoResumen");

    if (!contenedor) {
        return;
    }

    const carrito = obtenerCarrito();

    contenedor.innerHTML = "";

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
                    Agrega productos desde nuestro catálogo
                    para comenzar tu pedido.
                </p>

                <a
                    href="catalogo.html"
                    class="btn btn-primary"
                >
                    VER CATÁLOGO
                </a>

            </div>

        `;

        if (resumen) {
            resumen.style.display = "none";
        }

        return;
    }

    if (resumen) {
        resumen.style.display = "block";
    }


    carrito.forEach((producto, indice) => {

        const tarjeta =
            document.createElement("article");

        tarjeta.className = "pedido-item";

        tarjeta.innerHTML = `

            <div class="pedido-item-imagen">

                <img
                    src="${producto.imagen}"
                    alt="${producto.nombre}"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
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
                    ${producto.id}
                </span>

                <h3>
                    ${producto.nombre}
                </h3>

                <p>
                    Talla:
                    <strong>${producto.talla}</strong>
                </p>

                <p class="pedido-item-precio">
                    $${producto.precio.toLocaleString("es-MX")}
                    MXN
                </p>

            </div>


            <div class="pedido-item-cantidad">

                <span>
                    CANTIDAD
                </span>

                <div class="cantidad-control">

                    <button
                        class="cantidad-btn"
                        onclick="cambiarCantidad(${indice}, -1)"
                    >
                        −
                    </button>

                    <strong>
                        ${producto.cantidad}
                    </strong>

                    <button
                        class="cantidad-btn"
                        onclick="cambiarCantidad(${indice}, 1)"
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
                    $${(
                        producto.precio *
                        producto.cantidad
                    ).toLocaleString("es-MX")}
                    MXN
                </strong>

            </div>


            <button
                class="eliminar-producto"
                onclick="eliminarProducto(${indice})"
                aria-label="Eliminar producto"
            >
                ✕
            </button>

        `;

        contenedor.appendChild(tarjeta);

    });


    actualizarResumen();

}


/* =========================================================
   CAMBIAR CANTIDAD
   ========================================================= */

function cambiarCantidad(indice, cambio) {

    const carrito = obtenerCarrito();

    if (!carrito[indice]) {
        return;
    }

    carrito[indice].cantidad += cambio;


    if (carrito[indice].cantidad <= 0) {

        carrito.splice(indice, 1);

    }


    guardarCarrito(carrito);

    mostrarCarrito();

    actualizarContadorPedido();

}


/* =========================================================
   ELIMINAR PRODUCTO
   ========================================================= */

function eliminarProducto(indice) {

    const carrito = obtenerCarrito();

    if (!carrito[indice]) {
        return;
    }

    carrito.splice(indice, 1);

    guardarCarrito(carrito);

    mostrarCarrito();

    actualizarContadorPedido();

}


/* =========================================================
   VACIAR PEDIDO
   ========================================================= */

function vaciarPedido() {

    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
        return;
    }

    const confirmar =
        confirm(
            "¿Seguro que deseas vaciar todo el pedido?"
        );

    if (!confirmar) {
        return;
    }

    localStorage.removeItem("carrito");

    mostrarCarrito();

    actualizarContadorPedido();

}


/* =========================================================
   ACTUALIZAR RESUMEN
   ========================================================= */

function actualizarResumen() {

    const carrito = obtenerCarrito();

    const cantidadElement =
        document.getElementById("resumenCantidad");

    const subtotalElement =
        document.getElementById("resumenSubtotal");

    const totalElement =
        document.getElementById("resumenTotal");


    const cantidadTotal =
        carrito.reduce(
            (total, producto) => {

                return total +
                    Number(producto.cantidad || 0);

            },
            0
        );


    const subtotal =
        carrito.reduce(
            (total, producto) => {

                return total +
                    (
                        Number(producto.precio || 0) *
                        Number(producto.cantidad || 0)
                    );

            },
            0
        );


    if (cantidadElement) {

        cantidadElement.textContent =
            cantidadTotal;

    }


    if (subtotalElement) {

        subtotalElement.textContent =
            `$${subtotal.toLocaleString("es-MX")} MXN`;

    }


    if (totalElement) {

        totalElement.textContent =
            `$${subtotal.toLocaleString("es-MX")} MXN`;

    }

}