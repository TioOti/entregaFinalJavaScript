class Producto{
    constructor (nombre, precio, stock, categoria, codigoProducto, img){
        this.nombre = nombre
        this.precio = precio
        this.stock = stock
        this.categoria = categoria
        this.codigoProducto = codigoProducto
        this.img = img
    }
}

/* ================ Importo los datos desde el .json =================*/
function cargarDatos(){
    fetch("herramientas.json")
    .then((response)=> response.json())
    .then((data) => {
    let listaHerramientas = []
    data.forEach(producto => {
        listaHerramientas.push(new Producto(producto.nombre,producto.precio,producto.stock,producto.categoria,producto.codigoProducto,producto.img,))
    });
    renderizarCards(listaHerramientas)
    
    })
}

cargarDatos()


let carritoDeCompras = document.getElementById("carrito-table")
let offCanvasBody = document.getElementById("offcanvas-body")
let precioTotal = 0
let cantItemsEnCarro = 0
let itemIdUnico = 1
let carrito = []
let carritoJSON = []
let card_container = document.getElementById("card-container")


renderizarCarrito()

  function renderizarCards(listaHerramientas){    
    /* ================ Funcion para renderizar las cards de los productos =================*/
    for(const producto of listaHerramientas){
        if(producto.stock != 0){

            let card_body = document.createElement("div")
            card_body.classList.add("col", "mx-2", "card", "h-100", "align-items-center")
            
            let img_container = document.createElement("div")
            img_container.classList.add("img-container", "d-flex")
            
            let card_img = document.createElement("img")
            card_img.classList.add("card-img-top")
            card_img.setAttribute("alt", producto.nombre)
            card_img.setAttribute("src", producto.img)
            card_img.setAttribute("width", "64")
            card_img.setAttribute("height","150")
            img_container.append(card_img)

            let card_body_inner = document.createElement("div")
            card_body_inner.classList.add("card-body")      
            
            let card_titulo = document.createElement("h5")
            card_titulo.classList.add("card-title")
            card_titulo.innerText = producto.nombre

            let card_stock = document.createElement("p")
            card_stock.classList.add("card-text", "fs-6", "mt-3")
            card_stock.innerText = `Cantidad disponible: ${producto.stock}`
            card_body_inner.append(card_titulo)
            card_body_inner.append(card_stock)

            let card_codigo = document.createElement("h4")
            card_codigo.classList.add("text-center", "fs-6")
            card_codigo.innerText = `Cod: ${producto.codigoProducto}`

            let card_precio = document.createElement("h6")
            card_precio.classList.add("text-center")
            card_precio.innerText = `$${producto.precio}`

            let card_footer = document.createElement("div")
            card_footer.classList.add("py-3")

            let btn_add = document.createElement("a")
            btn_add.id = `card-btn_${listaHerramientas.indexOf(producto)}`
            btn_add.innerText = "Añadir"
            btn_add.classList.add("btn", "btn-md", "btn-success")
            btn_add.setAttribute("tabindex", "0")
            btn_add.setAttribute("role", "button")            
            
            let card_cantidad = document.createElement("input")
            card_cantidad.id = `catidad_input${listaHerramientas.indexOf(producto)}`
            card_cantidad.setAttribute("type", "number")
            card_cantidad.setAttribute("min", "1")
            card_cantidad.setAttribute("max", "100")
            card_cantidad.setAttribute("value", "1")
            card_cantidad.setAttribute("tabindex", "0")
            card_cantidad.setAttribute("data-bs-toggle", "popover")
            card_cantidad.setAttribute("data-bs-placement", "left")
            card_cantidad.setAttribute("data-bs-trigger", "focus")
            card_cantidad.setAttribute("data-bs-content", `Elija las unidades`)    

            card_footer.append(card_cantidad) 
            card_footer.append(btn_add)
            card_body.append(img_container)
            card_body.append(card_body_inner)
            card_body.append(card_codigo)
            card_body.append(card_precio)
            card_body.append(card_footer)
            card_container.append(card_body)

        let input_cantidad = document.getElementById(`catidad_input${listaHerramientas.indexOf(producto)}`)
        
        let button = document.getElementById(`card-btn_${listaHerramientas.indexOf(producto)}`)
        button.addEventListener("click", function() {addToCart(producto, input_cantidad)}) 
        }
    }
}



    /* ================ Funcion que me renderiza el carrito =================*/

