
DROP DATABASE IF EXISTS agenda_pet;

CREATE DATABASE agenda_pet
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE agenda_pet;

-- TABELA TUTORES

CREATE TABLE tutores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    endereco VARCHAR(255) NOT NULL,
    cep VARCHAR(9) NOT NULL,
    foto LONGTEXT NULL,
    senha_hash VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- TABELA PETS

CREATE TABLE pets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tutor_id INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    especie VARCHAR(50) NOT NULL,
    raca VARCHAR(100) NOT NULL,
    idade VARCHAR(30) NOT NULL,
    data_nascimento DATE NULL,
    sexo ENUM('Macho', 'Fêmea') NOT NULL,
    peso VARCHAR(30) NOT NULL,
    tem_carteira_vacinacao BOOLEAN NOT NULL DEFAULT FALSE,
    carteira_vacinacao LONGTEXT NULL,
    foto LONGTEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_pets_tutores
        FOREIGN KEY (tutor_id)
        REFERENCES tutores(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_pets_tutor (tutor_id)
) ENGINE=InnoDB;

-- TABELA CLÍNICAS

CREATE TABLE clinicas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    regiao VARCHAR(100) NOT NULL,
    endereco VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NULL,
    horario_atendimento VARCHAR(100) NULL,
    atendimento_24h BOOLEAN DEFAULT FALSE,
    descricao TEXT NULL,
    imagem VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- TABELA VETERINÁRIOS

CREATE TABLE veterinarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    clinica_id INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    especialidade VARCHAR(100) NULL,
    telefone VARCHAR(20) NULL,
    email VARCHAR(100) NULL,
    disponivel BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_veterinarios_clinicas
        FOREIGN KEY (clinica_id)
        REFERENCES clinicas(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_veterinarios_clinica (clinica_id)
) ENGINE=InnoDB;

-- TABELA SERVIÇOS

