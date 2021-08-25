const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')

const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content

const fragment = document.createDocumentFragment()

let carrito = {}

// Eventos
// El evento DOMContentLoaded es disparado cuando el documento HTML ha sido completamente cargado y parseado
document.addEventListener('DOMContentLoaded', () => { 
    fetchData()
    if (localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
})

cards.addEventListener('click', e => { 
    addCarrito(e) 
})

items.addEventListener('click', e => { 
    btnAccion(e) 
})

// Traer productos
const fetchData = async () => {
    try{
        const res = await fetch('api.json')
        const data = await res.json()
        pintarCards(data)
    } catch (error){
        console.log(error)
    }
}

// Pintar productos
const pintarCards = data => {
    data.forEach(producto => {
        templateCard.querySelector('h5').textContent = producto.title
        templateCard.querySelector('p').textContent = producto.precio
        templateCard.querySelector('img').setAttribute("src", producto.thumbnailUrl)
        templateCard.querySelector('.btn-success').dataset.id = producto.id
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

const addCarrito = e => {
    if (e.target.classList.contains('btn-success')) {
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = objeto => {
    const producto = {
       id: objeto.querySelector('.btn-success').dataset.id,
       title: objeto.querySelector('h5').textContent,
       precio: objeto.querySelector('p').textContent,
       cantidad: 1
    }
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    carrito[producto.id] = { ...producto }
    pintarCarrito()
}

const pintarCarrito = () => {
    items.innerHTML = ''
    Object.values(carrito).forEach(producto =>{
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad   
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio
        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
    pintarFooter()

    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const pintarFooter = () => {
    footer.innerHTML = ''
    if ( Object.keys(carrito).length === 0) {
        footer.innerHTML = ` <th scope="row" colspan="4">Cotización vacia - comience su cotización.</th>`
        return
    }

    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc +cantidad * precio, 0)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio
    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
    })
}

const btnAccion = e => {
    if(e.target.classList.contains('btn-info')){
        console.log(carrito[e.target.dataset.id])
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {...producto}
        pintarCarrito()
    }

    if(e.target.classList.contains('btn-danger')){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0){
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()
    }

    e.stopPropagation()
}