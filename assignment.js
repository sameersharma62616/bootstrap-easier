document.addEventListener('DOMContentLoaded', function () {
  let assignmentData = JSON.parse(localStorage.getItem('assignmentData')) || [
      { name: 'student1', date: '2024-01-01', marks: 0, totalAssignments: 0 },
      { name: 'student2', date: '2024-01-01', marks: 0, totalAssignments: 0 }
  ];

  const table = document.getElementById('assignment-table');
  const searchInput = document.getElementById('search-input');
  const startDateInput = document.getElementById('start-date');
  const endDateInput = document.getElementById('end-date');
  const marksInput = document.getElementById('marks-input');
  const addStudentForm = document.getElementById('add-student-form');
  const addStudentBtn = document.getElementById('add-student-btn');

  assignmentData.forEach((student, index) => {
      addStudentToTable(student, index + 1); // Start numbering from 1
  });

  const modal = document.getElementById('edit-form');
  const closeButton = document.querySelector('.close');
  closeButton.addEventListener('click', closeModal);
  searchInput.addEventListener('input', filterStudents);
  startDateInput.addEventListener('change', filterStudents);
  endDateInput.addEventListener('change', filterStudents);
  marksInput.addEventListener('input', filterStudents);
  addStudentBtn.addEventListener('click', showAddStudentForm);
  addStudentForm.addEventListener('submit', addNewStudent);

  function addStudentToTable(student, index) {
      const row = table.insertRow(-1);
      const numberCell = row.insertCell(0);
      const nameCell = row.insertCell(1);
      const dateCell = row.insertCell(2);
      const marksCell = row.insertCell(3);
      const totalAssignmentsCell = row.insertCell(4);
      const editCell = row.insertCell(5);
      const deleteCell = row.insertCell(6);

      numberCell.textContent = index;
      nameCell.textContent = student.name;
      dateCell.textContent = student.date;
      marksCell.textContent = student.marks;
      totalAssignmentsCell.textContent = student.totalAssignments;

      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.addEventListener('click', () => editStudent(row, student));
      editCell.appendChild(editButton);

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', () => deleteStudent(row, student));
      deleteCell.appendChild(deleteButton);
  }

  function filterStudents() {
      const searchTerm = searchInput.value.toLowerCase();
      const startDate = startDateInput.value;
      const endDate = endDateInput.value;
      const marks = marksInput.value ? parseInt(marksInput.value, 10) : 0;

      for (let i = table.rows.length - 1; i > 0; i--) {
          table.deleteRow(i);
      }

      const filteredData = assignmentData.filter(student => {
          const matchesSearch = student.name.toLowerCase().includes(searchTerm);
          const matchesStartDate = !startDate || new Date(student.date) >= new Date(startDate);
          const matchesEndDate = !endDate || new Date(student.date) <= new Date(endDate);
          const matchesMarks = !marks || student.marks >= marks;
          return matchesSearch && matchesStartDate && matchesEndDate && matchesMarks;
      });

      filteredData.forEach((student, index) => {
          addStudentToTable(student, index + 1);
      });
  }

  function showAddStudentForm() {
      addStudentForm.style.display = 'block';
  }

  function addNewStudent(event) {
      event.preventDefault();
      const newStudentName = document.getElementById('new-student-name').value;
      const newStudentDate = document.getElementById('new-student-date').value;
      const newStudentMarks = parseInt(document.getElementById('new-student-marks').value, 10);
      const newStudentTotal = parseInt(document.getElementById('new-student-total').value, 10);

      const newStudent = {
          name: newStudentName,
          date: newStudentDate,
          marks: newStudentMarks,
          totalAssignments: newStudentTotal
      };

      assignmentData.push(newStudent);
      addStudentToTable(newStudent, assignmentData.length);
      saveData();

      document.getElementById('new-student-name').value = '';
      document.getElementById('new-student-date').value = '';
      document.getElementById('new-student-marks').value = '';
      document.getElementById('new-student-total').value = '';
  }

  function deleteStudent(row, student) {
      const index = assignmentData.indexOf(student);
      if (index > -1) {
          assignmentData.splice(index, 1);
      }
      table.deleteRow(row.rowIndex);
      saveData();
  }

  function editStudent(row, student) {
      document.getElementById('edit-name').value = student.name;
      document.getElementById('edit-date').value = student.date;
      document.getElementById('edit-marks').value = student.marks;
      document.getElementById('edit-total').value = student.totalAssignments;
      modal.style.display = 'block';

      const submitButton = document.getElementById('edit-submit');
      submitButton.onclick = function () {
          const editedName = document.getElementById('edit-name').value;
          const editedDate = document.getElementById('edit-date').value;
          const editedMarks = parseInt(document.getElementById('edit-marks').value, 10);
          const editedTotal = parseInt(document.getElementById('edit-total').value, 10);

          student.name = editedName;
          student.date = editedDate;
          student.marks = editedMarks;
          student.totalAssignments = editedTotal;

          row.cells[1].textContent = editedName;
          row.cells[2].textContent = editedDate;
          row.cells[3].textContent = editedMarks;
          row.cells[4].textContent = editedTotal;

          modal.style.display = 'none';
          saveData();
      }
  }

  function closeModal() {
      modal.style.display = 'none';
  }

  function saveData() {
      localStorage.setItem('assignmentData', JSON.stringify(assignmentData));
  }
});
