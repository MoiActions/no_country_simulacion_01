-- ============================================================
-- MVP Plataforma Upskilling & Empleabilidad +45
-- Esquema PostgreSQL — Supabase compatible
-- ============================================================

-- ------------------------------------------------------------
-- 0. EXTENSIONES
-- ------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------
-- 1. TIPOS ENUM
-- ------------------------------------------------------------

-- User roles
CREATE TYPE user_role AS ENUM ('USER', 'RECRUITER', 'ADMIN');

-- Company status
CREATE TYPE company_status AS ENUM ('PENDING_REVIEW', 'ACTIVE', 'SUSPENDED');

-- Job opportunity status
CREATE TYPE opportunity_status AS ENUM ('DRAFT', 'PUBLISHED', 'CLOSED', 'EXPIRED');

-- Diagnosis test types
CREATE TYPE diagnosis_test_type AS ENUM ('DIGITAL', 'COGNITIVE', 'SOCIOEMOTIONAL');

-- Skill categories
CREATE TYPE skill_category AS ENUM ('DIGITAL', 'COGNITIVE', 'SOCIOEMOTIONAL', 'TECHNICAL', 'LEADERSHIP');

-- Learning path difficulty
CREATE TYPE path_difficulty AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- Content types
CREATE TYPE content_type AS ENUM ('VIDEO', 'PDF', 'ARTICLE', 'INTERACTIVE', 'QUIZ');

-- Progress status
CREATE TYPE progress_status AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- Profile visibility
CREATE TYPE profile_visibility AS ENUM ('PUBLIC', 'PRIVATE', 'RECRUITERS_ONLY');

-- Education level
CREATE TYPE education_level AS ENUM ('HIGH_SCHOOL', 'TECHNICAL', 'BACHELOR', 'MASTER', 'DOCTORATE', 'CERTIFICATION', 'OTHER');

-- Application status
CREATE TYPE application_status AS ENUM ('PENDING', 'REVIEWED', 'SHORTLISTED', 'INTERVIEW', 'REJECTED', 'HIRED', 'WITHDRAWN');

-- Feedback type
CREATE TYPE feedback_type AS ENUM ('POSITIVE', 'CONSTRUCTIVE', 'REJECTION');

-- Notification type
CREATE TYPE notification_type AS ENUM ('PROFILE_VIEWED', 'APPLICATION_RECEIVED', 'APPLICATION_STATUS_CHANGED', 'FEEDBACK_RECEIVED', 'SHORTLISTED', 'SKILL_VALIDATED', 'MODULE_COMPLETED', 'NEW_JOB_MATCH', 'SYSTEM');

-- ------------------------------------------------------------
-- 2. TABLAS CORE
-- ------------------------------------------------------------

-- Users table (synced with Supabase Auth)
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    role user_role DEFAULT 'USER',
    avatar_url VARCHAR(500),
    phone VARCHAR(50),
    date_of_birth DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ
);

-- Companies table
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    legal_name VARCHAR(255) NOT NULL,
    industry VARCHAR(255) NOT NULL,
    employee_count INT DEFAULT 0,
    website_url VARCHAR(500),
    company_status company_status DEFAULT 'PENDING_REVIEW',
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job opportunities table
CREATE TABLE job_opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255),
    is_remote BOOLEAN DEFAULT FALSE,
    min_salary DECIMAL(10, 2),
    max_salary DECIMAL(10, 2),
    status opportunity_status DEFAULT 'DRAFT',
    published_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 3. TABLAS DIAGNOSIS
-- ------------------------------------------------------------

-- Diagnosis tests
CREATE TABLE diagnosis_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type diagnosis_test_type NOT NULL,
    estimated_minutes INT DEFAULT 10,
    is_active BOOLEAN DEFAULT TRUE,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Diagnosis questions
CREATE TABLE diagnosis_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_id UUID NOT NULL REFERENCES diagnosis_tests(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    order_index INT DEFAULT 0,
    skill_category VARCHAR(100)
);

-- Diagnosis options
CREATE TABLE diagnosis_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID NOT NULL REFERENCES diagnosis_questions(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    score INT DEFAULT 0,
    order_index INT DEFAULT 0
);

-- Diagnosis results
CREATE TABLE diagnosis_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    test_id UUID NOT NULL REFERENCES diagnosis_tests(id) ON DELETE CASCADE,
    total_score INT NOT NULL,
    max_possible_score INT NOT NULL,
    percentage_score FLOAT NOT NULL,
    skill_gaps JSONB,
    recommended_paths JSONB,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Diagnosis responses
