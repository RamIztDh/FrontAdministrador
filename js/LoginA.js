document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita la recarga de la página

        // Obtén los valores ingresados por el usuario
        const usuario = document.getElementById('login-usuario').value.trim();
        const contrasena = document.getElementById('login-password').value.trim();

        // Validar campos vacíos
        if (!usuario || !contrasena) {
            Swal.fire({
                title: 'Campos incompletos',
                text: 'Por favor, completa ambos campos antes de continuar.',
                icon: 'warning',
                confirmButtonText: 'Aceptar'
            });
            return; // Detiene el flujo si hay campos vacíos
        }

        // Construye el objeto que será enviado al backend
        const loginData = {
            usuario: usuario,
            contrasena: contrasena
        };

        try {
            // Realiza la solicitud POST al backend
            const response = await fetch('http://localhost:8080/auth/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData) // Convierte los datos a JSON
            });

            if (response.ok) {
                // Si el inicio de sesión es exitoso
                const data = await response.json();

                // Guarda los tokens en localStorage
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('tokenRefresh', data.refresh_token);

                // Muestra alerta de éxito con SweetAlert2
                Swal.fire({
                    title: '¡Inicio de sesión exitoso!',
                    text: 'Redirigiendo al panel de administrador...',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    // Redirige al panel principal
                    window.location.href = 'panel_Administrador.html';
                });
            } else {
                // Manejo de errores
                const errorData = await response.json();
                Swal.fire({
                    title: 'Error',
                    text: errorData.message || 'Usuario o contraseña incorrectos.',
                    icon: 'error',
                    confirmButtonText: 'Cerrar'
                });
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            Swal.fire({
                title: 'Error',
                text: 'Ocurrió un error al intentar iniciar sesión. Inténtalo nuevamente.',
                icon: 'error',
                confirmButtonText: 'Cerrar'
            });
        }
    });
});
