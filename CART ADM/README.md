# CART ADM - Dashboard Moderno 🚀

## Visão Geral

Este é um painel administrativo moderno e inovador desenvolvido para a CART, com design responsivo, animações suaves e funcionalidades avançadas. O sistema foi construído usando tecnologias web modernas sem dependências de frameworks pesados como Bootstrap.

## ✨ Características Principais

### 🎨 Design e Interface
- **Design Moderno**: Interface limpa e moderna com gradientes sutis
- **Dark Mode**: Alternância entre tema claro e escuro
- **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Animações Fluidas**: Micro-interações e animações suaves
- **Tipografia**: Fonte Inter para melhor legibilidade

### 🏗️ Arquitetura
- **Sem Dependências**: Construído com HTML5, CSS3 e JavaScript puro
- **Modular**: Código organizado em classes e módulos
- **Performance**: Otimizado para carregamento rápido
- **Acessibilidade**: Seguindo boas práticas de acessibilidade

### 📊 Funcionalidades

#### Dashboard Principal
- **Métricas em Tempo Real**: Cards com estatísticas dinâmicas
- **Gráficos Interativos**: Visualizações de dados personalizadas
- **Atividades Recentes**: Timeline de ações do sistema
- **Ações Rápidas**: Botões para tarefas comuns

#### Navegação
- **Sidebar Responsiva**: Menu lateral colapsável
- **Multi-páginas**: Sistema de roteamento interno
- **Breadcrumb**: Navegação intuitiva

#### Power BI Integration
- **Incorporação Direta**: Visualização de dashboards do Power BI
- **Configuração Dinâmica**: URL configurável via interface
- **Tela Cheia**: Modo fullscreen para análise detalhada
- **Atualização Automática**: Refresh dos dados em tempo real

#### Módulos Administrativos
- **Rotina**: Farol de chamados e atividades
- **Materiais**: Gestão de ferramentas e equipamentos
- **PMRV**: Atividades e manutenção das bases
- **ARTESP**: DOPS e atividades realizadas
- **Insumos**: Controle de compras e estoque
- **Limpeza Fossa**: Cronograma e controle
- **Comunicados**: Avisos e informações
- **Atendimento**: Locais e pontos de atendimento
- **Serviços**: Escopo e atividades da equipe
- **Equipe**: Colaboradores e estrutura

## 🔧 Instalação e Configuração

### Pré-requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web (opcional, para desenvolvimento local)

### Instalação
1. Baixe ou clone os arquivos do projeto
2. Coloque os arquivos em um servidor web ou abra diretamente no navegador
3. Acesse o arquivo `index.html`

### Configuração do Power BI
1. Acesse a página "Power BI" no dashboard
2. Clique em "Configurar Power BI"
3. Cole a URL de incorporação do seu dashboard Power BI
4. Salve a configuração

## 📁 Estrutura do Projeto

```
novo site/
├── index.html          # Página principal
├── css/
│   └── style.css       # Estilos principais
├── js/
│   ├── app.js          # Lógica principal da aplicação
│   └── charts.js       # Sistema de gráficos
├── assets/
│   └── favicon.png     # Ícone do site
└── README.md           # Documentação
```

## 🎯 Uso

### Navegação
- Use o menu lateral para navegar entre as páginas
- Clique no ícone de hambúrguer para colapsar/expandir o menu
- No mobile, o menu se torna um overlay

### Dark Mode
- Clique no ícone de lua/sol no rodapé da sidebar
- A preferência é salva no navegador

### Gráficos
- Use os botões 7D, 30D, 90D para alterar o período dos dados
- Os gráficos são responsivos e se adaptam ao tamanho da tela

### Power BI
- Configure a URL na primeira vez
- Use os botões de atualizar e tela cheia conforme necessário

## 🔄 Funcionalidades em Tempo Real

### Simulação de Dados
- As métricas são atualizadas automaticamente a cada 30 segundos
- Os valores simulam variações realistas nos dados

### Notificações
- Sistema de toast para feedback ao usuário
- Notificações automáticas para ações importantes

## 📱 Responsividade

### Desktop (>1024px)
- Layout completo com sidebar e conteúdo lado a lado
- Gráficos em grid 2x1

### Tablet (768px - 1024px)
- Sidebar colapsável
- Gráficos empilhados verticalmente

### Mobile (<768px)
- Sidebar como overlay
- Layout em coluna única
- Botões otimizados para toque

## 🛠️ Personalização

### Cores
As cores principais podem ser alteradas no arquivo `style.css`:
```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #10b981;
    --accent-color: #f59e0b;
    /* ... */
}
```

### Adicionar Novas Páginas
1. Adicione um item no menu em `index.html`
2. Crie uma div com classe `page` e id correspondente
3. Adicione as informações da página no objeto `pageInfo` em `app.js`

### Personalizar Gráficos
- Modifique os dados em `charts.js`
- Ajuste cores e estilos conforme necessário

## 🔒 Segurança

- **Sem Backend**: Não há necessidade de servidor de aplicação
- **Local Storage**: Configurações salvas localmente no navegador
- **HTTPS**: Recomendado para produção (especialmente para Power BI)

## 🚀 Performance

### Otimizações Implementadas
- **CSS Sprites**: Ícones vetoriais para melhor performance
- **Lazy Loading**: Gráficos carregados sob demanda
- **Minificação**: CSS e JS otimizados
- **Debouncing**: Eventos otimizados para evitar execuções desnecessárias

## 📈 Monitoramento

### Métricas Disponíveis
- Tarefas pendentes e concluídas
- Equipe ativa
- Eficiência operacional
- Atividades por área
- Status dos projetos

## 🐛 Solução de Problemas

### Power BI não carrega
- Verifique se a URL está correta
- Certifique-se de que o dashboard está público ou você tem permissões
- Verifique se está usando HTTPS

### Gráficos não aparecem
- Verifique o console do navegador para erros
- Certifique-se de que JavaScript está habilitado
- Atualize a página

### Layout quebrado no mobile
- Limpe o cache do navegador
- Verifique se todos os arquivos CSS estão carregando

## 🔮 Funcionalidades Futuras

- [ ] Integração com APIs externas
- [ ] Sistema de autenticação
- [ ] Relatórios em PDF
- [ ] Notificações push
- [ ] Modo offline
- [ ] Mais tipos de gráficos

## 📞 Suporte

Para dúvidas ou sugestões sobre o painel administrativo CART ADM, entre em contato com a equipe de desenvolvimento.

---

**Desenvolvido com ❤️ para a CART**

*Versão 1.0 - Dashboard Moderno e Responsivo* 