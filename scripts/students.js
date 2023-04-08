function handleStudentForm() {
    const form = document.getElementById("student-form");

    form.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            var input = document.getElementById("new-student");
            document.getElementById("addBtn").click();
        }
    });
}
window.onload = handleStudentForm;

function cancelButtonClick(event) {
    event.preventDefault();
    window.location.href = "/students";
}
function deleteStudent(event) {
    const button = event.target;
    const row = button.closest("tr");
    row.remove();
}
function setError(error) {
    const message = document.getElementById("message");
    message.innerHTML = error;
}
function getStudents() {
    const students = document.querySelectorAll("input.student");
    const studentList = [];

    students.forEach((student) => {
        studentList.push(student.value.toUpperCase());
    });

    return studentList;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function addStudent() {
    event.preventDefault();
    const input = document.getElementById("new-student");
    const value = input.value;
    if (!value) {
        return;
    }
    if (getStudents().includes(value.toUpperCase())) {
        setError("Student Already Exists");
        return;
    }
    if (!isValidEmail(value)) {
        setError("Not a valid Email");
        return;
    }
    const tbody = document.getElementById("student-table");
    const row = document.createElement("tr");

    const cell = document.createElement("td");
    row.appendChild(cell);
    const name = document.createElement("input");
    name.setAttribute("name", "student");
    name.setAttribute("type", "text");
    name.setAttribute("class", "student");
    name.setAttribute("value", value);
    cell.appendChild(name);

    const button = document.createElement("button");
    button.id = `delete ${value}`;
    button.onclick = deleteStudent;
    button.className = "delete-button";
    const icon = document.createElement("i");
    icon.className = "fa fa-trash";
    button.appendChild(icon);

    cell.appendChild(button);

    tbody.appendChild(row);
    input.value = "";
    setError("");
}
