const url = window.location.hostname.includes("localhost")
  ? "http://localhost:3000/api/auth/"
  : "https://curso-node-socket-chat-production.up.railway.app/api/auth";


let user = null;
let socket = null;

// Las Referencias HTML

const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir');


const validarJWT = async() => {

    const token = localStorage.getItem('token') || '';

    if ( token.length <= 10 ) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor')
    }

    const resp = await fetch(url,  {
        headers: {'x-token':token}
    })

    const {user:userDB, token:tokenDB } = await resp.json()
    // console.log(userDB , tokenDB)
    localStorage.setItem('token' , tokenDB)
    user = userDB
    document.title = user.name;

    await conectarSocker();

    };

const conectarSocker = async () => {
    const socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });
    // Conectarme al socket
    socket.on('connect', () => {
    console.log('Sockets online')
    })

    // desconectarme del socket
    socket.on ('disconnect', () => {
        console.log('Sockets offline')
    })

    socket.on('recibir-mensaje' , ( payload ) => {
        console.log( payload )
    });

    socket.on('usuarios-activos', dibujarUser );

    socket.on('mensaje-privado' , () => {

    });
}

const dibujarUser = (user = []) => {
    let usersHTML = '';
        user.forEach (({ name , uid }) => {
            usersHTML += `
                <li>s
                    <p>
                        <h5 class="text-success"> ${ name } </h5>
                        <span class="fs-6 text-muted"> ${ uid  } </span>
                    </p>
                </li>
            `
        })

        ulUsuarios.innerHTML = usersHTML;
    }

txtMensaje.addEventListener('keyup', ({ keyCode }) => {
    
    let  mensaje = txtMensaje.value;
    const uid = txtUid.value;

    if( keyCode !== 13 ) { return }
    if( mensaje.length === 0) { return }
    // console.log( conectarSocker )
    socket.emit('enviar-mensaje', { mensaje , uid } );

    txtMensaje.value = '';
})

const main = async() => {
    //Validar JWT
    await validarJWT();
}

main();
