DROP DATABASE IF EXISTS agenda_pet;

CREATE DATABASE agenda_pet
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE agenda_pet;

-- Tabela tutores
CREATE TABLE tutores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    endereco VARCHAR(255),
    cep VARCHAR(10),
    senha_hash VARCHAR(255) NULL,
    foto LONGTEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela pets
CREATE TABLE pets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tutor_id INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    especie VARCHAR(50) NOT NULL,
    raca VARCHAR(100),
    idade VARCHAR(30),
    data_nascimento DATE,
    sexo ENUM('Macho', 'Fêmea'),
    peso DECIMAL(6,2),
    tem_carteira_vacinacao BOOLEAN DEFAULT FALSE,
    carteira_vacinacao LONGTEXT,
    foto LONGTEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_pets_tutores
        FOREIGN KEY (tutor_id) REFERENCES tutores(id)
        ON DELETE CASCADE
);

-- Tabela clinicas
CREATE TABLE clinicas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    endereco VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(150),
    descricao TEXT,
    imagem VARCHAR(255),
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela veterinarios
CREATE TABLE veterinarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    clinica_id INT NOT NULL,
    nome VARCHAR(150) NOT NULL,
    especialidade VARCHAR(100),
    telefone VARCHAR(20),
    email VARCHAR(150),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_veterinarios_clinicas
        FOREIGN KEY (clinica_id) REFERENCES clinicas(id)
        ON DELETE CASCADE
);

-- Tabela servicos
CREATE TABLE servicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    clinica_id INT NOT NULL,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    duracao_minutos INT DEFAULT 30,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_servicos_clinicas
        FOREIGN KEY (clinica_id) REFERENCES clinicas(id)
        ON DELETE CASCADE
);

