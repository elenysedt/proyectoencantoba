
let productos; // Definir productos en un ámbito global
let carrito = JSON.parse(localStorage.getItem('carrito')) || []; // Inicializar carrito desde localStorage

document.addEventListener("DOMContentLoaded", function () {
    fetch('https://raw.githubusercontent.com/elenysedt/proyectoencantoba/refs/heads/main/productos.json')
    //fetch('productos.json')
        .then(response => response.json())
        .then(data => {
            productos = data.productos; // Asignar el valor a la variable global
            inicializarPagina();
        })
        .catch(error => console.error('Error al cargar el JSON:', error));
});

function inicializarPagina() {
    const currentUrl = window.location.pathname;
    if (currentUrl.includes("dulces.html")) {
        mostrarProductos('dulces');
    } else if (currentUrl.includes("salados.html")) {
        mostrarProductos('salados');
    }

    const iconoCarrito = document.getElementById('icono-carrito');
    const carritoContainer = document.getElementById('carrito-container');

    iconoCarrito.addEventListener('click', function () {
        carritoContainer.classList.toggle('mostrar'); // Alternar la visibilidad
    });

    const vaciarCarritoButton = document.getElementById('vaciar-carrito');
    vaciarCarritoButton.addEventListener('click', vaciarCarrito);

    const enviarPedidoButton = document.getElementById('enviar-pedido');
    enviarPedidoButton.addEventListener('click', function () {
        if (carrito.length === 0) {
            alert("Tu carrito está vacío.");
            return;
        }

        const mensaje = carrito
            .map((producto, index) => `${index + 1}. ${producto.nombre} - $${(producto.precio * producto.cantidad).toFixed(2)}`)
            .join('\n');

        const mensajeFinal = `¡Hola! Me gustaría hacer un pedido con una semana de anticipación:\n\n${mensaje}\n\nTotal: $${carrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0).toFixed(2)}\n\nGracias.`;
        const numeroWhatsApp = "5491124019414"; // Reemplazar con tu número
        const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensajeFinal)}`;
        window.open(urlWhatsApp, '_blank');
    });

    actualizarCarrito();
}

function mostrarProductos(categoria) {
    const productsContainer = document.querySelector('.productos');
    productsContainer.innerHTML = ''; // Limpiar productos anteriores
    productos.filter(product => product.categoria === categoria).forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('producto');
        productElement.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.nombre}">
            <h2 class="name">${product.nombre}</h2>
            <span class="precio">${product.precio.toFixed(2)}$</span> 
            <div class="info">
                <p>${product.descripcion}</p>
            </div>
            <button class="btn-detalles">Detalles</button>
            <div class="cantidad-control">
                <input type="number" class="cantidad" id="cantidad-${product.id}" value="1" min="1" max="10">
            </div>
            <button onclick="agregarAlCarrito(${product.id})">Agregar al Carrito</button>
        `;

        const detallesButton = productElement.querySelector('.btn-detalles');
        detallesButton.addEventListener('click', function () {
            const info = productElement.querySelector('.info');
            info.classList.toggle('mostrar');
            this.textContent = info.classList.contains('mostrar') ? "Ocultar Detalles" : "Detalles";
        });

        // Añadir un evento para la cantidad
        const cantidadInput = productElement.querySelector('.cantidad');
        cantidadInput.addEventListener('change', function () {
            const nuevaCantidad = parseInt(cantidadInput.value) || 1;
            actualizarCantidad(product.id, nuevaCantidad);
        });

        productsContainer.appendChild(productElement);
    });
}

function agregarAlCarrito(productId) {
    const producto = productos.find(p => p.id === productId);
    const cantidadElement = document.getElementById(`cantidad-${productId}`);
    if (cantidadElement) {
        const cantidad = parseInt(cantidadElement.value) || 1; // Lee el valor de la cantidad

        // Verificar si el producto ya está en el carrito
        const productoEnCarrito = carrito.find(p => p.id === productId);
        if (productoEnCarrito) {
            productoEnCarrito.cantidad += cantidad; // Actualiza la cantidad
        } else {
            carrito.push({ ...producto, cantidad });
        }

        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarCarrito();
    } else {
        console.error(`No se encontró el elemento con ID cantidad-${productId}`);
    }
}

