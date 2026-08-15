// =========================================
//   STUDENT MANAGEMENT SYSTEM - CRUD
// =========================================

// Initialize students array from localStorage
let students = JSON.parse(localStorage.getItem('students')) || [];
let editingId = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    loadStudents();
    setupEventListeners();
    updateDashboard();
    showSection('dashboard');
});

// =========================================
//   EVENT LISTENERS
// =========================================

function setupEventListeners() {
    // Add Student Form
    const studentForm = document.getElementById('studentForm');
    if (studentForm) {
        studentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            addStudent();
        });
    }

    // Edit Form
    const editForm = document.getElementById('editForm');
    if (editForm) {
        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveEditedStudent();
        });
    }

    // Filter by Class
    const filterClass = document.getElementById('filterClass');
    if (filterClass) {
        filterClass.addEventListener('change', filterStudents);
    }

    // Search in table
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', filterStudents);
    }
}

// =========================================
//   SECTION NAVIGATION
// =========================================

function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
    }

    // Update nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    event.target.classList.add('active');

    // Load data when switching sections
    if (sectionId === 'students') {
        loadStudents();
    }
}

// =========================================
//   CREATE - ADD STUDENT
// =========================================

function addStudent() {
    const name = document.getElementById('studentName').value.trim();
    const email = document.getElementById('studentEmail').value.trim();
    const phone = document.getElementById('studentPhone').value.trim();
    const gender = document.getElementById('studentGender').value;
    const studentClass = document.getElementById('studentClass').value;
    const registration = document.getElementById('studentRegistration').value.trim();
    const dateOfBirth = document.getElementById('studentDateOfBirth').value;
    const address = document.getElementById('studentAddress').value.trim();

    // Validation
    if (!name || !email || !phone || !gender || !studentClass || !registration || !dateOfBirth) {
        showError('Please fill in all required fields!');
        return;
    }

    // Check for duplicate registration number
    if (students.some(s => s.registration === registration)) {
        showError('Registration number already exists!');
        return;
    }

    // Create new student object
    const student = {
        id: Date.now(),
        name,
        email,
        phone,
        gender,
        class: studentClass,
        registration,
        dateOfBirth,
        address,
        dateAdded: new Date().toLocaleDateString()
    };

    // Add to array
    students.push(student);

    // Save to localStorage
    localStorage.setItem('students', JSON.stringify(students));

    // Clear form
    document.getElementById('studentForm').reset();

    // Show success message
    showSuccess('Student added successfully!');

    // Update dashboard
    updateDashboard();

    // Reload table
    setTimeout(() => {
        showSection('students');
        loadStudents();
    }, 1500);
}

function showSuccess(message) {
    const successMsg = document.getElementById('successMessage');
    const errorMsg = document.getElementById('errorMessage');
    
    errorMsg.style.display = 'none';
    successMsg.textContent = '✓ ' + message;
    successMsg.style.display = 'block';

    setTimeout(() => {
        successMsg.style.display = 'none';
    }, 3000);
}

function showError(message) {
    const errorMsg = document.getElementById('errorMessage');
    const successMsg = document.getElementById('successMessage');
    
    successMsg.style.display = 'none';
    errorMsg.textContent = '✗ ' + message;
    errorMsg.style.display = 'block';

    setTimeout(() => {
        errorMsg.style.display = 'none';
    }, 3000);
}

// =========================================
//   READ - LOAD & DISPLAY STUDENTS
// =========================================

function loadStudents() {
    const tableBody = document.getElementById('studentsTableBody');
    const emptyState = document.getElementById('emptyState');

    if (!tableBody) return;

    if (students.length === 0) {
        tableBody.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    tableBody.innerHTML = '';

    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.registration}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.phone}</td>
            <td>${student.gender}</td>
            <td>${student.class}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-primary btn-sm" onclick="openEditModal(${student.id})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteStudent(${student.id})">Delete</button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// =========================================
//   FILTER & SEARCH
// =========================================

function filterStudents() {
    const filterClass = document.getElementById('filterClass').value;
    const searchInput = document.getElementById('searchInput').value.toLowerCase();

    const tableBody = document.getElementById('studentsTableBody');
    const rows = tableBody.querySelectorAll('tr');

    rows.forEach(row => {
        const name = row.cells[1].textContent.toLowerCase();
        const className = row.cells[5].textContent;
        const registration = row.cells[0].textContent.toLowerCase();

        const matchClass = !filterClass || className === filterClass;
        const matchSearch = !searchInput || name.includes(searchInput) || registration.includes(searchInput);

        row.style.display = (matchClass && matchSearch) ? '' : 'none';
    });
}

// =========================================
//   SEARCH STUDENT
// =========================================