CREATE TABLE servicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    clinica_id INT NOT NULL,
    veterinario_id INT NULL,
    nome VARCHAR(150) NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    descricao TEXT NULL,
    preco DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    duracao_minutos INT NOT NULL DEFAULT 30,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_servicos_clinicas
        FOREIGN KEY (clinica_id)
        REFERENCES clinicas(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_servicos_veterinarios
        FOREIGN KEY (veterinario_id)
        REFERENCES veterinarios(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    INDEX idx_servicos_clinica (clinica_id),
    INDEX idx_servicos_veterinario (veterinario_id)
) ENGINE=InnoDB;

-- TABELA AGENDAMENTOS

CREATE TABLE agendamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tutor_id INT NOT NULL,
    pet_id INT NOT NULL,
    clinica_id INT NOT NULL,
    veterinario_id INT NULL,
    servico_id INT NOT NULL,
    data_agendamento DATE NOT NULL,
    horario TIME NOT NULL,

    status ENUM(
        'Agendado',
        'Confirmado',
        'Cancelado',
        'Concluído'
    ) NOT NULL DEFAULT 'Agendado',

    observacoes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_agendamentos_tutores
        FOREIGN KEY (tutor_id)
        REFERENCES tutores(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_agendamentos_pets
        FOREIGN KEY (pet_id)
        REFERENCES pets(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_agendamentos_clinicas
        FOREIGN KEY (clinica_id)
        REFERENCES clinicas(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_agendamentos_veterinarios
        FOREIGN KEY (veterinario_id)
        REFERENCES veterinarios(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_agendamentos_servicos
        FOREIGN KEY (servico_id)
        REFERENCES servicos(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_agendamentos_tutor (tutor_id),
    INDEX idx_agendamentos_pet (pet_id),
    INDEX idx_agendamentos_clinica (clinica_id),
    INDEX idx_agendamentos_data_horario (
        clinica_id,
        data_agendamento,
        horario
    )
) ENGINE=InnoDB;

-- TABELA TRANSPORTES

CREATE TABLE transportes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    agendamento_id INT NOT NULL UNIQUE,
    endereco_coleta VARCHAR(255) NOT NULL,
    data_coleta DATE NOT NULL,
    horario_coleta TIME NOT NULL,
    observacoes TEXT NULL,

    status ENUM(
        'Solicitado',
        'Confirmado',
        'Em andamento',
        'Concluído',
        'Cancelado'
    ) NOT NULL DEFAULT 'Solicitado',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_transportes_agendamentos
        FOREIGN KEY (agendamento_id)
        REFERENCES agendamentos(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- TABELA DE ANIMAIS PERDIDOS E ENCONTRADOS

CREATE TABLE animais_perdidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tutor_id INT NULL,
    nome VARCHAR(100) NULL,
    especie VARCHAR(50) NOT NULL,
    raca VARCHAR(100) NULL,
    cor VARCHAR(100) NULL,
    data_perdido DATE NOT NULL,
    bairro VARCHAR(100) NOT NULL,
    local_perdido VARCHAR(255) NOT NULL,
    descricao TEXT NULL,
    contato VARCHAR(20) NOT NULL,
    foto LONGTEXT NULL,

    status ENUM(
        'perdido',
        'encontrado'
    ) NOT NULL DEFAULT 'perdido',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_animais_perdidos_tutores
        FOREIGN KEY (tutor_id)
        REFERENCES tutores(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    INDEX idx_animais_perdidos_status (status),
    INDEX idx_animais_perdidos_especie (especie),
    INDEX idx_animais_perdidos_bairro (bairro),
    INDEX idx_animais_perdidos_tutor (tutor_id)
) ENGINE=InnoDB;

-- CADASTRO DAS CLÍNICAS

INSERT INTO clinicas (
    nome,
    regiao,
    endereco,
    telefone,
    horario_atendimento,
    atendimento_24h,
    descricao,
    imagem
)
VALUES
(
    'Pet Vida Veterinária',
    'Jardim Nova Europa',
    'Av. Ralfo Leite de Barros, 93 - Jardim Nova Europa, Campinas - SP',
    '(19) 3232-1000',
    '08:00 às 18:00',
    FALSE,
    'Clínica veterinária com atendimento clínico, consultas e serviços para cães e gatos.',
    'petvida.jpg'
),
(
    'Clínica HVNC',
    'Nova Campinas',
    'Av. Dr. Jesuíno Marcondes Machado, 1077 - Nova Campinas, Campinas - SP, 13092-001',
    '(19) 3234-2000',
    '08:00 às 19:00',
    FALSE,
    'Atendimento veterinário para cães e gatos.',
    'hvnc.jpg'
),
(
    '+PET',
    'Jardim Nossa Sra. Auxiliadora',
    'Av. Dr. Heitor Penteado, 861 e 865 - Jardim Nossa Sra. Auxiliadora, Campinas - SP, 13087-000',
    '(19) 3255-3000',
    '08:00 às 18:00',
    FALSE,
    'Clínica veterinária para atendimento e cuidados com pets.',
    'pet.jpg'
),
(
    'S.O.S Animal & Cia',
    'Jardim Aurélia',
    'Av. Brg. Rafael Tobias de Aguiar, 1098 - Jardim Aurélia, Campinas - SP, 13033-140',
    '(19) 3289-4000',
    '08:00 às 20:00',
    FALSE,
    'Atendimento veterinário completo para pets.',
    'sos-animal.jpg'
);

-- CADASTRO DOS VETERINÁRIOS

INSERT INTO veterinarios (
    clinica_id,
    nome,
    especialidade,
    telefone,
    email,
    disponivel
)
VALUES
(1, 'Dra. Ana Paula', 'Clínica Geral', '(19) 3232-1001', 'ana@petvida.com.br', TRUE),
(1, 'Dr. Carlos Eduardo', 'Dermatologia Veterinária', '(19) 3232-1002', 'carlos@petvida.com.br', TRUE),
(2, 'Dra. Mariana Silva', 'Clínica Geral', '(19) 3234-2001', 'mariana@animalcare.com.br', TRUE),
(2, 'Dr. Rafael Souza', 'Cirurgia Veterinária', '(19) 3234-2002', 'rafael@animalcare.com.br', TRUE),
(3, 'Dra. Juliana Martins', 'Clínica Geral', '(19) 3255-3001', 'juliana@vetcare.com.br', TRUE),
(3, 'Dr. Felipe Almeida', 'Cardiologia Veterinária', '(19) 3255-3002', 'felipe@vetcare.com.br', TRUE),
(4, 'Dra. Beatriz Oliveira', 'Clínica Geral', '(19) 3289-4001', 'beatriz@pethealth.com.br', TRUE),
(4, 'Dr. Lucas Ferreira', 'Cirurgia Veterinária', '(19) 3289-4002', 'lucas@pethealth.com.br', TRUE);

-- CADASTRO DOS SERVIÇOS

INSERT INTO servicos (
    clinica_id,
    veterinario_id,
    nome,
    tipo,
    descricao,
    preco,
    duracao_minutos,
    ativo
)
VALUES
(1, 1, 'Consulta Veterinária', 'Consulta', 'Consulta veterinária geral.', 120.00, 40, TRUE),
(1, 2, 'Consulta Dermatológica', 'Consulta', 'Avaliação dermatológica do pet.', 180.00, 50, TRUE),
(1, 1, 'Vacinação', 'Vacina', 'Aplicação de vacina para cães e gatos.', 90.00, 20, TRUE),
(1, 2, 'Avaliação Dermatológica', 'Exame', 'Avaliação da pele e pelagem.', 150.00, 40, TRUE),

(2, 3, 'Consulta Veterinária', 'Consulta', 'Consulta veterinária geral.', 150.00, 40, TRUE),
(2, 4, 'Consulta Cirúrgica', 'Consulta', 'Avaliação pré-cirúrgica.', 180.00, 50, TRUE),
(2, 3, 'Vacinação', 'Vacina', 'Aplicação de vacinas.', 95.00, 20, TRUE),
(2, 4, 'Cirurgia Veterinária', 'Cirurgia', 'Procedimentos cirúrgicos veterinários.', 350.00, 90, TRUE),

(3, 5, 'Consulta Veterinária', 'Consulta', 'Consulta veterinária geral.', 100.00, 40, TRUE),
(3, 6, 'Consulta Cardiológica', 'Consulta', 'Avaliação cardiológica do pet.', 200.00, 50, TRUE),
(3, 5, 'Vacinação', 'Vacina', 'Aplicação de vacinas.', 85.00, 20, TRUE),
(3, 6, 'Exame Cardiológico', 'Exame', 'Avaliação do sistema cardiovascular.', 180.00, 45, TRUE),

(4, 7, 'Consulta Veterinária', 'Consulta', 'Consulta veterinária geral.', 130.00, 40, TRUE),
(4, 8, 'Consulta Cirúrgica', 'Consulta', 'Avaliação para procedimentos cirúrgicos.', 170.00, 50, TRUE),
(4, 7, 'Vacinação', 'Vacina', 'Aplicação de vacinas.', 90.00, 20, TRUE),
(4, 8, 'Cirurgia Veterinária', 'Cirurgia', 'Procedimentos cirúrgicos veterinários.', 400.00, 90, TRUE);

-- VERIFICAÇÃO DO BANCO

SELECT * FROM clinicas;
SELECT * FROM veterinarios;
SELECT * FROM servicos;
SELECT * FROM tutores;
SELECT * FROM pets;
SELECT * FROM agendamentos;
SELECT * FROM transportes;
SELECT * FROM animais_perdidos;
