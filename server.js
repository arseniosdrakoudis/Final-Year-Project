const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const functions = require("./functions.js");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "style")));
app.use(express.static(path.join(__dirname, "scripts")));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const { send } = require("process");
const {
    createGroup,
    insertStudentToGroup,
    getTopics,
    getGroups,
    getStudentGroups,
    getGroupCount,
} = require("./functions.js");
const { render } = require("ejs");
const { Console } = require("console");

app.use(
    session({
        secret: "my-secret",
        resave: false,
        saveUninitialized: true,
    })
);

app.get("/", (req, res) => {
    const message = req.query.message || "";
    const email = req.query.email || "";
    res.render("login", { email: email, message: message });
});

app.post("/login", async (req, res) => {
    const email = req.body.email;
    const password = functions.getSHA256(req.body.password);
    const user = await functions.getUser(email);

    if (user.length === 0) {
        res.redirect(`/?message=Email Not Found`);
        return;
    }

    if (password === user[0].password) {
        req.session.email = email;
        if (user[0].role === "admin") {
            res.redirect("/home");
        }
        if (user[0].role === "student") {
            res.redirect(`/student/${email}`);
        }
    } else {
        res.redirect(`/?email=${req.body.email}&message=Wrong Password`);
        return;
    }
});

app.get("/student/:id", async (req, res) => {
    const id = req.params.id;
    if (req.session.email != id) {
        res.redirect("/");
    }
    const topics = await functions.getTopics();
    const selections = await functions.getSelections(id);
    const message = req.query.message || "";

    res.render("student", {
        topics: topics,
        selectedNumbers: [],
        selections: selections,
        message: message,
    });
});

app.post("/student", async (req, res) => {
    const id = req.session.email;
    const topics = await functions.getTopics();
    const selections = Object.entries(req.body);
    await functions.deleteSelections(id);
    await functions.insertSelections(id, selections);

    res.redirect(`/student/${req.session.email}?message=Selection Submited`);
});

app.get("/home", async (req, res) => {
    res.render("home");
});

app.get("/selections", async (req, res) => {
    if (req.session.email != "admin@leicester.ac.uk") {
        res.redirect("/");
    }
    const unselectedStudents = await functions.getUnselectedStudents();
    const selectedStudents = await functions.getSelectedStudents();
    let studentChoices = [];
    for (let i = 0; i < selectedStudents.length; i++) {
        let student = selectedStudents[i].email;
        let choices = await functions.getSelections(student);
        studentChoices.push([student, [choices[0].topic, choices[1].topic, choices[2].topic]]);
    }
    res.render("selections", {
        unselectedStudents: unselectedStudents,
        studentChoices: studentChoices,
    });
});

app.post("/allocate", async (req, res) => {
    const unselectedStudents = await functions.getUnselectedStudents();
    const selectedStudents = await functions.getSelectedStudents();
    let studentChoices = [];
    for (let i = 0; i < selectedStudents.length; i++) {
        let student = selectedStudents[i].email;
        let choices = await functions.getSelections(student);
        studentChoices.push([student, [choices[0].topic, choices[1].topic, choices[2].topic]]);
    }
    await functions.allocate(studentChoices, unselectedStudents);

    res.redirect("/groups");
});

app.get("/topics", async (req, res) => {
    const topics = (await functions.getTopics()).map((topic) => topic.name);
    res.render("topics", { topics: topics });
});

app.get("/students", async (req, res) => {
    const topics = (await functions.getTopics()).map((topic) => topic.name);
    res.render("topics", { topics: topics });
});

app.post("/saveTopics", async (req, res) => {
    const body = req.body["topic"];
    await functions.deleteTopics();
    for (let i = 0; i < body.length; i++) {
        await functions.insertTopic(body[i]);
    }

    const topics = (await functions.getTopics()).map((topic) => topic.name);
    res.render("topics", { topics: topics });
});

app.get("/groups", async (req, res) => {
    if ((await functions.getGroupCount()) == 0) {
        res.redirect("/selections");
    }
    const groups = await getGroups();
    const studentGroups = await getStudentGroups();
    var topics = await getTopics();
    topics = topics.map((topic) => topic.name);

    res.render("groups", { groups: groups, studentGroups, studentGroups, topics: topics });
});

app.post("/saveGroups", async (req, res) => {
    const body = req.body;
    await functions.deleteGroups();
    await functions.deleteStudentGroups();
    const groups = body["group"];
    const topics = body["topic"];
    for (let i = 0; i < groups.length; i++) {
        await functions.createGroupWithName(groups[i], topics[i]);
        const group = body[groups[i]];
        for (let j = 0; j < group.length; j++) {
            await functions.insertStudentToGroup(group[j], groups[i]);
        }
    }
    res.redirect("/groups");
});

app.listen(3000);
