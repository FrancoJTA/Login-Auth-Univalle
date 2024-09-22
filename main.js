// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBCBzJm52lBcijVrqRWm7GoA8Hmdd9sS04",
    authDomain: "prueba-bd323.firebaseapp.com",
    databaseURL: "https://prueba-bd323-default-rtdb.firebaseio.com",
    projectId: "prueba-bd323",
    storageBucket: "prueba-bd323.appspot.com",
    messagingSenderId: "444005035831",
    appId: "1:444005035831:web:02fa93236164d5414a34b2",
    measurementId: "G-KTEQE2X0D2"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Mostrar opciones según la selección del usuario
document.getElementById('show-phone-login-btn').addEventListener('click', function() {
    document.getElementById('login-options').style.display = 'none';
    document.getElementById('phone-login-form').style.display = 'block';
});

document.getElementById('show-register-btn').addEventListener('click', function() {
    document.getElementById('login-options').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
});

document.getElementById('back-to-login-options').addEventListener('click', function() {
    document.getElementById('phone-login-form').style.display = 'none';
    document.getElementById('login-options').style.display = 'block';
});

document.getElementById('back-to-login-options-from-register').addEventListener('click', function() {
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-options').style.display = 'block';
});

// Iniciar sesión con Google
document.getElementById('google-login-btn').addEventListener('click', function() {
    auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then((result) => {
            console.log('Inicio de sesión exitoso:', result.user);
            mostrarContenido();
        })
        .catch((error) => {
            console.error('Error en el inicio de sesión con Google:', error);
        });
});

// Iniciar sesión con correo electrónico y contraseña
document.getElementById('email-login-btn').addEventListener('click', function() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log('Inicio de sesión con correo exitoso:', userCredential.user);
            mostrarContenido();
        })
        .catch((error) => {
            console.error('Error en el inicio de sesión con correo:', error);
        });
});

// Registrar un nuevo usuario con correo y contraseña
document.getElementById('register-btn').addEventListener('click', function() {
    const newEmail = document.getElementById('new-email').value;
    const newPassword = document.getElementById('new-password').value;

    auth.createUserWithEmailAndPassword(newEmail, newPassword)
        .then((userCredential) => {
            console.log('Usuario registrado exitosamente:', userCredential.user);
            alert('Usuario registrado exitosamente. Ahora puedes iniciar sesión.');
            document.getElementById('login-options').style.display = 'block';
            document.getElementById('register-form').style.display = 'none';
        })
        .catch((error) => {
            console.error('Error al registrar nuevo usuario:', error);
            alert('Error al registrar usuario: ' + error.message);
        });
});

// Configura el reCAPTCHA para la verificación del número de teléfono
window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
    'size': 'normal',
    'callback': function(response) {
        console.log('reCAPTCHA verificado.');
    }
});

// Enviar código SMS al número de teléfono
document.getElementById('phone-login-btn').addEventListener('click', function() {
    const countryCode = document.getElementById('country-code').value;
    const phoneNumber = document.getElementById('phone-number').value.trim();
    const fullPhoneNumber = countryCode + phoneNumber;

    if (!/^\+\d{10,15}$/.test(fullPhoneNumber)) {
        console.error('Número de teléfono inválido. Asegúrate de que esté en formato E.164.');
        return;
    }

    auth.signInWithPhoneNumber(fullPhoneNumber, window.recaptchaVerifier)
        .then((confirmationResult) => {
            console.log('Código SMS enviado.');
            window.confirmationResult = confirmationResult;
        })
        .catch((error) => {
            console.error('Error al enviar código SMS:', error);
        });
});

// Verificar el código de verificación SMS
document.getElementById('verify-code-btn').addEventListener('click', function() {
    const code = document.getElementById('verification-code').value;

    window.confirmationResult.confirm(code)
        .then((result) => {
            console.log('Inicio de sesión con número de teléfono exitoso:', result.user);
            mostrarContenido();
        })
        .catch((error) => {
            console.error('Error al verificar el código:', error);
        });
});

// Cerrar sesión
document.getElementById('logout-btn').addEventListener('click', function() {
    auth.signOut().then(() => {
        console.log('Cierre de sesión exitoso');
        document.getElementById('login-container').style.display = 'block';
        document.getElementById('content').style.display = 'none';
    }).catch((error) => {
        console.error('Error al cerrar sesión:', error);
    });
});

// Verificar el estado de autenticación
auth.onAuthStateChanged((user) => {
    if (user) {
        mostrarContenido();
    } else {
        document.getElementById('login-container').style.display = 'block';
        document.getElementById('content').style.display = 'none';
    }
});

function mostrarContenido() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('content').style.display = 'block';
}
