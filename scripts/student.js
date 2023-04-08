let selectedNumbers = [];
function updateDropdownBoxes(dropdown) {
    let selectedNumber = dropdown.value;
    let previousValue = dropdown.getAttribute("data-previous-value");
    if (previousValue && previousValue !== "-") {
        let index = selectedNumbers.indexOf(previousValue);
        if (index !== -1) {
            selectedNumbers.splice(index, 1);
        }
    }
    if (selectedNumber !== "-") {
        selectedNumbers.push(selectedNumber);
    }
    dropdown.setAttribute("data-previous-value", selectedNumber);
    let dropdownBoxes = document.querySelectorAll("select");
    dropdownBoxes.forEach(function (d) {
        let options = d.querySelectorAll("option");
        options.forEach(function (o) {
            if (selectedNumbers.includes(o.value)) {
                o.disabled = true;
            } else {
                o.disabled = false;
            }
        });
    });
}
function runUpdateDropdownBoxesOnPageLoad() {
    let dropdownBoxes = document.querySelectorAll("select");
    dropdownBoxes.forEach(function (dropdown) {
        updateDropdownBoxes(dropdown);
    });
}
window.onload = runUpdateDropdownBoxesOnPageLoad;
function validateSelection() {
    if (selectedNumbers.length !== 3) {
        document.getElementById("message").innerHTML = "You must select 3 topics";
        document.getElementById("message").style.color = "red";
        return false;
    }
    document.getElementById("message").innerHTML = "";
    let dropdownBoxes = document.querySelectorAll("select");
    dropdownBoxes.forEach(function (dropdown) {
        let options = dropdown.querySelectorAll("option");
        options.forEach(function (option) {
            option.disabled = false;
        });
    });
    return true;
}