function renderizarCarrito(){
    let carritoLocal = obtenerCarritoLocal()
    if (carritoLocal != undefined && carritoLocal.length != 0){
        carritoLocal.forEach(item => {
            let itemIdLocal = itemIdUnico
            let filaCantidad = document.createElement("td")
            let fila = document.createElement("tr")
            fila.id = "fila"
            filaCantidad.id = `cant_${itemIdLocal}`
            filaCantidad.innerText = item.Cantidad
            fila.append(filaCantidad)
            addAttribute(item.Nombre, fila)
            addAttribute(item.Precio*item.Cantidad, fila)
            carritoDeCompras.append(fila)
            calcularPrecioTotal(item.Precio, item.Cantidad)
            let filaBorrar = document.createElement("td")
            filaBorrar.classList.add("ps-4")
            fila.append(filaBorrar)
            
            let filaBorrarBtn = document.createElement("button")
            filaBorrarBtn.id = `item${itemIdLocal}`
            filaBorrarBtn.classList.add("borrar")
            filaBorrarBtn.setAttribute("type", "button")
            filaBorrar.append(filaBorrarBtn)
        
            let filaBorrarBtnImg = document.createElement("img")
            filaBorrarBtnImg.setAttribute("src", "img/iconos/delete.png")
            filaBorrarBtnImg.setAttribute("alt", "trash-can")
            filaBorrarBtnImg.classList.add("p-0")
            filaBorrarBtn.append(filaBorrarBtnImg)
        
            let btnBorrar = document.getElementById(`item${itemIdLocal}`)
            btnBorrar.addEventListener("click", () => {borrarItem(fila, item.Nombre)}) 
            carrito.push(fila)
            itemIdUnico++
        })
        carritoJSON = carritoLocal
    }
}

function llenarCarritoVisual(){
    let btnCarroFlotante = document.getElementById("btn-float-cart")
    let btnCarroFlotante1 = document.getElementById("btn-header-cart")

    if(carrito.length != 0){
        btnCarroFlotante.setAttribute("src","img/iconos/cartFill.png")
        btnCarroFlotante1.setAttribute("src","img/iconos/cartFill.png")
    }
    else{        
        btnCarroFlotante.setAttribute("src","img/iconos/cart.png")            
        btnCarroFlotante1.setAttribute("src","img/iconos/cart.png")
    }
   
}

    /* ================ Funcion que sensa el input_cantidad y en base a eso, se fija que no haya duplicados =================*/


function addToCart(producto, inputCantidad){
    Toastify({
        text: "Añadido al carrito",
        duration: 1000,
        gravity: "top",
        offset: {
            x: 5,
            y: 120, 
          },
        avatar: "img/iconos/add-to-cart--icon.png",
        position: "right",
        style: {
            background: "#a5eea0",
            color: "black",            
          }
      }).showToast();

    let items = document.querySelectorAll("#fila")
    let cantidad = inputCantidad.value
    inputCantidad.value = "1"

    if(items.length != 0){
        let productoAgregar =
            carrito.find(item => item.childNodes[1].innerHTML == producto.nombre)
        if (productoAgregar != undefined){
            updateLocalStorageCart(producto.nombre, cantidad, producto.precio)
            return updateQtyAndPrice(productoAgregar, cantidad, producto.precio)
        }
    }

    let itemIdLocal = itemIdUnico
    let filaCantidad = document.createElement("td")
    let fila = document.createElement("tr")
    fila.id = "fila"
    filaCantidad.id = `cant_${itemIdLocal}`
    filaCantidad.innerText = cantidad == 0 ? cantidad = 1 : cantidad
    fila.append(filaCantidad)
    addAttribute(producto.nombre, fila)
    addAttribute(producto.precio*cantidad, fila)     
    carritoDeCompras.append(fila)
    calcularPrecioTotal(producto.precio, cantidad)

    let filaBorrar = document.createElement("td")
    filaBorrar.classList.add("ps-4")
    fila.append(filaBorrar)
    
    let filaBorrarBtn = document.createElement("button")
    filaBorrarBtn.id = `item${itemIdLocal}`
    filaBorrarBtn.classList.add("borrar")
    filaBorrarBtn.setAttribute("type", "button")
    filaBorrar.append(filaBorrarBtn)

    let filaBorrarBtnImg = document.createElement("img")
    filaBorrarBtnImg.setAttribute("src", "img/iconos/delete.png")
    filaBorrarBtnImg.setAttribute("alt", "trash-can")
    filaBorrarBtnImg.classList.add("p-0")
    
    filaBorrarBtn.append(filaBorrarBtnImg)

    let btnBorrar = document.getElementById(`item${itemIdLocal}`)
    btnBorrar.addEventListener("click", () => {borrarItem(fila, producto.nombre)}) 
    carrito.push(fila)
    
    let itemCarrito = {"id": producto.codigoProducto, "Cantidad": parseInt(cantidad), "Nombre": producto.nombre, "Stock": producto.stock,
                        "Categoria": producto.categoria, "Precio": producto.precio}
    carritoJSON.push(itemCarrito)
    localStorage.setItem("carrito", JSON.stringify(carritoJSON))
    itemIdUnico++

    llenarCarritoVisual()
}

