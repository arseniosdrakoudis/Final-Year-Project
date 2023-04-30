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
// const { send } = require("process");
const {
    createGroup,
    insertStudentToGroup,
    getTopics,
    getGroups,
    getStudentGroups,
    getGroupCount,
    generateToken,
    insertStudent,
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

function requireAdmin(req, res, next) {
    if (req.session && req.session.isAdmin) {
        next();
    } else {
        res.redirect("/");
    }
}

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
            req.session.isAdmin = true;
            res.redirect("/home");
        }
        if (user[0].role === "student") {
            res.redirect(`/student/${email}`);
        }
        if (user[0].role === "super") {
            res.redirect(`/supervisor/${email}`);
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

app.get("/supervisor/:id", async (req, res) => {
    const id = req.params.id;
    if (req.session.email != id) {
        res.redirect("/");
    }
    const topics = await functions.getTopics();
    const selections = await functions.getSuperSelections(id);
    const message = req.query.message || "";

    res.render("supervisor", {
        topics: topics,
        selectedNumbers: [],
        selections: selections,
        message: message,
    });
});

app.post("/supervisor", async (req, res) => {
    const id = req.session.email;
    const topics = await functions.getTopics();
    const selections = Object.entries(req.body);
    await functions.deleteSuperSelections(id);
    await functions.insertSuperSelections(id, selections);

    res.redirect(`/supervisor/${req.session.email}?message=Selection Submited`);
});

app.post("/student", async (req, res) => {
    const id = req.session.email;
    const topics = await functions.getTopics();
    const selections = Object.entries(req.body);
    await functions.deleteSelections(id);
    await functions.insertSelections(id, selections);

    res.redirect(`/student/${req.session.email}?message=Selection Submited`);
});

app.get("/register/:token", async (req, res) => {
    const token = req.params.token;

    email = (await functions.getRegisteredWithToken(token)).map((student) => student.email);

    if (email.length == 0) {
        res.send("Invalid Token");
    } else {
        res.render("register", { email: email });
    }
});

app.post("/register", async (req, res) => {
    const body = req.body;
    const password = functions.getSHA256(body.password);
    const email = body.email;

    await functions.insertStudent(email, password);
    await functions.deleteRegister(email);

    res.redirect("/");
});

app.get("/home", requireAdmin, async (req, res) => {
    res.render("home");
});

app.get("/selections", requireAdmin, async (req, res) => {
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

app.post("/allocate", requireAdmin, async (req, res) => {
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

app.post("/saveTopics", requireAdmin, async (req, res) => {
    const body = req.body["topic"];
    await functions.deleteTopics();
    for (let i = 0; i < body.length; i++) {
        await functions.insertTopic(body[i]);
    }

    res.redirect("/topics");
});

app.get("/students", requireAdmin, async (req, res) => {
    const students = (await functions.getStudents()).map((student) => student.email);
    const registered = (await functions.getRegistered()).map((student) => student.email);
    const allStudents = students.concat(registered);

    res.render("students", { students: allStudents });
});

app.post("/saveStudents", requireAdmin, async (req, res) => {
    const body = req.body["student"];
    const students = (await functions.getStudents()).map((student) => student.email);
    const registered = (await functions.getRegistered()).map((student) => student.email);
    const allStudents = students.concat(registered);
    const newStudents = body.filter((email) => !students.includes(email) && !registered.includes(email));
    const deletedStudents = allStudents.filter((email) => !body.includes(email));

    for (let i = 0; i < newStudents.length; i++) {
        const token = generateToken();
        await functions.sendRegistrationEmail(newStudents[i], token);
        await functions.insertRegister(newStudents[i], token);
    }
    for (let i = 0; i < deletedStudents.length; i++) {
        await functions.deleteRegister(deletedStudents[i]);
        await functions.deleteStudent(deletedStudents[i]);
    }

    res.redirect("/students");
});

app.get("/groups", async (req, res) => {
    if ((await functions.getGroupCount()) == 0) {
        res.redirect("/selections");
    }
    const groupsLst = await getGroups();
    const studentGroups = await getStudentGroups();
    const supervisorsGroups = await functions.getSupervisorGroups();
    const supervisors = await functions.getSupervisor();
    var topics = await getTopics();
    var groups = [];
    for (let i = 0; i < groupsLst.length; i++) {
        groups.push([groupsLst[i][0], groupsLst[i][1], groupsLst[i][2], supervisorsGroups[i][0]]);
    }
    topics = topics.map((topic) => topic.name);

    res.render("groups", {
        groups: groups,
        studentGroups,
        studentGroups,
        supervisors: supervisors,
        topics: topics,
    });
});

app.get("/emailGroups", async (req, res) => {
    const studentGroups = await getStudentGroups();
    const groups = await getGroups();
    const supervisorsGroup = await functions.getSupervisorGroups();
    const supervisors = await functions.getSupervisor();

    for (var i = 0; i < studentGroups.length; i++) {
        var studentList = [];
        const group = studentGroups[i][1];
        const index = groups.findIndex((item) => item[1] === group);
        const topic = groups[index][2];
        for (var j = 0; j < studentGroups.length; j++) {
            if (studentGroups[i][1] == studentGroups[j][1] && studentGroups[i][0] != studentGroups[j][0]) {
                studentList.push(studentGroups[j][0]);
            }
        }
        const supervisor = supervisorsGroup.find((elem) => elem[1] === group)[0];
        // await functions.sendGroupEmail(studentGroups[i][0], group, topic, studentList, supervisor);
    }

    for (var i = 0; i < supervisors.length; i++) {
        supervised = [];
        for (var j = 0; j < supervisorsGroup.length; j++) {
            var group = "";
            var topic = "";
            if (supervisors[i] == supervisorsGroup[j][0]) {
                group = supervisorsGroup[j][1];
                const index = groups.findIndex((item) => item[1] === group);
                const topic = groups[index][2];
                var studentList = [];
                for (var k = 0; k < studentGroups.length; k++) {
                    if (group == studentGroups[k][1]) {
                        studentList.push(studentGroups[k][0]);
                    }
                }
                supervised.push([group, topic, studentList]);
            }
        }
        await functions.sendSupervisorEmail(supervisors[i], supervised);
    }

    res.redirect("/groups");
});

app.post("/saveGroups", async (req, res) => {
    const body = req.body;
    await functions.deleteGroups();
    await functions.deleteStudentGroups();
    await functions.deleteSupervisorGroups();
    const groups = body["group"];
    const supervisors = body["supervisor"];
    const topics = body["topic"];
    for (let i = 0; i < groups.length; i++) {
        await functions.insertSuperToGroup(supervisors[i], groups[i]);
        await functions.createGroupWithName(groups[i], topics[i]);
        const group = body[groups[i]];
        for (let j = 0; j < group.length; j++) {
            await functions.insertStudentToGroup(group[j], groups[i]);
        }
    }
    res.redirect("/groups");
});

app.listen(3000);
