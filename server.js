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
const { createGroup, insertStudentToGroup, getTopics, getGroups, getStudentGroups } = require("./functions.js");
const { render } = require("ejs");

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
            res.redirect("/admin");
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

app.get("/admin", async (req, res) => {
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
    res.render("admin", {
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

app.get("/groups", async (req, res) => {
    const groups = await getGroups();
    const studentGroups = await getStudentGroups();
    var topics = await getTopics();
    topics = topics.map((topic) => topic.name);

    res.render("groups", { groups: groups, studentGroups, studentGroups, topics: topics });
});

app.post("/saveGroups", async (req, res) => {
    const body = Object.values(req.body);
    console.log(body);
    await functions.deleteGroups();
    await functions.deleteStudentGroups();
    for (let i = 0; i < body[0].length; i++) {
        await functions.createGroupWithName(body[0][i], body[1][i]);
        for (let j = 0; j < body[2 + i].length; j++) {
            await functions.insertStudentToGroup(body[2 + i][j], body[0][i]);
        }
    }
    res.redirect("/groups");
});

app.listen(3000);
