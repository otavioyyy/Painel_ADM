// Classe para gerenciar o Calendário de Anotações
class CalendarioAnotacoes {
    constructor() {
        this.dataAtual = new Date();
        this.selectedDate = null; // yyyy-mm-dd do dia selecionado
        this.anotacoes = this.carregarAnotacoes();
        this.inicializarElementos();
        this.inicializarEventListeners();
        this.renderizarCalendario();
    }

    inicializarElementos() {
        this.calendarioGrid = document.getElementById('calendario-grid');
        this.currentMonthYear = document.getElementById('current-month-year');
        this.prevMonthBtn = document.getElementById('prev-month');
        this.nextMonthBtn = document.getElementById('next-month');
        this.addAtividadeBtn = document.getElementById('add-atividade');
        this.viewModeSelect = document.getElementById('view-mode');
        this.proximasAnotacoes = document.getElementById('anotacoes-recentes');
        this.totalAnotacoes = document.getElementById('total-anotacoes');
        // Drawer
        this.dayDrawer = document.getElementById('day-drawer');
        this.dayDrawerBackdrop = document.getElementById('day-drawer-backdrop');
        this.dayDrawerDate = document.getElementById('day-drawer-date');
        this.dayAnotacoes = document.getElementById('day-anotacoes');
        this.closeDayDrawerBtn = document.getElementById('close-day-drawer');
        this.openNotesDrawerBtn = document.getElementById('open-notes-drawer');
        this.drawerAddBtn = document.getElementById('drawer-add-atividade');

        // Elementos do modal
        this.atividadeModal = document.getElementById('atividade-modal');
        this.atividadeForm = document.getElementById('atividade-form');
        this.saveAtividadeBtn = document.getElementById('save-atividade');
        this.cancelAtividadeBtn = document.getElementById('cancel-atividade');
        this.closeAtividadeModalBtn = document.getElementById('close-atividade-modal');

        // Campos do formulário
        this.atividadeTitulo = document.getElementById('atividade-titulo');
        this.atividadeData = document.getElementById('atividade-data');
        this.atividadeCor = document.getElementById('atividade-cor');
        this.atividadeDescricao = document.getElementById('atividade-descricao');
        this.atividadeCategoria = document.getElementById('atividade-categoria');
        
        // Inicializar seletor de cores
        this.inicializarSeletorCores();
    }

    inicializarEventListeners() {
        this.prevMonthBtn.addEventListener('click', () => this.mudarMes(-1));
        this.nextMonthBtn.addEventListener('click', () => this.mudarMes(1));
        this.addAtividadeBtn.addEventListener('click', () => this.abrirModalAtividade());
        this.viewModeSelect.addEventListener('change', () => this.renderizarCalendario());
        this.saveAtividadeBtn.addEventListener('click', () => this.salvarAtividade());
        this.cancelAtividadeBtn.addEventListener('click', () => this.fecharModalAtividade());
        this.closeAtividadeModalBtn.addEventListener('click', () => this.fecharModalAtividade());
        // Drawer
        if (this.closeDayDrawerBtn) {
            this.closeDayDrawerBtn.addEventListener('click', () => this.fecharDayDrawer());
        }
        if (this.dayDrawerBackdrop) {
            this.dayDrawerBackdrop.addEventListener('click', () => this.fecharDayDrawer());
        }
        if (this.openNotesDrawerBtn) {
            this.openNotesDrawerBtn.addEventListener('click', () => this.abrirDayDrawer(new Date()));
        }
        if (this.drawerAddBtn) {
            this.drawerAddBtn.addEventListener('click', () => this.abrirModalAtividade(new Date()))
        }

        // Fechar com tecla ESC
        document.addEventListener('keydown', (ev) => {
            if (ev.key === 'Escape') this.fecharDayDrawer();
        });

        // Gestos simples de swipe para fechar no mobile
        this._touchStartX = null;
        this._touchStartY = null;
        const onTouchStart = (e) => {
            const t = e.changedTouches?.[0];
            this._touchStartX = t?.clientX ?? null;
            this._touchStartY = t?.clientY ?? null;
        };
        const onTouchEnd = (e) => {
            if (!this.dayDrawer?.classList.contains('active')) return;
            const t = e.changedTouches?.[0];
            if (!t || this._touchStartX == null) return;
            const dx = t.clientX - this._touchStartX;
            const dy = t.clientY - this._touchStartY;
            const isHorizontal = Math.abs(dx) > Math.abs(dy);
            if (isHorizontal && dx > 40) {
                this.fecharDayDrawer();
            }
        };
        if (this.dayDrawer) {
            this.dayDrawer.addEventListener('touchstart', onTouchStart, { passive: true });
            this.dayDrawer.addEventListener('touchend', onTouchEnd, { passive: true });
        }
    }