function updateQtyAndPrice(productoAgregar, cantidad, precio){
    let cartQty = productoAgregar.childNodes[0].innerHTML
    let cartPrice = productoAgregar.childNodes[2].innerHTML
    precioTotal -= parseInt(cartPrice)
    cartQty = parseInt(cartQty) + parseInt(cantidad)
    productoAgregar.childNodes[0].innerHTML = cartQty
    productoAgregar.childNodes[2].innerHTML = precio*cartQty
    calcularPrecioTotal(precio,cartQty)
}

function updateLocalStorageCart(nombreProducto, cantidad, precio){
    let carritoLocal = obtenerCarritoLocal()
    let item = carritoLocal.find(item => item.Nombre == nombreProducto)
    item.Cantidad = parseInt(item.Cantidad) + parseInt(cantidad)
    item.Stock -= cantidad
    item.Precio = precio*item.Cantidad
    localStorage.setItem("carrito",JSON.stringify(carritoLocal))
    llenarCarritoVisual()
}

function borrarItem(item, nombreProducto){
    let cartPrice = item.childNodes[2].innerHTML
    precioTotal -= parseInt(cartPrice)
    item.remove()
    let total = document.getElementById("Total")
    total.innerText = precioTotal == 0 ? "" : `Precio total: ${precioTotal}`
    carrito = carrito.filter(item => item.childNodes[1].innerHTML != nombreProducto)
    carritoJSON = carritoJSON.filter(item => item.Nombre != nombreProducto)
    localStorage.setItem("carrito",JSON.stringify(carritoJSON))
    llenarCarritoVisual()
}   

let botonvaciar = document.getElementById("boton-vaciar")
botonvaciar.addEventListener("click", vaciarCarrito)

 // Funcion de la Search Bar Starts
 
/* let searchBar = document.getElementById("input_text")
let listaHerramientasBusqueda =[];

searchBar.addEventListener('input', (e) => {
    const textoBusqueda = e.target.value.toLowerCase();
    console.log(textoBusqueda)
  
    let herramientasFiltradas = listaHerramientasBusqueda.filter((herramienta) => {
        return (
            herramienta.nombre.toLowerCase().includes(textoBusqueda)
        );
    });
    renderizarCards(herramientasFiltradas);
});
 */


/*
// Harry Potter API

            const charactersList = document.getElementById('charactersList');
            const searchBar = document.getElementById('searchBar');
            let hpCharacters = [];

            searchBar.addEventListener('keyup', (e) => {
                const searchString = e.target.value.toLowerCase();

                const filteredCharacters = hpCharacters.filter((character) => {
                    return (
                        character.name.toLowerCase().includes(searchString) ||
                        character.house.toLowerCase().includes(searchString)
                    );
                });
                displayCharacters(filteredCharacters);
            });

            const loadCharacters = async () => {
                try {
                    const res = await fetch('https://hp-api.herokuapp.com/api/characters');
                    hpCharacters = await res.json();
                    displayCharacters(hpCharacters);
                } catch (err) {
                    console.error(err);
                }
            };

            const displayCharacters = (characters) => {
                const htmlString = characters
                    .map((character) => {
                        return `
                        <li class="character">
                            <h2>${character.name}</h2>
                            <p>House: ${character.house}</p>
                            <img src="${character.image}"></img>
                        </li>
                    `;
                    })
                    .join('');
                charactersList.innerHTML = htmlString;
            };

            loadCharacters();   

 */
// Funcion de la Search Bar fin


function vaciarCarrito(){
    if(carrito.length != 0){
    Swal.fire({
        title: 'Está seguro que desea vaciar su carrito?',
        text: "Perderá todos los productos añadidos",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: "No",
        confirmButtonText: 'Vaciar carrito'
      }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
            '',
            'Su carrito ha sido vaciado con exito',
            'success'
        )
            let items = document.querySelectorAll("#fila")
            items.forEach(item => item.remove())
            document.getElementById("Total").innerText=""
            precioTotal = 0
            carrito = []
            carritoJSON = []
            localStorage.clear()
            llenarCarritoVisual()
        }
      }) 
    }
    else{
            
    }
}

function obtenerCarritoLocal(){
    let carrito = JSON.parse(localStorage.getItem("carrito"))
    return carrito;
}

function addAttribute(atributo, row){
    let item = document.createElement("td")
    item.innerHTML = `${atributo}`
    row.append(item)
}

function calcularPrecioTotal (precio, cantidad){
    precioTotal += precio*cantidad
    let total = document.getElementById("Total")
    total.innerText = `Precio total: ${precioTotal}`
}
     
   