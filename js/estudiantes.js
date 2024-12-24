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
        'id', 'matricula', 'curso', 'categoria', 'horario', 'nombreCompleto', 'fechaNacimiento',
        'edad', 'sexo', 'alergias', 'alergiasMedicamentos', 'medicamentosAlergicos', 'estatura',
        'tallaCamiseta', 'peso', 'centroEducativo', 'seguroMedico', 'institucionSeguro',
        'actividadFisicaUltimoAno', 'practicaFutbol', 'posicionJugada', 'habilidades',
        'comoSeEntero', 'expectativa', 'estatus', 'fechaPago', 'nombrePadre',
        'correoPadre', 'telefonoPadre'
    ];

    const updateFields = (studentData) => {
        campos.forEach(campo => setDefaultText(campo));

        if (studentData) {
            setDefaultText('id', studentData.id);
            setDefaultText('matricula', studentData.matricula);
            setDefaultText('curso', studentData.curso);
            setDefaultText('categoria', studentData.categoria);
            setDefaultText('horario', studentData.horario);
            setDefaultText('nombreCompleto', studentData.nombreCompleto);
            setDefaultText('fechaNacimiento', studentData.fechaNacimiento);
            setDefaultText('edad', studentData.edad);
            setDefaultText('sexo', studentData.sexo);
            setDefaultText('alergias', studentData.alergias);
            setDefaultText('alergiasMedicamentos', studentData.alergiasMedicamentos ? 'Sí' : 'No');
            setDefaultText('medicamentosAlergicos', studentData.medicamentosAlergicos);
            setDefaultText('estatura', studentData.estatura);
            setDefaultText('tallaCamiseta', studentData.tallaCamiseta);
            setDefaultText('peso', studentData.peso);
            setDefaultText('centroEducativo', studentData.centroEducativo);
            setDefaultText('seguroMedico', studentData.seguroMedico ? 'Sí' : 'No');
            setDefaultText('institucionSeguro', studentData.institucionSeguro);
            setDefaultText('actividadFisicaUltimoAno', studentData.actividadFisicaUltimoAno ? 'Sí' : 'No');
            setDefaultText('practicaFutbol', studentData.practicaFutbol ? 'Sí' : 'No');
            setDefaultText('posicionJugada', studentData.posicionJugada);
            setDefaultText('habilidades', studentData.habilidades);
            setDefaultText('comoSeEntero', studentData.comoSeEntero);
            setDefaultText('expectativa', studentData.expectativa);
            setDefaultText('estatus', studentData.estatus);
            setDefaultText('fechaPago', studentData.fechaPago);

            if (studentData.padre) {
                setDefaultText('nombrePadre', studentData.padre.nombreCompleto);
                setDefaultText('correoPadre', studentData.padre.email);
                setDefaultText('telefonoPadre', studentData.padre.telefono);
            }
        }
    };
    const eliminarEstudiante = async (uuidStudent) => {
        const response = await fetchWithAuth(
            `http://localhost:8080/api/student/admin/${uuidStudent}`,
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
    
    const actualizarEstudiante = async (studentData, uuidStudent) => {
        const response = await fetchWithAuth(
            `http://localhost:8080/api/student/admin/${uuidStudent}`,
            'PUT',
            studentData
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
        const response = await fetchWithAuthGet(`http://localhost:8080/api/student/all`);
        if (response.ok) {
            const data = await response.json();

            if (data.length > 0) {
                let currentIndex = 0;

                updateFields(data[currentIndex]);

                sessionStorage.setItem('Hijos', JSON.stringify(data));

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
                    const uuidStudent = data[currentIndex].id;

                    const studentData = {
                        matricula: document.getElementById('matricula').value,
                        curso: document.getElementById('curso').value,
                        categoria: document.getElementById('categoria').value,
                        horario: document.getElementById('horario').value,
                        estatus: document.getElementById('estatus').value,
                        fechaPago: new Date(document.getElementById('fechaPago').value).toISOString(),
                    };

                    actualizarEstudiante(studentData, uuidStudent);
                });
   // Agregar el evento para eliminar un estudiante
                document.getElementById('eliminar').addEventListener('click', () => {
                    const uuidStudent = data[currentIndex].id;

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
                            eliminarEstudiante(uuidStudent);
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
