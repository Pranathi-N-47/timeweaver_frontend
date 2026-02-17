/**
 * Seed Data for LocalStorage
 * Run this to populate the frontend with sample data if empty.
 */

const sampleFaculty = [
    { id: 1, name: "Dr. Sarah Thorne", dept: "CS", role: "Professor", subject: "Networks", current: 16, max: 18 },
    { id: 2, name: "Prof. Alan Turing", dept: "CS", role: "Professor", subject: "Algorithms", current: 12, max: 15 },
    { id: 3, name: "Dr. Grace Hopper", dept: "CS", role: "Associate Prof", subject: "Compilers", current: 14, max: 18 },
    { id: 4, name: "Prof. Richard Feynman", dept: "PH", role: "Professor", subject: "Physics", current: 10, max: 12 },
    { id: 5, name: "Dr. Marie Curie", dept: "CH", role: "Professor", subject: "Chemistry", current: 18, max: 18 },
    { id: 6, name: "Dr. Rosalind Franklin", dept: "BIO", role: "Associate Prof", subject: "Genetics", current: 15, max: 16 },
    { id: 7, name: "Prof. Stephen Hawking", dept: "PH", role: "Professor", subject: "Cosmology", current: 8, max: 10 },
    { id: 8, name: "Dr. Katherine Johnson", dept: "MATH", role: "Senior Lecturer", subject: "Calculus", current: 20, max: 20 },
    { id: 9, name: "Prof. John von Neumann", dept: "CS", role: "Professor", subject: "Architecture", current: 17, max: 18 },
    { id: 10, name: "Dr. Ada Lovelace", dept: "CS", role: "Lecturer", subject: "Programming", current: 14, max: 16 },
    { id: 11, name: "Prof. Nikola Tesla", dept: "EE", role: "Professor", subject: "Circuits", current: 11, max: 14 },
    { id: 12, name: "Dr. Hedy Lamarr", dept: "EE", role: "Associate Prof", subject: "Communications", current: 9, max: 12 }
];

const sampleStudents = [
    { id: 101, name: "John Doe", roll: "CS21001", batch: "2021-25", dept: "CS", section: "A" },
    { id: 102, name: "Jane Smith", roll: "CS21002", batch: "2021-25", dept: "CS", section: "A" },
    { id: 103, name: "Robert Brown", roll: "CS21003", batch: "2021-25", dept: "CS", section: "B" },
    { id: 104, name: "Emily Davis", roll: "EE21001", batch: "2021-25", dept: "EE", section: "A" },
    { id: 105, name: "Michael Wilson", roll: "ME21001", batch: "2021-25", dept: "ME", section: "A" }
];

const sampleRooms = [
    { id: 1, fullName: "Block A - 101", type: "classroom", capacity: 60, features: { hasProjector: true, hasLab: false, hasAC: true } },
    { id: 2, fullName: "Block A - 102", type: "classroom", capacity: 60, features: { hasProjector: true, hasLab: false, hasAC: false } },
    { id: 3, fullName: "Lab Complex - L1", type: "lab", capacity: 40, features: { hasProjector: true, hasLab: true, hasAC: true } },
    { id: 4, fullName: "Block B - 201", type: "classroom", capacity: 50, features: { hasProjector: false, hasLab: false, hasAC: false } }
];

const sampleRules = [
    { id: 1, name: "Max Faculty Load", type: "constraint", weight: 10, description: "Faculty cannot exceed max weekly hours", isHard: true, isActive: true },
    { id: 2, name: "Consecutive Lectures", type: "constraint", weight: 5, description: "Avoid more than 2 consecutive lectures", isHard: false, isActive: true },
    { id: 3, name: "Lunch Break", type: "constraint", weight: 8, description: "Must have break between 12:00-01:00", isHard: true, isActive: true }
];

const sampleLeaveRequests = [
    { id: 1, faculty: "Dr. Sarah Thorne", type: "Medical", dates: "Feb 15 - Feb 16", reason: "Viral Fever", status: "Pending" },
    { id: 2, faculty: "Prof. Alan Turing", type: "Conference", dates: "Mar 10", reason: "AI Summit 2026", status: "Approved" },
    { id: 3, faculty: "Dr. Grace Hopper", type: "Personal", dates: "Feb 20", reason: "Family Event", status: "Pending" },
    { id: 4, faculty: "Prof. Richard Feynman", type: "Medical", dates: "Feb 18", reason: "Dental Appt", status: "Pending" }
];

// Generate a rich timetable
const sampleTimetable = [];
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const times = ["09:00", "10:00", "11:00", "12:00", "01:00", "02:00", "03:00"];
const subjects = [
    { sub: "Data Structures", fac: "Dr. Sarah Thorne" },
    { sub: "Algorithms", fac: "Prof. Alan Turing" },
    { sub: "Database Systems", fac: "Dr. Grace Hopper" },
    { sub: "Operating Systems", fac: "Dr. Sarah Thorne" },
    { sub: "Comp. Networks", fac: "Prof. Alan Turing" }
];

days.forEach(day => {
    times.forEach(time => {
        if (time === "12:00") return; // Lunch break

        if (Math.random() > 0.3) { // 70% chance of class
            const sub = subjects[Math.floor(Math.random() * subjects.length)];
            const room = sampleRooms[Math.floor(Math.random() * sampleRooms.length)];

            sampleTimetable.push({
                id: Date.now() + Math.random(),
                day: day,
                time: time,
                subject: sub.sub,
                faculty: sub.fac,
                room: room.fullName,
                dept: "CS",
                sem: "1",
                section: "A",
                year: "2025-26"
            });
        }
    });
});

function seedLocalStorage() {
    console.log("Checking data seeding...");

    const existingFaculty = localStorage.getItem('timeWeaver_faculty');
    if (!existingFaculty || JSON.parse(existingFaculty).length < 6) {
        console.log("Seeding Faculty (Updated)...");
        localStorage.setItem('timeWeaver_faculty', JSON.stringify(sampleFaculty));
    }

    if (!localStorage.getItem('timeWeaver_students')) {
        console.log("Seeding Students...");
        localStorage.setItem('timeWeaver_students', JSON.stringify(sampleStudents));
    }

    if (!localStorage.getItem('timeWeaver_rooms')) {
        console.log("Seeding Rooms...");
        localStorage.setItem('timeWeaver_rooms', JSON.stringify(sampleRooms));
    }

    if (!localStorage.getItem('timeWeaver_rules')) {
        console.log("Seeding Rules...");
        localStorage.setItem('timeWeaver_rules', JSON.stringify(sampleRules));
    }

    if (!localStorage.getItem('timeWeaver_timetable')) {
        console.log("Seeding Timetable...");
        localStorage.setItem('timeWeaver_timetable', JSON.stringify(sampleTimetable));
    }

    if (!localStorage.getItem('timeWeaver_leaves')) {
        console.log("Seeding Leaves...");
        localStorage.setItem('timeWeaver_leaves', JSON.stringify(sampleLeaveRequests));
    }

    // Flag to ensure we don't re-seed aggressively if user clears specific items
    localStorage.setItem('timeWeaver_seeded', 'true');
}

// Auto-run on load
seedLocalStorage();