function searchStudent() {
    const query = document.getElementById('searchQuery').value.toLowerCase().trim();
    const resultsDiv = document.getElementById('searchResults');

    if (!query) {
        resultsDiv.innerHTML = '<p style="color: var(--light-text);">Enter a search term...</p>';
        return;
    }

    const results = students.filter(student =>
        student.name.toLowerCase().includes(query) ||
        student.registration.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query)
    );

    if (results.length === 0) {
        resultsDiv.innerHTML = '<p style="color: var(--light-text);">No students found.</p>';
        return;
    }

    resultsDiv.innerHTML = results.map(student => `
        <div class="student-card">
            <h3>${student.name}</h3>
            <p><strong>Registration:</strong> ${student.registration}</p>
            <p><strong>Email:</strong> ${student.email}</p>
            <p><strong>Phone:</strong> ${student.phone}</p>
            <p><strong>Gender:</strong> ${student.gender}</p>
            <p><strong>Class:</strong> ${student.class}</p>
            <p><strong>Date of Birth:</strong> ${student.dateOfBirth}</p>
            <p><strong>Address:</strong> ${student.address}</p>
            <div class="student-card-actions">
                <button class="btn btn-primary btn-sm" onclick="openEditModal(${student.id})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteStudent(${student.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// =========================================
//   UPDATE - EDIT STUDENT
// =========================================

function openEditModal(id) {
    const student = students.find(s => s.id === id);
    if (!student) return;

    editingId = id;

    document.getElementById('editStudentId').value = id;
    document.getElementById('editStudentName').value = student.name;
    document.getElementById('editStudentEmail').value = student.email;
    document.getElementById('editStudentPhone').value = student.phone;
    document.getElementById('editStudentGender').value = student.gender;
    document.getElementById('editStudentClass').value = student.class;
    document.getElementById('editStudentAddress').value = student.address;

    const modal = document.getElementById('editModal');
    modal.classList.add('show');
}

function closeEditModal() {
    const modal = document.getElementById('editModal');
    modal.classList.remove('show');
    editingId = null;
}

function saveEditedStudent() {
    const id = parseInt(document.getElementById('editStudentId').value);
    const name = document.getElementById('editStudentName').value.trim();
    const email = document.getElementById('editStudentEmail').value.trim();
    const phone = document.getElementById('editStudentPhone').value.trim();
    const gender = document.getElementById('editStudentGender').value;
    const studentClass = document.getElementById('editStudentClass').value;
    const address = document.getElementById('editStudentAddress').value.trim();

    if (!name || !email || !phone || !gender || !studentClass) {
        alert('Please fill in all required fields!');
        return;
    }

    const studentIndex = students.findIndex(s => s.id === id);
    if (studentIndex !== -1) {
        students[studentIndex] = {
            ...students[studentIndex],
            name,
            email,
            phone,
            gender,
            class: studentClass,
            address
        };

        localStorage.setItem('students', JSON.stringify(students));
        closeEditModal();
        loadStudents();
        showSuccess('Student updated successfully!');
        updateDashboard();
    }
}

// =========================================
//   DELETE - REMOVE STUDENT
// =========================================

function deleteStudent(id) {
    if (confirm('Are you sure you want to delete this student?')) {
        students = students.filter(s => s.id !== id);
        localStorage.setItem('students', JSON.stringify(students));
        loadStudents();
        showSuccess('Student deleted successfully!');
        updateDashboard();

        // If in search, refresh search
        const searchQuery = document.getElementById('searchQuery').value;
        if (searchQuery) {
            searchStudent();
        }
    }
}

// =========================================
//   DASHBOARD
// =========================================

function updateDashboard() {
    const totalStudents = students.length;
    const maleStudents = students.filter(s => s.gender === 'Male').length;
    const femaleStudents = students.filter(s => s.gender === 'Female').length;

    document.getElementById('totalStudents').textContent = totalStudents;
    document.getElementById('maleStudents').textContent = maleStudents;
    document.getElementById('femaleStudents').textContent = femaleStudents;
    document.getElementById('recentUpdates').textContent = totalStudents > 0 ? Math.ceil(totalStudents / 3) : 0;
}

// =========================================
//   SAMPLE DATA (for testing)
// =========================================

function addSampleData() {
    if (students.length > 0) {
        if (confirm('This will add sample data. Continue?')) {
            // Clear existing data
            students = [];
        } else {
            return;
        }
    }

    const sampleStudents = [
        {
            id: Date.now() + 1,
            name: 'John Ndaki',
            email: 'john.ndaki@email.com',
            phone: '0756 123 456',
            gender: 'Male',
            class: 'Form 1',
            registration: 'ISS-2024-001',
            dateOfBirth: '2009-03-15',
            address: 'Mbeya Region, Tanzania',
            dateAdded: new Date().toLocaleDateString()
        },
        {
            id: Date.now() + 2,
            name: 'Grace Mwambi',
            email: 'grace.mwambi@email.com',
            phone: '0756 234 567',
            gender: 'Female',
            class: 'Form 2',
            registration: 'ISS-2024-002',
            dateOfBirth: '2008-07-22',
            address: 'Mbeya Region, Tanzania',
            dateAdded: new Date().toLocaleDateString()
        },
        {
            id: Date.now() + 3,
            name: 'David Kipondo',
            email: 'david.kipondo@email.com',
            phone: '0756 345 678',
            gender: 'Male',
            class: 'Form 3',
            registration: 'ISS-2024-003',
            dateOfBirth: '2007-11-08',
            address: 'Mbeya Region, Tanzania',
            dateAdded: new Date().toLocaleDateString()
        },
        {
            id: Date.now() + 4,
            name: 'Mary Simu',
            email: 'mary.simu@email.com',
            phone: '0756 456 789',
            gender: 'Female',
            class: 'Form 4',
            registration: 'ISS-2024-004',
            dateOfBirth: '2006-09-12',
            address: 'Mbeya Region, Tanzania',
            dateAdded: new Date().toLocaleDateString()
        },
        {
            id: Date.now() + 5,
            name: 'Peter Mwangi',
            email: 'peter.mwangi@email.com',
            phone: '0756 567 890',
            gender: 'Male',
            class: 'Form 1',
            registration: 'ISS-2024-005',
            dateOfBirth: '2009-05-20',
            address: 'Mbeya Region, Tanzania',
            dateAdded: new Date().toLocaleDateString()
        }
    ];

    students = sampleStudents;
    localStorage.setItem('students', JSON.stringify(students));
    loadStudents();
    updateDashboard();
    showSuccess('Sample data added successfully!');
}

// Close modal when clicking outside
window.onclick = (event) => {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        modal.classList.remove('show');
    }
};
