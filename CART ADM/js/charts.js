// ===== CART ADM - SISTEMA DE GRÁFICOS =====

class ChartManager {
    constructor() {
        this.charts = {};
        this.colors = {
            primary: '#6366f1',
            secondary: '#10b981',
            accent: '#f59e0b',
            danger: '#ef4444',
            info: '#06b6d4',
            warning: '#f59e0b',
            success: '#10b981'
        };
        
        this.init();
    }

    init() {
        // Aguardar DOM estar pronto
        setTimeout(() => {
            this.createAreaChart();
            this.createStatusChart();
        }, 500);
    }

    createAreaChart() {
        const canvas = document.getElementById('areaChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const { width, height } = canvas.getBoundingClientRect();
        canvas.width = width * 2; // Para telas de alta resolução
        canvas.height = height * 2;
        ctx.scale(2, 2);

        // Dados simulados
        const data = {
            labels: ['PMRV', 'ARTESP', 'Manutenção', 'Insumos', 'Comunicados', 'Atendimento'],
            values: [45, 32, 28, 15, 12, 8],
            colors: [
                this.colors.primary,
                this.colors.secondary,
                this.colors.accent,
                this.colors.danger,
                this.colors.info,
                this.colors.warning
            ]
        };

        this.drawBarChart(ctx, data, width, height);
        this.charts.areaChart = { canvas, ctx, data };
    }

    createStatusChart() {
        const canvas = document.getElementById('statusChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const { width, height } = canvas.getBoundingClientRect();
        canvas.width = width * 2;
        canvas.height = height * 2;
        ctx.scale(2, 2);

        // Dados simulados para gráfico de pizza
        const data = {
            labels: ['Concluído', 'Em Andamento', 'Pendente', 'Cancelado'],
            values: [65, 20, 12, 3],
            colors: [
                this.colors.success,
                this.colors.info,
                this.colors.warning,
                this.colors.danger
            ]
        };

        this.drawPieChart(ctx, data, width, height);
        this.charts.statusChart = { canvas, ctx, data };
    }

    drawBarChart(ctx, data, width, height) {
        const padding = 40;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;
        const barWidth = chartWidth / data.labels.length * 0.8;
        const barSpacing = chartWidth / data.labels.length * 0.2;
        const maxValue = Math.max(...data.values);

        // Limpar canvas
        ctx.clearRect(0, 0, width, height);

        // Fundo do gráfico
        ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
        ctx.fillRect(padding, padding, chartWidth, chartHeight);

        // Linhas de grade
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = padding + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(padding + chartWidth, y);
            ctx.stroke();
        }

        // Desenhar barras
        data.values.forEach((value, index) => {
            const barHeight = (value / maxValue) * chartHeight;
            const x = padding + index * (barWidth + barSpacing) + barSpacing / 2;
            const y = padding + chartHeight - barHeight;

            // Gradiente para as barras
            const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
            gradient.addColorStop(0, data.colors[index]);
            gradient.addColorStop(1, data.colors[index] + '80');

            // Barra
            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth, barHeight);

            // Borda da barra
            ctx.strokeStyle = data.colors[index];
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, barWidth, barHeight);

            // Valor no topo da barra
            ctx.fillStyle = '#333';
            ctx.font = 'bold 12px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(value, x + barWidth / 2, y - 5);

            // Label embaixo
            ctx.fillStyle = '#666';
            ctx.font = '10px Inter';
            ctx.fillText(data.labels[index], x + barWidth / 2, padding + chartHeight + 20);
        });

        // Título do eixo Y
        ctx.save();
        ctx.translate(15, padding + chartHeight / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillStyle = '#666';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Atividades', 0, 0);
        ctx.restore();
    }

    drawPieChart(ctx, data, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 40;
        const total = data.values.reduce((sum, value) => sum + value, 0);

        // Limpar canvas
        ctx.clearRect(0, 0, width, height);

        let currentAngle = -Math.PI / 2; // Começar do topo

        data.values.forEach((value, index) => {
            const sliceAngle = (value / total) * 2 * Math.PI;

            // Desenhar fatia
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();

            // Gradiente para a fatia
            const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
            gradient.addColorStop(0, data.colors[index] + 'CC');
            gradient.addColorStop(1, data.colors[index]);

            ctx.fillStyle = gradient;
            ctx.fill();

            // Borda da fatia
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Texto da porcentagem
            const labelAngle = currentAngle + sliceAngle / 2;
            const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
            const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
            const percentage = Math.round((value / total) * 100);

            ctx.fillStyle = '#fff';
            ctx.font = 'bold 14px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(`${percentage}%`, labelX, labelY);

            currentAngle += sliceAngle;
        });

        // Legenda
        const legendX = 20;
        let legendY = 20;

        data.labels.forEach((label, index) => {
            // Quadrado colorido
            ctx.fillStyle = data.colors[index];
            ctx.fillRect(legendX, legendY, 12, 12);

            // Texto da legenda
            ctx.fillStyle = '#333';
            ctx.font = '12px Inter';
            ctx.textAlign = 'left';
            ctx.fillText(label, legendX + 20, legendY + 9);

            legendY += 20;
        });
    }

