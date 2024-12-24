document.addEventListener('DOMContentLoaded', () => {
    const registroForm = document.getElementById('registro-form');

    registroForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita que el formulario recargue la página

        // Obtén los valores ingresados por el usuario
        const usuario = document.getElementById('registro-usuario').value.trim();
        const nombreCompleto = document.getElementById('registro-nombre').value.trim();
        const contrasena = document.getElementById('registro-password').value.trim();

        // Validar campos vacíos
        if (!usuario || !nombreCompleto || !contrasena) {
            Swal.fire({
                title: 'Campos incompletos',
                text: 'Por favor, completa todos los campos antes de continuar.',
                icon: 'warning',
                confirmButtonText: 'Aceptar'
            });
            return; // Detiene la ejecución si hay campos vacíos
        }

        // Construye el objeto que será enviado al backend
        const administradorData = {
            usuario: usuario,
            nombreCompleto: nombreCompleto,
            contrasena: contrasena,
        };

        try {
            // Realiza la solicitud POST al backend
            const response = await fetch('http://localhost:8080/auth/admin/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(administradorData) // Envía los datos correctos
            });

            if (response.ok) {
                // Si el registro es exitoso
                const data = await response.json();

                // Muestra una alerta de éxito
                Swal.fire({
                    title: '¡Registro exitoso!',
                    text: 'Ahora puedes iniciar sesión.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    // Guardar datos en localStorage (excepto contraseña por seguridad)
                    localStorage.setItem('nombreCompleto', nombreCompleto);
                    localStorage.setItem('token', data.access_token);
                    localStorage.setItem('tokenRefresh', data.refresh_token);

                    // Redirige al usuario al login
                    window.location.href = 'login_administrador.html';
                });
            } else {
                // Manejo de errores
                const errorData = await response.json();
                Swal.fire({
                    title: 'Error',
                    text: errorData.message || 'No se pudo registrar el usuario.',
                    icon: 'error',
                    confirmButtonText: 'Cerrar'
                });
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            Swal.fire({
                title: 'Error',
                text: 'Ocurrió un error al intentar registrar el usuario. Inténtalo nuevamente.',
                icon: 'error',
                confirmButtonText: 'Cerrar'
            });
        }
    });
});
