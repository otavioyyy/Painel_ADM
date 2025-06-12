// ===== CART ADM - APLICAÇÃO PRINCIPAL =====

class CartADM {
    constructor() {
        this.currentPage = 'inicio';
        this.sidebarOpen = false;
        this.darkMode = localStorage.getItem('darkMode') === 'true';
        this.powerBiUrl = 'https://app.powerbi.com/reportEmbed?reportId=64e478fb-ce93-4ae1-92ca-fbf9aaf386b1&autoAuth=true&ctid=48a3b807-608a-4aed-93c6-d10b37240de2';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupTheme();
        this.updateDateTime();
        this.updateNewspaperDate();
        this.setupLoadingScreen();
        this.setupPowerBI();
        
        // Atualizar relógio a cada segundo
        setInterval(() => this.updateDateTime(), 1000);
        
        // Simular carregamento inicial
        setTimeout(() => this.hideLoadingScreen(), 1500);
    }

    setupEventListeners() {
        // Mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => this.toggleMobileSidebar());
        }

        // Mobile backdrop
        const mobileBackdrop = document.getElementById('mobile-backdrop');
        if (mobileBackdrop) {
            mobileBackdrop.addEventListener('click', () => this.closeMobileSidebar());
        }

        // Navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.currentTarget.dataset.page;
                if (page) {
                    this.navigateToPage(page);
                    if (window.innerWidth <= 768) {
                        this.closeMobileSidebar();
                    }
                }
            });
        });

        // Theme toggle (desktop)
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Theme toggle (mobile)
        const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
        if (mobileThemeToggle) {
            mobileThemeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Chart period buttons
        const chartBtns = document.querySelectorAll('.chart-btn');
        chartBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const period = e.currentTarget.dataset.period;
                this.switchChartPeriod(e.currentTarget, period);
            });
        });

        // Quick actions
        const actionBtns = document.querySelectorAll('.action-btn');
        actionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleQuickAction(action);
            });
        });

        // Power BI controls
        this.setupPowerBIControls();

        // Modal controls
        this.setupModalControls();

        // Notification controls
        this.setupNotificationControls();

        // Help button
        this.setupHelpButton();

        // Comunicados filters
        this.setupComunicadosFilters();

        // Equipe filters
        this.setupEquipeFilters();

        // Window resize handler
        window.addEventListener('resize', () => this.handleWindowResize());

        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
    }

    toggleMobileSidebar() {
        const sidebar = document.getElementById('modern-sidebar');
        const backdrop = document.getElementById('mobile-backdrop');
        const toggle = document.getElementById('mobile-menu-toggle');
        
        if (sidebar && backdrop && toggle) {
            this.sidebarOpen = !this.sidebarOpen;
            
            if (this.sidebarOpen) {
                sidebar.classList.add('active');
                backdrop.classList.add('active');
                toggle.classList.add('active');
                document.body.style.overflow = 'hidden';
            } else {
                sidebar.classList.remove('active');
                backdrop.classList.remove('active');
                toggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    }

    closeMobileSidebar() {
        const sidebar = document.getElementById('modern-sidebar');
        const backdrop = document.getElementById('mobile-backdrop');
        const toggle = document.getElementById('mobile-menu-toggle');
        
        if (sidebar && backdrop && toggle) {
            this.sidebarOpen = false;
            sidebar.classList.remove('active');
            backdrop.classList.remove('active');
            toggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    handleWindowResize() {
        // Fechar sidebar mobile quando tela ficar grande
        if (window.innerWidth > 768 && this.sidebarOpen) {
            this.closeMobileSidebar();
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // ESC para fechar sidebar mobile
            if (e.key === 'Escape' && this.sidebarOpen) {
                this.closeMobileSidebar();
            }
            
            // Ctrl/Cmd + \ para toggle do tema
            if ((e.ctrlKey || e.metaKey) && e.key === '\\') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }

    setupTheme() {
        if (this.darkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            this.updateThemeIcons('fas fa-sun');
        }
    }

    toggleTheme() {
        this.darkMode = !this.darkMode;
        localStorage.setItem('darkMode', this.darkMode);
        
        if (this.darkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            this.updateThemeIcons('fas fa-sun');
        } else {
            document.documentElement.removeAttribute('data-theme');
            this.updateThemeIcons('fas fa-moon');
        }

        this.showToast('Tema alterado com sucesso!', 'success');
    }

    updateThemeIcons(iconClass) {
        const themeIcon = document.querySelector('#theme-toggle i');
        const mobileThemeIcon = document.querySelector('#mobile-theme-toggle i');
        
        if (themeIcon) themeIcon.className = iconClass;
        if (mobileThemeIcon) mobileThemeIcon.className = iconClass;
    }

    navigateToPage(page) {
        // Remove active class from all pages and nav links
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));

        // Add active class to current page and nav link
        const targetPage = document.getElementById(`${page}-page`);
        const targetNavLink = document.querySelector(`[data-page="${page}"]`);
        
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = page;
        }
        
        if (targetNavLink) {
            targetNavLink.classList.add('active');
        }

        // Update header title and subtitle
        this.updatePageHeader(page);

        // Handle special pages
        if (page === 'powerbi') {
            this.refreshPowerBI();
        }
        
        // Update newspaper date for activities page
        if (page === 'atividades') {
            this.updateNewspaperDate();
        }

        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    updatePageHeader(page) {
        const pageTitle = document.getElementById('page-title');
        const pageSubtitle = document.getElementById('page-subtitle');
        
        const pageInfo = {
            inicio: {
                title: 'Início',
                subtitle: 'Visão geral das operações administrativas'
            },
            atividades: {
                title: 'Principais Atividades',
                subtitle: 'Boletim de atividades e notícias do Administrativo'
            },
            powerbi: {
                title: 'Power BI',
                subtitle: 'Dashboards e relatórios em tempo real'
            },
            comunicados: {
                title: 'Comunicados',
                subtitle: 'Avisos e informações para a equipe'
            },
            atendimento: {
                title: 'Atendimento',
                subtitle: 'Locais e pontos de atendimento'
            },
            equipe: {
                title: 'Equipe',
                subtitle: 'Colaboradores e estrutura organizacional'
            }
        };

        if (pageTitle && pageSubtitle && pageInfo[page]) {
            pageTitle.textContent = pageInfo[page].title;
            pageSubtitle.textContent = pageInfo[page].subtitle;
        }
    }

    updateDateTime() {
        const now = new Date();
        
        // Format time
        const timeOptions = { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit',
            hour12: false 
        };
        const timeString = now.toLocaleTimeString('pt-BR', timeOptions);
        
        // Format date
        const dateOptions = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const dateString = now.toLocaleDateString('pt-BR', dateOptions);
        
        // Update DOM elements
        const timeElement = document.getElementById('current-time');
        const dateElement = document.getElementById('current-date');
        
        if (timeElement) timeElement.textContent = timeString;
        if (dateElement) dateElement.textContent = dateString;
    }

    updateNewspaperDate() {
        const now = new Date();
        const dateOptions = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const formattedDate = now.toLocaleDateString('pt-BR', dateOptions);
        
        const newspaperDateElement = document.getElementById('newspaper-date');
        if (newspaperDateElement) {
            newspaperDateElement.textContent = `Edição de ${formattedDate}`;
        }
    }

    setupLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            // Adicionar classe hidden após animação
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
            }, 100);
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }

    switchChartPeriod(button, period) {
        // Remove active class from all chart buttons
        const chartBtns = button.parentElement.querySelectorAll('.chart-btn');
        chartBtns.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Here you would typically update the chart data
        this.showToast(`Período alterado para ${period}`, 'info');
    }

    handleQuickAction(action) {
        switch (action) {
            case 'new-task':
                this.showToast('Nova tarefa criada!', 'success');
                break;
            case 'generate-report':
                this.showToast('Gerando relatório...', 'info');
                setTimeout(() => {
                    this.showToast('Relatório gerado com sucesso!', 'success');
                }, 2000);
                break;
            case 'schedule-maintenance':
                this.showToast('Manutenção agendada!', 'success');
                break;
            case 'view-powerbi':
                this.navigateToPage('powerbi');
                break;
        }
    }

    setupPowerBIControls() {
        const refreshBtn = document.getElementById('refresh-powerbi');
        const fullscreenBtn = document.getElementById('fullscreen-powerbi');
        const configureBtn = document.getElementById('configure-powerbi');

        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshPowerBI());
        }

        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => this.togglePowerBIFullscreen());
        }

        if (configureBtn) {
            configureBtn.addEventListener('click', () => this.openPowerBIConfig());
        }
    }

    setupPowerBI() {
        // Power BI já está configurado com URL padrão
        const iframe = document.getElementById('powerbi-iframe');
        const placeholder = document.querySelector('.powerbi-placeholder');
        
        if (iframe && this.powerBiUrl) {
            iframe.src = this.powerBiUrl;
            if (placeholder) {
                placeholder.style.display = 'none';
            }
        }
    }

    refreshPowerBI() {
        const iframe = document.getElementById('powerbi-iframe');
        if (iframe && this.powerBiUrl) {
            iframe.src = this.powerBiUrl;
            this.showToast('Power BI atualizado!', 'success');
        } else {
            this.showToast('Configure a URL do Power BI primeiro', 'warning');
        }
    }

    togglePowerBIFullscreen() {
        const container = document.querySelector('.powerbi-iframe-container');
        if (container) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                container.requestFullscreen();
            }
        }
    }

    openPowerBIConfig() {
        const modal = document.getElementById('powerbi-config-modal');
        const urlInput = document.getElementById('powerbi-url');
        
        if (modal && urlInput) {
            urlInput.value = this.powerBiUrl;
            modal.classList.add('active');
        }
    }

    loadPowerBI(url) {
        const iframe = document.getElementById('powerbi-iframe');
        const placeholder = document.querySelector('.powerbi-placeholder');
        
        if (iframe && url) {
            iframe.src = url;
            if (placeholder) {
                placeholder.style.display = 'none';
            }
        }
    }

    setupModalControls() {
        // Power BI Config Modal
        const modal = document.getElementById('powerbi-config-modal');
        const closeBtn = document.getElementById('close-powerbi-modal');
        const cancelBtn = document.getElementById('cancel-powerbi-config');
        const saveBtn = document.getElementById('save-powerbi-config');
        const urlInput = document.getElementById('powerbi-url');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal(modal));
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.closeModal(modal));
        }

        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const url = urlInput.value.trim();
                if (url) {
                    this.powerBiUrl = url;
                    localStorage.setItem('powerBiUrl', url);
                    this.loadPowerBI(url);
                    this.closeModal(modal);
                    this.showToast('Power BI configurado com sucesso!', 'success');
                } else {
                    this.showToast('Digite uma URL válida', 'error');
                }
            });
        }

        // Close modal on backdrop click
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        }
    }

    closeModal(modal) {
        if (modal) {
            modal.classList.remove('active');
        }
    }

    setupNotificationControls() {
        const notificationBtn = document.querySelector('.notification-btn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => {
                this.showToast('Você tem 3 notificações pendentes', 'info');
            });
        }

        const toastClose = document.querySelector('.toast-close');
        if (toastClose) {
            toastClose.addEventListener('click', () => this.hideToast());
        }
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('notification-toast');
        const toastIcon = document.querySelector('.toast-icon');
        const toastMessage = document.querySelector('.toast-message');
        
        if (!toast || !toastIcon || !toastMessage) return;

        // Set icon based on type
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        toastIcon.className = `toast-icon ${icons[type] || icons.info}`;
        toastMessage.textContent = message;
        
        // Show toast
        toast.classList.add('show');
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            this.hideToast();
        }, 5000);
    }

    hideToast() {
        const toast = document.getElementById('notification-toast');
        if (toast) {
            toast.classList.remove('show');
        }
    }

    // Método para adicionar animações aos cards
    animateCards() {
        const cards = document.querySelectorAll('.stat-card, .chart-card, .activities-section, .quick-actions');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                }
            });
        }, {
            threshold: 0.1
        });

        cards.forEach(card => observer.observe(card));
    }

    // Método para simular dados em tempo real
    simulateRealTimeData() {
        setInterval(() => {
            this.updateStats();
        }, 30000); // Atualizar a cada 30 segundos
    }

    updateStats() {
        // Selecionar apenas os stat-numbers do início principal, excluindo os da equipe
        const statNumbers = document.querySelectorAll('.inicio-grid .stat-number');
        statNumbers.forEach(stat => {
            const currentValue = parseInt(stat.textContent);
            const variation = Math.floor(Math.random() * 10) - 5; // -5 a +5
            const newValue = Math.max(0, currentValue + variation);
            
            // Animar mudança
            stat.style.transform = 'scale(1.1)';
            setTimeout(() => {
                stat.textContent = newValue;
                stat.style.transform = 'scale(1)';
            }, 150);
        });
    }

    // Método para adicionar micro-interações
    addMicroInteractions() {
        // Hover effect para menu items
        const menuItems = document.querySelectorAll('.nav-link');
        menuItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateX(10px) scale(1.02)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateX(0) scale(1)';
            });
        });

        // Click effect para botões
        const buttons = document.querySelectorAll('button, .action-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Criar efeito ripple
                const ripple = document.createElement('div');
                ripple.classList.add('ripple');
                ripple.style.position = 'absolute';
                ripple.style.borderRadius = '50%';
                ripple.style.background = 'rgba(255, 255, 255, 0.6)';
                ripple.style.transform = 'scale(0)';
                ripple.style.animation = 'ripple 0.6s linear';
                ripple.style.left = e.offsetX + 'px';
                ripple.style.top = e.offsetY + 'px';
                
                btn.style.position = 'relative';
                btn.style.overflow = 'hidden';
                btn.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    // Help button
    setupHelpButton() {
        const helpButton = document.getElementById('help-button');
        if (helpButton) {
            helpButton.addEventListener('click', () => {
                const email = 'otavio.maia@cartsp.com.br';
                const subject = 'Solicitação de Suporte - CART ADM Início';
                const body = 'Olá Otavio,\n\nPreciso de ajuda com o sistema CART ADM.\n\nDescrição do problema:\n\n\nAtenciosamente,';
                
                const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                
                window.location.href = mailtoLink;
                
                this.showToast('Abrindo cliente de email...', 'info');
            });
        }
    }

    // Comunicados filters
    setupComunicadosFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const comunicadoCards = document.querySelectorAll('.comunicado-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;

                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter cards
                comunicadoCards.forEach(card => {
                    const category = card.dataset.category;
                    
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        card.style.animation = 'fadeInScale 0.6s ease-out forwards';
                    } else {
                        card.style.display = 'none';
                    }
                });

                this.showToast(`Filtro aplicado: ${btn.textContent.trim()}`, 'info');
            });
        });
    }

    // Equipe filters
    setupEquipeFilters() {
        const deptBtns = document.querySelectorAll('.dept-btn');
        const memberCards = document.querySelectorAll('.member-card');

        deptBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const dept = btn.dataset.dept;

                // Remove active class from all buttons
                deptBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter cards
                memberCards.forEach(card => {
                    const department = card.dataset.department;
                    
                    if (dept === 'all' || department === dept) {
                        card.style.display = 'block';
                        card.style.animation = 'fadeInScale 0.6s ease-out forwards';
                    } else {
                        card.style.display = 'none';
                    }
                });

                this.showToast(`Departamento: ${btn.textContent.trim()}`, 'info');
            });
        });
    }
}

