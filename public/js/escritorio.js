const searchParams = new URLSearchParams(window.location.search)

if (!searchParams.has('escritorio')) {
    window.location.assign('index.html')
    throw new Error('El parametro escritorio es obligatorio')
}



//referencias html
const lblEscritorio = document.querySelector('h1')
const btnAtender = document.querySelector('button')
const lblTicket = document.querySelector('small')
const divAlerta = document.querySelector('.alert')
const lblPendientes = document.querySelector('#lblPendientes')


const escritorio = searchParams.get('escritorio')
lblEscritorio.innerText = escritorio

divAlerta.style.display = 'none'

const socket = io();




socket.on('connect', () => {
    // console.log('Conectado');
    btnAtender.disabled = false

});

socket.on('disconnect', () => {
    // console.log('Desconectado del servidor');
    btnAtender.disabled = true
});

socket.on('tickets-pendientes', (payload) => {

    if (payload === 0) {
        lblPendientes.style.display = 'none'
    } else {
        lblPendientes.style.display = ''
        lblPendientes.innerText = `${payload}`
    }

})


btnAtender.addEventListener('click', () => {
    socket.emit('atender-ticket', { escritorio }, (payload) => {
        const { ok, msg, ticket } = payload

        if (!ok) {
            lblTicket.innerText = 'No hay tickets'
            return divAlerta.style.display = ''

        }
        lblTicket.innerText = `Ticket ${ticket.numero}`



    })

});

