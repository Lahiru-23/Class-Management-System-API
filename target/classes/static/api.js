/**
 * SmartClass API client.
 * Wraps fetch() with JWT auth (Authorization: Bearer <token> from localStorage),
 * consistent error handling, and small helpers used across all dashboard pages.
 */

const API_BASE = 'http://localhost:8080/api';

const Auth = {
    getToken() {
        return localStorage.getItem('smartclass_token');
    },
    getUser() {
        const raw = localStorage.getItem('smartclass_user');
        return raw ? JSON.parse(raw) : null;
    },
    setSession(authResponse) {
        localStorage.setItem('smartclass_token', authResponse.token);
        localStorage.setItem('smartclass_user', JSON.stringify({
            username: authResponse.username,
            roles: authResponse.roles,
            userId: authResponse.userId,
            studentId: authResponse.studentId,
            teacherId: authResponse.teacherId
        }));
    },
    clearSession() {
        localStorage.removeItem('smartclass_token');
        localStorage.removeItem('smartclass_user');
    },
    isLoggedIn() {
        return !!this.getToken();
    },
    hasRole(role) {
        const user = this.getUser();
        return user && user.roles.some(r => r.includes(role));
    },
    /** Returns the primary role for dashboard routing, priority ADMIN > TEACHER > STUDENT */
    primaryRole() {
        if (this.hasRole('ADMIN')) return 'ADMIN';
        if (this.hasRole('TEACHER')) return 'TEACHER';
        if (this.hasRole('STUDENT')) return 'STUDENT';
        return 'GUEST';
    },
    logout() {
        this.clearSession();
        window.location.href = 'login.html';
    },
    /** Call at the top of every dashboard page to enforce auth + role */
    requireRole(allowedRoles) {
        if (!this.isLoggedIn()) {
            window.location.href = 'login.html';
            return;
        }
        const ok = allowedRoles.some(r => this.hasRole(r));
        if (!ok) {
            alert('You do not have permission to view this page.');
            window.location.href = 'login.html';
        }
    }
};

const Api = {
    async request(path, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        };
        const token = Auth.getToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;

        let response;
        try {
            response = await fetch(`${API_BASE}${path}`, { ...options, headers });
        } catch (networkErr) {
            throw new ApiError(0, 'Cannot reach the server. Is the backend running?');
        }

        // 401 anywhere means the token expired or is invalid — force re-login
        if (response.status === 401) {
            Auth.clearSession();
            window.location.href = 'login.html';
            throw new ApiError(401, 'Session expired. Please log in again.');
        }

        if (response.status === 204) return null; // No Content

        let body;
        try {
            body = await response.json();
        } catch {
            body = null;
        }

        if (!response.ok) {
            const message = body?.message || `Request failed (${response.status})`;
            const details = body?.details || [];
            throw new ApiError(response.status, message, details);
        }

        return body;
    },

    get(path) { return this.request(path, { method: 'GET' }); },
    post(path, data) { return this.request(path, { method: 'POST', body: JSON.stringify(data) }); },
    put(path, data) { return this.request(path, { method: 'PUT', body: JSON.stringify(data) }); },
    patch(path, data) { return this.request(path, { method: 'PATCH', body: data ? JSON.stringify(data) : undefined }); },
    delete(path) { return this.request(path, { method: 'DELETE' }); }
};

class ApiError extends Error {
    constructor(status, message, details = []) {
        super(message);
        this.status = status;
        this.details = details;
    }
}

/** Small DOM helper: shows an alert box (id must exist in the page) with a message. */
function showAlert(elementId, message, type = 'error') {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = message;
    el.className = `alert show alert-${type}`;
}

function hideAlert(elementId) {
    const el = document.getElementById(elementId);
    if (el) el.className = 'alert';
}

function formatCurrency(amount) {
    return 'Rs. ' + Number(amount).toLocaleString('en-LK', { minimumFractionDigits: 2 });
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-LK', { year: 'numeric', month: 'short', day: 'numeric' });
}