    inicializarSeletorCores() {
        // Configurar seletor de cores
        const colorInput = this.atividadeCor;
        const colorPresets = document.querySelectorAll('.color-preset');
        
        // Atualizar cor do input quando um preset for clicado
        colorPresets.forEach(preset => {
            preset.addEventListener('click', () => {
                const color = preset.dataset.color;
                colorInput.value = color;
                
                // Remover classe active de todos os presets
                colorPresets.forEach(p => p.classList.remove('active'));
                // Adicionar classe active ao preset selecionado
                preset.classList.add('active');
            });
        });
        
        // Atualizar preset ativo quando a cor for alterada manualmente
        colorInput.addEventListener('input', () => {
            const currentColor = colorInput.value;
            colorPresets.forEach(preset => {
                if (preset.dataset.color === currentColor) {
                    preset.classList.add('active');
                } else {
                    preset.classList.remove('active');
                }
            });
        });
        
        // Definir cor padrão como ativa
        const defaultColor = colorInput.value;
        colorPresets.forEach(preset => {
            if (preset.dataset.color === defaultColor) {
                preset.classList.add('active');
            }
        });
    }

    toggleRecorrencia() {
        // Removido - não mais necessário para anotações
    }

    mudarMes(delta) {
        const modo = this.viewModeSelect ? this.viewModeSelect.value : 'month';
        if (modo === 'week') {
            this.dataAtual.setDate(this.dataAtual.getDate() + (delta * 7));
        } else if (modo === 'day') {
            this.dataAtual.setDate(this.dataAtual.getDate() + delta);
        } else {
            this.dataAtual.setMonth(this.dataAtual.getMonth() + delta);
        }
        this.renderizarCalendario();
    }