-- Tabela agendamentos
CREATE TABLE agendamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tutor_id INT NOT NULL,
    pet_id INT NOT NULL,
    clinica_id INT NOT NULL,
    veterinario_id INT NULL,
    servico_id INT NULL,
    data_agendamento DATE NOT NULL,
    horario TIME NOT NULL,
    observacoes TEXT,
    status ENUM(
        'Agendado',
        'Confirmado',
        'Cancelado',
        'Concluído'
    ) DEFAULT 'Agendado',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_agendamentos_tutores
        FOREIGN KEY (tutor_id) REFERENCES tutores(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_agendamentos_pets
        FOREIGN KEY (pet_id) REFERENCES pets(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_agendamentos_clinicas
        FOREIGN KEY (clinica_id) REFERENCES clinicas(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_agendamentos_veterinarios
        FOREIGN KEY (veterinario_id) REFERENCES veterinarios(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_agendamentos_servicos
        FOREIGN KEY (servico_id) REFERENCES servicos(id)
        ON DELETE SET NULL
);

-- Tabela transportes
CREATE TABLE transportes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tutor_id INT NOT NULL,
    pet_id INT NOT NULL,
    clinica_id INT NULL,
    endereco_origem VARCHAR(255) NOT NULL,
    endereco_destino VARCHAR(255) NOT NULL,
    data_transporte DATE,
    horario TIME,
    observacoes TEXT,
    status ENUM(
        'Solicitado',
        'Confirmado',
        'Concluído',
        'Cancelado'
    ) DEFAULT 'Solicitado',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_transportes_tutores
        FOREIGN KEY (tutor_id) REFERENCES tutores(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_transportes_pets
        FOREIGN KEY (pet_id) REFERENCES pets(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_transportes_clinicas
        FOREIGN KEY (clinica_id) REFERENCES clinicas(id)
        ON DELETE SET NULL
);

-- Tabela animais perdidos
CREATE TABLE animais_perdidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tutor_id INT NULL,
    nome VARCHAR(100),
    especie VARCHAR(50) NOT NULL,
    raca VARCHAR(100),
    cor VARCHAR(100),
    porte VARCHAR(50),
    descricao TEXT,
    foto LONGTEXT,
    telefone_contato VARCHAR(20) NOT NULL,
    endereco VARCHAR(255),
    data_desaparecimento DATE,
    status ENUM('Perdido', 'Encontrado') DEFAULT 'Perdido',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_animais_perdidos_tutores
        FOREIGN KEY (tutor_id) REFERENCES tutores(id)
        ON DELETE SET NULL
);

-- Índices
CREATE INDEX idx_pets_tutor ON pets(tutor_id);
CREATE INDEX idx_veterinarios_clinica ON veterinarios(clinica_id);
CREATE INDEX idx_servicos_clinica ON servicos(clinica_id);
CREATE INDEX idx_agendamentos_tutor ON agendamentos(tutor_id);
CREATE INDEX idx_agendamentos_pet ON agendamentos(pet_id);
CREATE INDEX idx_agendamentos_clinica ON agendamentos(clinica_id);
CREATE INDEX idx_transportes_tutor ON transportes(tutor_id);
CREATE INDEX idx_animais_perdidos_status ON animais_perdidos(status);

-- Dados das clínicas
INSERT INTO clinicas
(nome, endereco, telefone, email, descricao, imagem, latitude, longitude)
VALUES
(
    'Pet Vida Veterinária',
    'Av. Ralfo Leite de Barros, 93, Jardim Nova Europa, Campinas - SP',
    NULL,
    NULL,
    'Atendimento veterinário para cuidar da saúde dos animais.',
    'petvida.jpg',
    NULL,
    NULL
),
(
    'Clínica HVNC',
    'Av. Dr. Jesuíno Marcondes Machado, 1077, Nova Campinas, Campinas - SP',
    NULL,
    NULL,
    'Clínica veterinária com atendimento especializado.',
    NULL,
    NULL,
    NULL
),
(
    '+PET',
    'Av. Heitor Penteado, 861 e 865, Campinas - SP',
    NULL,
    NULL,
    'Atendimento e serviços para animais de estimação.',
    NULL,
    NULL,
    NULL
),
(
    'S.O.S Animal & Cia',
    'Rua Tobias de Aguiar, 1098, Campinas - SP',
    NULL,
    NULL,
    'Atendimento veterinário e cuidado animal.',
    NULL,
    NULL,
    NULL
);

-- Dados dos veterinários
INSERT INTO veterinarios
(clinica_id, nome, especialidade)
VALUES
(1, 'Dra. Ana Paula', 'Clínica geral'),
(1, 'Dr. Rafael Mendes', 'Dermatologia veterinária'),
(2, 'Dra. Camila Oliveira', 'Clínica geral'),
(2, 'Dr. Felipe Santos', 'Cirurgia veterinária'),
(3, 'Dra. Juliana Costa', 'Clínica geral'),
(3, 'Dr. Lucas Almeida', 'Ortopedia veterinária'),
(4, 'Dra. Beatriz Lima', 'Clínica geral'),
(4, 'Dr. Gabriel Souza', 'Medicina preventiva');

-- Dados dos serviços
INSERT INTO servicos
(clinica_id, nome, descricao, preco, duracao_minutos)
VALUES
(1, 'Consulta veterinária', 'Avaliação geral da saúde do pet.', 120.00, 30),
(1, 'Vacinação', 'Aplicação de vacina conforme orientação veterinária.', 80.00, 20),
(1, 'Exame de sangue', 'Coleta e análise de sangue.', 100.00, 30),
(1, 'Retorno veterinário', 'Reavaliação após consulta.', 60.00, 20),
(2, 'Consulta veterinária', 'Avaliação clínica do animal.', 150.00, 30),
(2, 'Consulta especializada', 'Atendimento veterinário especializado.', 200.00, 45),
(2, 'Exame de imagem', 'Exame de imagem mediante indicação veterinária.', 180.00, 40),
(2, 'Cirurgia veterinária', 'Procedimento cirúrgico conforme avaliação.', 500.00, 120),
(3, 'Consulta veterinária', 'Avaliação geral do pet.', 110.00, 30),
(3, 'Vacinação', 'Aplicação de vacina conforme orientação veterinária.', 75.00, 20),
(3, 'Banho e tosa', 'Higiene e cuidados com a pelagem.', 90.00, 60),
(3, 'Exame de sangue', 'Coleta e análise de sangue.', 95.00, 30),
(4, 'Consulta veterinária', 'Avaliação geral do animal.', 100.00, 30),
(4, 'Vacinação', 'Aplicação de vacina conforme orientação veterinária.', 70.00, 20),
(4, 'Atendimento preventivo', 'Orientações para prevenção de doenças.', 85.00, 30),
(4, 'Retorno veterinário', 'Reavaliação após consulta.', 50.00, 20);

-- Verificação das tabelas
SHOW TABLES;

-- Verificação das clínicas
SELECT * FROM clinicas;

-- Verificação dos veterinários
SELECT * FROM veterinarios;

-- Verificação dos serviços
SELECT * FROM servicos;