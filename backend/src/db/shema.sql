PRAGMA foreign_keys = ON;

-- ===============================
-- DEPARTEMENTS
-- ===============================
CREATE TABLE IF NOT EXISTS departements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  departement_nom TEXT NOT NULL CHECK (
    departement_nom IN ('حفظ الأرشيف','الموارد البشرية','التجهيز و نظم المعلومات')
  )
);

-- ===============================
-- JUDICIAL ENTITIES
-- ===============================
CREATE TABLE IF NOT EXISTS judicial_entities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom_ville TEXT NOT NULL,
  entity_type TEXT NOT NULL CHECK (
    entity_type IN ('المحكمة الابتدائية','المركز القضائي','محكمة الاستئناف')
  )
);

-- ===============================
-- COMPANY EMPLOYEES
-- ===============================
CREATE TABLE IF NOT EXISTS company_employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employee_id INTEGER UNIQUE NOT NULL,
  cin TEXT UNIQUE NOT NULL,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  telephone TEXT NOT NULL,
  cadre_actuel TEXT NOT NULL,
  nom_ville TEXT NOT NULL,
  departement_id INTEGER NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','non active')),
  hire_date TEXT NOT NULL,
  FOREIGN KEY (departement_id)
    REFERENCES departements(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

-- ===============================
-- JUDICIAL EMPLOYEES
-- ===============================
CREATE TABLE IF NOT EXISTS judicial_employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employee_id INTEGER UNIQUE NOT NULL,
  cin TEXT UNIQUE NOT NULL,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  telephone TEXT NOT NULL,
  cadre_actuel TEXT NOT NULL,
  judicial_entity_id INTEGER NOT NULL,
  department TEXT NOT NULL CHECK (department IN ('النيابة العامة','رئاسة')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active','non active')),
  hire_date TEXT NOT NULL,
  FOREIGN KEY (judicial_entity_id)
    REFERENCES judicial_entities(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

-- ===============================
-- ANNUAL ABSENCE IMPORTS
-- ===============================
CREATE TABLE IF NOT EXISTS annual_absence_imports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  year INTEGER NOT NULL,
  file_name TEXT NOT NULL,
  uploaded_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- ANNUAL ABSENCES
-- ===============================
CREATE TABLE IF NOT EXISTS annual_absences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  import_id INTEGER NOT NULL,
  year INTEGER NOT NULL,
  employee_id INTEGER NOT NULL,
  cin TEXT,
  cadre_actuel TEXT,
  nom TEXT,
  prenom TEXT,
  fullName TEXT,
  departement TEXT,
  situation TEXT,
  FOREIGN KEY (import_id)
    REFERENCES annual_absence_imports(id)
    ON DELETE CASCADE,
  UNIQUE (employee_id, year)
);

-- ===============================
-- CERTIFICATES (company + judicial)
-- ===============================
CREATE TABLE IF NOT EXISTS certificates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  certificate_type TEXT CHECK (
    certificate_type IN ('attestation de travaille','Gestion des licences administratives')
  ),
  file_name TEXT NOT NULL,
  uploaded_at TEXT DEFAULT CURRENT_TIMESTAMP,

  employee_id INTEGER NOT NULL,
  employee_scope TEXT NOT NULL CHECK (employee_scope IN ('company','judicial'))
);


-- =====================================================
-- INSERT INITIAL DATA (safe to run multiple times)
-- =====================================================

-- Keep IDs stable so departement_id references are correct
INSERT OR IGNORE INTO departements (id, departement_nom) VALUES
(1,'حفظ الأرشيف'),
(2,'الموارد البشرية'),
(3,'التجهيز و نظم المعلومات');

-- Insert company employees (employee_id is UNIQUE so OR IGNORE works)
INSERT OR IGNORE INTO company_employees
(employee_id, cin, nom, prenom, telephone, cadre_actuel, nom_ville, departement_id, status, hire_date)
VALUES
(1001, 'AA111111', 'العمراوي', 'محمد', '+212 612345678', 'متصرف إداري', 'Laayoune', 2, 'active', '2018-03-12'),
(1002, 'BB222222', 'الزهراوي', 'فاطمة', '+212 622345678', 'تقني', 'Laayoune', 3, 'active', '2019-07-01'),
(1003, 'CC333333', 'بن علي', 'يوسف', '+212 633345678', 'محرر', 'Laayoune', 1, 'active', '2020-01-15'),
(1004, 'DD444444', 'الإدريسي', 'سلمى', '+212 644345678', 'متصرف مساعد', 'Laayoune', 2, 'active', '2017-09-20'),
(1005, 'EE555555', 'العلوي', 'حسن', '+212 655345678', 'مهندس دولة', 'Laayoune', 3, 'active', '2016-05-10'),
(1006, 'FF666666', 'السباعي', 'خديجة', '+212 666345678', 'تقني متخصص', 'Laayoune', 1, 'active', '2021-02-03'),
(1007, 'GG777777', 'الشرايبي', 'عمر', '+212 677345678', 'متصرف إداري', 'Laayoune', 2, 'non active', '2015-11-30'),
(1008, 'HH888888', 'السعيدي', 'نورة', '+212 688345678', 'محررة', 'Laayoune', 1, 'active', '2019-04-18'),
(1009, 'II999999', 'الوزاني', 'ياسين', '+212 699345678', 'تقني', 'Laayoune', 3, 'active', '2022-06-07'),
(1010, 'JJ101010', 'اللحلو', 'إيمان', '+212 611223344', 'متصرف مساعد', 'Laayoune', 2, 'active', '2023-01-09');

-- Keep IDs stable for FK references in judicial_employees
INSERT OR IGNORE INTO judicial_entities (id, nom_ville, entity_type) VALUES
(1,'Laayoune', 'محكمة الاستئناف'),
(2,'Laayoune', 'المحكمة الابتدائية'),
(3,'Smara',   'المحكمة الابتدائية'),
(4,'Boujdour','المحكمة الابتدائية'),
(5,'Dakhla',  'المحكمة الابتدائية'),
(6,'Tarfaya', 'المركز القضائي');

INSERT OR IGNORE INTO judicial_employees
(employee_id, cin, nom, prenom, telephone, cadre_actuel, judicial_entity_id, department, status, hire_date)
VALUES
(3001, 'JJ300001', 'العلمي', 'أحمد', '+212 612000001', 'كاتب ضبط', 1, 'النيابة العامة', 'active', '2016-02-14'),
(3002, 'JJ300002', 'الرحماني', 'خديجة', '+212 612000002', 'محررة قضائية', 1, 'رئاسة', 'active', '2018-10-03'),
(3003, 'JJ300003', 'الإدريسي', 'عمر', '+212 612000003', 'كاتب ضبط رئيسي', 2, 'النيابة العامة', 'active', '2015-07-19'),
(3004, 'JJ300004', 'آيت لحسن', 'سلمى', '+212 612000004', 'محررة', 2, 'رئاسة', 'active', '2019-01-25'),
(3005, 'JJ300005', 'بنقاسم', 'يوسف', '+212 612000005', 'كاتب ضبط', 3, 'النيابة العامة', 'active', '2017-06-11'),
(3006, 'JJ300006', 'الفاسي', 'نادية', '+212 612000006', 'محررة قضائية', 4, 'رئاسة', 'active', '2020-09-01'),
(3007, 'JJ300007', 'الشفيق', 'حمزة', '+212 612000007', 'كاتب ضبط', 5, 'النيابة العامة', 'active', '2014-12-05'),
(3008, 'JJ300008', 'بولحسن', 'إيمان', '+212 612000008', 'محررة', 6, 'رئاسة', 'active', '2019-04-17'),
(3009, 'JJ300009', 'الراشدي', 'عادل', '+212 612000009', 'كاتب ضبط', 2, 'النيابة العامة', 'active', '2021-08-22'),
(3010, 'JJ300010', 'الخطيب', 'سهام', '+212 612000010', 'محررة قضائية', 5, 'رئاسة', 'active', '2018-03-30');
