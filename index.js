//Importação dass bibliotecas
const express = require('express')
const http = require('http')
const { Server } = require('socket.io')

//Iniciando o express e o socket.io
const app = express()
const server = http.createServer(app)
const io = new Server(server)

const SERVER_PORT = 3000

//Configuração para ler arquivos estáticos (html)
app.use(express.static('public'))

const users = {}

io.on("connection", function(socket) {
    console.log("Novo usuário conectado " + socket.id)

    socket.on("register", function(username) {
        users[socket.id] = username
        socket.broadcast.emit("usuário conectado ", username)
    })

    socket.on("chat message", function(msg) {
        const username = users[socket.id] || 'Anônimo'
        io.emit("chat message", {username, msg})
    })

    socket.on("disconnect", function() {
        const username = users[socket.id]
        delete users[socket.id]
        if (username) {
            io.emit("usuário saiu da sala", username)
        }
    })

});

server.listen(SERVER_PORT, function() {
    console.log("Servidor rodando na porta " + SERVER_PORT)
});