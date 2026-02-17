require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function seed() {
    console.log('🌱 Starting Database Seed...');

    try {
        // --- USERS ---
        console.log('Creating Users...');
        const passwordHash = await bcrypt.hash('password123', 10);
        const adminHash = await bcrypt.hash('admin123', 10);

        // Faculty
        await pool.query(`
            INSERT INTO users (username, password_hash, role, full_name)
            VALUES 
            ('sarah', $1, 'faculty', 'Dr. Sarah Thorne'),
            ('alan', $1, 'faculty', 'Prof. Alan Turing')
            ON CONFLICT (username) DO NOTHING;
        `, [passwordHash]);

        // Student
        await pool.query(`
            INSERT INTO users (username, password_hash, role, full_name)
            VALUES 
            ('student1', $1, 'student', 'John Doe'),
            ('student2', $1, 'student', 'Jane Smith')
            ON CONFLICT (username) DO NOTHING;
        `, [passwordHash]);

        // Admin
        await pool.query(`
            INSERT INTO users (username, password_hash, role, full_name)
            VALUES 
            ('admin', $1, 'admin', 'System Admin')
            ON CONFLICT (username) DO NOTHING;
        `, [adminHash]);

        // --- DEPARTMENTS ---
        console.log('Creating Departments...');
        const depts = await pool.query(`
            INSERT INTO departments (name, code, description)
            VALUES 
            ('Computer Science', 'CS', 'Department of Computer Science & Engineering'),
            ('Electrical Engineering', 'EE', 'Department of Electrical Engineering'),
            ('Mechanical Engineering', 'ME', 'Department of Mechanical Engineering')
            ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name RETURNING id, code;
        `);

        const csId = depts.rows.find(d => d.code === 'CS')?.id || (await pool.query("SELECT id FROM departments WHERE code = 'CS'")).rows[0].id;

        // --- SEMESTERS ---
        console.log('Creating Semesters...');
        const sems = await pool.query(`
            INSERT INTO semesters (year, semester_number, start_date, end_date)
            VALUES 
            (2025, 1, '2025-08-01', '2025-12-15'),
            (2025, 2, '2026-01-10', '2026-05-20')
            RETURNING id, year, semester_number;
        `);

        const sem1Id = sems.rows.find(s => s.semester_number === 1)?.id;

        // --- COURSES ---
        console.log('Creating Courses...');
        if (csId) {
            await pool.query(`
                INSERT INTO courses (code, name, credits, department_id, theory_hours, lab_hours)
                VALUES 
                ('CS101', 'Data Structures', 4, $1, 3, 2),
                ('CS102', 'Algorithms', 4, $1, 3, 2),
                ('CS103', 'Database Systems', 3, $1, 3, 0),
                ('CS104', 'Operating Systems', 3, $1, 3, 0),
                ('CS105', 'Computer Networks', 3, $1, 3, 0)
                ON CONFLICT (code) DO NOTHING;
            `, [csId]);
        }

        // --- SECTIONS ---
        console.log('Creating Sections...');
        if (csId && sem1Id) {
            await pool.query(`
                INSERT INTO sections (department_id, name, batch_year_start, batch_year_end, student_count, semester_id)
                VALUES 
                ($1, 'Section A', 2023, 2027, 60, $2),
                ($1, 'Section B', 2023, 2027, 55, $2)
                ON CONFLICT DO NOTHING;
            `, [csId, sem1Id]);
        }

        console.log('✅ Database Seeding Completed!');
    } catch (err) {
        console.error('❌ Error seeding database:', err);
    } finally {
        pool.end();
    }
}

seed();
