setInterval(function () {
    checkTables();
}, 100);

let shadow;

function dragit(event) {
    shadow = event.target;
}

function dragover(e) {
    let target = e.target;
    if (target.nodeName === "INPUT" || target.nodeName === "SELECT" || target.nodeName === "BUTTON") {
        target = target.closest("tr");
    }
    const table = target.parentNode.parentNode;
    table.appendChild(shadow);
}

function cancelButtonClick(event) {
    event.preventDefault();
    window.location.href = "/groups";
}

function checkUniqueNames() {
    const inputs = document.getElementsByTagName("input");
    const nonUniqueValues = new Set();
    const values = new Set();

    for (let i = 0; i < inputs.length; i++) {
        const value = inputs[i].value;
        if (values.has(value)) {
            nonUniqueValues.add(value);
        } else {
            values.add(value);
        }
    }
    let returnable = [];
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].parentNode.nodeName === "TH") {
            if (nonUniqueValues.has(inputs[i].value)) {
                returnable.push([inputs[i].parentNode, 1]);
            } else {
                returnable.push([inputs[i].parentNode, 0]);
            }
        }
    }
    return returnable;
}

function areNamesUnique() {
    const uniqueNames = checkUniqueNames();
    for (let i = 0; i < uniqueNames.length; i++) {
        if (uniqueNames[i][1]) {
            return false;
        }
    }
    return true;
}
function checkGroupSizes() {
    const tables = document.getElementsByTagName("table");
    let returnable = [];
    for (let i = 0; i < tables.length; i++) {
        const numRows = tables[i].getElementsByTagName("tr").length - 1;
        const th = tables[i].getElementsByTagName("th")[0];
        if (numRows > 6 || numRows < 4) {
            returnable.push([th, 1]);
        } else {
            returnable.push([th, 0]);
        }
    }
    return returnable;
}
function setStudentNames() {
    var studentInputs = document.querySelectorAll("#student");
    for (var i = 0; i < studentInputs.length; i++) {
        var parentElement = studentInputs[i].parentNode;
        var name =
            parentElement.parentElement.parentElement.firstElementChild.firstElementChild.firstElementChild.value;
        studentInputs[i].setAttribute("name", name);
    }
}

function checkTables() {
    const uniqueNames = checkUniqueNames();
    const groupSizes = checkGroupSizes();

    if (groupSizes.length !== uniqueNames.length) {
        console.error(uniqueNames);
        return;
    }

    for (let i = 0; i < uniqueNames.length; i++) {
        if (groupSizes[i][1] || uniqueNames[i][1]) {
            uniqueNames[i][0].style.backgroundColor = "red";
        } else {
            uniqueNames[i][0].style.backgroundColor = "#04AA6D";
        }
    }
}
function validateTables() {
    const tables = document.getElementsByTagName("table");
    let isError = false;
    for (let i = 0; i < tables.length; i++) {
        const numRows = tables[i].getElementsByTagName("tr").length - 1;
        const th = tables[i].getElementsByTagName("th")[0];
        if (numRows > 6 || numRows < 4) {
            isError = true;
        }
    }
    const message = document.getElementById("message");
    if (isError) {
        message.innerHTML = "Error: Groups must be of size 4 to 6. <br>Check tables with red colors.<br /><br />";
        return false;
    } else if (!areNamesUnique()) {
        message.innerHTML = "Error: Groups must have unique names. <br>Check tables with red colors.<br /><br />";
        return false;
    } else {
        message.textContent = "";
        setStudentNames();
        return true;
    }
}

function deleteTable(event) {
    event.preventDefault();
    const button = event.currentTarget;
    const table = button.closest("table");
    if (table.rows.length != 1) {
        return;
    }
    const br = table.previousElementSibling;
    if (br.nodeName === "BR") {
        br.parentNode.removeChild(br);
    }
    table.parentNode.removeChild(table);
}
function setWidthToContent(element) {
    const value = element.value;
    let capitalCount = 0;
    for (let i = 0; i < value.length; i++) {
        if (value[i] >= "A" && value[i] <= "Z") {
            capitalCount++;
        }
    }
    element.style.width = (element.value.length + 2) * 8 + capitalCount * 2.7 + "px";
}
function addNewTable() {
    const newGroupName = "New Group";

    const firstTable = document.querySelector("table");
    const newTable = firstTable.cloneNode(true);

    newTable.id = newGroupName;

    const input = newTable.querySelector("input");
    input.value = newGroupName;
    const select = newTable.querySelector("select");

    const rows = newTable.querySelectorAll("tr");
    for (let i = 1; i < rows.length; i++) {
        rows[i].remove();
    }
    firstTable.parentNode.insertBefore(newTable, firstTable);

    const br = document.createElement("br");
    newTable.insertAdjacentElement("afterend", br);

    setWidthToContent(newTable.querySelector("input[type='text']"));
}

document.addEventListener("DOMContentLoaded", function () {
    const inputs = document.getElementsByTagName("input");
    for (let i = 0; i < inputs.length; i++) {
        const value = inputs[i].value;
        let capitalCount = 0;
        for (let i = 0; i < value.length; i++) {
            if (value[i] >= "A" && value[i] <= "Z") {
                capitalCount++;
            }
        }
        inputs[i].style.width = (inputs[i].value.length + 1) * 8 + capitalCount * 2.7 + "px";
    }
});
