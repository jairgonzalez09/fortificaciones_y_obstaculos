    const API_URL = 'http://localhost:3000/api/user/catalog/fortificaciones/all';
    const FETCH_API_URL = 'http://localhost:3000/api/user/catalog/fortificaciones/all';

(() => {
    const form = document.querySelector('form') || document.forms[0];
    
    if (!form) {
        console.error("No se encontró ningún formulario en el DOM.");
        return;
    }

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const submitButton = form.querySelector('button[type="submit"]');
    let errorContainer = null;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (errorContainer) {
            errorContainer.classList.add('hidden');
        }

        const username = usernameInput?.value.trim();
        const password = passwordInput?.value;

        if (!username || !password) {
            showError("Todos los campos son obligatorios.");
            return;
        }

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = `
                <span class="material-symbols-outlined animate-spin text-[20px]">sync</span>
                <span>Verificando...</span>
            `;
        }

        try {
            const response = await fetch(FETCH_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Credenciales incorrectas.');
            }

            if (data.status === 'success' && data.token) {
                localStorage.setItem('adminToken', data.token);
                console.log(`Token: ${data.token}`);
                window.location.replace('/admin');
            }

        } catch (error) {
            showError(error.message || "Error de conexión con el servidor.");
            
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = `
                    <span>Entrar</span>
                    <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
                `;
            }
        }
    });

    function showError(message) {
        if (!errorContainer) {
            errorContainer = document.createElement('div');
            errorContainer.id = 'loginErrorMessage';
            errorContainer.className = 'p-3 rounded-lg bg-error-container/20 border border-error/30 text-center mb-4 text-[#ff4444] font-semibold text-sm transition-all duration-300';
            form.insertBefore(errorContainer, form.lastElementChild);
        }
        errorContainer.textContent = message;
        errorContainer.classList.remove('hidden');
    }
})();