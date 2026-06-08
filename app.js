/**
 * JavaScript Principal - Desentupidora JSousa
 * Responsável por animações, interatividade do widget de diagnóstico e menu mobile.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. MENU MOBILE (DRAWER)
    // ==========================================================================
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const closeDrawer = document.querySelector('.drawer-close');
    const drawer = document.querySelector('.mobile-drawer');
    const overlay = document.querySelector('.drawer-overlay');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    function toggleMenu() {
        drawer.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = drawer.classList.contains('active') ? 'hidden' : '';
    }

    if (menuToggle) menuToggle.addEventListener('click', toggleMenu);
    if (closeDrawer) closeDrawer.addEventListener('click', toggleMenu);
    if (overlay) overlay.addEventListener('click', toggleMenu);

    drawerLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (drawer.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // ==========================================================================
    // 2. ACTIVE NAV LINK ON SCROLL & STICKY HEADER
    // ==========================================================================
    const sections = document.querySelectorAll('section[id], header');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        // Efeito sticky header compact
        if (window.scrollY > 50) {
            header.style.padding = '10px 0';
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.height = '70px';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
        } else {
            header.style.padding = '';
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            header.style.height = '80px';
            header.style.boxShadow = 'none';
        }


        // Highlight active link
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================================================
    // 3. REVEAL ANIMATIONS (INTERSECTION OBSERVER)
    // ==========================================================================
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Para itens como a imagem no Hero, aciona uma vez e para de observar
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // ==========================================================================
    // 4. WIDGET INTERATIVO DE DIAGNÓSTICO MULTI-STEP
    // ==========================================================================
    const widgetSteps = document.querySelectorAll('.widget-step');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    const progressBar = document.getElementById('widget-progress');
    const diagnosticForm = document.getElementById('diagnostic-form');

    let currentStep = 1;
    const totalSteps = widgetSteps.length;

    // Atualiza a barra de progresso visual
    function updateProgressBar() {
        const progressPercentage = (currentStep / totalSteps) * 100;
        if (progressBar) {
            progressBar.style.width = `${progressPercentage}%`;
        }
    }

    // Valida se a etapa atual possui preenchimento obrigatório
    function validateStep(stepNum) {
        const activeStepEl = document.querySelector(`.widget-step[data-step="${stepNum}"]`);
        if (!activeStepEl) return true;

        // Se houver inputs de rádio, garante que um esteja selecionado
        const radios = activeStepEl.querySelectorAll('input[type="radio"]');
        if (radios.length > 0) {
            const checkedRadio = activeStepEl.querySelector('input[type="radio"]:checked');
            if (!checkedRadio) {
                alert('Por favor, selecione uma das opções antes de prosseguir.');
                return false;
            }
        }

        // Se houver inputs de texto, garante que estão preenchidos
        const textInputs = activeStepEl.querySelectorAll('input[required]');
        let valid = true;
        textInputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = 'red';
                valid = false;
            } else {
                input.style.borderColor = '';
            }
        });

        if (!valid) {
            alert('Por favor, preencha os campos obrigatórios.');
        }

        return valid;
    }

    // Avançar passo
    nextButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                document.querySelector(`.widget-step[data-step="${currentStep}"]`).classList.remove('active');
                currentStep++;
                document.querySelector(`.widget-step[data-step="${currentStep}"]`).classList.add('active');
                updateProgressBar();
            }
        });
    });

    // Voltar passo
    prevButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector(`.widget-step[data-step="${currentStep}"]`).classList.remove('active');
            currentStep--;
            document.querySelector(`.widget-step[data-step="${currentStep}"]`).classList.add('active');
            updateProgressBar();
        });
    });

    // Submissão do Formulário e Integração WhatsApp
    if (diagnosticForm) {
        diagnosticForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (!validateStep(currentStep)) return;

            // Coleta os dados selecionados
            const formData = new FormData(diagnosticForm);
            const name = formData.get('name');
            const neighborhood = formData.get('neighborhood');
            const location = formData.get('location');
            const severity = formData.get('severity');
            const property = formData.get('property');

            // Número do WhatsApp da central (substituir se necessário)
            const whatsappNumber = '5521974593911';

            // Monta a mensagem estruturada (copywriting de urgência e clareza técnica)
            const message = `Olá, me chamo *${name}* e preciso de um orçamento de desentupimento.\n\n` +
                            `📍 *Bairro:* ${neighborhood}\n` +
                            `🔍 *Local do Problema:* ${location}\n` +
                            `🚨 *Gravidade da Situação:* ${severity}\n` +
                            `🏢 *Tipo de Imóvel:* ${property}\n\n` +
                            `_Gostaria de agendar uma visita grátis com o técnico de plantão mais próximo._`;

            // Codifica a mensagem para a URL do WhatsApp
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;

            // Redireciona o usuário para o WhatsApp em uma nova aba
            window.open(whatsappUrl, '_blank');
        });
    }

});
