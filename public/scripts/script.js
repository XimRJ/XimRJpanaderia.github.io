// Función para obtener productos del inventario y mostrarlos en el frontend
async function cargarInventario() {
    try {
        const response = await fetch('http://localhost:5000/inventario');
        if (!response.ok) throw new Error('Error al obtener inventario');

        const productos = await response.json();
        const contenedorCarruselTemporada = document.querySelector('.elementos-carrusel-temporada');
        const contenedorCarruselTradicional = document.querySelector('.elementos-carrusel-tradicional');
        
        contenedorCarruselTemporada.innerHTML = '';
        contenedorCarruselTradicional.innerHTML = '';

        // Separa productos por categoría
        productos.forEach(producto => {
            const elementoHTML = `
                <div class="elemento-carrusel">
                    <img src="${producto.urlimage}" alt="${producto.Nombre}">
                    <h3>${producto.Nombre}</h3>
                    <p class="descripcion">${producto.Descripcion}</p>
                    <p class="precio">$${producto.Precio} MXN</p>
                    <p class="cantidad">Cantidad: <span>${producto.cantidad}</span></p>
                    <button class="boton-editar" onclick="abrirModalEditar(${producto.PANID})">Actualizar</button>
                    <button class="boton-eliminar" onclick="eliminarProducto(${producto.PANID})">Eliminar</button>
                </div>
            `;
            
            if (producto.categoria.toLowerCase() === 'temporada') {
                contenedorCarruselTemporada.insertAdjacentHTML('beforeend', elementoHTML);
            } else if (producto.categoria.toLowerCase() === 'tradicional') {
                contenedorCarruselTradicional.insertAdjacentHTML('beforeend', elementoHTML);
            }
        });
    } catch (error) {
        console.error(error);
    }
}

const modalAgregarProducto = document.getElementById('modalAgregarProducto');
const agregarProductoBtn = document.getElementById('agregarProductoBtn');
const cerrarModal = document.getElementById('cerrarModal');
const formAgregarProducto = document.getElementById('formAgregarProducto');

agregarProductoBtn.onclick = function() {
    modalAgregarProducto.style.display = 'block';
}

cerrarModal.onclick = function() {
    modalAgregarProducto.style.display = 'none';
}

// agregar un producto
formAgregarProducto.onsubmit = async function(e) {
    e.preventDefault();

    const nuevoProducto = {
        Nombre: document.getElementById('nombre').value,
        Descripcion: document.getElementById('descripcion').value,
        Precio: parseFloat(document.getElementById('precio').value).toFixed(2),
        cantidad: parseInt(document.getElementById('cantidad').value, 10),
        categoria: document.getElementById('categoria').value,
        urlimage: document.getElementById('urlimage').value
    };

    try {
        const response = await fetch('http://localhost:5000/inventario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoProducto)
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            cargarInventario(); // Recargar inventario para mostrar el nuevo producto
            modalAgregarProducto.style.display = 'none';
            formAgregarProducto.reset(); // Resetea el formulario
        } else {
            alert('Error al agregar el producto: ' + data.error);
        }
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        alert('Error al agregar el producto. Intenta nuevamente.');
    }
}

// eliminar un producto
async function eliminarProducto(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        try {
            const response = await fetch(`http://localhost:5000/inventario/${id}`, {
                method: 'DELETE'
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                cargarInventario(); // Recargar inventario después de eliminar
            } else {
                alert('Error al eliminar el producto: ' + data.error);
            }
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            alert('Error al eliminar el producto. Intenta nuevamente.');
        }
    }
}

const modalEditarProducto = document.getElementById('modalEditarProducto');
const cerrarModalEditar = document.getElementById('cerrarModalEditar');
const formEditarProducto = document.getElementById('formEditarProducto');

// modal de edición
async function abrirModalEditar(id) {
    try {
        const response = await fetch(`http://localhost:5000/inventario/${id}`); // Obtener el producto por ID
        if (!response.ok) throw new Error('Error al obtener producto');

        const producto = await response.json();

        // Rellenar el formulario con los datos actuales del producto
        document.getElementById('editarId').value = producto.PANID;
        document.getElementById('editarNombre').value = producto.Nombre;
        document.getElementById('editarDescripcion').value = producto.Descripcion;
        document.getElementById('editarPrecio').value = producto.Precio;
        document.getElementById('editarCantidad').value = producto.cantidad;
        document.getElementById('editarCategoria').value = producto.categoria;
        document.getElementById('editarUrlImagen').value = producto.urlimage;

        modalEditarProducto.style.display = 'block';
    } catch (error) {
        console.error(error);
        alert('Error al cargar los datos del producto. Intenta nuevamente.');
    }
}

cerrarModalEditar.onclick = function() {
    modalEditarProducto.style.display = 'none';
}

// actualizar un producto
formEditarProducto.onsubmit = async function(e) {
    e.preventDefault();

    const id = document.getElementById('editarId').value;
    const productoActualizado = {
        Nombre: document.getElementById('editarNombre').value,
        Descripcion: document.getElementById('editarDescripcion').value,
        Precio: parseFloat(document.getElementById('editarPrecio').value).toFixed(2),
        cantidad: parseInt(document.getElementById('editarCantidad').value, 10),
        categoria: document.getElementById('editarCategoria').value,
        urlimage: document.getElementById('editarUrlImagen').value
    };

    try {
        const response = await fetch(`http://localhost:5000/inventario/${id}`, {
            method: 'PUT', // Método PUT para actualizar
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productoActualizado)
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            cargarInventario(); // Recargar inventario para mostrar los cambios
            modalEditarProducto.style.display = 'none'; // Cerrar el modal
            formEditarProducto.reset(); // Resetea el formulario
        } else {
            alert('Error al actualizar el producto: ' + data.error);
        }
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        alert('Error al actualizar el producto. Intenta nuevamente.');
    }
}

// Cerrar el modal si se hace clic fuera de él
window.onclick = function(event) {
    if (event.target === modalEditarProducto) {
        modalEditarProducto.style.display = 'none';
    }
    if (event.target === modalAgregarProducto) {
        modalAgregarProducto.style.display = 'none';
    }
};

// Cargar productos al inicio
cargarInventario();
