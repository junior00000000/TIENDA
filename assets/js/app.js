/* =========================================================
   TIENDA GYM
   APP PRINCIPAL
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

    /*
     * MENÚ MÓVIL
     */

    if (menuToggle && mainNav) {

        menuToggle.addEventListener("click", () => {

            mainNav.classList.toggle("active");

            if (mainNav.classList.contains("active")) {

                menuToggle.textContent = "✕";

            } else {

                menuToggle.textContent = "☰";

            }

        });


        /*
         * CERRAR MENÚ AL SELECCIONAR UNA OPCIÓN
         */

        const navLinks = mainNav.querySelectorAll("a");

        navLinks.forEach(link => {

            link.addEventListener("click", () => {

                mainNav.classList.remove("active");

                menuToggle.textContent = "☰";

            });

        });

    }


    /*
     * CONTADOR DEL PEDIDO
     *
     * Por ahora solamente lee localStorage.
     * El carrito real se implementará posteriormente.
     */

    actualizarContadorPedido();

});


/* =========================================================
   CONTADOR DEL PEDIDO
   ========================================================= */

function actualizarContadorPedido() {

    const cartCount = document.getElementById("cartCount");

    if (!cartCount) {
        return;
    }

    try {

        const carritoGuardado =
            localStorage.getItem("carrito");

        if (!carritoGuardado) {

            cartCount.textContent = "(0)";

            return;
        }

        const carrito =
            JSON.parse(carritoGuardado);

        if (!Array.isArray(carrito)) {

            cartCount.textContent = "(0)";

            return;
        }

        const cantidadTotal = carrito.reduce(
            (total, producto) => {

                return total +
                    Number(producto.cantidad || 0);

            },
            0
        );

        cartCount.textContent =
            `(${cantidadTotal})`;

    } catch (error) {

        console.error(
            "Error al leer el carrito:",
            error
        );

        cartCount.textContent = "(0)";
    }
}