    renderizarCalendario() {
        // Limpar grid anterior mantendo o header dos dias da semana
        const headerWeekdays = this.calendarioGrid.querySelector('.weekdays')?.outerHTML || '';
        this.calendarioGrid.innerHTML = headerWeekdays;

        const modo = this.viewModeSelect ? this.viewModeSelect.value : 'month';

        if (modo === 'day') {
            // Cabeçalho com data completa
            this.currentMonthYear.textContent = this.dataAtual.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
            this.criarDiaNoCalendario(new Date(this.dataAtual));
        } else if (modo === 'week') {
            // Início da semana (domingo)
            const inicioSemana = new Date(this.dataAtual);
            const diaSemana = inicioSemana.getDay(); // 0..6
            inicioSemana.setDate(inicioSemana.getDate() - diaSemana);

            const fimSemana = new Date(inicioSemana);
            fimSemana.setDate(inicioSemana.getDate() + 6);

            const inicioLabel = inicioSemana.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
            const fimLabel = fimSemana.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
            this.currentMonthYear.textContent = `Semana ${inicioLabel} – ${fimLabel}`;

            for (let i = 0; i < 7; i++) {
                const dia = new Date(inicioSemana);
                dia.setDate(inicioSemana.getDate() + i);
                this.criarDiaNoCalendario(dia, false);
            }
        } else {
            // Modo mês (padrão)
            const primeiroDiaDoMes = new Date(this.dataAtual.getFullYear(), this.dataAtual.getMonth(), 1);
            const ultimoDiaDoMes = new Date(this.dataAtual.getFullYear(), this.dataAtual.getMonth() + 1, 0);

            // Atualizar título do mês
            this.currentMonthYear.textContent = primeiroDiaDoMes.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

            // Calcular dias do mês anterior e próximo mês para preencher a grade
            const diasNoMes = ultimoDiaDoMes.getDate();
            const primeiroDiaSemana = primeiroDiaDoMes.getDay();
            const ultimoDiaSemana = ultimoDiaDoMes.getDay();

            // Renderizar dias do mês anterior
            for (let i = primeiroDiaSemana; i > 0; i--) {
                const diaAnterior = new Date(primeiroDiaDoMes);
                diaAnterior.setDate(primeiroDiaDoMes.getDate() - i);
                this.criarDiaNoCalendario(diaAnterior, true);
            }

            // Renderizar dias do mês atual
            for (let dia = 1; dia <= diasNoMes; dia++) {
                const dataAtual = new Date(this.dataAtual.getFullYear(), this.dataAtual.getMonth(), dia);
                this.criarDiaNoCalendario(dataAtual);
            }

            // Renderizar dias do próximo mês
            for (let i = 1; i <= 6 - ultimoDiaSemana; i++) {
                const proximoMes = new Date(this.dataAtual.getFullYear(), this.dataAtual.getMonth() + 1, i);
                this.criarDiaNoCalendario(proximoMes, true);
            }
        }

        this.renderizarProximasAtividades();
    }

    criarDiaNoCalendario(data, outroMes = false) {
        const diaElemento = document.createElement('div');
        diaElemento.classList.add('calendario-dia');
        diaElemento.dataset.date = this.formatarData(data);
        
        if (outroMes) {
            diaElemento.classList.add('outro-mes');
        }

        // Verificar se é o dia atual e fim de semana
        if (this.ehMesmoDia(data, new Date())) {
            diaElemento.classList.add('hoje');
        }
        if ([0,6].includes(data.getDay())) {
            diaElemento.classList.add('weekend');
        }
        if (this.selectedDate && this.formatarData(data) === this.selectedDate) {
            diaElemento.classList.add('selected');
        }

        // Adicionar número do dia
        const diaNumero = document.createElement('div');
        diaNumero.classList.add('dia-numero');
        diaNumero.textContent = data.getDate();
        diaElemento.appendChild(diaNumero);

        // Adicionar anotações do dia
        const anotacoesDoDia = this.anotacoes.filter(anot => {
            const dataAnotacao = this.parseDateLocal(anot.data);
            return this.ehMesmoDia(dataAnotacao, data);
        });

        if (anotacoesDoDia.length > 0) {
            diaElemento.classList.add('has-anotacoes');
        }

        const limite = 2; // Mostrar no máximo 2 anotações no dia
        anotacoesDoDia.slice(0, limite).forEach(anotacao => {
            const anotacaoElemento = document.createElement('div');
            anotacaoElemento.classList.add('anotacao-item');
            anotacaoElemento.style.borderLeftColor = anotacao.cor;
            anotacaoElemento.textContent = anotacao.titulo;
            anotacaoElemento.title = `${anotacao.titulo} — ${anotacao.categoria}`;

            // Clique para editar
            anotacaoElemento.addEventListener('click', (ev) => {
                ev.stopPropagation();
                this.abrirModalAtividade(this.parseDateLocal(anotacao.data), anotacao);
            });

            // Clique direito para excluir
            anotacaoElemento.addEventListener('contextmenu', (ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                this.excluirAtividade(anotacao);
            });

            diaElemento.appendChild(anotacaoElemento);
        });

        // Indicador de mais itens
        const restantes = anotacoesDoDia.length - 2;
        if (restantes > 0) {
            const maisElemento = document.createElement('div');
            maisElemento.classList.add('mais-anotacoes');
            maisElemento.textContent = `+${restantes} mais`;
            maisElemento.title = `Ver mais ${restantes} anotações`;
            diaElemento.appendChild(maisElemento);
        }

        // Clique no dia abre drawer com lista do dia
        diaElemento.addEventListener('click', () => this.abrirDayDrawer(data));

        this.calendarioGrid.appendChild(diaElemento);
    }

