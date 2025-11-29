CREATE DATABASE fgtas_atendimentos;

USE fgtas_atendimentos;

CREATE TABLE tipo_usuario (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    tipo VARCHAR(50),
    status VARCHAR(7) DEFAULT 'Ativo'
);

CREATE TABLE usuario (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_tipo_usuario INT,
    nome VARCHAR(100),
    senha VARCHAR(255),
    cpf VARCHAR(11),
    data_nascimento DATE,
    telefone VARCHAR(40),
    cep VARCHAR(8),
    endereco VARCHAR(255),
    email VARCHAR(50),
    status VARCHAR(7) DEFAULT 'Ativo',
    INDEX idx_usuario_id_tipo_usuario (id_tipo_usuario),
    INDEX idx_usuario_cpf (cpf)
);

CREATE TABLE tipo_solicitante (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    tipo VARCHAR(50),
    status VARCHAR(7) DEFAULT 'Ativo'
);

CREATE TABLE solicitante (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_tipo_solicitante INT,
    nome VARCHAR(200),
    identificacao VARCHAR(14),
    data_nascimento DATE,
    telefone VARCHAR(40),
    cep VARCHAR(8),
    endereco VARCHAR(255),
    email VARCHAR(50),
    status VARCHAR(7) DEFAULT 'Ativo',
    INDEX idx_solicitante_id_tipo_solicitante (id_tipo_solicitante),
    INDEX idx_solicitante_identificacao (identificacao)
);

CREATE TABLE portfolio (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_tipo_solicitante INT,
    nome VARCHAR(100),
    status VARCHAR(7) DEFAULT 'Ativo',
    INDEX idx_portfolio_id_tipo_solicitante (id_tipo_solicitante)
);

CREATE TABLE servico (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_portfolio INT,
    nome VARCHAR(100),
    status VARCHAR(7) DEFAULT 'Ativo',
    INDEX idx_servico_id_portfolio (id_portfolio)
);

CREATE TABLE tipo_ocorrencia (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    tipo VARCHAR(100)
);

CREATE TABLE atendimento (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    id_solicitante INT,
    id_atendente INT,
    id_portfolio INT,
    id_servico INT,
    id_tipo_ocorrencia INT,
    arquivos_caminho VARCHAR(255),
    data_inicio DATETIME,
    data_fim DATETIME,
    solucao VARCHAR(500),
    descricao VARCHAR(500),
    status VARCHAR(50) DEFAULT 'Em Andamento',
    canal VARCHAR(50),
    INDEX idx_atendimento_id_solicitante (id_solicitante),
    INDEX idx_atendimento_id_atendente (id_atendente),
    INDEX idx_atendimento_id_portfolio (id_portfolio),
    INDEX idx_atendimento_id_servico (id_servico),
    INDEX idx_atendimento_id_tipo_ocorrencia (id_tipo_ocorrencia),
    INDEX idx_atendimento_data_inicio (data_inicio),
    INDEX idx_atendimento_status (status)
);

ALTER TABLE usuario
ADD CONSTRAINT fk_usuario_id_tipo_usuario FOREIGN KEY (id_tipo_usuario) REFERENCES tipo_usuario (id);

ALTER TABLE solicitante
ADD CONSTRAINT fk_solicitante_id_tipo_solicitante FOREIGN KEY (id_tipo_solicitante) REFERENCES tipo_solicitante (id);

ALTER TABLE portfolio
ADD CONSTRAINT fk_portfolio_id_tipo_solicitante FOREIGN KEY (id_tipo_solicitante) REFERENCES tipo_solicitante (id);

ALTER TABLE servico
ADD CONSTRAINT fk_servico_id_portfolio FOREIGN KEY (id_portfolio) REFERENCES portfolio (id);

ALTER TABLE atendimento
ADD CONSTRAINT fk_atendimento_id_atendente FOREIGN KEY (id_atendente) REFERENCES usuario (id);

ALTER TABLE atendimento
ADD CONSTRAINT fk_atendimento_id_solicitante FOREIGN KEY (id_solicitante) REFERENCES solicitante (id);

ALTER TABLE atendimento
ADD CONSTRAINT fk_atendimento_id_portfolio FOREIGN KEY (id_portfolio) REFERENCES portfolio (id);

ALTER TABLE atendimento
ADD CONSTRAINT fk_atendimento_id_servico FOREIGN KEY (id_servico) REFERENCES servico (id);

ALTER TABLE atendimento
ADD CONSTRAINT fk_atendimento_id_tipo_ocorrencia FOREIGN KEY (id_tipo_ocorrencia) REFERENCES tipo_ocorrencia (id);