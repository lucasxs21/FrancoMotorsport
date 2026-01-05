/**
 * AUTH GUARD - Sistema de protección de páginas
 * Incluir este script en TODAS las páginas que quieras proteger
 */

(function() {
    'use strict';

    // Configuración
    const CONFIG = {
        API_URL: 'http://localhost:3000', // Cambiar en producción
        LOGIN_PAGE: '/public/login.html',
        TOKEN_KEY: 'token',
        USER_KEY: 'usuario'
    };

    /**
     * Verifica si el usuario está autenticado
     */
    function verificarAutenticacion() {
        const token = localStorage.getItem(CONFIG.TOKEN_KEY);
        
        if (!token) {
            redirigirALogin();
            return false;
        }

        // Verificar si el token es válido
        if (!validarToken(token)) {
            cerrarSesion();
            return false;
        }

        return true;
    }

    /**
     * Valida el formato del token JWT
     */
    function validarToken(token) {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) return false;

            // Decodificar payload
            const payload = JSON.parse(atob(parts[1]));
            
            // Verificar expiración
            if (payload.exp && payload.exp * 1000 < Date.now()) {
                console.warn('Token expirado');
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error al validar token:', error);
            return false;
        }
    }

    /**
     * Obtiene el usuario actual del localStorage
     */
    function obtenerUsuario() {
        const usuarioStr = localStorage.getItem(CONFIG.USER_KEY);
        if (!usuarioStr) return null;

        try {
            return JSON.parse(usuarioStr);
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            return null;
        }
    }

    /**
     * Obtiene el token actual
     */
    function obtenerToken() {
        return localStorage.getItem(CONFIG.TOKEN_KEY);
    }

    /**
     * Cierra la sesión del usuario
     */
    async function cerrarSesion() {
        const token = obtenerToken();

        // Intentar hacer logout en el servidor
        if (token) {
            try {
                await fetch(`${CONFIG.API_URL}/api/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            } catch (error) {
                console.error('Error al hacer logout:', error);
            }
        }

        // Limpiar localStorage
        localStorage.removeItem(CONFIG.TOKEN_KEY);
        localStorage.removeItem(CONFIG.USER_KEY);

        // Redirigir al login
        redirigirALogin();
    }

    /**
     * Redirige al usuario a la página de login
     */
    function redirigirALogin() {
        // Guardar la página actual para volver después del login
        const currentPage = window.location.pathname + window.location.search;
        sessionStorage.setItem('redirect_after_login', currentPage);
        
        window.location.href = CONFIG.LOGIN_PAGE;
    }

    /**
     * Hace una petición autenticada al API
     */
    async function fetchAutenticado(url, options = {}) {
        const token = obtenerToken();
        
        if (!token) {
            redirigirALogin();
            return null;
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers
        };

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            // Si el token es inválido, cerrar sesión
            if (response.status === 401) {
                cerrarSesion();
                return null;
            }

            return response;
        } catch (error) {
            console.error('Error en petición autenticada:', error);
            throw error;
        }
    }

    /**
     * Muestra información del usuario en la página
     */
    function mostrarInfoUsuario(elementId = 'user-info') {
        const usuario = obtenerUsuario();
        const element = document.getElementById(elementId);

        if (!usuario || !element) return;

        element.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="color: #333;">👤 ${usuario.nombre || usuario.email}</span>
                <button onclick="AuthGuard.cerrarSesion()" style="
                    padding: 5px 15px;
                    background: #f59e0b;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 14px;
                ">Cerrar Sesión</button>
            </div>
        `;
    }

    /**
     * Agrega el botón de cerrar sesión a un elemento
     */
    function agregarBotonCerrarSesion(selector) {
        const element = document.querySelector(selector);
        if (!element) return;

        const usuario = obtenerUsuario();
        const btn = document.createElement('button');
        btn.textContent = `Cerrar Sesión (${usuario?.nombre || 'Usuario'})`;
        btn.style.cssText = `
            padding: 10px 20px;
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.3s;
        `;
        btn.onmouseover = () => btn.style.transform = 'translateY(-2px)';
        btn.onmouseout = () => btn.style.transform = 'translateY(0)';
        btn.onclick = cerrarSesion;

        element.appendChild(btn);
    }

    // API pública del AuthGuard
    window.AuthGuard = {
        verificarAutenticacion,
        obtenerUsuario,
        obtenerToken,
        cerrarSesion,
        fetchAutenticado,
        mostrarInfoUsuario,
        agregarBotonCerrarSesion,
        CONFIG
    };

    // Auto-verificar autenticación cuando se carga el script
    // Solo si no estamos en la página de login
    if (!window.location.pathname.includes('login.html')) {
        if (!verificarAutenticacion()) {
            // El usuario será redirigido automáticamente
            return;
        }
    }

    console.log('✅ AuthGuard cargado correctamente');
})();