    renderizarProximasAtividades() {
        // Limpar lista anterior
        this.proximasAnotacoes.innerHTML = '';

        // Ordenar anotações por data
        const anotacoesOrdenadas = this.anotacoes
            .filter(anot => this.parseDateLocal(anot.data) >= new Date(new Date().toDateString()))
            .sort((a, b) => this.parseDateLocal(a.data) - this.parseDateLocal(b.data))
            .slice(0, 5); // Mostrar apenas as 5 anotações mais recentes

        // Atualizar total de anotações
        this.totalAnotacoes.textContent = `${anotacoesOrdenadas.length} anotações`;

        anotacoesOrdenadas.forEach(anotacao => {
            const itemElemento = document.createElement('div');
            itemElemento.classList.add('anotacao-item');
            itemElemento.style.borderLeftColor = anotacao.cor;
            
            const infoElemento = document.createElement('div');
            infoElemento.classList.add('anotacao-info');
            infoElemento.innerHTML = `
                <div class="anotacao-titulo">${anotacao.titulo}</div>
                <div class="anotacao-descricao">${anotacao.descricao || 'Sem descrição'}</div>
                <div class="anotacao-meta">
                    <span class="anotacao-categoria">${anotacao.categoria}</span>
                    <span>${this.parseDateLocal(anotacao.data).toLocaleDateString('pt-BR')}</span>
                </div>
            `;

            const acoesElemento = document.createElement('div');
            acoesElemento.classList.add('anotacao-acoes');

            const editarBtn = document.createElement('button');
            editarBtn.innerHTML = '<i class="fas fa-edit"></i>';
            editarBtn.addEventListener('click', () => this.abrirModalAtividade(this.parseDateLocal(anotacao.data), anotacao));

            const excluirBtn = document.createElement('button');
            excluirBtn.innerHTML = '<i class="fas fa-trash"></i>';
            excluirBtn.addEventListener('click', () => this.excluirAtividade(anotacao));

            acoesElemento.appendChild(editarBtn);
            acoesElemento.appendChild(excluirBtn);

            itemElemento.appendChild(infoElemento);
            itemElemento.appendChild(acoesElemento);

            this.proximasAnotacoes.appendChild(itemElemento);
        });
    }

    abrirModalAtividade(data = null, anotacao = null) {
        // Resetar formulário
        this.atividadeForm.reset();
        this._atividadeEmEdicao = null;

        if (data) {
            // Definir data do dia clicado
            this.atividadeData.value = this.formatarData(data);
        } else {
            // Definir data atual como padrão
            this.atividadeData.value = this.formatarData(new Date());
        }

        if (anotacao) {
            // Preencher formulário com dados da anotação existente
            this._atividadeEmEdicao = anotacao;
            this.atividadeTitulo.value = anotacao.titulo;
            this.atividadeData.value = anotacao.data;
            this.atividadeCor.value = anotacao.cor;
            this.atividadeDescricao.value = anotacao.descricao;
            this.atividadeCategoria.value = anotacao.categoria;
            
            // Atualizar preset de cor ativo
            const colorPresets = document.querySelectorAll('.color-preset');
            colorPresets.forEach(preset => {
                if (preset.dataset.color === anotacao.cor) {
                    preset.classList.add('active');
                } else {
                    preset.classList.remove('active');
                }
            });
        }

        // Mostrar modal
        this.atividadeModal.classList.add('active');
    }

