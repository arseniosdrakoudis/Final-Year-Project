function handleTopicForm() {
    const form = document.getElementById("topic-form");

    form.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            var input = document.getElementById("new-topic");
            document.getElementById("addBtn").click();
        }
    });
}

window.onload = handleTopicForm;

function cancelButtonClick(event) {
    event.preventDefault();
    window.location.href = "/topics";
}
function deleteTopic(event) {
    const button = event.target;
    const row = button.closest("tr");
    row.remove();
}
function setError(error) {
    const message = document.getElementById("message");
    message.innerHTML = error;
}
function getTopics() {
    const topics = document.querySelectorAll("input.topic");
    const topicList = [];

    topics.forEach((topic) => {
        topicList.push(topic.value.toUpperCase());
    });

    return topicList;
}
function addTopic() {
    event.preventDefault();
    const input = document.getElementById("new-topic");
    const value = input.value;
    if (!value) {
        return;
    }
    if (getTopics().includes(value.toUpperCase())) {
        setError("Topic Already Exists");
        return;
    }
    const tbody = document.getElementById("topics-table");
    const row = document.createElement("tr");

    const cell = document.createElement("td");
    row.appendChild(cell);
    const name = document.createElement("input");
    name.setAttribute("name", "topic");
    name.setAttribute("type", "text");
    name.setAttribute("class", "topic");
    name.setAttribute("value", value);
    cell.appendChild(name);

    const button = document.createElement("button");
    button.id = `delete ${value}`;
    button.onclick = deleteTopic;
    button.className = "delete-button";
    const icon = document.createElement("i");
    icon.className = "fa fa-trash";
    button.appendChild(icon);

    cell.appendChild(button);

    tbody.appendChild(row);
    input.value = "";

    setError("");
}
