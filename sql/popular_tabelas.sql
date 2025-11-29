USE fgtas_atendimentos;

INSERT INTO
    tipo_ocorrencia (tipo)
VALUES ('Requisição'),
    ('Incidente');

INSERT INTO
    tipo_usuario (tipo, status)
VALUES ('Administrador', 'Ativo'),
    ('Gestor', 'Ativo'),
    ('Atendente', 'Ativo'),
    ('Teste', 'Inativo');

INSERT INTO
    usuario (
        id_tipo_usuario,
        nome,
        senha,
        cpf,
        data_nascimento,
        telefone,
        cep,
        endereco,
        email,
        status
    )
VALUES (
        1,
        'Gusthavo Soares',
        '$2b$12$KJfidQik7mmlLfpaOgCgCOu7OZhAZo22GmOpZTO7gWgrdWiq/6jWe',
        '05883633080',
        '2005-02-28',
        '51993419188',
        '90870390',
        'Rua Nunes 339 - Medianeira',
        'gusthavorsoares@gmail.com',
        'Ativo'
    ),
    (
        2,
        'Mário Costa',
        '$2b$12$.RfY5Yh1.16cq2u5aCSILu5EOhyudMJhjxO9.LhxJPOptBfblsipS',
        '16158137723',
        '1999-01-12',
        '5128340166',
        '36773568',
        'Rua Lacordaire Dutra, 30 - Cataguases - MG',
        'mario.costa@fgtas.com.br',
        'Ativo'
    ),
    (
        3,
        'Ana Maria',
        '$2b$12$NCXZJt8jKI0SewUnqPjpguNTPwNQWFSO/gTMBScFRB9995UruEz3e',
        '88711415711',
        '2004-11-16',
        '5539338645',
        '85802100',
        'Rua Sete de Setembro, 25 - Parque São Paulo - PR',
        'ana.maria@fgtas.com.br',
        'Ativo'
    ),
    (
        3,
        'Ana Braga',
        '$2b$12$GC/46QwPDf8XVrGfU5CuCOAwfAqFfaLVV2wY6u9aBaSVhowshYckO',
        '88711315711',
        '2001-11-16',
        '5532338645',
        '75802100',
        'Rua Sete de Setembro, 25 - Parque Paulo - PR',
        'ana.maria@gmail.com.br',
        'Inativo'
    );

INSERT INTO
    tipo_solicitante (tipo, status)
VALUES ('Empregador', 'Ativo'),
    ('Setor FGTAS', 'Ativo'),
    ('Trabalhador', 'Ativo'),
    ('Agência', 'Ativo'),
    ('ADS', 'Ativo'),
    (
        'Interessado no mercado de trabalho',
        'Ativo'
    ),
    (
        'Mercado de trabalho',
        'Inativo'
    );

INSERT INTO
    portfolio (
        id_tipo_solicitante,
        nome,
        status
    )
VALUES (
        1,
        'Emissão de Documentos',
        'Ativo'
    ),
    (1, 'Dúvidas', 'Ativo'),
    (
        2,
        'Repasse de Documentação',
        'Ativo'
    ),
    (
        3,
        'Emissão de Documentos',
        'Ativo'
    ),
    (3, 'Dúvidas', 'Ativo'),
    (3, 'Vagas', 'Ativo'),
    (4, 'Candidatos', 'Ativo'),
    (5, 'Distribuição', 'Ativo'),
    (6, 'Empregabilidade', 'Ativo');

INSERT INTO
    servico (id_portfolio, nome, status)
VALUES (1, 'DAS', 'Ativo'),
    (
        1,
        'Contrato de Trabalho',
        'Ativo'
    ),
    (2, 'Empregados', 'Ativo'),
    (
        2,
        'Documentação Admissional',
        'Ativo'
    ),
    (
        3,
        'Colaboradores Ativos',
        'Ativo'
    ),
    (
        4,
        'Carteira de Trabalho Digital (CTPS)',
        'Ativo'
    ),
    (
        4,
        'Carteira de Identidade',
        'Ativo'
    ),
    (
        5,
        'Carteira de Trabalho Digital (CTPS)',
        'Ativo'
    ),
    (5, 'Gov.br', 'Ativo'),
    (
        6,
        'Vagas disponíveis',
        'Ativo'
    ),
    (
        6,
        'Processos Seletivos em Aberto',
        'Ativo'
    ),
    (
        7,
        'Lista de Candidatos Disponíveis',
        'Ativo'
    ),
    (8, 'Cestas Básicas', 'Ativo'),
    (8, 'Roupas', 'Ativo'),
    (9, 'Currículo', 'Ativo'),
    (
        9,
        'Postura Profissional',
        'Ativo'
    ),
    (
        9,
        'Teste de entrevista',
        'Ativo'
    );

INSERT INTO
    solicitante (
        nome,
        id_tipo_solicitante,
        identificacao,
        data_nascimento,
        telefone,
        cep,
        endereco,
        email,
        status
    )
VALUES (
        'Gustavo Pereira',
        1,
        '03205893123',
        '2005-02-12',
        '51995120974',
        '90870390',
        'Rua Nunes 339',
        'gusthavo.pereira@gmail.com',
        'Ativo'
    ),
    (
        'Márcio Silva',
        2,
        '03205823123',
        '2002-02-12',
        '51905120974',
        '90870389',
        'Rua Teste',
        'marcio.silva@gmail.com',
        'Ativo'
    ),
    (
        'Beatriz Albuquerque',
        3,
        '59767778306',
        '1994-05-18',
        '51998112234',
        '90020000',
        'Rua General Câmara, 155',
        'beatriz.alb@gmail.com',
        'Inativo'
    ),
    (
        'Lucas Montenegro',
        4,
        '17446411708',
        '1989-09-02',
        '51993014452',
        '90619900',
        'Av. Ipiranga, 2000',
        'lucas.montenegro@hotmail.com',
        'Ativo'
    ),
    (
        'Patrícia Nogueira',
        5,
        '73405296757',
        '1991-12-30',
        '51994023311',
        '91760030',
        'Rua Camaquã, 455',
        'patricia.nogueira@gmail.com',
        'Ativo'
    );

INSERT INTO
    atendimento (
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
        'Finalizado',
        'Atendimento Presencial'
    ),
    (
        1,
        3,
        1,
        1,
        1,
        '',
        '2025-11-18 12:00:00',
        '',
        '',
        'O Senhor Gustavo Pereira retornou para emitir novamente o contrato de um empregado.',
        'Em Andamento',
        'Atendimento Presencial'
    );