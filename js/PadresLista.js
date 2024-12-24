document.addEventListener('DOMContentLoaded', async () => {
    const setDefaultText = (id, text = 'No disponible') => {
        const element = document.getElementById(id);

        if (element && element.tagName === 'INPUT') {
            if (element.type === 'date') {
                const date = new Date(text);
                element.value = isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
            } else {
                element.value = text;
            }
        } else {
            element.textContent = text;
        }
    };

    const campos = [
        'usuario', 'nombreCompleto', 'telefono', 'email', 'direccion', 'fechaCreacion'
    ];

    const updateFields = (padreData) => {
        campos.forEach(campo => setDefaultText(campo));

        if (padreData) {
            setDefaultText('usuario', padreData.usuario);
            setDefaultText('nombreCompleto', padreData.nombreCompleto);
            setDefaultText('telefono', padreData.telefono);
            setDefaultText('email', padreData.email);
            setDefaultText('direccion', padreData.direccion);
            setDefaultText('fechaCreacion', padreData.fechaCreacion);
        }
    };
    const eliminarEstudiante = async (uuidPadre) => {
        const response = await fetchWithAuth(
            `http://localhost:8080/api/student/${uuidPadre}`,
            'DELETE'
        );

        if (response.ok) {
            // Mostrar alerta de éxito con SweetAlert2
            Swal.fire({
                icon: 'success',
                title: '¡Estudiante eliminado!',
                text: 'El estudiante se ha eliminado correctamente.',
                confirmButtonText: 'Aceptar'
            });
        } else {
            // Mostrar alerta de error con SweetAlert2
            Swal.fire({
                icon: 'error',
                title: '¡Error al eliminar!',
                text: 'Hubo un problema al intentar eliminar al estudiante.',
                confirmButtonText: 'Intentar de nuevo'
            });
        }
    };
    
    const actualizarEstudiante = async (padreData, uuidPadre) => {
        const response = await fetchWithAuth(
            `http://localhost:8080/api/student/admin/${uuidPadre}`,
            'PUT',
            padreData
        );

        if (response.ok) {
            // Mostrar alerta de éxito con SweetAlert2
            Swal.fire({
                icon: 'success',
                title: '¡Estudiante actualizado!',
                text: 'Los datos del estudiante se han actualizado correctamente.',
                confirmButtonText: 'Aceptar'
            });
        } else {
            // Mostrar alerta de error con SweetAlert2
            Swal.fire({
                icon: 'error',
                title: '¡Error al actualizar!',
                text: 'Hubo un problema al intentar actualizar los datos del estudiante.',
                confirmButtonText: 'Intentar de nuevo'
            });
        }
    };

    try {
        
        const response = await fetchWithAuthGet(`http://localhost:8080/api/father/user/$`);
        if (response.ok) {
            const data = await response.json();

            if (data.length > 0) {
                let currentIndex = 0;

                updateFields(data[currentIndex]);

                sessionStorage.setItem('Padres', JSON.stringify(data));

                document.getElementById('anterior').addEventListener('click', () => {
                    if (currentIndex > 0) {
                        currentIndex--;
                    } else {
                        currentIndex = data.length - 1;
                    }
                    updateFields(data[currentIndex]);
                });

                document.getElementById('siguiente').addEventListener('click', () => {
                    if (currentIndex < data.length - 1) {
                        currentIndex++;
                    } else {
                        currentIndex = 0;
                    }
                    updateFields(data[currentIndex]);
                });

                document.getElementById('actualizar').addEventListener('click', () => {
                    const uuidPadre = data[currentIndex].id;

                    const padreData = {
                        categoria: document.getElementById('categoria').value,
                        horario: document.getElementById('horario').value,
                        estatus: document.getElementById('estatus').value,
                        fechaPago: new Date(document.getElementById('fechaPago').value).toISOString(),
                    };

                    actualizarEstudiante(padreData, uuidPadre);
                });
   // Agregar el evento para eliminar un estudiante
   document.getElementById('eliminar').addEventListener('click', () => {
    const uuidPadre = data[currentIndex].id;

    // Mostrar alerta de confirmación para eliminar
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Este proceso eliminará al estudiante permanentemente.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'No, cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            eliminarEstudiante(uuidPadre);
        }
    });
});
              // Buscador por nombre


// Buscador por nombre
// Buscador por nombre
document.getElementById('btnBuscar').addEventListener('click', () => {
    const query = document.getElementById('buscar').value.toLowerCase();
    const filteredStudent = data.find(student => 
        student.nombreCompleto.toLowerCase().includes(query)
    );

    if (filteredStudent) {
        updateFields(filteredStudent);
        currentIndex = data.indexOf(filteredStudent);

        // Mostrar mensaje de éxito con SweetAlert2
        Swal.fire({
            icon: 'success',
            title: '¡Alumno encontrado!',
            text: 'El estudiante ha sido encontrado con éxito.',
            confirmButtonText: 'Aceptar'
        });

    } else {
        // Mostrar mensaje de error con SweetAlert2
        Swal.fire({
            icon: 'error',
            title: '¡No encontrado!',
            text: 'No se encontró un estudiante con ese nombre.',
            confirmButtonText: 'Intentar de nuevo'
        });
    }
});





            }
        } else {
            console.error(`Error en la solicitud: ${response.status}`);
            alert('Hubo un problema al obtener los datos del estudiante.');
        }
    } catch (error) {
        console.error('Error en la solicitud GET:', error);
        alert('Hubo un problema al obtener los datos del estudiante.');
    }
    
});
