document.addEventListener('DOMContentLoaded', async () => {
    let studentsData = []; // Inicializamos la variable para almacenar los estudiantes

    // Función para generar la tabla de estudiantes
    const generateTable = (students) => {
        const tableBody = document.getElementById('table-body');
        tableBody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos resultados

        students.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.nombreCompleto}</td>
                <td>${student.estatus}</td>
                <td>${student.matricula}</td>
                <td>
                    <button class="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600" 
                            onclick="openModal('${student.id}')">
                        Editar 
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    };

    // Función para obtener todos los estudiantes
    const fetchStudents = async () => {
        try {
            const response = await fetchWithAuthGet('http://localhost:8080/api/student/all');
            if (response.ok) {
                const data = await response.json();
                if (data.length > 0) {
                    studentsData = data; // Guardar los estudiantes en la variable
                    generateTable(studentsData); // Mostrar todos los estudiantes inicialmente
                    sessionStorage.setItem('Hijos', JSON.stringify(data)); // Guardar en sessionStorage
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'No se encontraron estudiantes',
                        text: 'No se encontraron estudiantes.',
                        confirmButtonText: 'Aceptar'
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
    };

    // Función para obtener los estudiantes por estatus
    const fetchStudentsByStatus = async (estatus) => {
        try {
            const response = await fetchWithAuthGet(`http://localhost:8080/api/student/status/${estatus}`);
            if (response.ok) {
                const data = await response.json();
                if (data.length > 0) {
                    generateTable(data); // Generar la tabla con los estudiantes filtrados
                    sessionStorage.setItem('Hijos', JSON.stringify(data)); // Guardar en sessionStorage
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'No se encontraron estudiantes',
                        text: `No se encontraron estudiantes con el estatus ${estatus}.`,
                        confirmButtonText: 'Aceptar'
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
    };

    // Llamar a la función para obtener todos los estudiantes al cargar la página
    await fetchStudents();

    // Función para manejar el evento de búsqueda
    document.getElementById('btnBuscarEstatus').addEventListener('click', () => {
        const estatusQuery = document.getElementById('buscarEstatus').value.toUpperCase();

        if (estatusQuery) {
            // Llamar a la función que filtra por estatus
            fetchStudentsByStatus(estatusQuery);
        } else {
            // Si no se selecciona un estatus, mostrar todos los estudiantes
            generateTable(studentsData);
        }
    });

    // Abre el modal para editar el estatus de un estudiante
    window.openModal = (estudianteId) => {
        const student = studentsData.find(s => s.id === estudianteId);
        if (student) {
            document.getElementById("nuevoEstatus").value = student.estatus; // Prellena el estatus actual
            document.getElementById("modal").classList.remove("hidden");
            document.getElementById("btnConfirmar").onclick = function() {
                const nuevoEstatus = document.getElementById("nuevoEstatus").value;
                actualizarEstudiante(nuevoEstatus, estudianteId); // Llamar a la función de actualización
            };
        }
    };
    // Función para actualizar el estatus en la base de datos
    const actualizarEstudiante = async (nuevoEstatus, uuidStudent) => {
        const studentData = { estatus: nuevoEstatus }; // Datos que se enviarán para actualizar el estatus
        console.log(studentData);
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

            // Actualizar la tabla después de la actualización
            await fetchStudents();
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

    // Cierra el modal sin guardar cambios
    document.getElementById("btnCancelar").onclick = function() {
        document.getElementById("modal").classList.add("hidden");
    };

});
