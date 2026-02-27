CREATE TABLE hospitals (
	id SERIAL NOT NULL, 
	hospital_id VARCHAR(50) NOT NULL, 
	name VARCHAR(255) NOT NULL, 
	email VARCHAR(255) NOT NULL, 
	address TEXT, 
	is_active BOOLEAN, 
	created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(), 
	PRIMARY KEY (id), 
	UNIQUE (hospital_id), 
	UNIQUE (email)
);

CREATE TABLE patient_master (
	id SERIAL NOT NULL, 
	abha_id VARCHAR(12) NOT NULL, 
	aadhaar VARCHAR(12), 
	name VARCHAR(255) NOT NULL, 
	age INTEGER, 
	gender VARCHAR(10), 
	blood_group VARCHAR(5), 
	allergies TEXT, 
	chronic_conditions TEXT, 
	emergency_contact VARCHAR(255), 
	emergency_phone VARCHAR(15), 
	current_medicines TEXT, 
	risk_level VARCHAR(10) CHECK (risk_level IN ('Low','Medium','High')), 
	created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(), 
	PRIMARY KEY (id), 
	UNIQUE (abha_id), 
	UNIQUE (aadhaar)
);

CREATE TABLE registered_patients (
	id SERIAL NOT NULL, 
	abha_id VARCHAR(12) NOT NULL, 
	aadhaar_id VARCHAR(12) NOT NULL, 
	name VARCHAR(100) NOT NULL, 
	phone VARCHAR(15) NOT NULL, 
	blood_group VARCHAR(5), 
	allergies TEXT, 
	medical_notes TEXT, 
	emergency_contact VARCHAR(15), 
	password_hash TEXT NOT NULL, 
	created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(), 
	PRIMARY KEY (id), 
	UNIQUE (aadhaar_id)
);

CREATE TABLE users (
	id SERIAL NOT NULL, 
	hospital_id INTEGER, 
	username VARCHAR(100) NOT NULL, 
	email VARCHAR(255), 
	password_hash TEXT NOT NULL, 
	role VARCHAR(20) NOT NULL CHECK (role IN ('admin','doctor','staff')), 
	full_name VARCHAR(255), 
	status BOOLEAN, 
	last_login TIMESTAMP WITHOUT TIME ZONE, 
	created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(), 
	PRIMARY KEY (id), 
	FOREIGN KEY(hospital_id) REFERENCES hospitals (id) ON DELETE CASCADE, 
	UNIQUE (username), 
	UNIQUE (email)
);

CREATE TABLE audit_logs (
	id SERIAL NOT NULL, 
	user_id INTEGER, 
	action TEXT NOT NULL, 
	details JSONB, 
	ip_address VARCHAR(45), 
	timestamp TIMESTAMP WITHOUT TIME ZONE DEFAULT now(), 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE SET NULL
);

CREATE TABLE doctor_suggestions (
	id SERIAL NOT NULL, 
	doctor_id INTEGER, 
	patient_id INTEGER, 
	notes TEXT NOT NULL, 
	risk_level VARCHAR(10) CHECK (risk_level IN ('Low','Medium','High')), 
	followup_date DATE, 
	created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(), 
	PRIMARY KEY (id), 
	FOREIGN KEY(doctor_id) REFERENCES users (id) ON DELETE SET NULL, 
	FOREIGN KEY(patient_id) REFERENCES patient_master (id) ON DELETE CASCADE
);

CREATE TABLE patient_reports (
	id SERIAL NOT NULL, 
	patient_id INTEGER, 
	category VARCHAR(50) NOT NULL CHECK (category IN ('Lab Report','Radiology','Prescription','Emergency','Nursing Report','Daily Monitoring','Emergency Observation')), 
	file_name VARCHAR(255) NOT NULL, 
	file_path TEXT NOT NULL, 
	uploaded_by INTEGER, 
	upload_date TIMESTAMP WITHOUT TIME ZONE DEFAULT now(), 
	PRIMARY KEY (id), 
	FOREIGN KEY(patient_id) REFERENCES patient_master (id) ON DELETE CASCADE, 
	FOREIGN KEY(uploaded_by) REFERENCES users (id) ON DELETE SET NULL
);

CREATE TABLE patient_vitals (
	id SERIAL NOT NULL, 
	patient_id INTEGER, 
	systolic INTEGER, 
	diastolic INTEGER, 
	sugar_fasting INTEGER, 
	sugar_random INTEGER, 
	temperature INTEGER, 
	recorded_by INTEGER, 
	created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(), 
	PRIMARY KEY (id), 
	FOREIGN KEY(patient_id) REFERENCES patient_master (id) ON DELETE CASCADE, 
	FOREIGN KEY(recorded_by) REFERENCES users (id) ON DELETE SET NULL
);

CREATE TABLE prescriptions (
	id SERIAL NOT NULL, 
	doctor_id INTEGER, 
	patient_id INTEGER, 
	medicine_name VARCHAR(255) NOT NULL, 
	dosage VARCHAR(100), 
	frequency VARCHAR(100), 
	duration VARCHAR(100), 
	created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(), 
	PRIMARY KEY (id), 
	FOREIGN KEY(doctor_id) REFERENCES users (id) ON DELETE SET NULL, 
	FOREIGN KEY(patient_id) REFERENCES patient_master (id) ON DELETE CASCADE
);