CREATE TABLE diagnosis_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    result_id UUID NOT NULL REFERENCES diagnosis_results(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES diagnosis_questions(id) ON DELETE CASCADE,
    selected_option_id UUID NOT NULL REFERENCES diagnosis_options(id) ON DELETE CASCADE,
    score INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 4. TABLAS LEARNING
-- ------------------------------------------------------------

-- Skills catalog
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    category skill_category NOT NULL,
    icon_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Learning paths
CREATE TABLE learning_paths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    thumbnail_url VARCHAR(500),
    difficulty path_difficulty DEFAULT 'BEGINNER',
    estimated_hours INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Learning modules
CREATE TABLE learning_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    thumbnail_url VARCHAR(500),
    estimated_minutes INT DEFAULT 30,
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    passing_score INT DEFAULT 70,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Module-Skills relationship
CREATE TABLE module_skills (
    module_id UUID NOT NULL REFERENCES learning_modules(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (module_id, skill_id)
);

-- Learning contents
CREATE TABLE learning_contents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID NOT NULL REFERENCES learning_modules(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type content_type NOT NULL,
    content_url VARCHAR(500) NOT NULL,
    duration_minutes INT DEFAULT 0,
    order_index INT DEFAULT 0,
    is_required BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Checkpoints (mini-challenges)
CREATE TABLE checkpoints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID NOT NULL REFERENCES learning_modules(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    order_index INT DEFAULT 0,
    after_content_index INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Module evaluations
CREATE TABLE module_evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID NOT NULL REFERENCES learning_modules(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    points INT DEFAULT 1,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User progress
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES learning_modules(id) ON DELETE CASCADE,
    status progress_status DEFAULT 'NOT_STARTED',
    completed_contents JSONB DEFAULT '[]',
    completed_checkpoints JSONB DEFAULT '[]',
    progress_percentage FLOAT DEFAULT 0,
    evaluation_score INT,
    evaluation_passed BOOLEAN DEFAULT FALSE,
    evaluation_attempts INT DEFAULT 0,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    UNIQUE(user_id, module_id)
);

-- Validated skills
CREATE TABLE validated_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES learning_modules(id) ON DELETE CASCADE,
    score_achieved INT NOT NULL,
    validated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, skill_id)
);

-- ------------------------------------------------------------
-- 5. TABLAS PROFESSIONAL PROFILE
-- ------------------------------------------------------------

-- Professional profiles
CREATE TABLE professional_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    headline VARCHAR(200),
    summary TEXT,
    pitch TEXT,
    location VARCHAR(150),
    years_experience INT,
    linkedin_url VARCHAR(500),
    portfolio_url VARCHAR(500),
    phone VARCHAR(50),
    visibility profile_visibility DEFAULT 'PUBLIC',
    declared_skills JSONB DEFAULT '[]',
    availability VARCHAR(50),
    preferred_work_type VARCHAR(50),
    completion_score FLOAT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Work experiences
CREATE TABLE work_experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES professional_profiles(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    achievements JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Education
CREATE TABLE education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES professional_profiles(id) ON DELETE CASCADE,
    institution_name VARCHAR(255) NOT NULL,
    degree VARCHAR(255) NOT NULL,
    field_of_study VARCHAR(255),
    level education_level DEFAULT 'OTHER',
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 6. TABLAS MARKETPLACE
-- ------------------------------------------------------------

-- Applications
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_opportunity_id UUID NOT NULL REFERENCES job_opportunities(id) ON DELETE CASCADE,
    status application_status DEFAULT 'PENDING',
    cover_letter TEXT,
    profile_snapshot JSONB,
    notes TEXT,
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    UNIQUE(user_id, job_opportunity_id)
);

-- Application feedback
CREATE TABLE application_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    recruiter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type feedback_type NOT NULL,
    message TEXT NOT NULL,
    skills_to_improve JSONB,
    is_visible_to_candidate BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Candidate shortlists
CREATE TABLE candidate_shortlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notes TEXT,
    tags JSONB,
    added_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    added_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(company_id, user_id)
);

-- ------------------------------------------------------------
-- 7. TABLAS NOTIFICATIONS
-- ------------------------------------------------------------

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    metadata JSONB,
    action_url VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    read_at TIMESTAMPTZ
);

