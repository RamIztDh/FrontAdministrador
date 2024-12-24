// Función para refrescar el token
const refreshTokenFather = async () => {
    const refresh_token = localStorage.getItem('tokenRefresh');
    if (!refresh_token) {
        throw new Error('No hay refresh token disponible.');
    }

    try {
        const response = await fetch('http://localhost:8080/auth/father/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${refresh_token}`
            }
        });

        if (!response.ok) {
            throw new Error('No se pudo refrescar el token.');
        }

        const {access_token, refresh_token: new_refresh_token} = await response.json();

        // Actualizar los tokens en localStorage
        localStorage.setItem('token', access_token);
        localStorage.setItem('tokenRefresh', new_refresh_token);

        return access_token;
    } catch (error) {
        console.error('Error al refrescar el token:', error);
        throw error;
    }
};

const refreshTokenAdmin = async () => {
    const refresh_token = localStorage.getItem('tokenRefresh');
    if (!refresh_token) {
        throw new Error('No hay refresh token disponible.');
    }

    try {
        const response = await fetch('http://localhost:8080/auth/admin/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${refresh_token}`
            }
        });

        if (!response.ok) {
            throw new Error('No se pudo refrescar el token.');
        }

        const {access_token, refresh_token: new_refresh_token} = await response.json();

        // Actualizar los tokens en localStorage
        localStorage.setItem('token', access_token);
        localStorage.setItem('tokenRefresh', new_refresh_token);

        return access_token;
    } catch (error) {
        console.error('Error al refrescar el token:', error);
        throw error;
    }
};

// Función para manejar solicitudes autenticadas
const getWithAuth = async (url) => {
    let token = localStorage.getItem('token');

    // Si el token no está disponible, intentamos refrescarlo
    if (!token) {
        console.warn('No hay token, intentando refrescar...');
        token = await refreshToken();
    }

    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        // Si el token ha expirado (código 401), intentamos refrescarlo y reintentamos la solicitud
        if (response.status === 401) {
            console.warn('El token no es válido o ha expirado, intentando refrescar...');
            token = await refreshToken();
            return await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
        }

        return response; // Devolver la respuesta si no hubo problemas
    } catch (error) {
        console.error('Error en la solicitud autenticada:', error);
        throw error;
    }
};

// Función para manejar solicitudes GET autenticadas
const fetchWithAuthGet = async (url) => {      /// usar est funcion para los get nadamas.
    let token = localStorage.getItem('token');

    // Si el token no está disponible, intentamos refrescarlo
    if (!token) {
        console.warn('No hay token disponible, intentando refrescar...');
        token = await refreshToken();
    }

    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        // Si el token ha expirado (código 401), intentamos refrescarlo y reintentamos la solicitud
        return response; // Devolver la respuesta si no hubo problemas
    } catch (error) {
        console.error('Error en la solicitud GET autenticada:', error);
        throw error;
    }
};

// Función para manejar solicitudes autenticadas con verbo y cuerpo
const fetchWithAuth = async (url, verbo, data) => {                     //// funcion para POST,PUT Y DELETE
    let token = localStorage.getItem('token');
    // Si el token no está disponible, intentamos refrescarlo
    if (!token) {
        console.warn('No hay token, intentando refrescar...');
        token = await refreshTokenAdmin();
    }

    return await fetch(url, {
        method: verbo,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })
};
