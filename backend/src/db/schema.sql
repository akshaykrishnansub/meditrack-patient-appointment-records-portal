create TYPE user_role AS ENUM(
'PATIENT',
'DOCTOR',
'ADMIN'
);

create table users(
id uuid primary key default gen_random_uuid(),
name varchar(255) not null,
email varchar(255) unique not null,
password_hash TEXT not null,
role user_role not null
);

create table appointment(
id uuid primary key default gen_random_uuid(),
patientId uuid references users(id),
doctorId uuid references users(id),
datetime timestamp not null,
status varchar(50) not null
);

drop table appointment;

create table medicalrecord(
id uuid primary key default gen_random_uuid(),
userId uuid references users(id),
filePath text not null,
uploadedAt timestamp default current_timestamp not null,
description text not null
);

create table message(
id uuid primary key default gen_random_uuid(),
senderId uuid references users(id),
receiverId uuid references users(id),
content text not null,
sentAt timestamp default current_timestamp not null
);