CREATE INDEX idx_notifications_user_read ON notifications(user_id, read);

-- ------------------------------------------------------------
-- 8. INDEXES
-- ------------------------------------------------------------

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_companies_user ON companies(user_id);
CREATE INDEX idx_companies_status ON companies(company_status);
CREATE INDEX idx_job_opportunities_company ON job_opportunities(company_id);
CREATE INDEX idx_job_opportunities_status ON job_opportunities(status);
CREATE INDEX idx_diagnosis_results_user ON diagnosis_results(user_id);
CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_validated_skills_user ON validated_skills(user_id);
CREATE INDEX idx_professional_profiles_user ON professional_profiles(user_id);
CREATE INDEX idx_applications_user ON applications(user_id);
CREATE INDEX idx_applications_job ON applications(job_opportunity_id);
CREATE INDEX idx_applications_status ON applications(status);

-- ------------------------------------------------------------
-- 9. DATOS INICIALES - Tests de Diagnóstico
-- ------------------------------------------------------------

-- Test Digital
INSERT INTO diagnosis_tests (id, name, description, type, estimated_minutes, order_index) VALUES
('11111111-1111-1111-1111-111111111111', 'Evaluación de Habilidades Digitales', 'Evalúa tu nivel de competencia en herramientas digitales y tecnología', 'DIGITAL', 15, 1);