// Inicializar aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    const app = new CartADM();
    
    // Inicializar AOS (Animate On Scroll)
    initAOS();
    
    // Adicionar animações e interações extras
    setTimeout(() => {
        app.animateCards();
        app.addMicroInteractions();
        app.simulateRealTimeData();
        createFloatingElements();
        addHoverEffects();
    }, 100);
    
    // Adicionar listeners para melhor UX
    document.addEventListener('keydown', (e) => {
        // Alt + M para toggle do menu mobile
        if (e.altKey && e.key.toLowerCase() === 'm') {
            e.preventDefault();
            app.toggleMobileSidebar();
        }
    });
});

// Adicionar CSS para animação ripple
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .ripple {
        width: 20px;
        height: 20px;
        pointer-events: none;
    }
`;
document.head.appendChild(style);

// ===== MODAL DE E-MAIL ===== 
function openEmailModal(type) {
    const modal = document.getElementById('email-modal');
    const emailTo = document.getElementById('email-to');
    const emailSubject = document.getElementById('email-subject');
    
    // Configurar destinatário baseado no tipo
    let emailAddress = '';
    let defaultSubject = '';
    
    switch(type) {
        case 'predial':
            emailAddress = 'predial@cartsp.com.br';
            defaultSubject = 'Solicitação de Atendimento Predial';
            break;
        case 'administrativo':
            emailAddress = 'administrativo@cartsp.com.br';
            defaultSubject = 'Solicitação de Atendimento Administrativo';
            break;
        case 'geral':
            emailAddress = 'contato@cartsp.com.br';
            defaultSubject = 'Contato Geral - CART';
            break;
        default:
            emailAddress = 'contato@cartsp.com.br';
            defaultSubject = 'Contato - CART';
    }
    
    emailTo.value = emailAddress;
    emailSubject.value = defaultSubject;
    
    modal.classList.add('active');
    
    // Adicionar animação de entrada
    setTimeout(() => {
        modal.querySelector('.modal-content').style.transform = 'scale(1)';
    }, 50);
}

function closeEmailModal() {
    const modal = document.getElementById('email-modal');
    const modalContent = modal.querySelector('.modal-content');
    
    modalContent.style.transform = 'scale(0.8)';
    
    setTimeout(() => {
        modal.classList.remove('active');
        // Limpar formulário
        document.getElementById('email-form').reset();
    }, 300);
}

function sendEmail() {
    const form = document.getElementById('email-form');
    const formData = new FormData(form);
    
    // Validar formulário
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const emailData = {
        to: document.getElementById('email-to').value,
        from: document.getElementById('email-from').value,
        subject: document.getElementById('email-subject').value,
        message: document.getElementById('email-message').value,
        priority: document.getElementById('email-priority').value
    };
    
    // Criar link mailto
    const mailtoLink = `mailto:${emailData.to}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(`
De: ${emailData.from}
Prioridade: ${emailData.priority.toUpperCase()}

${emailData.message}

---
Enviado através do Sistema CART ADM
    `)}`;
    
    // Abrir cliente de e-mail
    window.location.href = mailtoLink;
    
    // Mostrar toast de sucesso
    showToast('E-mail aberto no seu cliente de e-mail padrão!', 'success');
    
    // Fechar modal
    closeEmailModal();
}

// ===== ANIMAÇÕES AOS ===== 
function initAOS() {
    // Simular biblioteca AOS
    const elements = document.querySelectorAll('[data-aos]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-aos-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, parseInt(delay));
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(el => observer.observe(el));
}

// ===== TOAST NOTIFICATIONS ===== 
function showToast(message, type = 'info') {
    // Remover toast existente
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const iconClass = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    }[type] || 'fas fa-info-circle';
    
    toast.innerHTML = `
        <div class="toast-content">
            <i class="${iconClass} toast-icon"></i>
            <span class="toast-message">${message}</span>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(toast);
    
    // Mostrar toast
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Auto remover após 5 segundos
    setTimeout(() => {
        if (toast.parentElement) {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }
    }, 5000);
}

