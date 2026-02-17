const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ============ DEPARTMENTS ============

// Get all departments
router.get('/departments', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM departments ORDER BY name');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching departments:', err);
        res.status(500).json({ error: 'Failed to fetch departments' });
    }
});

// Create department
router.post('/departments', async (req, res) => {
    const { name, code, description } = req.body;
    
    if (!name || !code) {
        return res.status(400).json({ error: 'Name and code are required' });
    }

    try {
        const result = await db.query(
            'INSERT INTO departments (name, code, description) VALUES ($1, $2, $3) RETURNING *',
            [name, code, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating department:', err);
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Department code already exists' });
        }
        res.status(500).json({ error: 'Failed to create department' });
    }
});

// Update department
router.put('/departments/:id', async (req, res) => {
    const { id } = req.params;
    const { name, code, description } = req.body;

    try {
        const result = await db.query(
            'UPDATE departments SET name = COALESCE($1, name), code = COALESCE($2, code), description = COALESCE($3, description) WHERE id = $4 RETURNING *',
            [name, code, description, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Department not found' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating department:', err);
        res.status(500).json({ error: 'Failed to update department' });
    }
});

// Delete department
router.delete('/departments/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query('DELETE FROM departments WHERE id = $1 RETURNING *', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Department not found' });
        }
        
        res.json({ message: 'Department deleted successfully', department: result.rows[0] });
    } catch (err) {
        console.error('Error deleting department:', err);
        res.status(500).json({ error: 'Failed to delete department' });
    }
});

// ============ COURSES ============

// Get all courses
router.get('/courses', async (req, res) => {
    const { department_id } = req.query;
    
    try {
        let query = 'SELECT c.*, d.name as department_name FROM courses c LEFT JOIN departments d ON c.department_id = d.id';
        let params = [];
        
        if (department_id) {
            query += ' WHERE c.department_id = $1';
            params.push(department_id);
        }
        
        query += ' ORDER BY c.code';
        
        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching courses:', err);
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
});

// Create course
router.post('/courses', async (req, res) => {
    const { code, name, theory_hours, lab_hours, tutorial_hours, credits, department_id, requires_lab, min_room_capacity } = req.body;
    
    if (!code || !name || !credits || !department_id) {
        return res.status(400).json({ error: 'Code, name, credits, and department_id are required' });
    }

    try {
        const result = await db.query(
            'INSERT INTO courses (code, name, theory_hours, lab_hours, tutorial_hours, credits, department_id, requires_lab, min_room_capacity) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [code, name, theory_hours || 0, lab_hours || 0, tutorial_hours || 0, credits, department_id, requires_lab || false, min_room_capacity]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating course:', err);
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Course code already exists' });
        }
        res.status(500).json({ error: 'Failed to create course' });
    }
});

// Update course
router.put('/courses/:id', async (req, res) => {
    const { id } = req.params;
    const { code, name, theory_hours, lab_hours, tutorial_hours, credits, department_id, requires_lab, min_room_capacity } = req.body;

    try {
        const result = await db.query(
            `UPDATE courses SET 
                code = COALESCE($1, code), 
                name = COALESCE($2, name), 
                theory_hours = COALESCE($3, theory_hours), 
                lab_hours = COALESCE($4, lab_hours), 
                tutorial_hours = COALESCE($5, tutorial_hours), 
                credits = COALESCE($6, credits), 
                department_id = COALESCE($7, department_id),
                requires_lab = COALESCE($8, requires_lab),
                min_room_capacity = COALESCE($9, min_room_capacity)
            WHERE id = $10 RETURNING *`,
            [code, name, theory_hours, lab_hours, tutorial_hours, credits, department_id, requires_lab, min_room_capacity, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating course:', err);
        res.status(500).json({ error: 'Failed to update course' });
    }
});

// Delete course
router.delete('/courses/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query('DELETE FROM courses WHERE id = $1 RETURNING *', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }
        
        res.json({ message: 'Course deleted successfully', course: result.rows[0] });
    } catch (err) {
        console.error('Error deleting course:', err);
        res.status(500).json({ error: 'Failed to delete course' });
    }
});

// ============ SEMESTERS ============

// Get all semesters
router.get('/semesters', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM semesters ORDER BY year DESC, semester_number DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching semesters:', err);
        res.status(500).json({ error: 'Failed to fetch semesters' });
    }
});