    fecharModalAtividade() {
        this.atividadeModal.classList.remove('active');
        this.atividadeForm.reset();
        this._atividadeEmEdicao = null;
        
        // Resetar cor padrão
        this.atividadeCor.value = '#6366f1';
        
        // Resetar preset de cor ativo
        const colorPresets = document.querySelectorAll('.color-preset');
        colorPresets.forEach(preset => {
            if (preset.dataset.color === '#6366f1') {
                preset.classList.add('active');
            } else {
                preset.classList.remove('active');
            }
        });
    }

    salvarAtividade() {
        // Validar formulário
        if (!this.atividadeForm.checkValidity()) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const idExistente = this._atividadeEmEdicao ? this._atividadeEmEdicao.id : null;
        const novaAnotacao = {
            id: idExistente || Date.now(), // Usar timestamp como ID único para novas
            titulo: this.atividadeTitulo.value,
            data: this.atividadeData.value,
            cor: this.atividadeCor.value,
            descricao: this.atividadeDescricao.value,
            categoria: this.atividadeCategoria.value
        };

        // Adicionar ou atualizar anotação
        const indiceExistente = this.anotacoes.findIndex(a => a.id === novaAnotacao.id);
        if (indiceExistente !== -1) {
            this.anotacoes[indiceExistente] = novaAnotacao;
        } else {
            this.anotacoes.push(novaAnotacao);
        }

        // Salvar no localStorage
        this.salvarAnotacoes();

        // Renderizar calendário novamente
        this.renderizarCalendario();

        // Limpar estado de edição e fechar modal
        this._atividadeEmEdicao = null;
        this.fecharModalAtividade();

        // Atualizar drawer se estiver aberto
        if (this.dayDrawer && this.dayDrawer.classList.contains('active')) {
            const d = this.dayDrawerDate?.dataset?.date
                ? new Date(this.dayDrawerDate.dataset.date)
                : new Date();
            this.abrirDayDrawer(d);
        }
    }

    excluirAtividade(anotacao) {
        const confirmacao = confirm(`Tem certeza que deseja excluir a anotação "${anotacao.titulo}"?`);
        if (confirmacao) {
            this.anotacoes = this.anotacoes.filter(a => a.id !== anotacao.id);
            this.salvarAnotacoes();
            this.renderizarCalendario();
            if (this.dayDrawer && this.dayDrawer.classList.contains('active')) {
                const d = this.dayDrawerDate?.dataset?.date
                    ? new Date(this.dayDrawerDate.dataset.date)
                    : new Date();
                this.abrirDayDrawer(d);
            }
        }
    }

    carregarAnotacoes() {
        const anotacoesSalvas = localStorage.getItem('cartAdmAnotacoes');
        return anotacoesSalvas ? JSON.parse(anotacoesSalvas) : [];
    }

    salvarAnotacoes() {
        localStorage.setItem('cartAdmAnotacoes', JSON.stringify(this.anotacoes));
    }

    ehMesmoDia(data1, data2) {
        return data1.getFullYear() === data2.getFullYear() &&
               data1.getMonth() === data2.getMonth() &&
               data1.getDate() === data2.getDate();
    }

    formatarData(data) {
        return data.toISOString().split('T')[0];
    }

    // Garante que 'YYYY-MM-DD' seja interpretado como data local (meia-noite local)
    parseDateLocal(yyyyMmDd) {
        if (!yyyyMmDd) return new Date();
        const [y, m, d] = yyyyMmDd.split('-').map(Number);
        return new Date(y, (m || 1) - 1, d || 1);
    }