// ===== FLOATING ELEMENTS ===== 
function createFloatingElements() {
    const atendimentoContainer = document.querySelector('.atendimento-container');
    if (!atendimentoContainer) return;
    
    // Criar elementos flutuantes decorativos
    for (let i = 0; i < 5; i++) {
        const floatingElement = document.createElement('div');
        floatingElement.className = 'floating-element';
        floatingElement.style.cssText = `
            position: absolute;
            width: ${Math.random() * 60 + 20}px;
            height: ${Math.random() * 60 + 20}px;
            background: linear-gradient(135deg, 
                rgba(99, 102, 241, 0.1), 
                rgba(16, 185, 129, 0.1)
            );
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: floatRandom ${5 + Math.random() * 10}s ease-in-out infinite;
            z-index: -1;
            pointer-events: none;
        `;
        
        atendimentoContainer.appendChild(floatingElement);
    }
}

// ===== PARTICLE EFFECT ===== 
function addParticleEffect(element) {
    element.addEventListener('click', function(e) {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: var(--primary-color);
                border-radius: 50%;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                z-index: 1000;
                animation: particle-burst 0.6s ease-out forwards;
            `;
            
            element.appendChild(particle);
            
            setTimeout(() => particle.remove(), 600);
        }
    });
}

// ===== HOVER SOUND EFFECTS ===== 
function addHoverEffects() {
    const interactiveElements = document.querySelectorAll('.btn-action, .quick-btn, .mini-btn');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform += ' scale(1.02)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = this.style.transform.replace(' scale(1.02)', '');
        });
        
        // Adicionar efeito de partícula
        addParticleEffect(element);
    });
}

// ===== INICIALIZAÇÃO ===== 
document.addEventListener('DOMContentLoaded', function() {
    // Event listeners para modal de e-mail
    const emailModal = document.getElementById('email-modal');
    const closeEmailBtn = document.getElementById('close-email-modal');
    const cancelEmailBtn = document.getElementById('cancel-email');
    const sendEmailBtn = document.getElementById('send-email');
    
    if (closeEmailBtn) {
        closeEmailBtn.addEventListener('click', closeEmailModal);
    }
    
    if (cancelEmailBtn) {
        cancelEmailBtn.addEventListener('click', closeEmailModal);
    }
    
    if (sendEmailBtn) {
        sendEmailBtn.addEventListener('click', sendEmail);
    }
    
    // Fechar modal clicando fora
    if (emailModal) {
        emailModal.addEventListener('click', function(e) {
            if (e.target === emailModal) {
                closeEmailModal();
            }
        });
    }
    
    // Fechar modal com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && emailModal && emailModal.classList.contains('active')) {
            closeEmailModal();
        }
    });
    
    // Inicializar animações e efeitos
    setTimeout(() => {
        initAOS();
        createFloatingElements();
        addHoverEffects();
    }, 500);
});

// ===== CSS DINÂMICO PARA ANIMAÇÕES ===== 
const dynamicStyles = `
    @keyframes floatRandom {
        0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
        25% { transform: translateY(-20px) translateX(10px) rotate(90deg); }
        50% { transform: translateY(-10px) translateX(-15px) rotate(180deg); }
        75% { transform: translateY(-30px) translateX(5px) rotate(270deg); }
    }
    
    @keyframes particle-burst {
        0% {
            transform: scale(1) translate(0, 0);
            opacity: 1;
        }
        100% {
            transform: scale(0) translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px);
            opacity: 0;
        }
    }
    
    .toast {
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: var(--bg-card);
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-lg);
        padding: 1rem 1.5rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        z-index: 3000;
        transform: translateX(100%);
        transition: transform var(--transition-normal);
        border-left: 4px solid var(--secondary-color);
        max-width: 350px;
    }
    
    .toast.show {
        transform: translateX(0);
    }
    
    .toast-success {
        border-left-color: var(--secondary-color);
    }
    
    .toast-error {
        border-left-color: var(--danger-color);
    }
    
    .toast-warning {
        border-left-color: var(--accent-color);
    }
    
    .toast-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex: 1;
    }
    
    .toast-icon {
        font-size: 1.25rem;
    }
    
    .toast-success .toast-icon {
        color: var(--secondary-color);
    }
    
    .toast-error .toast-icon {
        color: var(--danger-color);
    }
    
    .toast-warning .toast-icon {
        color: var(--accent-color);
    }
    
    .toast-info .toast-icon {
        color: var(--primary-color);
    }
    
    .toast-message {
        color: var(--text-primary);
        font-weight: 500;
        line-height: 1.4;
    }
    
    .toast-close {
        background: none;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        padding: 0.25rem;
        border-radius: var(--border-radius);
        transition: all var(--transition-fast);
    }
    
    .toast-close:hover {
        background: var(--bg-secondary);
        color: var(--text-primary);
    }
    
    @media (max-width: 768px) {
        .toast {
            right: 1rem;
            left: 1rem;
            top: 1rem;
            transform: translateY(-100%);
            max-width: none;
        }
        
        .toast.show {
            transform: translateY(0);
        }
    }