// Create semester
router.post('/semesters', async (req, res) => {
    const { year, semester_number, start_date, end_date } = req.body;
    
    if (!year || !semester_number || !start_date || !end_date) {
        return res.status(400).json({ error: 'Year, semester_number, start_date, and end_date are required' });
    }

    try {
        const result = await db.query(
            'INSERT INTO semesters (year, semester_number, start_date, end_date) VALUES ($1, $2, $3, $4) RETURNING *',
            [year, semester_number, start_date, end_date]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating semester:', err);
        res.status(500).json({ error: 'Failed to create semester' });
    }
});

// Update semester
router.put('/semesters/:id', async (req, res) => {
    const { id } = req.params;
    const { year, semester_number, start_date, end_date } = req.body;

    try {
        const result = await db.query(
            `UPDATE semesters SET 
                year = COALESCE($1, year), 
                semester_number = COALESCE($2, semester_number), 
                start_date = COALESCE($3, start_date), 
                end_date = COALESCE($4, end_date)
            WHERE id = $5 RETURNING *`,
            [year, semester_number, start_date, end_date, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Semester not found' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating semester:', err);
        res.status(500).json({ error: 'Failed to update semester' });
    }
});

// Delete semester
router.delete('/semesters/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query('DELETE FROM semesters WHERE id = $1 RETURNING *', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Semester not found' });
        }
        
        res.json({ message: 'Semester deleted successfully', semester: result.rows[0] });
    } catch (err) {
        console.error('Error deleting semester:', err);
        res.status(500).json({ error: 'Failed to delete semester' });
    }
});

// ============ SECTIONS ============

// Get all sections
router.get('/sections', async (req, res) => {
    const { department_id, semester_id } = req.query;
    
    try {
        let query = 'SELECT s.*, d.name as department_name FROM sections s LEFT JOIN departments d ON s.department_id = d.id WHERE 1=1';
        let params = [];
        let paramCount = 1;
        
        if (department_id) {
            query += ` AND s.department_id = $${paramCount}`;
            params.push(department_id);
            paramCount++;
        }
        
        if (semester_id) {
            query += ` AND s.semester_id = $${paramCount}`;
            params.push(semester_id);
            paramCount++;
        }
        
        query += ' ORDER BY s.name';
        
        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching sections:', err);
        res.status(500).json({ error: 'Failed to fetch sections' });
    }
});

// Create section
router.post('/sections', async (req, res) => {
    const { department_id, name, batch_year_start, batch_year_end, student_count, semester_id } = req.body;
    
    if (!department_id || !name || !batch_year_start || !batch_year_end || !student_count) {
        return res.status(400).json({ error: 'Department_id, name, batch years, and student_count are required' });
    }

    try {
        const result = await db.query(
            'INSERT INTO sections (department_id, name, batch_year_start, batch_year_end, student_count, semester_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [department_id, name, batch_year_start, batch_year_end, student_count, semester_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating section:', err);
        res.status(500).json({ error: 'Failed to create section' });
    }
});

// Update section
router.put('/sections/:id', async (req, res) => {
    const { id } = req.params;
    const { department_id, name, batch_year_start, batch_year_end, student_count, semester_id } = req.body;

    try {
        const result = await db.query(
            `UPDATE sections SET 
                department_id = COALESCE($1, department_id), 
                name = COALESCE($2, name), 
                batch_year_start = COALESCE($3, batch_year_start), 
                batch_year_end = COALESCE($4, batch_year_end), 
                student_count = COALESCE($5, student_count),
                semester_id = COALESCE($6, semester_id)
            WHERE id = $7 RETURNING *`,
            [department_id, name, batch_year_start, batch_year_end, student_count, semester_id, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Section not found' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating section:', err);
        res.status(500).json({ error: 'Failed to update section' });
    }
});

// Delete section
router.delete('/sections/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query('DELETE FROM sections WHERE id = $1 RETURNING *', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Section not found' });
        }
        
        res.json({ message: 'Section deleted successfully', section: result.rows[0] });
    } catch (err) {
        console.error('Error deleting section:', err);
        res.status(500).json({ error: 'Failed to delete section' });
    }
});

module.exports = router;
