const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const functions = require("./functions.js");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "style")));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
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

    const groups = await getGroups();
    const studentGroups = await getStudentGroups();

    res.render("groups", { groups: groups, studentGroups, studentGroups });
});

app.put("/students/:id/group/:groupId", async (req, res) => {
    const studentId = req.params.id;
    const newGroupId = "Group " + req.params.groupId;

    console.log(studentId + " " + newGroupId);

    await functions.updateStudentGroups(newGroupId, studentId);

    res.sendStatus(200);
});

app.listen(3000);