`;

// Adicionar estilos dinâmicos
if (!document.getElementById('dynamic-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'dynamic-styles';
    styleSheet.textContent = dynamicStyles;
    document.head.appendChild(styleSheet);
}

// ===== SISTEMA DE GERENCIAMENTO DE NOTÍCIAS ===== 
class NewsManager {
    constructor() {
        this.storageKey = 'cart_news_data';
        this.currentEditingId = null;
        this.lastUpdate = Date.now();
        this.syncInterval = 2000; // Verificar mudanças a cada 2 segundos
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        
        // Verificar se já existem dados no localStorage
        const existingData = localStorage.getItem(this.storageKey);
        if (!existingData) {
            // Inicializar com dados padrão apenas na primeira vez
            const defaultNews = this.getDefaultNews();
            this.saveNewsToStorage(defaultNews);
        }
        
        this.loadNewsFromStorage();
        this.startRealTimeSync();
    }

    setupEventListeners() {
        // Botão de adicionar notícia
        const addNewsBtn = document.getElementById('add-news-btn');
        if (addNewsBtn) {
            addNewsBtn.addEventListener('click', () => this.openNewsModal());
        }

        // Botão de atualizar
        const refreshBtn = document.getElementById('refresh-news-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshNews());
        }

        // Modal controls
        const closeModalBtn = document.getElementById('close-news-modal');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => this.closeNewsModal());
        }

        const cancelBtn = document.getElementById('cancel-news');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.closeNewsModal());
        }

        const saveBtn = document.getElementById('save-news');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveNews());
        }

        // Fechar modal clicando fora
        const modal = document.getElementById('news-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeNewsModal();
                }
            });
        }
    }

    openNewsModal(newsId = null) {
        const modal = document.getElementById('news-modal');
        const modalTitle = document.getElementById('news-modal-title');
        const saveText = document.getElementById('save-news-text');
        
        if (newsId) {
            // Editando notícia existente
            this.currentEditingId = newsId;
            modalTitle.textContent = 'Editar Notícia';
            saveText.textContent = 'Atualizar Notícia';
            this.loadNewsData(newsId);
        } else {
            // Criando nova notícia
            this.currentEditingId = null;
            modalTitle.textContent = 'Adicionar Notícia';
            saveText.textContent = 'Salvar Notícia';
            this.clearForm();
        }
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeNewsModal() {
        const modal = document.getElementById('news-modal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
        this.clearForm();
        this.currentEditingId = null;
    }

    clearForm() {
        document.getElementById('news-title').value = '';
        document.getElementById('news-excerpt').value = '';
        document.getElementById('news-location').value = '';
        document.getElementById('news-author').value = '';
        document.getElementById('news-status').value = 'completed';
        document.getElementById('news-badge').value = 'destaque';
        document.getElementById('news-featured').checked = false;
    }

    loadNewsData(newsId) {
        const newsData = this.getNewsFromStorage();
        const news = newsData.find(n => n.id === newsId);
        
        if (news) {
            document.getElementById('news-title').value = news.title;
            document.getElementById('news-excerpt').value = news.excerpt;
            document.getElementById('news-location').value = news.location;
            document.getElementById('news-author').value = news.author;
            document.getElementById('news-status').value = news.status;
            document.getElementById('news-badge').value = news.badge;
            document.getElementById('news-featured').checked = news.featured;
        }
    }

    saveNews() {
        const title = document.getElementById('news-title').value.trim();
        const excerpt = document.getElementById('news-excerpt').value.trim();
        const location = document.getElementById('news-location').value.trim();
        const author = document.getElementById('news-author').value.trim();
        const status = document.getElementById('news-status').value;
        const badge = document.getElementById('news-badge').value;
        const featured = document.getElementById('news-featured').checked;

        if (!title || !excerpt || !location || !author) {
            this.showToast('Por favor, preencha todos os campos obrigatórios!', 'error');
            return;
        }

        const newsData = this.getNewsFromStorage();
        const now = new Date();
        const timeString = this.formatTime(now);

        if (this.currentEditingId) {
            // Editando notícia existente
            const index = newsData.findIndex(n => n.id === this.currentEditingId);
            if (index !== -1) {
                newsData[index] = {
                    ...newsData[index],
                    title,
                    excerpt,
                    location,
                    author,
                    status,
                    badge,
                    featured,
                    updatedAt: now.toISOString()
                };
            }
        } else {
            // Criando nova notícia
            const newNews = {
                id: this.generateId(),
                title,
                excerpt,
                location,
                author,
                status,
                badge,
                featured,
                time: timeString,
                createdAt: now.toISOString(),
                updatedAt: now.toISOString()
            };
            newsData.unshift(newNews); // Adicionar no início
        }

        this.saveNewsToStorage(newsData);
        this.renderNews();
        this.updateStats();
        this.closeNewsModal();
        
        const action = this.currentEditingId ? 'atualizada' : 'adicionada';
        this.showToast(`Notícia ${action} com sucesso!`, 'success');
    }

    deleteNews(newsId) {
        if (!confirm('Tem certeza que deseja excluir esta notícia?')) {
            return;
        }

        const newsData = this.getNewsFromStorage();
        const filteredNews = newsData.filter(n => n.id !== newsId);
        
        this.saveNewsToStorage(filteredNews);
        this.renderNews();
        this.updateStats();
        this.showToast('Notícia excluída com sucesso!', 'success');
    }

    renderNews() {
        const newsGrid = document.getElementById('news-grid');
        if (!newsGrid) return;

        const newsData = this.getNewsFromStorage();
        
        // Limpar grid atual
        newsGrid.innerHTML = '';

        // Renderizar notícias
        newsData.forEach(news => {
            const newsCard = this.createNewsCard(news);
            newsGrid.appendChild(newsCard);
        });

        // Animar entrada
        this.animateNewsCards();
    }

    createNewsCard(news) {
        const article = document.createElement('article');
        article.className = `news-card ${news.featured ? 'featured' : ''}`;
        article.setAttribute('data-news-id', news.id);

        const badgeClass = this.getBadgeClass(news.badge);
        const badgeText = this.getBadgeText(news.badge);
        const statusClass = this.getStatusClass(news.status);
        const statusText = this.getStatusText(news.status);

        article.innerHTML = `
            <div class="news-actions">
                <button class="btn-edit-news" onclick="window.newsManager.openNewsModal(${news.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete-news" onclick="window.newsManager.deleteNews(${news.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="news-badge ${badgeClass}">${badgeText}</div>
            <h3 class="news-title">${news.title}</h3>
            <div class="news-meta">
                <span><i class="fas fa-calendar"></i> ${news.time}</span>
                <span><i class="fas fa-map-marker-alt"></i> ${news.location}</span>
            </div>
            <p class="news-excerpt">${news.excerpt}</p>
            <div class="news-status ${statusClass}">
                <i class="fas fa-${this.getStatusIcon(news.status)}"></i> ${statusText}
            </div>
        `;

        return article;
    }

    getBadgeClass(badge) {
        const classes = {
            'destaque': 'urgent',
            'nova': 'new',
            'urgente': 'urgent',
            'manutencao': 'manutencao',
            'info': 'info'
        };
        return classes[badge] || 'destaque';
    }

    getBadgeText(badge) {
        const texts = {
            'destaque': 'DESTAQUE',
            'nova': 'NOVA',
            'urgente': 'URGENTE',
            'manutencao': 'MANUTENÇÃO',
            'info': 'INFORMATIVO'
        };
        return texts[badge] || 'DESTAQUE';
    }

    getStatusClass(status) {
        return status.replace('_', '-');
    }

    getStatusText(status) {
        const texts = {
            'completed': 'Concluído',
            'in-progress': 'Em Andamento',
            'pending': 'Pendente',
            'urgent': 'Urgente'
        };
        return texts[status] || 'Concluído';
    }

    getStatusIcon(status) {
        const icons = {
            'completed': 'check-circle',
            'in-progress': 'clock',
            'pending': 'hourglass-half',
            'urgent': 'exclamation-triangle'
        };
        return icons[status] || 'check-circle';
    }

    animateNewsCards() {
        const cards = document.querySelectorAll('.news-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    updateStats() {
        const newsData = this.getNewsFromStorage();
        const completed = newsData.filter(n => n.status === 'completed').length;
        const pending = newsData.filter(n => n.status === 'pending' || n.status === 'in-progress').length;

        const completedElement = document.getElementById('activities-completed');
        const pendingElement = document.getElementById('activities-pending');

        if (completedElement) {
            completedElement.textContent = completed;
        }
        if (pendingElement) {
            pendingElement.textContent = pending;
        }
    }

    refreshNews() {
        this.loadNewsFromStorage();
        this.renderNews();
        this.updateStats();
        this.showToast('Notícias atualizadas!', 'success');
    }

    getNewsFromStorage() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (data) {
                const parsed = JSON.parse(data);
                if (parsed.news && Array.isArray(parsed.news)) {
                    return parsed.news;
                }
            }
            return this.getDefaultNews();
        } catch (error) {
            console.error('Erro ao carregar notícias:', error);
            return this.getDefaultNews();
        }
    }

    saveNewsToStorage(newsData) {
        try {
            const dataToSave = {
                news: newsData,
                lastUpdate: Date.now()
            };
            localStorage.setItem(this.storageKey, JSON.stringify(dataToSave));
            this.lastUpdate = Date.now();
        } catch (error) {
            console.error('Erro ao salvar notícias:', error);
            this.showToast('Erro ao salvar as alterações!', 'error');
        }
    }

    loadNewsFromStorage() {
        const newsData = this.getNewsFromStorage();
        this.renderNews();
        this.updateStats();
        return newsData;
    }

    getDefaultNews() {
        return [
            {
                id: 1,
                title: 'Reparo da Marquise P09 Reconstruída',
                excerpt: 'A marquise do posto P09 foi completamente reconstruída após os danos causados pelo temporal da semana passada. A nova estrutura conta com materiais mais resistentes e design aprimorado.',
                location: 'Posto P09',
                author: 'Equipe Técnica',
                status: 'completed',
                badge: 'destaque',
                featured: true,
                time: 'Ontem, 14:15',
                createdAt: new Date(Date.now() - 86400000).toISOString(),
                updatedAt: new Date(Date.now() - 86400000).toISOString()
            },
            {
                id: 2,
                title: 'Troca das Calhas Telhado P04',
                excerpt: 'Substituição completa do sistema de calhas do telhado do posto P04. O trabalho foi realizado preventivamente para evitar infiltrações durante o período chuvoso.',
                location: 'Posto P04',
                author: 'Manutenção',
                status: 'completed',
                badge: 'nova',
                featured: false,
                time: 'Anteontem, 11:20',
                createdAt: new Date(Date.now() - 172800000).toISOString(),
                updatedAt: new Date(Date.now() - 172800000).toISOString()
            },
            {
                id: 3,
                title: 'Reparo do Poço de Abastecimento',
                excerpt: 'Manutenção corretiva realizada no poço de abastecimento principal. Foi identificado e reparado vazamento na tubulação principal, restabelecendo o fornecimento normal de água.',
                location: 'Área Central',
                author: 'Infraestrutura',
                status: 'completed',
                badge: 'manutencao',
                featured: false,
                time: '2 dias atrás, 09:30',
                createdAt: new Date(Date.now() - 259200000).toISOString(),
                updatedAt: new Date(Date.now() - 259200000).toISOString()
            }
        ];
    }

    startRealTimeSync() {
        // Verificar mudanças a cada 2 segundos
        setInterval(() => {
            this.checkForUpdates();
        }, this.syncInterval);
    }

    checkForUpdates() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (data) {
                const parsed = JSON.parse(data);
                if (parsed.lastUpdate && parsed.lastUpdate > this.lastUpdate) {
                    // Há atualizações, recarregar
                    this.lastUpdate = parsed.lastUpdate;
                    this.renderNews();
                    this.updateStats();
                }
            }
        } catch (error) {
            console.error('Erro ao verificar atualizações:', error);
        }
    }

    generateId() {
        return Date.now() + Math.random();
    }

    formatTime(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 60) {
            return `Há ${minutes} minuto${minutes !== 1 ? 's' : ''}`;
        } else if (hours < 24) {
            return `Há ${hours} hora${hours !== 1 ? 's' : ''}`;
        } else if (days === 1) {
            return 'Ontem';
        } else if (days === 2) {
            return 'Anteontem';
        } else {
            return `${days} dias atrás`;
        }
    }

    showToast(message, type = 'info') {
        // Usar o sistema de toast existente
        if (window.app && window.app.showToast) {
            window.app.showToast(message, type);
        } else {
            // Fallback simples
            alert(message);
        }
    }
}

// Funções globais para compatibilidade
function editNews(newsId) {
    if (window.newsManager) {
        window.newsManager.openNewsModal(newsId);
    }
}

function deleteNews(newsId) {
    if (window.newsManager) {
        window.newsManager.deleteNews(newsId);
    }
}

// ===== AMPLIAR IMAGEM =====
function enlargeImage(imageSrc, imageAlt) {
    const modal = document.getElementById('image-modal');
    const enlargedImage = document.getElementById('enlarged-image');
    const modalTitle = document.getElementById('image-modal-title');
    
    if (modal && enlargedImage && modalTitle) {
        // Definir a imagem e título
        enlargedImage.src = imageSrc;
        enlargedImage.alt = imageAlt;
        modalTitle.textContent = imageAlt;
        
        // Mostrar o modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Evento para fechar o modal
        const closeButton = document.getElementById('close-image-modal');
        if (closeButton) {
            closeButton.onclick = closeImageModal;
        }
        
        // Fechar modal ao clicar fora da imagem
        modal.onclick = function(e) {
            if (e.target === modal) {
                closeImageModal();
            }
        };
        
        // Fechar modal com ESC
        document.addEventListener('keydown', handleImageModalKeydown);
    }
}

function closeImageModal() {
    const modal = document.getElementById('image-modal');
    
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Remover event listener do ESC
        document.removeEventListener('keydown', handleImageModalKeydown);
    }
}

function handleImageModalKeydown(e) {
    if (e.key === 'Escape') {
        closeImageModal();
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar aplicação principal
    window.app = new CartADM();
    
    // Inicializar gerenciador de notícias
    window.newsManager = new NewsManager();
    
    // Outras inicializações
    if (typeof initAOS === 'function') {
        initAOS();
    }
    
    createFloatingElements();
    addHoverEffects();
});

// ===== NOVA PÁGINA INICIAL - ANIMAÇÕES AVANÇADAS =====

// Contador animado para estatísticas do hero
function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    const observerOptions = {
        threshold: 0.7
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000; // 2 segundos
                const increment = target / (duration / 16); // 60fps
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

// Animação dos círculos de progresso
function animateProgressRings() {
    const rings = document.querySelectorAll('.stat-circle');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const circle = entry.target;
                const percentage = parseInt(circle.getAttribute('data-percentage'));
                const progressRing = circle.querySelector('.progress-ring-fill');
                
                if (progressRing) {
                    const circumference = 2 * Math.PI * 50; // raio = 50
                    const offset = circumference - (percentage / 100) * circumference;
                    
                    progressRing.style.strokeDashoffset = offset;
                }
                
                observer.unobserve(circle);
            }
        });
    }, observerOptions);
    
    rings.forEach(ring => observer.observe(ring));
}

// Efeito de partículas no hero
function createParticles() {
    const hero = document.querySelector('.hero-particles');
    if (!hero) return;
    
    // Criar partículas dinâmicas
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 4 + 1 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`;
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.pointerEvents = 'none';
        
        // Animação aleatória
        particle.style.animation = `float ${Math.random() * 10 + 5}s ease-in-out infinite`;
        particle.style.animationDelay = Math.random() * 5 + 's';
        
        hero.appendChild(particle);
    }
}