INSERT INTO diagnosis_questions (id, test_id, question, order_index, skill_category) VALUES
('21111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '¿Con qué frecuencia utilizas herramientas de colaboración en línea (Google Docs, Microsoft Teams, Slack)?', 1, 'Colaboración Digital'),
('21111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', '¿Qué tan cómodo te sientes aprendiendo nuevas aplicaciones o software?', 2, 'Adaptabilidad Tecnológica'),
('21111111-1111-1111-1111-111111111113', '11111111-1111-1111-1111-111111111111', '¿Puedes crear y gestionar hojas de cálculo con fórmulas básicas?', 3, 'Ofimática'),
('21111111-1111-1111-1111-111111111114', '11111111-1111-1111-1111-111111111111', '¿Sabes cómo proteger tu información personal en línea?', 4, 'Seguridad Digital'),
('21111111-1111-1111-1111-111111111115', '11111111-1111-1111-1111-111111111111', '¿Has trabajado con videoconferencias de manera profesional?', 5, 'Comunicación Digital');

INSERT INTO diagnosis_options (question_id, text, score, order_index) VALUES
('21111111-1111-1111-1111-111111111111', 'Nunca las he usado', 0, 1),
('21111111-1111-1111-1111-111111111111', 'Raramente (algunas veces al mes)', 1, 2),
('21111111-1111-1111-1111-111111111111', 'Frecuentemente (varias veces a la semana)', 2, 3),
('21111111-1111-1111-1111-111111111111', 'Diariamente y con fluidez', 3, 4),
('21111111-1111-1111-1111-111111111112', 'Me resulta muy difícil', 0, 1),
('21111111-1111-1111-1111-111111111112', 'Necesito mucha ayuda', 1, 2),
('21111111-1111-1111-1111-111111111112', 'Puedo aprenderlas con algo de práctica', 2, 3),
('21111111-1111-1111-1111-111111111112', 'Aprendo rápidamente nuevas herramientas', 3, 4),
('21111111-1111-1111-1111-111111111113', 'No sé usar hojas de cálculo', 0, 1),
('21111111-1111-1111-1111-111111111113', 'Solo tareas muy básicas', 1, 2),
('21111111-1111-1111-1111-111111111113', 'Puedo usar fórmulas básicas', 2, 3),
('21111111-1111-1111-1111-111111111113', 'Domino fórmulas avanzadas y tablas dinámicas', 3, 4),
('21111111-1111-1111-1111-111111111114', 'No conozco medidas de seguridad', 0, 1),
('21111111-1111-1111-1111-111111111114', 'Conozco algunas básicas', 1, 2),
('21111111-1111-1111-1111-111111111114', 'Aplico buenas prácticas regularmente', 2, 3),
('21111111-1111-1111-1111-111111111114', 'Soy muy consciente y proactivo en seguridad', 3, 4),
('21111111-1111-1111-1111-111111111115', 'Nunca he usado videoconferencias', 0, 1),
('21111111-1111-1111-1111-111111111115', 'Las uso pero con dificultad', 1, 2),
('21111111-1111-1111-1111-111111111115', 'Las uso con comodidad', 2, 3),
('21111111-1111-1111-1111-111111111115', 'Puedo organizar y moderar reuniones virtuales', 3, 4);

-- Test Socioemocional
INSERT INTO diagnosis_tests (id, name, description, type, estimated_minutes, order_index) VALUES
('11111111-1111-1111-1111-111111111112', 'Evaluación de Habilidades Socioemocionales', 'Evalúa tus competencias de comunicación, trabajo en equipo y liderazgo', 'SOCIOEMOTIONAL', 10, 2);

INSERT INTO diagnosis_questions (id, test_id, question, order_index, skill_category) VALUES
('22111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111112', '¿Cómo manejas los conflictos en un equipo de trabajo?', 1, 'Resolución de Conflictos'),
('22111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111112', '¿Te resulta fácil expresar tus ideas en reuniones?', 2, 'Comunicación'),
('22111111-1111-1111-1111-111111111113', '11111111-1111-1111-1111-111111111112', '¿Cómo reaccionas ante cambios inesperados en el trabajo?', 3, 'Adaptabilidad'),
('22111111-1111-1111-1111-111111111114', '11111111-1111-1111-1111-111111111112', '¿Puedes dar y recibir feedback constructivo?', 4, 'Feedback');

INSERT INTO diagnosis_options (question_id, text, score, order_index) VALUES
('22111111-1111-1111-1111-111111111111', 'Prefiero evitar los conflictos', 0, 1),
('22111111-1111-1111-1111-111111111111', 'Me cuesta pero intento resolverlos', 1, 2),
('22111111-1111-1111-1111-111111111111', 'Busco soluciones que beneficien a todos', 2, 3),
('22111111-1111-1111-1111-111111111111', 'Soy mediador natural en situaciones tensas', 3, 4),
('22111111-1111-1111-1111-111111111112', 'Me cuesta mucho hablar en grupo', 0, 1),
('22111111-1111-1111-1111-111111111112', 'Participo solo cuando me preguntan', 1, 2),
('22111111-1111-1111-1111-111111111112', 'Comparto mis ideas regularmente', 2, 3),
('22111111-1111-1111-1111-111111111112', 'Lidero discusiones con confianza', 3, 4),
('22111111-1111-1111-1111-111111111113', 'Me estreso mucho ante los cambios', 0, 1),
('22111111-1111-1111-1111-111111111113', 'Me cuesta adaptarme pero lo logro', 1, 2),
('22111111-1111-1111-1111-111111111113', 'Me adapto con relativa facilidad', 2, 3),
('22111111-1111-1111-1111-111111111113', 'Veo los cambios como oportunidades', 3, 4),
('22111111-1111-1111-1111-111111111114', 'Me resulta incómodo el feedback', 0, 1),
('22111111-1111-1111-1111-111111111114', 'Acepto feedback pero me cuesta darlo', 1, 2),
('22111111-1111-1111-1111-111111111114', 'Doy y recibo feedback constructivamente', 2, 3),
('22111111-1111-1111-1111-111111111114', 'Promuevo una cultura de feedback continuo', 3, 4);

-- ------------------------------------------------------------
-- 10. DATOS INICIALES - Skills
-- ------------------------------------------------------------

INSERT INTO skills (id, name, description, category) VALUES
('31111111-1111-1111-1111-111111111111', 'Microsoft Excel', 'Dominio de hojas de cálculo, fórmulas y análisis de datos', 'DIGITAL'),
('31111111-1111-1111-1111-111111111112', 'Google Workspace', 'Uso de herramientas colaborativas de Google', 'DIGITAL'),
('31111111-1111-1111-1111-111111111113', 'Comunicación Efectiva', 'Habilidad para comunicar ideas clara y persuasivamente', 'SOCIOEMOTIONAL'),
('31111111-1111-1111-1111-111111111114', 'Trabajo en Equipo', 'Capacidad de colaborar efectivamente con otros', 'SOCIOEMOTIONAL'),
('31111111-1111-1111-1111-111111111115', 'Liderazgo', 'Habilidad para guiar y motivar equipos', 'LEADERSHIP'),
('31111111-1111-1111-1111-111111111116', 'Resolución de Problemas', 'Capacidad analítica para resolver desafíos', 'COGNITIVE'),
('31111111-1111-1111-1111-111111111117', 'Gestión del Tiempo', 'Organización y priorización efectiva de tareas', 'COGNITIVE'),
('31111111-1111-1111-1111-111111111118', 'Adaptabilidad', 'Flexibilidad ante cambios y nuevas situaciones', 'SOCIOEMOTIONAL');

-- ------------------------------------------------------------
-- 11. DATOS INICIALES - Learning Paths y Modules
-- ------------------------------------------------------------

INSERT INTO learning_paths (id, name, description, difficulty, estimated_hours, order_index) VALUES
('41111111-1111-1111-1111-111111111111', 'Fundamentos Digitales', 'Aprende las herramientas digitales esenciales para el trabajo moderno', 'BEGINNER', 10, 1),
('41111111-1111-1111-1111-111111111112', 'Habilidades de Liderazgo', 'Desarrolla competencias de liderazgo y gestión de equipos', 'INTERMEDIATE', 15, 2),
('41111111-1111-1111-1111-111111111113', 'Productividad Avanzada', 'Maximiza tu eficiencia con técnicas y herramientas avanzadas', 'ADVANCED', 12, 3);

INSERT INTO learning_modules (id, path_id, name, description, estimated_minutes, order_index, passing_score) VALUES
('51111111-1111-1111-1111-111111111111', '41111111-1111-1111-1111-111111111111', 'Introducción a Excel', 'Aprende los fundamentos de las hojas de cálculo', 45, 1, 70),
('51111111-1111-1111-1111-111111111112', '41111111-1111-1111-1111-111111111111', 'Colaboración con Google Workspace', 'Domina las herramientas de colaboración de Google', 60, 2, 70),
('51111111-1111-1111-1111-111111111113', '41111111-1111-1111-1111-111111111112', 'Comunicación Asertiva', 'Técnicas para comunicarte de manera efectiva', 30, 1, 70),
('51111111-1111-1111-1111-111111111114', '41111111-1111-1111-1111-111111111112', 'Gestión de Equipos', 'Aprende a liderar y motivar equipos de trabajo', 45, 2, 70);

-- Link modules to skills
INSERT INTO module_skills (module_id, skill_id) VALUES
('51111111-1111-1111-1111-111111111111', '31111111-1111-1111-1111-111111111111'),
('51111111-1111-1111-1111-111111111112', '31111111-1111-1111-1111-111111111112'),
('51111111-1111-1111-1111-111111111113', '31111111-1111-1111-1111-111111111113'),
('51111111-1111-1111-1111-111111111114', '31111111-1111-1111-1111-111111111114'),
('51111111-1111-1111-1111-111111111114', '31111111-1111-1111-1111-111111111115');

-- Sample contents
INSERT INTO learning_contents (module_id, title, description, type, content_url, duration_minutes, order_index) VALUES
('51111111-1111-1111-1111-111111111111', 'Introducción a Excel - Video', 'Video introductorio sobre Excel', 'VIDEO', 'https://example.com/video1', 15, 1),
('51111111-1111-1111-1111-111111111111', 'Fórmulas Básicas', 'Guía de fórmulas esenciales', 'PDF', 'https://example.com/pdf1', 10, 2),
('51111111-1111-1111-1111-111111111112', 'Tour por Google Workspace', 'Conoce todas las herramientas', 'VIDEO', 'https://example.com/video2', 20, 1);

-- Sample checkpoints
INSERT INTO checkpoints (module_id, title, question, options, order_index, after_content_index) VALUES
('51111111-1111-1111-1111-111111111111', 'Verificación de conceptos', '¿Cuál es la función para sumar en Excel?', '[{"id": "a", "text": "=SUMAR()", "isCorrect": false}, {"id": "b", "text": "=SUM()", "isCorrect": true}, {"id": "c", "text": "=ADD()", "isCorrect": false}]', 1, 1);

-- Sample evaluations
INSERT INTO module_evaluations (module_id, question, options, points, order_index) VALUES
('51111111-1111-1111-1111-111111111111', '¿Qué función usarías para calcular el promedio?', '[{"id": "a", "text": "=AVERAGE()", "isCorrect": true}, {"id": "b", "text": "=MEAN()", "isCorrect": false}, {"id": "c", "text": "=AVG()", "isCorrect": false}]', 1, 1),
('51111111-1111-1111-1111-111111111111', '¿Cómo se fija una celda en una fórmula?', '[{"id": "a", "text": "Con el símbolo #", "isCorrect": false}, {"id": "b", "text": "Con el símbolo $", "isCorrect": true}, {"id": "c", "text": "Con el símbolo @", "isCorrect": false}]', 1, 2);

-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================
