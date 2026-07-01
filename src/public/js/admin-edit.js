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

    const itemId = window.location.pathname.split('/').pop();
    if (!itemId || itemId === 'edit') {
        window.location.href = '/admin/catalog-list';
        return;
    }

    const loadingIndicator = document.getElementById('loadingIndicator');
    const editForm = document.getElementById('editForm');
    const notFoundState = document.getElementById('notFoundState');

    const itemName = document.getElementById('itemName');
    const itemDescription = document.getElementById('itemDescription');
    const itemClassification = document.getElementById('itemClassification');
    const itemType = document.getElementById('itemType');
    const coverImageZone = document.querySelector('.upload-zone');
    const coverFileInput = document.getElementById('coverFileInput');
    const coverIcon = document.getElementById('coverIcon');

    let steps = [];
    let coverFileObject = null;
    let originalCoverUrl = null;
    let hasChanges = false;

    const stepsContainer = document.getElementById('dynamicStepsContainer');
    const stepsCounterBadge = document.getElementById('step-counter-badge');
    const progressBar = document.getElementById('step-progress-bar');
    const addStepButton = document.querySelector('button.btn-ghost');
    const submitButton = editForm.querySelector('button.btn-primary');

    let catalogItem = null;

    try {
        const response = await fetch(`/api/user/catalog/${itemId}`);

        if (!response.ok) {
            if (response.status === 404) {
                loadingIndicator.classList.add('hidden');
                notFoundState.classList.remove('hidden');
                return;
            }
            throw new Error('Error al obtener el elemento');
        }

        const result = await response.json();

        if (result.status !== 'success' || !result.data) {
            loadingIndicator.classList.add('hidden');
            notFoundState.classList.remove('hidden');
            return;
        }

        catalogItem = result.data;
        loadingIndicator.classList.add('hidden');
        editForm.classList.remove('hidden');

        itemName.value = catalogItem.name || '';
        itemDescription.value = catalogItem.description || '';
        itemClassification.value = catalogItem.classification || 'fortificacion';
        itemType.value = catalogItem.type || '';

        if (catalogItem.file?.url) {
            originalCoverUrl = catalogItem.file.url;
            const previewContainer = coverImageZone.querySelector('.mix-blend-overlay');
            if (previewContainer) {
                previewContainer.style.backgroundImage = `url('/${catalogItem.file.url}')`;
                previewContainer.style.opacity = '0.6';
            }
            const textLabel = coverImageZone.querySelector('.font-body-md.text-body-md.text-on-surface.font-semibold');
            if (textLabel) textLabel.textContent = 'Haz clic para cambiar la imagen de portada';
            if (coverIcon) coverIcon.textContent = 'photo';
        }

        if (Array.isArray(catalogItem.steps) && catalogItem.steps.length > 0) {
            steps = catalogItem.steps.map(s => ({
                id: s.id || null,
                title: (s.name || '').replace(/^Paso\s+\d+:\s*/, ''),
                description: s.description || '',
                file: null,
                existingImage: s.file?.url || null
            }));
        } else {
            steps = [{ id: null, title: '', description: '', file: null, existingImage: null }];
        }

        updateStepsUI();

    } catch (err) {
        loadingIndicator.innerHTML = `
            <span class="material-symbols-outlined text-4xl text-[#ff4444]">error</span>
            <p class="font-body-md text-body-md text-[#ff4444] mt-4">${err.message}</p>
        `;
    }

    function updateStepsUI() {
        stepsContainer.innerHTML = '';
        const totalSteps = steps.length;
        if (stepsCounterBadge) {
            stepsCounterBadge.textContent = `Pasos ${totalSteps}`;
        }

        if (progressBar) {
            progressBar.style.width = '100%';
        }

        steps.forEach((step, index) => {
            const stepIndex = index + 1;
            const stepBlock = document.createElement('div');
            stepBlock.className = 'step-item border-b border-white/5 pb-6 last:border-b-0 last:pb-0 flex flex-col gap-4 animate-fade-in-up';

            const hasExistingImage = step.existingImage && !step.file;

            let uploadHtml;
            if (step.file) {
                uploadHtml = `
                    <div class="absolute inset-0 bg-cover bg-center opacity-30" style="background-image: url('${URL.createObjectURL(step.file)}')"></div>
                    <span class="material-symbols-outlined text-primary text-2xl relative z-10">check_circle</span>
                    <p class="font-label-sm text-label-sm text-primary relative z-10 mt-1">${step.file.name}</p>
                `;
            } else if (hasExistingImage) {
                uploadHtml = `
                    <div class="absolute inset-0 bg-cover bg-center opacity-30" style="background-image: url('/${step.existingImage}')"></div>
                    <span class="material-symbols-outlined text-primary text-2xl relative z-10">check_circle</span>
                    <p class="font-label-sm text-label-sm text-primary relative z-10 mt-1">Imagen existente</p>
                `;
            } else {
                uploadHtml = `
                    <span class="material-symbols-outlined text-on-surface-variant mb-1 group-hover:text-primary transition-colors text-2xl">add_photo_alternate</span>
                    <p class="font-label-sm text-label-sm text-on-surface-variant group-hover:text-primary transition-colors">Subir referencia para Paso ${stepIndex}</p>
                `;
            }

            stepBlock.innerHTML = `
                <div class="flex justify-between items-center mb-2">
                    <span class="text-primary font-semibold text-sm">Paso ${stepIndex}</span>
                    ${totalSteps > 1 ? `
                        <button type="button" class="bg-transparent border border-[#ff4444] text-[#ff4444] hover:bg-[#ff4444]/10 hover:shadow-[0_0_15px_rgba(255,68,68,0.2)] px-4 py-1.5 rounded-lg font-body-md text-sm font-semibold flex items-center gap-2 transition-all duration-300 remove-step-btn" data-index="${index}">
                            <span class="material-symbols-outlined text-sm">delete</span> Eliminar paso
                        </button>
                    ` : ''}
                </div>
                <div class="floating-label-group input-glass rounded-lg overflow-hidden group">
                    <input class="floating-input bg-transparent border-none focus:ring-0 text-on-surface font-body-md text-body-md p-4 w-full step-title-input" 
                           placeholder=" " type="text" value="${step.title}" data-index="${index}">
                    <label class="floating-label font-body-md text-body-md transition-colors pl-4 pt-1">Título del Paso</label>
                </div>
                <div class="input-glass rounded-lg p-1 group">
                    <textarea class="w-full bg-transparent border-none focus:ring-0 text-on-surface font-body-md text-body-md p-4 resize-none transition-colors step-desc-input" 
                              placeholder="Instrucciones del paso..." rows="3" data-index="${index}">${step.description}</textarea>
                </div>
                <div class="upload-zone step-upload-zone rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer group border border-dashed border-white/10 relative overflow-hidden h-[120px]" data-index="${index}">
                    <input type="file" accept="image/*" class="hidden step-file-input" data-index="${index}">
                    ${uploadHtml}
                </div>
            `;
            stepsContainer.appendChild(stepBlock);
        });

        assignStepsEvents();
    }

    function assignStepsEvents() {
        document.querySelectorAll('.step-title-input').forEach(input => {
            input.addEventListener('input', (e) => {
                hasChanges = true;
                const idx = parseInt(e.target.dataset.index);
                steps[idx].title = e.target.value;
            });
        });

        document.querySelectorAll('.step-desc-input').forEach(textarea => {
            textarea.addEventListener('input', (e) => {
                hasChanges = true;
                const idx = parseInt(e.target.dataset.index);
                steps[idx].description = e.target.value;
            });
        });

        document.querySelectorAll('.step-upload-zone').forEach(zone => {
            const fileInput = zone.querySelector('.step-file-input');

            fileInput?.addEventListener('click', (e) => {
                e.stopPropagation();
            });

            zone.addEventListener('click', (e) => {
                if (e.target.closest('.remove-step-btn')) return;
                fileInput?.click();
            });
        });

        document.querySelectorAll('.step-file-input').forEach(input => {
            input.addEventListener('change', (e) => {
                hasChanges = true;
                e.stopPropagation();
                const idx = parseInt(e.target.dataset.index);
                if (e.target.files.length > 0) {
                    steps[idx].file = e.target.files[0];
                    steps[idx].existingImage = null;
                    updateStepsUI();
                }
            });
        });

        document.querySelectorAll('.remove-step-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                hasChanges = true;
                e.preventDefault();
                e.stopPropagation();
                const idx = parseInt(e.currentTarget.dataset.index);
                steps.splice(idx, 1);
                updateStepsUI();
            });
        });
    }

    itemName?.addEventListener('input', () => { hasChanges = true; });
    itemDescription?.addEventListener('input', () => { hasChanges = true; });
    itemClassification?.addEventListener('change', () => { hasChanges = true; });
    itemType?.addEventListener('input', () => { hasChanges = true; });

    coverImageZone?.addEventListener('click', () => {
        coverFileInput?.click();
    });

    coverFileInput?.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    coverFileInput?.addEventListener('change', (ev) => {
        hasChanges = true;
        if (ev.target.files.length > 0) {
            coverFileObject = ev.target.files[0];
            const previewContainer = coverImageZone.querySelector('.mix-blend-overlay');
            if (previewContainer) {
                previewContainer.style.backgroundImage = `url('${URL.createObjectURL(coverFileObject)}')`;
                previewContainer.style.opacity = '0.6';
            }
            const textLabel = coverImageZone.querySelector('.font-body-md.text-body-md.text-on-surface.font-semibold');
            if (textLabel) textLabel.textContent = `Portada: ${coverFileObject.name}`;
            if (coverIcon) coverIcon.textContent = 'photo';
        }
    });

    addStepButton?.addEventListener('click', (e) => {
        hasChanges = true;
        e.preventDefault();
        e.stopPropagation();
        steps.push({ id: null, title: '', description: '', file: null, existingImage: null });
        updateStepsUI();
    });

    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const currentToken = localStorage.getItem('adminToken');
        if (!currentToken) {
            alert('Sesión expirada o no válida. Por favor, inicia sesión de nuevo.');
            window.location.href = '/login';
            return;
        }

        if (!hasChanges) {
            alert('No hay cambios para guardar.');
            return;
        }

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Guardando cambios...';
        }

        const formData = new FormData();
        formData.append('name', itemName?.value.trim());
        formData.append('description', itemDescription?.value.trim());
        formData.append('classification', itemClassification?.value);
        formData.append('type', itemType?.value.trim());

        if (coverFileObject) {
            formData.append('coverImage', coverFileObject);
        }

        const stepsTextArray = steps.map((s, i) => ({
            title: `Paso ${i + 1}: ` + (s.title.trim() || 'Sin título'),
            description: s.description.trim() || ''
        }));
        formData.append('stepsText', JSON.stringify(stepsTextArray));

        const hasNewStepImages = steps.some(s => s.file !== null);

        if (hasNewStepImages) {
            steps.forEach((s) => {
                if (s.file) {
                    formData.append('stepImages', s.file);
                }
            });
        }

        fetch(`/api/admin/catalog/${itemId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${currentToken}`
            },
            body: formData
        })
        .then(async (response) => {
            const data = await response.json();
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('adminToken');
                    window.location.href = '/login';
                }
                throw new Error(data.message || 'Error al actualizar el elemento.');
            }
            return data;
        })
        .then(result => {
            if (result.status === 'success') {
                alert('¡Elemento actualizado con éxito!');
                window.location.href = '/admin/catalog-list';
            }
        })
        .catch(error => {
            alert(error.message);
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Guardar Cambios';
            }
        });
    });
})();
