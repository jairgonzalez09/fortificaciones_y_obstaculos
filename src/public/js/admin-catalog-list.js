(async () => {
    document.body.style.opacity = '0';

    const token = localStorage.getItem('adminToken');

    if (!token) {
        window.location.href = '/login';
        return;
    }

    try {
        const verifyResponse = await fetch('/api/auth/verify', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!verifyResponse.ok) {
            throw new Error('Token inválido o expirado');
        }
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.3s ease';

    } catch (error) {
        localStorage.removeItem('adminToken');
        window.location.href = '/login';
        return;
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('adminToken');
            window.location.href = '/login';
        });
    }

    const ITEMS_PER_PAGE = 8;
    let catalogData = [];
    let currentPage = 1;

    const loadingIndicator = document.getElementById('loadingIndicator');
    const tableContainer = document.getElementById('tableContainer');
    const emptyState = document.getElementById('emptyState');
    const tbody = document.getElementById('catalogTableBody');
    const paginationContainer = document.getElementById('paginationContainer');
    const paginationInfo = document.getElementById('paginationInfo');
    const paginationButtons = document.getElementById('paginationButtons');

    function formatDate(dateStr) {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    function renderTable() {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const pageItems = catalogData.slice(start, end);

        tbody.innerHTML = '';

        if (pageItems.length === 0) {
            tableContainer.classList.add('hidden');
            emptyState.classList.remove('hidden');
            return;
        }

        pageItems.forEach(item => {
            const tr = document.createElement('tr');
            tr.className = 'border-b border-white/5 hover:bg-white/[0.02] transition-colors';

            const classificationBadge = item.classification
                ? `<span class="inline-flex items-center gap-2 px-4 py-3 rounded-full font-label-sm text-label-sm ${item.classification === 'fortificaciones' ? 'bg-blue-500/10 text-blue-400' : 'bg-orange-500/10 text-orange-400'}">${item.classification === 'fortificaciones' ? '<span class="material-symbols-outlined" style="font-size:11px">shield</span> Fortificaciones' : '<span class="material-symbols-outlined" style="font-size:11px">block</span> Obstáculos'}</span>`
                : '—';

            const typeBadge = item.type
                ? `<span class="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm"><span class="material-symbols-outlined" style="font-size:11px">sell</span> ${item.type}</span>`
                : '—';

            tr.innerHTML = `
                <td class="px-6 py-4 font-body-md text-body-md text-center text-on-surface font-mono text-sm">${item.id || '—'}</td>
                <td class="px-6 py-4 font-body-md text-body-md text-on-surface font-semibold">${item.name ? (item.name.length > 34 ? item.name.substring(0, 34) + '..' : item.name) : '—'}</td>
                <td class="px-6 py-4 md:table-cell text-center">${classificationBadge}</td>
                <td class="px-6 py-4 sm:table-cell text-center">${typeBadge}</td>
                <td class="px-6 py-4 font-body-md text-body-md text-center text-on-surface-variant lg:table-cell">${item.steps ? item.steps.length : 0}</td>
                <td class="px-6 py-4 font-body-md text-body-md text-on-surface-variant hidden lg:table-cell">${formatDate(item.updatedAt)}</td>
                <td class="px-6 py-4 text-center">
                    <div class="inline-flex items-center gap-2">
                        <a href="/admin/edit/${item.id}" class="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#8ED927] text-[#8ED927] hover:bg-[#8ED927]/10 transition-all duration-300 font-label-sm text-label-sm">
                            <span class="material-symbols-outlined" style="font-size:13px">edit</span>
                            Editar
                        </a>
                        <button onclick="deleteItem(${item.id})" class="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#ff4444] text-[#ff4444] hover:bg-[#ff4444]/10 transition-all duration-300 font-label-sm text-label-sm">
                            <span class="material-symbols-outlined" style="font-size:13px">delete</span>
                            Eliminar
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });

        updatePagination();
    }

    function updatePagination() {
        const totalPages = Math.ceil(catalogData.length / ITEMS_PER_PAGE);

        if (totalPages <= 1) {
            paginationContainer.classList.add('hidden');
            return;
        }

        paginationContainer.classList.remove('hidden');
        paginationInfo.textContent = `Página ${currentPage} de ${totalPages} (${catalogData.length} elementos)`;

        paginationButtons.innerHTML = '';

        const prevBtn = document.createElement('button');
        prevBtn.className = `pagination-btn flex items-center justify-center rounded-lg font-body-md text-sm transition-all duration-300 ${currentPage === 1 ? 'text-on-surface-variant/30 cursor-not-allowed' : 'text-on-surface-variant hover:text-primary hover:bg-primary/10 cursor-pointer'}`;
        prevBtn.innerHTML = '<span class="material-symbols-outlined text-sm">chevron_left</span>';
        if (currentPage > 1) {
            prevBtn.addEventListener('click', () => {
                currentPage--;
                renderTable();
            });
        }
        paginationButtons.appendChild(prevBtn);

        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, startPage + 4);

        for (let i = startPage; i <= endPage; i++) {
            const btn = document.createElement('button');
            const isActive = i === currentPage;
            btn.className = `pagination-btn flex items-center justify-center rounded-lg font-body-md text-sm font-semibold transition-all duration-300 ${isActive ? 'bg-primary text-background' : 'text-on-surface-variant hover:text-primary hover:bg-primary/10 cursor-pointer'}`;
            btn.textContent = i;
            if (!isActive) {
                btn.addEventListener('click', () => {
                    currentPage = i;
                    renderTable();
                });
            }
            paginationButtons.appendChild(btn);
        }

        const nextBtn = document.createElement('button');
        nextBtn.className = `pagination-btn flex items-center justify-center rounded-lg font-body-md text-sm transition-all duration-300 ${currentPage === totalPages ? 'text-on-surface-variant/30 cursor-not-allowed' : 'text-on-surface-variant hover:text-primary hover:bg-primary/10 cursor-pointer'}`;
        nextBtn.innerHTML = '<span class="material-symbols-outlined text-sm">chevron_right</span>';
        if (currentPage < totalPages) {
            nextBtn.addEventListener('click', () => {
                currentPage++;
                renderTable();
            });
        }
        paginationButtons.appendChild(nextBtn);
    }

    try {
        const response = await fetch('/api/user/catalog/all');

        if (!response.ok) {
            throw new Error('Error al obtener el catálogo');
        }

        const result = await response.json();

        if (result.status === 'success' && Array.isArray(result.data)) {
            catalogData = result.data;
        } else if (Array.isArray(result)) {
            catalogData = result;
        }

        loadingIndicator.classList.add('hidden');

        if (catalogData.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            tableContainer.classList.remove('hidden');
            renderTable();
        }

    } catch (err) {
        loadingIndicator.innerHTML = `
            <span class="material-symbols-outlined text-4xl text-[#ff4444]">error</span>
            <p class="font-body-md text-body-md text-[#ff4444] mt-4">${err.message}</p>
        `;
    }

    window.deleteItem = async (id) => {
        if (!confirm('¿Eliminar este elemento del catálogo? Esta acción no se puede deshacer.')) return;

        const currentToken = localStorage.getItem('adminToken');
        if (!currentToken) {
            window.location.href = '/login';
            return;
        }

        try {
            const response = await fetch(`/api/admin/catalog/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${currentToken}` }
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('adminToken');
                    window.location.href = '/login';
                    return;
                }
                const data = await response.json();
                throw new Error(data.message || 'Error al eliminar el elemento.');
            }

            catalogData = catalogData.filter(item => item.id !== id);
            const totalPages = Math.ceil(catalogData.length / ITEMS_PER_PAGE);
            if (currentPage > totalPages) currentPage = totalPages || 1;
            renderTable();

        } catch (err) {
            alert(err.message);
        }
    };
})();
