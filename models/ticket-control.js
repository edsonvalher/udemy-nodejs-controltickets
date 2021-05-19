const path = require('path')
const fs = require('fs')
const Ticket = require('../models/ticket');



class TicketControl {

    constructor() {
        this.ultimo = 0
        this.hoy = new Date().getDate()
        this.tickets = []
        this.ultimos4 = []

        this.init()

    }

    get toJson() {
        return {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4,
        }
    }
    init() {
        //leer json 
        const { hoy, tickets, ultimo, ultimos4 } = require('../db/data.json')
        if (hoy === this.hoy) {
            this.ultimo = ultimo
            this.hoy = hoy
            this.tickets = tickets
            this.ultimos4 = ultimos4

        } else {
            this.guardarDB()

        }
    }
    guardarDB() {
        const dbPath = path.join(__dirname, '../db/data.json')
        fs.writeFileSync(dbPath, JSON.stringify(this.toJson))
    }
    siguiente() {
        this.ultimo += 1
        const ticket = new Ticket(this.ultimo, null)
        this.tickets.push(ticket)
        this.guardarDB()
        return `Ticket ${ticket.numero}`
    }

    atenderTicket(escritorio) {
        if (this.tickets.length === 0) {
            return null
        }
        const ticket = this.tickets.shift() //this.tickets[0] **esto es lo mismo a shift

        ticket.escritorio = escritorio

        this.ultimos4.unshift(ticket) //añade el ticket al inicio del arreglo

        if (this.ultimos4.length > 4) {
            this.ultimos4.splice(-1, 1) //borra el ultimo en el arreglo y mantiene 4 elementos en el arreglo
        }
        this.guardarDB()
        return ticket

    }
}
module.exports = TicketControl