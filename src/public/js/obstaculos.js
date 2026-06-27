document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:3000/api/user/catalog/obstaculos/all';
    const catalogContainer = document.getElementById('catalog-container');
    
    const modal = document.querySelector('[data-modal]');
    const modalImage = document.querySelector('[data-modal-image]');
    const modalTitle = document.querySelector('[data-modal-title]');
    const modalDescription = document.querySelector('[data-modal-description]');
    
    const stepLabel = document.querySelector('[data-step-label]');
    const stepCount = document.querySelector('[data-step-count]');
    const stepProgress = document.querySelector('[data-step-progress]');
    const stepTitle = document.querySelector('[data-step-title]');
    const stepContent = document.querySelector('[data-step-content]');
    
    const btnPrev = document.querySelector('[data-step-prev]');
    const btnNext = document.querySelector('[data-step-next]');
    const dotsContainer = document.querySelector('[data-step-dots]');

    let currentCatalogItem = null;
    let currentStepIndex = 0;

    async function fetchCatalog() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Error al conectar con la API de catálogos');
            
            const jsonResponse = await response.json();
            const rawItems = jsonResponse.data || [];
            
            if (!Array.isArray(rawItems)) {
                throw new Error('La propiedad data recibida no es un array válido');
            }

            const obstacles = rawItems.filter(item => 
                item.classification === 'obstaculos' && item.parentId === null
            );

            renderCatalog(obstacles);
        } catch (error) {
            console.error(error);
            catalogContainer.innerHTML = `
                <div class="col-span-full text-center text-red-500 py-12 font-mono">
                    ⚠️ Error al cargar los obstáculos tácticos: ${error.message}
                </div>`;
        }
    }

    function renderCatalog(items) {
        if (items.length === 0) {
            catalogContainer.innerHTML = `<div class="col-span-full text-center text-muted-foreground py-12">No hay obstáculos registrados.</div>`;
            return;
        }

        catalogContainer.innerHTML = items.map(item => {
            const coverImage = item.file ? `/${item.file.url}` : '/images/obstaculos.png';
            const typeTag = item.type ? `<span class="inline-flex items-center px-3 py-1.5 bg-primary/15 text-primary text-xs font-semibold uppercase tracking-wider rounded-full border border-primary/40">◆ ${item.type}</span>` : '';
            
            const truncatedDescription = item.description && item.description.length > 89 
                ? `${item.description.substring(0, 89)}...` 
                : (item.description || '');

            return `
                <div tabindex="0" data-id="${item.id}" class="catalog-card group text-left w-full block relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 border border-secondary/40 hover:border-primary/60 bg-gradient-to-br from-card via-card to-secondary/20 backdrop-blur-sm cursor-pointer">
                    <div class="relative h-72 md:h-80 w-full block overflow-hidden bg-secondary/30">
                        <img src="${coverImage}" alt="${item.name}" class="w-full h-full block object-cover group-hover:scale-110 transition duration-500 ease-out">
                        <div class="absolute inset-0 w-full h-full bg-gradient-to-t from-background via-background/50 to-transparent opacity-90 group-hover:opacity-85 transition duration-300"></div>
                    </div>
                    <div class="relative p-5 md:p-6 space-y-4 w-full block">
                        <div>
                            <h3 class="text-lg md:text-xl font-bold text-primary uppercase tracking-wider leading-tight">${item.name}</h3>
                            <div class="h-0.5 w-12 bg-primary/60 mt-2 rounded-full group-hover:w-16 transition-all duration-300"></div>
                        </div>
                        <p class="text-foreground text-sm md:text-base leading-relaxed">${truncatedDescription}</p>
                        <div class="flex flex-wrap gap-2 pt-3">
                            ${typeTag}
                        </div>
                    </div>
                    <div class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
                </div>
            `;
        }).join('');

        document.querySelectorAll('.catalog-card').forEach(card => {
            card.addEventListener('click', () => {
                const itemId = card.getAttribute('data-id');
                const selectedItem = items.find(i => i.id == itemId);
                if (selectedItem) openStepperModal(selectedItem);
            });
            
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
        });
    }

    function openStepperModal(catalogItem) {
        currentCatalogItem = catalogItem;
        currentStepIndex = 0;

        modalTitle.textContent = catalogItem.name;
        modalDescription.textContent = catalogItem.description;

        currentCatalogItem.orderedSteps = catalogItem.steps ? [...catalogItem.steps].sort((a, b) => a.stepOrder - b.stepOrder) : [];

        buildDots(currentCatalogItem.orderedSteps.length);
        updateStep();

        modal.removeAttribute('hidden');
        document.body.classList.add('overflow-hidden');
    }

    function buildDots(totalSteps) {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSteps; i++) {
            const dot = document.createElement('div');
            dot.className = `w-2 h-2 rounded-full transition-all duration-200 ${i === 0 ? 'bg-primary scale-125' : 'bg-secondary'}`;
            dotsContainer.appendChild(dot);
        }
    }

    function updateStep() {
        const steps = currentCatalogItem.orderedSteps;
        const total = steps.length;

        if (total === 0) {
            modalImage.src = currentCatalogItem.file ? `/${currentCatalogItem.file.url}` : '/images/obstaculos.png';
            modalImage.alt = currentCatalogItem.name;
            stepTitle.textContent = "Sin pasos registrados";
            stepContent.textContent = "Este sistema defensivo no cuenta con instrucciones asíncronas de despliegue.";
            stepCount.textContent = "0 / 0";
            stepProgress.style.width = `0%`;
            btnPrev.disabled = true;
            btnNext.disabled = true;
            return;
        }

        const activeStep = steps[currentStepIndex];

        modalImage.src = activeStep.file ? `/${activeStep.file.url}` : (currentCatalogItem.file ? `/${currentCatalogItem.file.url}` : '/images/obstaculos.png');
        modalImage.alt = activeStep.name;

        stepLabel.textContent = `PASO SELECCIONADO`;
        stepCount.textContent = `${currentStepIndex + 1} / ${total}`;
        
        const cleanName = activeStep.name.replace(/^paso\s+\d+:\s*/i, '');
        stepTitle.textContent = `Paso ${currentStepIndex + 1}: ${cleanName}`;
        
        stepContent.textContent = activeStep.description;

        const progressPercent = ((currentStepIndex + 1) / total) * 100;
        stepProgress.style.width = `${progressPercent}%`;

        btnPrev.disabled = currentStepIndex === 0;
        btnNext.disabled = currentStepIndex === total - 1;

        Array.from(dotsContainer.children).forEach((dot, idx) => {
            if (idx === currentStepIndex) {
                dot.className = 'w-2 h-2 rounded-full bg-primary scale-125 transition-all duration-200';
            } else {
                dot.className = 'w-2 h-2 rounded-full bg-secondary transition-all duration-200';
            }
        });
    }

    btnPrev.addEventListener('click', () => {
        if (currentStepIndex > 0) {
            currentStepIndex--;
            updateStep();
        }
    });

    btnNext.addEventListener('click', () => {
        if (currentStepIndex < currentCatalogItem.orderedSteps.length - 1) {
            currentStepIndex++;
            updateStep();
        }
    });

    document.querySelectorAll('[data-close-modal]').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            modal.setAttribute('hidden', '');
            document.body.classList.remove('overflow-hidden');
        });
    });

    fetchCatalog();
});