(() => {
    const form = document.querySelector('form') || document.forms[0];

    const logoutBtn = document.getElementById('logoutBtn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('adminToken');
            window.location.href = '/login';
        });
    }
    if (!form) return;

    const itemName = document.getElementById('itemName');
    const itemDescription = form.querySelector('textarea');
    const itemClassification = form.querySelector('select');
    const itemType = document.getElementById('itemType');
    const coverImageZone = form.querySelector('.upload-zone');

    let steps = [
        { title: '', description: '', file: null }
    ];

    const stepsContainer = document.getElementById('dynamicStepsContainer') || document.createElement('div');
    if (!stepsContainer.parentNode && form.querySelector('button.btn-ghost')) {
        const addBtn = form.querySelector('button.btn-ghost');
        addBtn.parentElement.insertBefore(stepsContainer, addBtn);
    }

    const stepsCounterBadge = document.getElementById('step-counter-badge');
    const progressBar = document.getElementById('step-progress-bar');
    const addStepButton = form.querySelector('button.btn-ghost');
    const submitButton = form.querySelector('button.btn-primary');

    let coverFileObject = null;

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
                    ${step.file ? `
                        <div class="absolute inset-0 bg-cover bg-center opacity-30" style="background-image: url('${URL.createObjectURL(step.file)}')"></div>
                        <span class="material-symbols-outlined text-primary text-2xl relative z-10">check_circle</span>
                        <p class="font-label-sm text-label-sm text-primary relative z-10 mt-1">${step.file.name}</p>
                    ` : `
                        <span class="material-symbols-outlined text-on-surface-variant mb-1 group-hover:text-primary transition-colors text-2xl">add_photo_alternate</span>
                        <p class="font-label-sm text-label-sm text-on-surface-variant group-hover:text-primary transition-colors">Subir referencia para Paso ${stepIndex}</p>
                    `}
                </div>
            `;
            stepsContainer.appendChild(stepBlock);
        });

        assignStepsEvents();
    }

    function assignStepsEvents() {
        document.querySelectorAll('.step-title-input').forEach(input => {
            input.addEventListener('input', (e) => {
                const idx = parseInt(e.target.dataset.index);
                steps[idx].title = e.target.value;
            });
        });

        document.querySelectorAll('.step-desc-input').forEach(textarea => {
            textarea.addEventListener('input', (e) => {
                const idx = parseInt(e.target.dataset.index);
                steps[idx].description = e.target.value;
            });
        });

        document.querySelectorAll('.step-upload-zone').forEach(zone => {
            zone.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (e.target.closest('.remove-step-btn')) return;
                const fileInput = zone.querySelector('.step-file-input');
                fileInput?.click();
            });
        });

        document.querySelectorAll('.step-file-input').forEach(input => {
            input.addEventListener('change', (e) => {
                e.stopPropagation();
                const idx = parseInt(e.target.dataset.index);
                if (e.target.files.length > 0) {
                    steps[idx].file = e.target.files[0];
                    updateStepsUI();
                }
            });
        });

        document.querySelectorAll('.remove-step-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const idx = parseInt(e.currentTarget.dataset.index);
                steps.splice(idx, 1);
                updateStepsUI();
            });
        });
    }

    coverImageZone?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        let hiddenInput = coverImageZone.querySelector('#coverFileInput');
        if (!hiddenInput) {
            hiddenInput = document.createElement('input');
            hiddenInput.id = 'coverFileInput';
            hiddenInput.type = 'file';
            hiddenInput.accept = 'image/*';
            hiddenInput.className = 'hidden';
            coverImageZone.appendChild(hiddenInput);

            hiddenInput.addEventListener('change', (ev) => {
                ev.stopPropagation();
                if (ev.target.files.length > 0) {
                    coverFileObject = ev.target.files[0];
                    const previewContainer = coverImageZone.querySelector('.mix-blend-overlay');
                    if (previewContainer) {
                        previewContainer.style.backgroundImage = `url('${URL.createObjectURL(coverFileObject)}')`;
                        previewContainer.style.opacity = '0.6';
                    }
                    const textLabel = coverImageZone.querySelector('.font-body-md');
                    if (textLabel) textLabel.textContent = `Portada: ${coverFileObject.name}`;
                }
            });
        }
        hiddenInput.click();
    });

    addStepButton?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        steps.push({ title: '', description: '', file: null });
        updateStepsUI();
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const token = localStorage.getItem('adminToken');
        if (!token) {
            alert('Sesión expirada o no válida. Por favor, inicia sesión de nuevo.');
            window.location.href = '/login';
            return;
        }

        if (!coverFileObject) {
            alert('La imagen de portada general es obligatoria.');
            return;
        }

        for (let i = 0; i < steps.length; i++) {
            if (!steps[i].file) {
                alert(`Falta adjuntar la imagen de referencia para el Paso ${i + 1}.`);
                return;
            }
        }

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Guardando catálogo...';
        }

        const formData = new FormData();
        formData.append('name', itemName?.value.trim());
        formData.append('description', itemDescription?.value.trim());
        formData.append('classification', itemClassification?.value);
        formData.append('type', itemType?.value.trim());
        formData.append('coverImage', coverFileObject);

        const stepsTextArray = steps.map(s => ({
            title: s.title.trim() || 'Sin título',
            description: s.description.trim() || ''
        }));
        formData.append('stepsText', JSON.stringify(stepsTextArray));

        steps.forEach((s) => {
            if (s.file) {
                formData.append('stepImages', s.file);
            }
        });

        fetch('/api/admin/catalog-stepper', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        })
        .then(async (response) => {
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Error al procesar la subida del elemento.');
            }
            return data;
        })
        .then(result => {
            if (result.status === 'success') {
                alert('¡Elemento de catálogo creado con éxito!');
                window.location.reload();
            }
        })
        .catch(error => {
            alert(error.message);
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Crear Elemento';
            }
        });
    });

    updateStepsUI();
})();