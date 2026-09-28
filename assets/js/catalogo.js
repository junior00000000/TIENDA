/* =========================================================
   GYM STORE
   CATÁLOGO
   ========================================================= */


/* =========================================================
   INICIALIZAR CATÁLOGO
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const contenedor =
        document.getElementById("productosGrid");

    const filtros =
        document.querySelectorAll(".filtro-btn");


    if (!contenedor) {
        return;
    }


    /* Mostrar todos los productos */

    mostrarProductos(productos);


    /* Filtros */

    filtros.forEach(boton => {

        boton.addEventListener("click", () => {

            filtros.forEach(btn => {

                btn.classList.remove("active");

            });


            boton.classList.add("active");


            const categoria =
                boton.dataset.categoria;


            if (categoria === "todos") {

                mostrarProductos(productos);

                return;
            }


            const filtrados =
                productos.filter(producto => {

                    return producto.categoria === categoria;

                });


            mostrarProductos(filtrados);

        });

    });

});



/* =========================================================
   MOSTRAR PRODUCTOS
   ========================================================= */

function mostrarProductos(lista) {

    const contenedor =
        document.getElementById("productosGrid");


    if (!contenedor) {
        return;
    }


    contenedor.innerHTML = "";


    if (lista.length === 0) {

        contenedor.innerHTML = `

            <div class="catalogo-vacio">

                <h2>
                    No hay productos disponibles
                </h2>

                <p>
                    Prueba con otra categoría.
                </p>

            </div>

        `;

        return;
    }


    lista.forEach(producto => {

        const tarjeta =
            document.createElement("article");


        tarjeta.className =
            "producto-card";


        tarjeta.innerHTML = `

            <div class="producto-imagen">

                <img
                    src="${producto.imagen}"
                    alt="${producto.nombre}"
                    onerror="
                        this.style.display='none';
                        this.nextElementSibling.style.display='block';
                    "
                >

                <span
                    class="producto-placeholder"
                    style="display:none;"
                >
                    GYM
                </span>

            </div>


            <div class="producto-info">

                <span class="producto-categoria">
                    ${producto.tipo}
                </span>


                <h3>
                    ${producto.nombre}
                </h3>


                <span class="producto-id">
                    ID: ${producto.id}
                </span>


                <div class="producto-precio">
                    $${producto.precio.toLocaleString("es-MX")} MXN
                </div>


                <div class="producto-tallas">

                    ${producto.tallas.map(talla => `

                        <button
                            type="button"
                            class="talla-btn"
                            data-producto="${producto.id}"
                            data-talla="${talla}"
                        >
                            ${talla}
                        </button>

                    `).join("")}

                </div>


                <button
                    type="button"
                    class="btn-agregar"
                    data-id="${producto.id}"
                >
                    AGREGAR AL PEDIDO
                </button>

            </div>

        `;


        contenedor.appendChild(tarjeta);

    });


    activarTallas();

    activarBotonesAgregar();

}



/* =========================================================
   SELECCIONAR TALLA
   ========================================================= */

function activarTallas() {

    const botones =
        document.querySelectorAll(".talla-btn");


    botones.forEach(boton => {

        boton.addEventListener("click", () => {

            const productoId =
                boton.dataset.producto;


            document
                .querySelectorAll(
                    `.talla-btn[data-producto="${productoId}"]`
                )
                .forEach(btn => {

                    btn.classList.remove("selected");

                });


            boton.classList.add("selected");

        });

    });

}



/* =========================================================
   BOTÓN AGREGAR
   ========================================================= */

function activarBotonesAgregar() {

    const botones =
        document.querySelectorAll(".btn-agregar");


    botones.forEach(boton => {

        boton.addEventListener("click", () => {

            const productoId =
                boton.dataset.id;


            const producto =
                productos.find(item => {

                    return item.id === productoId;

                });


            const tallaSeleccionada =
                document.querySelector(
                    `.talla-btn[data-producto="${productoId}"].selected`
                );


            /* =============================================
               VALIDAR TALLA
               ============================================= */

            if (!tallaSeleccionada) {

                mostrarAlerta(
                    `
                    <strong>Selecciona una talla</strong>
                    <br>
                    Debes seleccionar una talla antes
                    de agregar el producto.
                    `,
                    "warning"
                );

                return;
            }


            const talla =
                tallaSeleccionada.dataset.talla;


            agregarAlCarrito(
                producto,
                talla
            );

        });

    });

}



/* =========================================================
   AGREGAR AL CARRITO
   ========================================================= */

function agregarAlCarrito(producto, talla) {

    let carrito = [];


    try {

        carrito =
            JSON.parse(
                localStorage.getItem("carrito")
            ) || [];

    } catch (error) {

        carrito = [];

    }


    const existente =
        carrito.find(item => {

            return (
                item.id === producto.id &&
                item.talla === talla
            );

        });


    if (existente) {

        existente.cantidad += 1;

    } else {

        carrito.push({

            id: producto.id,

            nombre: producto.nombre,

            talla: talla,

            cantidad: 1,

            precio: producto.precio,

            imagen: producto.imagen

        });

    }


    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );


    /* Actualizar contador */

    if (typeof actualizarContadorPedido === "function") {

        actualizarContadorPedido();

    }


    /* ALERTA PERSONALIZADA */

    mostrarAlerta(

        `
        <strong>${producto.nombre}</strong>
        <br>
        Talla: ${talla}
        <br>
        Producto agregado al pedido.
        `,

        "success"

    );

}



/* =========================================================
   ALERTA GYM STORE
   ========================================================= */

function mostrarAlerta(mensaje, tipo = "info") {

    let contenedor =
        document.getElementById(
            "gymAlertContainer"
        );


    /* Crear contenedor */

    if (!contenedor) {

        contenedor =
            document.createElement("div");


        contenedor.id =
            "gymAlertContainer";


        contenedor.className =
            "gym-alert-container";


        document.body.appendChild(
            contenedor
        );

    }


    /* Iconos */

    let icono = "ⓘ";


    if (tipo === "success") {

        icono = "✓";

    }


    if (tipo === "warning") {

        icono = "!";

    }


    if (tipo === "danger") {

        icono = "×";

    }


    /* Crear alerta */

    const alerta =
        document.createElement("div");


    alerta.className =
        "alert alert-dismissible fade show gym-alert mb-3";


    alerta.setAttribute(
        "role",
        "alert"
    );


    alerta.innerHTML = `

        <div class="d-flex align-items-center">

            <span class="gym-alert-icon">
                ${icono}
            </span>

            <div>
                ${mensaje}
            </div>

        </div>


        <button
            type="button"
            class="btn-close gym-alert-close"
            aria-label="Cerrar"
        ></button>

    `;


    contenedor.appendChild(
        alerta
    );


    /* Botón cerrar */

    const botonCerrar =
        alerta.querySelector(
            ".gym-alert-close"
        );


    botonCerrar.addEventListener(
        "click",
        () => {

            cerrarAlerta(alerta);

        }
    );


    /* Cierre automático */

    setTimeout(() => {

        cerrarAlerta(alerta);

    }, 3500);

}



/* =========================================================
   CERRAR ALERTA
   ========================================================= */

function cerrarAlerta(alerta) {

    if (!alerta) {
        return;
    }


    alerta.classList.remove("show");


    setTimeout(() => {

        if (alerta.parentNode) {

            alerta.remove();

        }

    }, 300);

}