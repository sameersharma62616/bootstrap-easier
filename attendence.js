document.addEventListener("DOMContentLoaded", function() {
    let attendanceData = localStorage.getItem("attendance") ? JSON.parse(localStorage.getItem("attendance")) : {};
    let studentData = localStorage.getItem("studentData") ? JSON.parse(localStorage.getItem("studentData")) : [];

    const startDate = new Date(2025, 0, 1); // January is 0-based index

    renderAttendanceTable();

    function renderAttendanceTable() {
        const attendanceDiv = document.getElementById("attendance");
        attendanceDiv.innerHTML = "";

        const tableContainer = document.createElement("div");
        tableContainer.classList.add("table-container");

        const table = document.createElement("table");
        table.classList.add("attendance-table");

        const headerRow = document.createElement("tr");
        const noHeader = document.createElement("th");
        noHeader.textContent = "No.";
        headerRow.appendChild(noHeader);

        const motherNameHeader = document.createElement("th");
        motherNameHeader.textContent = "Mother's Name";
        headerRow.appendChild(motherNameHeader);

        const fatherNameHeader = document.createElement("th");
        fatherNameHeader.textContent = "Father's Name";
        headerRow.appendChild(fatherNameHeader);

        const mobileNumberHeader = document.createElement("th");
        mobileNumberHeader.textContent = "Mobile Number";
        headerRow.appendChild(mobileNumberHeader);

        const nameHeader = document.createElement("th");
        nameHeader.textContent = "Student Name";
        headerRow.appendChild(nameHeader);

        let currentDate = new Date(startDate);
        const endDate = new Date(2025, 11, 31);
        while (currentDate <= endDate) {
            const th = document.createElement("th");
            th.textContent = formatDate(currentDate);
            headerRow.appendChild(th);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Adding the counter header
        const counterHeader = document.createElement("th");
        counterHeader.textContent = "Present Count";
        headerRow.appendChild(counterHeader);

        table.appendChild(headerRow);

        studentData.forEach(function(data, index) {
            const row = createStudentRow(data, index + 1);
            table.appendChild(row);
        });

        tableContainer.appendChild(table);
        attendanceDiv.appendChild(tableContainer);

        // Create buttons dynamically and add styles
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("button-container");

        const addButton = document.createElement("button");
        addButton.textContent = "Add Student";
        addButton.classList.add("btn");
        addButton.addEventListener("click", function() {
            const newStudent = { fullAddress: "", motherName: "", fatherName: "", mobileNumber: "", studentName: "" };
            studentData.push(newStudent);
            const newRow = createStudentRow(newStudent, studentData.length);
            table.appendChild(newRow);
            saveStudentData();
        });
        buttonContainer.appendChild(addButton);

        const stepBackButton = document.createElement("button");
        stepBackButton.textContent = "Step Back";
        stepBackButton.classList.add("btn");
        stepBackButton.addEventListener("click", function() {
            if (studentData.length > 0) {
                studentData.pop();
                table.removeChild(table.lastElementChild);
                saveStudentData();
            }
        });
        buttonContainer.appendChild(stepBackButton);

        const saveButton = document.createElement("button");
        saveButton.textContent = "Save Changes";
        saveButton.classList.add("btn");
        saveButton.addEventListener("click", function() {
            saveData();
        });
        buttonContainer.appendChild(saveButton);

        attendanceDiv.appendChild(buttonContainer);
    }

    function formatDate(date) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    function createStudentRow(data, index) {
        const row = document.createElement("tr");

        const noCell = document.createElement("td");
        noCell.textContent = index;
        row.appendChild(noCell);

        const motherNameCell = document.createElement("td");
        motherNameCell.textContent = data.motherName;
        motherNameCell.setAttribute("contenteditable", "true");
        motherNameCell.addEventListener("blur", function() {
            data.motherName = this.textContent.trim();
            saveStudentData();
        });
        row.appendChild(motherNameCell);

        const fatherNameCell = document.createElement("td");
        fatherNameCell.textContent = data.fatherName;
        fatherNameCell.setAttribute("contenteditable", "true");
        fatherNameCell.addEventListener("blur", function() {
            data.fatherName = this.textContent.trim();
            saveStudentData();
        });
        row.appendChild(fatherNameCell);

        const mobileNumberCell = document.createElement("td");
        mobileNumberCell.textContent = data.mobileNumber;
        mobileNumberCell.setAttribute("contenteditable", "true");
        mobileNumberCell.addEventListener("blur", function() {
            data.mobileNumber = this.textContent.trim();
            saveStudentData();
        });
        row.appendChild(mobileNumberCell);

        const nameCell = document.createElement("td");
        nameCell.textContent = data.studentName;
        nameCell.classList.add("fixed-column");
        nameCell.setAttribute("contenteditable", "true");
        nameCell.addEventListener("blur", function() {
            data.studentName = this.textContent.trim();
            saveStudentData();
        });
        row.appendChild(nameCell);

        let currentDate = new Date(startDate);
        const endDate = new Date(2025, 11, 31);
        while (currentDate <= endDate) {
            const td = document.createElement("td");
            const date = currentDate.toISOString().split('T')[0];
            const checkbox = createCheckbox(data.studentName, date, row);
            td.appendChild(checkbox);
            row.appendChild(td);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Adding the counter cell
        const counterCell = document.createElement("td");
        counterCell.classList.add("counter-cell");
        row.appendChild(counterCell);

        updateCounterCell(row);

        return row;
    }

    function createCheckbox(studentName, date, row) {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.setAttribute("data-student", studentName);
        checkbox.setAttribute("data-date", date);
        checkbox.classList.add("attendance-checkbox");

        // Load the checkbox state from attendanceData
        if (attendanceData[studentName] && attendanceData[studentName][date]) {
            checkbox.checked = attendanceData[studentName][date].present || false;
        }

        checkbox.addEventListener("change", function() {
            const studentName = this.getAttribute("data-student");
            const date = this.getAttribute("data-date");
            attendanceData[studentName] = attendanceData[studentName] || {};
            attendanceData[studentName][date] = attendanceData[studentName][date] || {};
            attendanceData[studentName][date].present = this.checked;
            saveAttendance();
            updateCounterCell(row);
        });

        return checkbox;
    }

    function updateCounterCell(row) {
        const checkboxes = row.querySelectorAll(".attendance-checkbox");
        const counterCell = row.querySelector(".counter-cell");
        const checkedCount = Array.from(checkboxes).filter(checkbox => checkbox.checked).length;
        counterCell.textContent = checkedCount;
    }

    function saveAttendance() {
        localStorage.setItem("attendance", JSON.stringify(attendanceData));
    }

    function saveStudentData() {
        localStorage.setItem("studentData", JSON.stringify(studentData));
    }

    function saveData() {
        saveAttendance();
        saveStudentData();
        alert("Data saved successfully!");
    }
});


// Here is the JS for percentage counter
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('percentage-form');
    const resultElement = document.getElementById('result');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const value = parseFloat(document.getElementById('value').value);
        const total = parseFloat(document.getElementById('total').value);

        if (total !== 0) {
            const percentage = (value / total) * 100;
            resultElement.textContent = `Result: ${percentage.toFixed(2)}%`;
        } else {
            resultElement.textContent = 'Total value cannot be zero.';
        }
    });
});
