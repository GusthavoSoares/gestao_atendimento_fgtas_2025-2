USE fgtas_atendimentos;

INSERT INTO tipo_ocorrencia (nome)
VALUES ('REQUISIÇÃO'), ('INCIDENTE');

INSERT INTO tipo_usuario (tipo, status)
VALUES ('ADMINISTRADOR', 'ATIVO'),
       ('GESTOR', 'ATIVO'),
       ('ATENDENTE', 'ATIVO'),
       ('TESTE', 'INATIVO');

INSERT INTO usuario (
    id_tipo_usuario,
    nome,
    cpf,
    data_nascimento,
    telefone,
    cep,
    endereco,
    email,
    status
)
VALUES 
    (1, 'Gusthavo Soares', '05883633080', '2005-02-28', '51993419188', '90870390', 'Rua Nunes 339 - Medianeira', 'gusthavorsoares@gmail.com', 'ATIVO'),
    (2, 'Mário Costa', '16158137723', '1999-01-12', '5128340166', '36773568', 'Rua Lacordaire Dutra, 30 - Cataguases - MG', 'mario.costa@fgtas.com.br', 'ATIVO'),
    (3, 'Ana Maria', '88711415711', '2004-11-16', '5539338645', '85802100', 'Rua Sete de Setembro, 25 - Parque São Paulo - PR', 'ana.maria@fgtas.com.br', 'ATIVO'),
    (3, 'Ana Braga', '88711315711', '2001-11-16', '5532338645', '75802100', 'Rua Sete de Setembro, 25 - Parque Paulo - PR', 'ana.maria@gmail.com.br', 'INATIVO');

INSERT INTO tipo_solicitante (tipo, status)
VALUES ('EMPREGADOR', 'ATIVO'),
       ('SETOR FGTAS', 'ATIVO'),
       ('TRABALHADOR', 'ATIVO'),
       ('AGÊNCIA', 'ATIVO'),
       ('ADS', 'ATIVO'),
       ('INTERESSADO NO MERCADO DE TRABALHO', 'ATIVO'),
       ('MERCADO DE TRABALHO', 'INATIVO');

INSERT INTO portfolio (id_tipo_solicitante, nome, status)
VALUES 
    (1, 'Emissão de Documentos', 'ATIVO'),
    (1, 'Dúvidas', 'ATIVO'),
    (2, 'Repasse de Documentação', 'ATIVO'),
    (3, 'Emissão de Documentos', 'ATIVO'),
    (3, 'Dúvidas', 'ATIVO'),
    (3, 'Vagas', 'ATIVO'),
    (4, 'Candidatos', 'ATIVO'),
    (5, 'Distribuição', 'ATIVO'),
    (6, 'Empregabilidade', 'ATIVO');

INSERT INTO servico (id_portfolio, nome, status)
VALUES 
    (1, 'DAS', 'ATIVO'),
    (1, 'Contrato de Trabalho', 'ATIVO'),
    (2, 'Empregados', 'ATIVO'),
    (2, 'Documentação Admissional', 'ATIVO'),
    (3, 'Colaboradores Ativos', 'ATIVO'),
    (4, 'Carteira de Trabalho Digital (CTPS)', 'ATIVO'),
    (4, 'Carteira de Identidade', 'ATIVO'),
    (5, 'Carteira de Trabalho Digital (CTPS)', 'ATIVO'),
    (5, 'Gov.br', 'ATIVO'),
    (6, 'Vagas disponíveis', 'ATIVO'),
    (6, 'Processos Seletivos em Aberto', 'ATIVO'),
    (7, 'Lista de Candidatos Disponíveis', 'ATIVO'),
    (8, 'Cestas Básicas', 'ATIVO'),
    (8, 'Roupas', 'ATIVO'),
    (9, 'Currículo', 'ATIVO'),
    (9, 'Postura Profissional', 'ATIVO'),
    (9, 'Teste de entrevista', 'ATIVO');

INSERT INTO solicitante (
    nome,
    id_tipo_solicitante,
    identificacao,
    data_nascimento,
    telefone,
    cep,
    endereco,
    email
)
VALUES
    ('Gustavo Pereira', 1, '03205893123', '2005-02-12', '51995120974', '90870390', 'Rua Nunes 339', 'gusthavo.pereira@gmail.com'),
    ('Márcio Silva', 2, '03205823123', '2002-02-12', '51905120974', '90870389', 'Rua Teste', 'marcio.silva@gmail.com'),
    ('Beatriz Albuquerque', 3, '59767778306', '1994-05-18', '51998112234', '90020000', 'Rua General Câmara, 155', 'beatriz.alb@gmail.com'),
    ('Lucas Montenegro', 4, '17446411708', '1989-09-02', '51993014452', '90619900', 'Av. Ipiranga, 2000', 'lucas.montenegro@hotmail.com'),
    ('Patrícia Nogueira', 5, '73405296757', '1991-12-30', '51994023311', '91760030', 'Rua Camaquã, 455', 'patricia.nogueira@gmail.com');

INSERT INTO atendimento (
    id_solicitante,
    id_atendente,
    id_portfolio,
    id_servico,
    id_tipo_ocorrencia,
    arquivos_caminho,
    data_inicio,
    data_fim,
    solucao,
    descricao,
    status,
    canal
)
VALUES (
    1,
    3,
    1,
    1,
    1,
    'src/files/teste.png',
    '2025-11-16 12:00:00',
    '2025-11-16 13:00:00',
    'Elaborei em conjunto a Gustavo Pereira o contrato de trabalho, indicando os principais campos necessários.',
    'O Senhor Gustavo Pereira pediu ajuda para emitir o contrato de um empregado.',
    'Fechado',
    'Atendimento Presencial'
);