function actualizarCantidad(productId, nuevaCantidad) {
    const productoEnCarrito = carrito.find(p => p.id === productId);
    if (productoEnCarrito) {
        if (confirm(`¿Quieres actualizar la cantidad de "${productoEnCarrito.nombre}" a ${nuevaCantidad}?`)) {
            productoEnCarrito.cantidad = nuevaCantidad; // Actualiza la cantidad
            localStorage.setItem('carrito', JSON.stringify(carrito)); // Actualiza el localStorage
            actualizarCarrito(); // Actualiza la visualización del carrito
            alert(`Cantidad de "${productoEnCarrito.nombre}" actualizada a ${nuevaCantidad}.`);
        }
    }
}
// Funciones para sumar y restar
function sumarCantidad(productId) {
    const cantidadElement = document.getElementById(`cantidad-${productId}`);
    if (cantidadElement) {
        let cantidad = parseInt(cantidadElement.value) || 1;
        if (cantidad < 10) { // Puedes ajustar el límite según sea necesario
            cantidad += 1; // Aumenta la cantidad
            cantidadElement.value = cantidad; // Actualiza el valor del input
            actualizarCantidad(productId, cantidad); // Llama a actualizarCantidad para confirmar el cambio
        }
    } else {
        console.error(`No se encontró el elemento con ID cantidad-${productId}`);
    }
}

function restarCantidad(productId) {
    const cantidadElement = document.getElementById(`cantidad-${productId}`);
    if (cantidadElement) {
        let cantidad = parseInt(cantidadElement.value) || 1;
        if (cantidad > 1) {
            cantidad -= 1; // Disminuye la cantidad
            cantidadElement.value = cantidad; // Actualiza el valor del input
            actualizarCantidad(productId, cantidad); // Llama a actualizarCantidad para confirmar el cambio
        } else {
            alert("No puedes reducir la cantidad a menos de 1.");
        }
    } else {
        console.error(`No se encontró el elemento con ID cantidad-${productId}`);
    }
}

function actualizarCarrito() {
    const listaCarrito = document.getElementById('lista-carrito');
    const totalCarritoElemento = document.getElementById('total-carrito');
    listaCarrito.innerHTML = ''; // Limpiar la lista del carrito

    carrito.forEach(function (producto) {
        const li = document.createElement('li');
        li.innerHTML = `
        ${producto.nombre} - ${producto.cantidad} unidades - $${(producto.precio * producto.cantidad).toFixed(2)}
        <img src="../Images/tacho.png" alt="Eliminar" class="icono-eliminar" onclick="eliminarDelCarrito(${producto.id})" style="cursor: pointer; width: 20px; height: 20px; margin-left: 10px;">
        `;
        listaCarrito.appendChild(li);
    });

    const totalCarrito = carrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
    totalCarritoElemento.textContent = totalCarrito.toFixed(2);
}
function eliminarDelCarrito(productId) {
    carrito = carrito.filter(producto => producto.id !== productId);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarrito();
    alert("Producto eliminado del carrito.");
}

function vaciarCarrito() {
    carrito = [];
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarrito();
    alert("El carrito ha sido vaciado.");
}

function validarFormulario(event) {
    // Prevenir el envío del formulario
    event.preventDefault();

    // Obtener los valores de los campos
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const mensaje = document.getElementById('mensaje').value;

    // Verificar si todos los campos están completos
    if (nombre === '' || email === '' || mensaje === '') {
        console.log('Por favor, completa todos los campos del formulario.');
    } else {
        console.log('Formulario enviado correctamente.');
        // Si deseas enviar el formulario, puedes hacerlo aquí
        event.target.submit(); // Descomentar esta línea para enviar el formulario
    }
}