// Efeito parallax no scroll
function initParallax() {
    const hero = document.querySelector('.hero-section');
    const floatingCards = document.querySelectorAll('.floating-card');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
        
        floatingCards.forEach((card, index) => {
            const cardRate = scrolled * (0.1 + index * 0.02);
            card.style.transform = `translateY(${cardRate}px)`;
        });
    });
}

// Smooth scroll para seções
function initSmoothScroll() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const servicesSection = document.querySelector('.services-section');
            if (servicesSection) {
                servicesSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
}

// Typing effect para o subtitle
function initTypingEffect() {
    const subtitle = document.querySelector('.hero-subtitle');
    if (!subtitle) return;
    
    const originalText = subtitle.textContent;
    subtitle.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < originalText.length) {
            subtitle.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    };
    
    // Iniciar o efeito após um delay
    setTimeout(typeWriter, 1000);
}

// Efeito 3D nos cards de serviço
function init3DCards() {
    const cards = document.querySelectorAll('.service-card, .action-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

// Inicializar animações quando a página carrega
function initInicioAnimations() {
    // Aguardar um pouco para garantir que o DOM está pronto
    setTimeout(() => {
        if (document.querySelector('.hero-section')) {
            animateCounters();
            animateProgressRings();
            createParticles();
            initParallax();
            initSmoothScroll();
            initTypingEffect();
            init3DCards();
        }
    }, 500);
}

// Adicionar event listener para quando a página início for mostrada
document.addEventListener('DOMContentLoaded', () => {
    initInicioAnimations();
    
    // Re-inicializar animações quando mudar para início
    const inicioMenuItem = document.querySelector('a[data-page="inicio"]');
    if (inicioMenuItem) {
        inicioMenuItem.addEventListener('click', () => {
            setTimeout(initInicioAnimations, 300);
        });
    }
});

// AOS (Animate On Scroll) simplificado
function initAOS() {
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animation = element.getAttribute('data-aos');
                const delay = element.getAttribute('data-aos-delay') || 0;
                
                setTimeout(() => {
                    element.classList.add('aos-animate');
                    
                    // Aplicar transformações baseadas no tipo de animação
                    switch(animation) {
                        case 'fade-up':
                            element.style.opacity = '1';
                            element.style.transform = 'translateY(0)';
                            break;
                        case 'fade-left':
                            element.style.opacity = '1';
                            element.style.transform = 'translateX(0)';
                            break;
                        case 'zoom-in':
                            element.style.opacity = '1';
                            element.style.transform = 'scale(1)';
                            break;
                        case 'flip-left':
                            element.style.opacity = '1';
                            element.style.transform = 'rotateY(0)';
                            break;
                        case 'scale-up':
                            element.style.opacity = '1';
                            element.style.transform = 'scale(1)';
                            break;
                    }
                }, delay);
                
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        // Configurar estado inicial
        const animation = element.getAttribute('data-aos');
        element.style.transition = 'all 0.6s ease';
        element.style.opacity = '0';
        
        switch(animation) {
            case 'fade-up':
                element.style.transform = 'translateY(30px)';
                break;
            case 'fade-left':
                element.style.transform = 'translateX(-30px)';
                break;
            case 'zoom-in':
                element.style.transform = 'scale(0.9)';
                break;
            case 'flip-left':
                element.style.transform = 'rotateY(-45deg)';
                break;
            case 'scale-up':
                element.style.transform = 'scale(0.8)';
                break;
        }
        
        observer.observe(element);
    });
}

