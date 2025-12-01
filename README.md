# Sistema de Gestão de Atendimentos FGTAS

Sistema desenvolvido no semestre 2025-2 para gestão de atendimentos da FGTAS, baseado nos conceitos do framework ITIL V4.

## 📋 Sobre o Projeto

O Sistema de Gestão de Atendimentos FGTAS é uma aplicação web completa para gerenciar solicitações, atendimentos e ocorrências, permitindo o controle eficiente de portfólios, serviços e solicitantes.

## 👥 Autores

- Gusthavo Soares
- Gabriel Rangel
- Juliano de Oliveira

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** com Express 5.1.0
- **MySQL** para banco de dados
- **JWT** para autenticação
- **bcryptjs** para criptografia de senhas
- **CORS** para controle de acesso

### Frontend
- **HTML5**, **CSS3** e **JavaScript** (Vanilla)
- **Bootstrap 5.3.0** para interface responsiva
- **Font Awesome** para ícones
- **Chart.js** para gráficos e dashboards

## 📁 Estrutura do Projeto

```
atendimento_fgtas/
├── src/                          # Backend da aplicação
│   ├── server.js                 # Servidor Express
│   ├── controller/               # Controladores da API
│   ├── model/                    # Modelos de dados
│   ├── routes/                   # Rotas da API
│   ├── middleware/               # Middlewares de autenticação
│   └── files/                    # Arquivos estáticos
├── pages/                        # Páginas HTML do frontend
│   ├── dashboard.html            # Página inicial
│   ├── atendimentos.html         # Gestão de atendimentos
│   ├── usuarios.html             # Gestão de usuários
│   ├── solicitantes.html         # Gestão de solicitantes
│   ├── portfolios.html           # Gestão de portfólios
│   ├── servicos.html             # Gestão de serviços
│   ├── relatorios.html           # Relatórios e KPIs
│   └── tipos-*.html              # Cadastros de tipos
├── js/                           # JavaScript frontend
│   ├── controller/               # Controladores frontend
│   ├── frontController/          # Controladores de páginas
│   ├── flows/                    # Fluxos de navegação
│   ├── middleware/               # Middlewares frontend
│   └── renders/                  # Classes de renderização
├── css/                          # Estilos customizados
├── sql/                          # Scripts do banco de dados
│   ├── banco.sql                 # Criação das tabelas
│   └── popular_tabelas.sql       # População inicial
└── insomnia/                     # Coleção de testes da API
```

## 🗄️ Banco de Dados

O sistema utiliza MySQL com as seguintes principais tabelas:

- **usuario** - Cadastro de usuários do sistema
- **tipo_usuario** - Tipos de usuário (Admin, Atendente, etc.)
- **solicitante** - Cadastro de solicitantes
- **tipo_solicitante** - Tipos de solicitante
- **atendimento** - Registros de atendimentos
- **portfolio** - Portfólios de serviços
- **servico** - Serviços oferecidos
- **tipo_ocorrencia** - Tipos de ocorrências

## ⚙️ Configuração e Instalação

### Pré-requisitos

- Node.js (versão 16 ou superior)
- MySQL (versão 8 ou superior)
- Navegador web moderno

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/GusthavoSoares/gestao_atendimento_fgtas_2025-2.git
cd gestao_atendimento_fgtas_2025-2
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o banco de dados ou utilize o XAMPP:
```bash
# Execute os scripts SQL na ordem:
mysql -u root -p < sql/banco.sql
mysql -u root -p < sql/popular_tabelas.sql
```

4. Configure a conexão com o banco de dados:
   - Edite o arquivo `src/model/Conexao.js`
   - Ajuste as credenciais do MySQL (host, user, password, database)

5. Inicie o servidor backend:
```bash
npm run api
```

6. Abra o frontend:
   - Use o Live Server do VS Code ou similar
   - Acesse `http://127.0.0.1:5500/index.html`

## 🔌 API Endpoints

A API REST está disponível em `http://localhost:8001` com os seguintes recursos:

- **`/usuarios`** - CRUD de usuários
- **`/atendimentos`** - CRUD de atendimentos
- **`/solicitantes`** - CRUD de solicitantes
- **`/portfolios`** - CRUD de portfólios
- **`/servicos`** - CRUD de serviços
- **`/tipos-usuario`** - CRUD de tipos de usuário
- **`/tipos-solicitante`** - CRUD de tipos de solicitante
- **`/tipos-ocorrencia`** - CRUD de tipos de ocorrência

### Autenticação

O sistema utiliza JWT (JSON Web Token) para autenticação:

```javascript
// Exemplo de requisição autenticada
fetch('http://localhost:8001/atendimentos', {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
})
```

## 📊 Funcionalidades Principais

### Dashboard
- KPIs de atendimentos (Total, Em Andamento, Finalizados, Cancelados)
- Gráficos de análise de desempenho
- Visão geral do sistema

### Gestão de Atendimentos
- Cadastro e edição de atendimentos
- Controle de status (Pendente, Em Andamento, Finalizado, Cancelado)
- Filtros avançados por data, status, portfólio, serviço
- Exportação de dados em CSV

### Gestão de Usuários
- Cadastro de usuários com validação de CPF
- Controle de tipos e permissões
- Alteração de senha
- Recuperação de senha

### Gestão de Solicitantes
- Cadastro de pessoas físicas e jurídicas
- Validação de CPF/CNPJ
- Histórico de atendimentos

### Relatórios
- Filtros personalizáveis por período
- Exportação em CSV
- Análise de KPIs
- Filtros avançados (portfólio, serviço, tipo de ocorrência)

## 🎨 Padrões de Desenvolvimento

### Frontend
- **MVC Pattern** - Separação de controladores, renders e views
- **Static Classes** - Renders reutilizáveis (BotoesFiltroRender, FiltroRender)
- **RouteMiddleware** - Validação de rotas e redirecionamento 404
- **NotificationService** - Sistema centralizado de notificações

### Backend
- **RESTful API** - Endpoints padronizados
- **JWT Authentication** - Segurança de rotas
- **Model Layer** - Abstração de dados
- **Error Handling** - Tratamento centralizado de erros

## 🔒 Segurança

- Senhas criptografadas com bcryptjs
- Autenticação JWT em todas as rotas protegidas
- Validação de tokens no backend
- CORS configurado para origens específicas
- Sanitização de inputs

## 📝 Licença

ISC License - Consulte o arquivo `package.json` para mais detalhes.

## 🐛 Issues

Encontrou um bug? Abra uma issue em: https://github.com/GusthavoSoares/gestao_atendimento_fgtas_2025-2/issues

## 📞 Suporte

Para questões e suporte, entre em contato com os autores do projeto.

---

**Desenvolvido por Gusthavo Soares, Juliano de Oliveira e Gabriel Rangel para FGTAS - 2025/2**