    updateChartPeriod(period) {
        // Simular mudança de dados baseada no período
        const multipliers = {
            '7d': 0.8,
            '30d': 1.0,
            '90d': 1.3
        };

        const multiplier = multipliers[period] || 1.0;

        // Atualizar gráfico de barras
        if (this.charts.areaChart) {
            const { ctx, data } = this.charts.areaChart;
            const newValues = data.values.map(value => Math.round(value * multiplier));
            data.values = newValues;
            
            const { width, height } = this.charts.areaChart.canvas.getBoundingClientRect();
            this.drawBarChart(ctx, data, width, height);
        }

        // Atualizar gráfico de pizza
        if (this.charts.statusChart) {
            const { ctx, data } = this.charts.statusChart;
            const newValues = data.values.map(value => Math.round(value * multiplier));
            data.values = newValues;
            
            const { width, height } = this.charts.statusChart.canvas.getBoundingClientRect();
            this.drawPieChart(ctx, data, width, height);
        }
    }

    animateCharts() {
        // Adicionar animação de entrada aos gráficos
        Object.values(this.charts).forEach(chart => {
            if (chart.canvas) {
                chart.canvas.style.opacity = '0';
                chart.canvas.style.transform = 'scale(0.8)';
                chart.canvas.style.transition = 'all 0.8s ease-out';
                
                setTimeout(() => {
                    chart.canvas.style.opacity = '1';
                    chart.canvas.style.transform = 'scale(1)';
                }, 100);
            }
        });
    }

    // Método para redimensionar gráficos responsivamente
    resizeCharts() {
        Object.entries(this.charts).forEach(([chartId, chart]) => {
            const { canvas, ctx, data } = chart;
            const { width, height } = canvas.getBoundingClientRect();
            
            canvas.width = width * 2;
            canvas.height = height * 2;
            ctx.scale(2, 2);

            if (chartId === 'areaChart') {
                this.drawBarChart(ctx, data, width, height);
            } else if (chartId === 'statusChart') {
                this.drawPieChart(ctx, data, width, height);
            }
        });
    }

    // Método para adicionar hover effects nos gráficos
    addInteractivity() {
        Object.values(this.charts).forEach(chart => {
            if (chart.canvas) {
                chart.canvas.addEventListener('mousemove', (e) => {
                    chart.canvas.style.cursor = 'pointer';
                });

                chart.canvas.addEventListener('mouseleave', (e) => {
                    chart.canvas.style.cursor = 'default';
                });

                chart.canvas.addEventListener('click', (e) => {
                    // Adicionar efeito de clique
                    chart.canvas.style.transform = 'scale(0.98)';
                    setTimeout(() => {
                        chart.canvas.style.transform = 'scale(1)';
                    }, 150);
                });
            }
        });
    }
}

// Classe para criar gráficos de linha simples
class LineChart {
    constructor(canvas, data) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.data = data;
        this.animation = 0;
        
        this.draw();
    }

    draw() {
        const { width, height } = this.canvas.getBoundingClientRect();
        this.canvas.width = width * 2;
        this.canvas.height = height * 2;
        this.ctx.scale(2, 2);

        const padding = 40;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;
        const maxValue = Math.max(...this.data.values);
        const minValue = Math.min(...this.data.values);

        // Limpar canvas
        this.ctx.clearRect(0, 0, width, height);

        // Fundo
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
        this.ctx.fillRect(padding, padding, chartWidth, chartHeight);

        // Grid
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = padding + (chartHeight / 5) * i;
            this.ctx.beginPath();
            this.ctx.moveTo(padding, y);
            this.ctx.lineTo(padding + chartWidth, y);
            this.ctx.stroke();
        }

        // Linha do gráfico
        this.ctx.strokeStyle = '#6366f1';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();

        this.data.values.forEach((value, index) => {
            const x = padding + (chartWidth / (this.data.values.length - 1)) * index;
            const y = padding + chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;

            if (index === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }

            // Pontos
            this.ctx.fillStyle = '#6366f1';
            this.ctx.beginPath();
            this.ctx.arc(x, y, 4, 0, 2 * Math.PI);
            this.ctx.fill();
        });

        this.ctx.stroke();

        // Área sob a linha
        this.ctx.globalAlpha = 0.2;
        this.ctx.fillStyle = '#6366f1';
        this.ctx.beginPath();
        this.data.values.forEach((value, index) => {
            const x = padding + (chartWidth / (this.data.values.length - 1)) * index;
            const y = padding + chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;

            if (index === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        });
        this.ctx.lineTo(padding + chartWidth, padding + chartHeight);
        this.ctx.lineTo(padding, padding + chartHeight);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
    }
}

// Inicializar sistema de gráficos
document.addEventListener('DOMContentLoaded', () => {
    const chartManager = new ChartManager();
    
    // Adicionar responsividade
    window.addEventListener('resize', () => {
        chartManager.resizeCharts();
    });

    // Adicionar interatividade
    setTimeout(() => {
        chartManager.addInteractivity();
        chartManager.animateCharts();
    }, 1000);

    // Escutar mudanças de período nos gráficos
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('chart-btn')) {
            const period = e.target.dataset.period;
            chartManager.updateChartPeriod(period);
        }
    });
});

// Exportar para uso global
window.ChartManager = ChartManager;
window.LineChart = LineChart; 