// Inicializar AOS
document.addEventListener('DOMContentLoaded', initAOS);

// ===== INÍCIO LIMPO =====  

// ===== PÁGINA INÍCIO - FUNCIONALIDADES AVANÇADAS =====

class InicioManager {
    constructor() {
        this.weatherApiKey = ''; // Deixar vazio por questões de segurança - usar variável de ambiente
        this.weatherData = {};
        this.animationObserver = null;
        this.systemUptime = 99.9;
        this.lastUpdates = {
            powerbi: new Date(),
            site: new Date()
        };
        this.isInitialized = false;
    }

    init() {
        if (this.isInitialized) return;
        
        console.log('Inicializando página Início...');
        
        this.setupEventListeners();
        this.setupScrollAnimations();
        this.startCounters();
        this.loadWeatherData();
        this.updateSystemInfo();
        this.startRealTimeUpdates();
        
        this.isInitialized = true;
    }

    setupEventListeners() {


        // PowerBI Button
        const powerbiBtn = document.querySelector('.btn-primary[data-page="powerbi"]');
        if (powerbiBtn) {
            powerbiBtn.addEventListener('click', () => {
                if (window.cartADM) {
                    window.cartADM.navigateToPage('powerbi');
                }
            });
        }

        // Metric cards hover effects
        const metricCards = document.querySelectorAll('.metric-card');
        metricCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    setupScrollAnimations() {
        // Intersection Observer para animações de scroll
        this.animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Animações específicas para cada seção
                    if (entry.target.classList.contains('weather-section')) {
                        this.animateWeatherCards();
                    } else if (entry.target.classList.contains('sistema-section')) {
                        this.animateSystemCards();
                    } else if (entry.target.classList.contains('metrics-section')) {
                        this.animateMetricCards();
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observar seções
        const sections = document.querySelectorAll('.weather-section, .sistema-section, .metrics-section');
        sections.forEach(section => {
            this.animationObserver.observe(section);
        });
    }

    startCounters() {
        // Animar contadores na hero section
        const statNumbers = document.querySelectorAll('.hero-stats .stat-number');
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            this.animateCounter(stat, 0, target, 2000);
        });

        // Animar contadores nas métricas (desabilitado - sendo tratado pelo inicio.js)
        // setTimeout(() => {
        //     const metricNumbers = document.querySelectorAll('.metric-number');
        //     metricNumbers.forEach(metric => {
        //         // Extrair número do texto atual ao invés de data-target
        //         const currentText = metric.textContent.trim();
        //         const target = parseInt(currentText);
        //         if (isNaN(target)) return;
        //         this.animateCounter(metric, 0, target, 1500);
        //     });
        // }, 1000);

        // Animar valores do painel de excelência
        setTimeout(() => {
            this.animateExcellenceValues();
        }, 1200);
    }