    abrirDayDrawer(data) {
        if (!this.dayDrawer) return;
        const d = new Date(data);
        this.selectedDate = this.formatarData(d);
        // Guardar data no header para reuso
        if (this.dayDrawerDate) {
            this.dayDrawerDate.dataset.date = this.formatarData(d);
            this.dayDrawerDate.textContent = d.toLocaleDateString('pt-BR', {
                weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
            });
        }

        // Renderizar anotações do dia
        if (this.dayAnotacoes) {
            this.dayAnotacoes.innerHTML = '';
            const anotacoesDoDia = this.anotacoes
                .filter(anot => this.ehMesmoDia(this.parseDateLocal(anot.data), d))
                .sort((a,b) => a.titulo.localeCompare(b.titulo));
            
            if (anotacoesDoDia.length === 0) {
                const vazio = document.createElement('div');
                vazio.classList.add('anotacao-item');
                vazio.innerHTML = '<span>Nenhuma anotação para este dia.</span>';
                this.dayAnotacoes.appendChild(vazio);
            } else {
                anotacoesDoDia.forEach(anotacao => {
                    const item = document.createElement('div');
                    item.classList.add('anotacao-item');
                    item.style.borderLeftColor = anotacao.cor;
                    
                    const info = document.createElement('div');
                    info.classList.add('anotacao-info');
                    info.innerHTML = `
                        <div class="anotacao-titulo">${anotacao.titulo}</div>
                        <div class="anotacao-descricao">${anotacao.descricao || 'Sem descrição'}</div>
                        <div class="anotacao-meta">
                            <span class="anotacao-categoria">${anotacao.categoria}</span>
                        </div>
                    `;
                    
                    const acoes = document.createElement('div');
                    acoes.classList.add('anotacao-acoes');
                    
                    const editarBtn = document.createElement('button');
                    editarBtn.innerHTML = '<i class="fas fa-edit"></i>';
                    editarBtn.addEventListener('click', () => this.abrirModalAtividade(this.parseDateLocal(anotacao.data), anotacao));
                    
                    const excluirBtn = document.createElement('button');
                    excluirBtn.innerHTML = '<i class="fas fa-trash"></i>';
                    excluirBtn.addEventListener('click', () => this.excluirAtividade(anotacao));
                    
                    acoes.appendChild(editarBtn);
                    acoes.appendChild(excluirBtn);
                    
                    item.appendChild(info);
                    item.appendChild(acoes);
                    this.dayAnotacoes.appendChild(item);
                });
            }
        }

        this.dayDrawer.classList.add('active');
        // Adicionar classe para empurrar o grid e evitar sobreposição em desktop
        const container = document.querySelector('.calendario-container');
        if (container) container.classList.add('drawer-open');
        // Travar scroll do body no mobile
        document.body.classList.add('no-scroll');
        // Atualiza ARIA
        this.dayDrawer.setAttribute('aria-hidden', 'false');
        if (this.dayDrawerBackdrop) this.dayDrawerBackdrop.setAttribute('aria-hidden', 'false');
        // Foco acessível no header do drawer
        setTimeout(() => {
            this.closeDayDrawerBtn?.focus({ preventScroll: true });
        }, 50);
        // Garantir que a lista role ao topo
        if (this.dayAnotacoes) this.dayAnotacoes.scrollTop = 0;
        this.marcarDiaSelecionado(d);
    }

    fecharDayDrawer() {
        if (this.dayDrawer) {
            this.dayDrawer.classList.remove('active');
        }
        const container = document.querySelector('.calendario-container');
        if (container) container.classList.remove('drawer-open');
        document.body.classList.remove('no-scroll');
        this.dayDrawer?.setAttribute('aria-hidden', 'true');
        if (this.dayDrawerBackdrop) this.dayDrawerBackdrop.setAttribute('aria-hidden', 'true');
    }

    marcarDiaSelecionado(data) {
        const selecionada = this.formatarData(data);
        // remover seleção anterior
        this.calendarioGrid.querySelectorAll('.calendario-dia.selected').forEach(el => el.classList.remove('selected'));
        // adicionar na célula correspondente
        const alvo = this.calendarioGrid.querySelector(`.calendario-dia[data-date="${selecionada}"]`);
        if (alvo) {
            alvo.classList.add('selected');
        }
    }
}

// Inicializar calendário quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new CalendarioAnotacoes();
});
