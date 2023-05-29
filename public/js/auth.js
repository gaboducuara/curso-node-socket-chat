const Myformulario = document.querySelector("form");


const xurl = window.location.hostname.includes("localhost")
  ? "http://localhost:3000/api/auth/google"
  : "https://curso-node-socket-chat-production.up.railway.app/api/auth/google";


const url = window.location.hostname.includes("localhost")
  ? "http://localhost:3000/api/auth/login"
  : "https://curso-node-socket-chat-production.up.railway.app/api/auth";

//mandar info al backend
Myformulario.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = {};

  for (let el of Myformulario.elements) {
    if (el.name.length > 0) data[el.name] = el.value;
  }
 /// ------------LOGIN -------------------//
  fetch(url, {

    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  })
    .then( res => res.json())
    .then(({ msg, token }) => {
      if (msg) {
        return console.error(msg);
      }
      localStorage.setItem("token", token);
      window.location = 'chat.html';
    })
    .catch((err) => {
      console.log(err);
    });
});

// ---------------- A PARTIR DE AQUI ES GOOGLE -------------------///

function handleCredentialResponse(response) {
  //Google TOKEN
  //console.log('id_token' ,response.credential)

  const body = { id_token: response.credential };

  fetch(xurl , {
    method:'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  })
    .then(resp => resp.json())
    .then(({ token , email }) => {
      localStorage.setItem('token', token)
      localStorage.setItem('email', email )
      window.location = 'chat.html';
    })
    .catch(console.warn);
  }
  
  //const button = document.getElementById("google_signout");
    //button.onclick = () => {
/// ------------> Codigo para desloguearse del correo
    function cerrarSesion() {
      google.accounts.id.disableAutoSelect();
      google.accounts.id.revoke(localStorage.getItem("email") , done => {
        localStorage.clear();
        location.reload();  
      }) 
    }
    //} 


















// function onSignIn(usuario) {
//   var id_token = usuario.getAuthResponse().id_token;
//   const data = { id_token };

//   fetch(xurl , {

//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   })
//     .then((resp) => resp.json())
//     .then(({ token }) => {
//       //asi se graba en localStorage un token
//       localStorage.setItem("token", token);
//       window.location = 'chat.html';
//       //localStorage.setItem('email', res.usuario.email)
//     })
//     .catch(console.log);
//   };

  // function signOut() {
  //   var auth2 = gapi.auth2.getAuthInstance();
  //   auth2.signOut().then(function() {
  //     console.log('User signed out.')
  //   }) 
  // }