    animateCounter(element, start, end, duration) {
        const startTime = performance.now();
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (end - start) * easeOut);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = end;
            }
        };
        
        requestAnimationFrame(animate);
    }

    animateExcellenceValues() {
        const excellenceItems = document.querySelectorAll('.excellence-item');
        
        excellenceItems.forEach((item, index) => {
            setTimeout(() => {
                const valueElement = item.querySelector('.item-value');
                const originalText = valueElement.textContent;
                
                // Efeito de digitação para valores especiais
                if (originalText.includes('%')) {
                    const targetValue = parseFloat(originalText);
                    this.animatePercentage(valueElement, 0, targetValue, 1000);
                } else if (originalText.includes('h')) {
                    // Animação especial para tempo
                    this.animateTimeValue(valueElement, originalText);
                } else {
                    // Outros valores mantém animação padrão
                    item.style.transform = 'scale(1.05)';
                    setTimeout(() => {
                        item.style.transform = 'scale(1)';
                    }, 200);
                }
            }, index * 200);
        });
    }

    animatePercentage(element, start, end, duration) {
        const startTime = performance.now();
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = (start + (end - start) * easeOut).toFixed(1);
            
            element.textContent = `${current}%`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    animateTimeValue(element, finalValue) {
        const stages = ['...', '< 5h', '< 3h', '< 2h'];
        let currentStage = 0;
        
        const typeEffect = () => {
            if (currentStage < stages.length) {
                element.textContent = stages[currentStage];
                currentStage++;
                setTimeout(typeEffect, 300);
            }
        };
        
        typeEffect();
    }

    animateWeatherCards() {
        const weatherCards = document.querySelectorAll('.weather-card');
        weatherCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    animateSystemCards() {
        const systemCards = document.querySelectorAll('.sistema-card');
        systemCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 150);
        });

        // Animar progresso do sistema
        setTimeout(() => {
            this.animateSystemProgress();
        }, 500);
    }

    animateSystemProgress() {
        const progressCircle = document.querySelector('.progress-ring-circle');
        const percentageElement = document.getElementById('system-percentage');
        
        if (progressCircle && percentageElement) {
            const circumference = 2 * Math.PI * 52; // r=52
            progressCircle.style.strokeDasharray = circumference;
            progressCircle.style.strokeDashoffset = circumference;
            
            // Animar para 100%
            let progress = 0;
            const animate = () => {
                progress += 2;
                const offset = circumference - (progress / 100) * circumference;
                progressCircle.style.strokeDashoffset = offset;
                percentageElement.textContent = progress;
                
                if (progress < 100) {
                    requestAnimationFrame(animate);
                }
            };
            
            animate();
        }
    }

    animateMetricCards() {
        const metricCards = document.querySelectorAll('.metric-card');
        metricCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    async loadWeatherData() {
        const cities = [
            { name: 'bauru', lat: -22.3144, lon: -49.0608 },
            { name: 'assis', lat: -22.6614, lon: -50.4013 },
            { name: 'prudente', lat: -22.1256, lon: -51.3873 }
        ];

        try {
            // Simular dados de clima (substitua por API real)
            for (const city of cities) {
                await this.loadCityWeather(city);
            }
        } catch (error) {
            console.error('Erro ao carregar dados meteorológicos:', error);
            this.showWeatherError();
        }
    }

    async loadCityWeather(city) {
        try {
            // Simular dados de clima realistas
            const weatherData = this.generateMockWeatherData(city.name);
            
            this.updateWeatherDisplay(city.name, weatherData);
            this.updateWeatherStatus(city.name, 'active');
            
        } catch (error) {
            console.error(`Erro ao carregar clima para ${city.name}:`, error);
            this.updateWeatherStatus(city.name, 'error');
        }
    }

    generateMockWeatherData(cityName) {
        // Dados meteorológicos simulados realistas para as cidades
        const baseTemps = { bauru: 25, assis: 24, prudente: 26 };
        const baseTemp = baseTemps[cityName] || 25;
        
        return {
            temperature: baseTemp + Math.floor(Math.random() * 10) - 5,
            humidity: 60 + Math.floor(Math.random() * 30),
            windSpeed: 5 + Math.floor(Math.random() * 15),
            visibility: 8 + Math.floor(Math.random() * 7),
            description: this.getWeatherDescription(),
            icon: this.getWeatherIcon()
        };
    }

    getWeatherDescription() {
        const descriptions = [
            'Parcialmente nublado',
            'Ensolarado',
            'Nublado',
            'Tempo limpo',
            'Poucas nuvens'
        ];
        return descriptions[Math.floor(Math.random() * descriptions.length)];
    }

    getWeatherIcon() {
        const icons = [
            'fa-sun',
            'fa-cloud-sun',
            'fa-cloud',
            'fa-clouds',
            'fa-cloud-sun-rain'
        ];
        return icons[Math.floor(Math.random() * icons.length)];
    }

    updateWeatherDisplay(cityName, data) {
        // Atualizar temperatura
        const tempElement = document.getElementById(`temp-${cityName}`);
        if (tempElement) {
            tempElement.textContent = data.temperature;
        }

        // Atualizar detalhes
        const humidityElement = document.getElementById(`humidity-${cityName}`);
        if (humidityElement) {
            humidityElement.textContent = `${data.humidity}%`;
        }

        const windElement = document.getElementById(`wind-${cityName}`);
        if (windElement) {
            windElement.textContent = `${data.windSpeed} km/h`;
        }

        const visibilityElement = document.getElementById(`visibility-${cityName}`);
        if (visibilityElement) {
            visibilityElement.textContent = `${data.visibility} km`;
        }

        // Atualizar descrição
        const descElement = document.getElementById(`desc-${cityName}`);
        if (descElement) {
            descElement.textContent = data.description;
        }

        // Atualizar última atualização
        const updateElement = document.getElementById(`update-${cityName}`);
        if (updateElement) {
            const now = new Date();
            updateElement.textContent = `Atualizado às ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
        }

        // Atualizar ícone do clima
        const iconElement = document.querySelector(`[data-trecho="${this.getCityTrecho(cityName)}"] .weather-icon i`);
        if (iconElement && data.icon) {
            iconElement.className = `fas ${data.icon}`;
        }
    }

    getCityTrecho(cityName) {
        const mapping = { bauru: '1', assis: '2', prudente: '3' };
        return mapping[cityName] || '1';
    }

    updateWeatherStatus(cityName, status) {
        const trecho = this.getCityTrecho(cityName);
        const statusIndicator = document.querySelector(`[data-trecho="${trecho}"] .status-indicator`);
        
        if (statusIndicator) {
            statusIndicator.className = `status-indicator ${status}`;
        }
    }

    showWeatherError() {
        const weatherCards = document.querySelectorAll('.weather-card');
        weatherCards.forEach(card => {
            const statusIndicator = card.querySelector('.status-indicator');
            if (statusIndicator) {
                statusIndicator.className = 'status-indicator error';
            }
            
            const description = card.querySelector('.weather-description');
            if (description) {
                description.textContent = 'Erro ao carregar dados';
            }
        });
    }

    updateSystemInfo() {
        // Atualizar data/hora da última publicação PowerBI
        const powerbiDate = document.getElementById('powerbi-last-date');
        const powerbiTime = document.getElementById('powerbi-last-time');
        
        if (powerbiDate && powerbiTime) {
            const lastUpdate = this.lastUpdates.powerbi;
            powerbiDate.textContent = lastUpdate.toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            powerbiTime.textContent = lastUpdate.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        // Atualizar última atualização do site
        const siteDate = document.getElementById('site-last-date');
        const siteTime = document.getElementById('site-last-time');
        
        if (siteDate && siteTime) {
            const lastUpdate = this.lastUpdates.site;
            siteDate.textContent = lastUpdate.toLocaleDateString('pt-BR');
            siteTime.textContent = lastUpdate.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        // Atualizar uptime do sistema
        const uptimeElement = document.getElementById('system-uptime');
        if (uptimeElement) {
            uptimeElement.textContent = `${this.systemUptime}%`;
        }
    }

    startRealTimeUpdates() {
        // Atualizar dados meteorológicos a cada 10 minutos
        setInterval(() => {
            this.loadWeatherData();
        }, 600000);

        // Atualizar informações do sistema a cada minuto
        setInterval(() => {
            this.updateSystemInfo();
        }, 60000);

        // Simular pequenas variações no uptime
        setInterval(() => {
            this.systemUptime = Math.max(99.5, Math.min(100, this.systemUptime + (Math.random() - 0.5) * 0.1));
            const uptimeElement = document.getElementById('system-uptime');
            if (uptimeElement) {
                uptimeElement.textContent = `${this.systemUptime.toFixed(1)}%`;
            }
        }, 30000);
    }

    // Método para atualizar dados do PowerBI (chamado quando necessário)
    updatePowerBIInfo(lastPublishDate) {
        this.lastUpdates.powerbi = lastPublishDate || new Date();
        this.updateSystemInfo();
    }

    // Método para atualizar dados do site (chamado quando necessário)
    updateSiteInfo(lastUpdateDate) {
        this.lastUpdates.site = lastUpdateDate || new Date();
        this.updateSystemInfo();
    }

    // Cleanup
    destroy() {
        if (this.animationObserver) {
            this.animationObserver.disconnect();
        }
        this.isInitialized = false;
    }
}

// Instância global do gerenciador de início
let inicioManager = null;

// Função para inicializar a página de início
function initInicio() {
    if (!inicioManager) {
        inicioManager = new InicioManager();
    }
    
    // Aguardar o DOM estar pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => inicioManager.init(), 500);
        });
    } else {
        setTimeout(() => inicioManager.init(), 500);
    }
}

// Função para reinicializar quando mudar para a página de início
function reinitInicio() {
    if (inicioManager) {
        inicioManager.destroy();
        inicioManager = null;
    }
    initInicio();
}

// Event listener para navegação
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar se já estiver na página de início
    const inicioPage = document.getElementById('inicio-page');
    if (inicioPage && inicioPage.classList.contains('active')) {
        initInicio();
    }
    
    // Observer para detectar quando a página de início fica ativa
    const pageObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.id === 'inicio-page' && target.classList.contains('active')) {
                    setTimeout(() => {
                        if (!inicioManager || !inicioManager.isInitialized) {
                            initInicio();
                        }
                    }, 300);
                }
            }
        });
    });
    
    if (inicioPage) {
        pageObserver.observe(inicioPage, {
            attributes: true,
            attributeFilter: ['class']
        });
    }
});

// Integração com o sistema de navegação existente
if (window.cartADM) {
    const originalNavigateToPage = window.cartADM.navigateToPage;
    window.cartADM.navigateToPage = function(page) {
        originalNavigateToPage.call(this, page);
        
        if (page === 'inicio') {
            setTimeout(() => {
                if (!inicioManager || !inicioManager.isInitialized) {
                    initInicio();
                }
            }, 300);
        }
    };
}

// ===== FIM DAS FUNCIONALIDADES DA PÁGINA INÍCIO =====  