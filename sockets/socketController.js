const { Socket } = require("socket.io");
const { checkJWT } = require("../helpers");
const { ChatMensajes } = require('../models')

const chatMensajes = new ChatMensajes();

const socketController = async ( socket = new Socket(), io ) => {
    // ----> CODIGO para extraer el X-TOKEN "TOKEN"
    const usuario = await checkJWT ( socket.handshake.headers['x-token'] )
    if (!usuario) {
        return socket.disconnect();
    }
    // console.log('se conecto', usuario.name)
    chatMensajes.ConectarUsuario( usuario );
    io.emit('usuarios-activos', chatMensajes.usuariosArr )

    //Limpiar cuando alguien se desconecta
    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario(usuario.id);
        io.emit('usuarios-activos', chatMensajes.usuariosArr );
    })

    socket.on('enviar-mensaje', ({ uid, mensaje }) => {
        
        chatMensajes.enviarMensaje(usuario.id , usuario.name , mensaje)
        io.emit('recibir-mensajes', chatMensajes.ultimos10 );
    })
}

module.exports = {
    socketController
}