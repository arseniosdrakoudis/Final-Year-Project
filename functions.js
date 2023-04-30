// const { group } = require("console");
const { group } = require("console");
const crypto = require("crypto");
const mysql = require("mysql2");
// const { resolve } = require("path");
const nodemailer = require("nodemailer");
const { send } = require("process");

const connection = mysql.createConnection({
    host: "localhost",
    port: 13306,
    user: "root",
    password: "rootroot",
    database: "StudentAlloc",
});

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "ad561testuser@gmail.com", // sender's email address
        pass: "jcgorayziychgtlg", // sender's email password
    },
});

async function sendRegistrationEmail(email, token) {
    let info = await transporter.sendMail({
        from: "ad561testuser@gmail.com",
        to: email,
        subject: "Register for Group Allocation",
        html: `Dear Student, </br> Please 
        <a href="http://localhost:3000/register/${token}">click here </a>
        to register to the group allocation platform</br>
        After you register you can access the platform from 
        <a href="http://localhost:3000/"> http://localhost:3000/ </a>`,
    });
}

async function sendGroupEmail(email, group, topic, students, supervisor) {
    var studentList = "";
    for (var i = 0; i < students.length; i++) {
        studentList = studentList + students[i] + `</br>`;
    }

    let info = await transporter.sendMail({
        from: "ad561testuser@gmail.com",
        to: email,
        subject: "Your Group",
        html: `Dear Student, </br>Your Group name is "${group}" with topic "${topic}"
        </br> your supervisor is ${supervisor},
        </br>your groupmates are: </br> ${studentList}`,
    });
}

async function sendSupervisorEmail(email, supervised) {
    var mail = "Dear Supervisor, </br>Your Groups are as following </br></br>";
    for (var i = 0; i < supervised.length; i++) {
        mail = mail + supervised[i][0] + " with topic " + supervised[i][1] + "</br>" + "with students: </br>";
        for (var j = 0; j < supervised[i][2].length; j++) {
            mail = mail + supervised[i][2][j] + "</br>";
        }
        mail = mail + "</br>";
    }
    let info = await transporter.sendMail({
        from: "ad561testuser@gmail.com",
        to: email,
        subject: "Groups You Supervise",
        html: mail,
    });
}

connection.connect();

function getSHA256(data) {
    try {
        const hash = crypto.createHash("sha256").update(data, "utf8").digest("hex");
        return hash;
    } catch (err) {
        console.error(err);
    }
    return null;
}

function generateToken() {
    const token = crypto.randomBytes(64).toString("hex");
    return token;
}

function fetchUser(email) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM User WHERE email = ?`;
        connection.query(query, [email], (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(results);
        });
    });
}

async function getUser(email) {
    let user;
    try {
        user = await fetchUser(email);
    } catch (error) {
        console.error(error);
    }
    return user;
}

function insertStudentInDatabse(email, password) {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO User VALUES (?,?,'student')`;
        connection.query(query, [email, password], (error, results) => {
            if (error) {
                console.log(error);
                reject(error);
                return;
            }
        });
        resolve();
    });
}

async function insertStudent(email, password) {
    try {
        await insertStudentInDatabse(email, password);
    } catch (error) {
        console.error(error);
    }
}

function fetchUnselectedStudents() {
    return new Promise(async (resolve, reject) => {
        const query = `SELECT email FROM User WHERE role = 'student' AND email NOT IN 
        (SELECT student FROM Selection) UNION SELECT email FROM Register;`;
        connection.query(query, (error, results) => {
            if (error) {
                console.log("error");
                reject(error);
                return;
            }
            resolve(results);
        });
    });
}

async function getUnselectedStudents() {
    let User;
    try {
        user = await fetchUnselectedStudents();
    } catch (error) {
        console.error(error);
    }
    return user;
}

function fetchSelectedStudents() {
    return new Promise(async (resolve, reject) => {
        const query = `SELECT email FROM User WHERE role = 'student' AND email IN (SELECT student FROM Selection)`;
        connection.query(query, (error, results) => {
            if (error) {
                console.log("error");
                reject(error);
                return;
            }
            resolve(results);
        });
    });
}

async function getSelectedStudents() {
    let User;
    try {
        user = await fetchSelectedStudents();
    } catch (error) {
        console.error(error);
    }
    return user;
}

function fetchStudents() {
    return new Promise(async (resolve, reject) => {
        const query = `SELECT email FROM User WHERE role = 'student'`;
        connection.query(query, (error, results) => {
            if (error) {
                console.log("error");
                reject(error);
                return;
            }
            resolve(results);
        });
    });
}

async function getStudents() {
    let User;
    try {
        user = await fetchStudents();
    } catch (error) {
        console.error(error);
    }
    return user;
}

function fetchSupervisors() {
    return new Promise(async (resolve, reject) => {
        const query = `SELECT email FROM User WHERE role = 'super'`;
        connection.query(query, (error, results) => {
            if (error) {
                console.log("error");
                reject(error);
                return;
            }
            resolve(results);
        });
    });
}

async function getSupervisor() {
    let user;
    try {
        user = await fetchSupervisors();
    } catch (error) {
        console.error(error);
    }
    const arr = user.map((item) => item.email);
    return arr;
}

function fetchRegistered() {
    return new Promise(async (resolve, reject) => {
        const query = `SELECT email FROM Register`;
        connection.query(query, (error, results) => {
            if (error) {
                console.log("error");
                reject(error);
                return;
            }
            resolve(results);
        });
    });
}

async function getRegistered() {
    let User;
    try {
        user = await fetchRegistered();
    } catch (error) {
        console.error(error);
    }
    return user;
}

function fetchRegisteredWithToken(token) {
    return new Promise(async (resolve, reject) => {
        const query = `SELECT email FROM Register WHERE token = ?`;
        connection.query(query, [token], (error, results) => {
            if (error) {
                console.log("error");
                reject(error);
                return;
            }
            resolve(results);
        });
    });
}

async function getRegisteredWithToken(token) {
    let User;
    try {
        user = await fetchRegisteredWithToken(token);
    } catch (error) {
        console.error(error);
    }
    return user;
}

function insertRegisterInDatabse(email, token) {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO Register VALUES (?,?)`;
        connection.query(query, [email, token], (error, results) => {
            if (error) {
                reject(error);
                return;
            }
        });
        resolve();
    });
}

async function insertRegister(email, token) {
    try {
        await insertRegisterInDatabse(email, token);
    } catch (error) {
        console.error(error);
    }
}

function deleteRegisterFromDatabse(email) {
    return new Promise((resolve, reject) => {
        const query = "DELETE FROM `Register` WHERE email = ?";
        connection.query(query, [email], (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(results);
        });
    });
}

async function deleteRegister(email) {
    try {
        const results = await deleteRegisterFromDatabse(email);
    } catch (error) {
        console.error(error);
    }
}

function deleteStudentFromDatabse(email) {
    return new Promise((resolve, reject) => {
        const query = "DELETE FROM `User` WHERE email = ?";
        connection.query(query, [email], (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(results);
        });
    });
}

async function deleteStudent(email) {
    try {
        const results = await deleteStudentFromDatabse(email);
    } catch (error) {
        console.error(error);
    }
}

function fetchTopics() {
    return new Promise((resolve, reject) => {
        const query = `SELECT name FROM Topic`;
        connection.query(query, (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(results);
        });
    });
}

async function getTopics() {
    let topics;
    try {
        topics = await fetchTopics();
    } catch (error) {
        console.error(error);
    }
    return topics;
}

function deleteTopicsFromDatabse() {
    return new Promise((resolve, reject) => {
        const query = "DELETE FROM `Topic`";
        connection.query(query, (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(results);
        });
    });
}

async function deleteTopics() {
    try {
        const results = await deleteTopicsFromDatabse();
    } catch (error) {
        console.error(error);
    }
}

function insertTopicInDatabse(topic) {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO Topic (name) VALUES (?)`;
        connection.query(query, [topic], (error, results) => {
            if (error) {
                reject(error);
                return;
            }
        });
        resolve();
    });
}

async function insertTopic(topic) {
    try {
        await insertTopicInDatabse(topic);
    } catch (error) {
        console.error(error);
    }
}

function fetchGroups() {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM `Group`";
        connection.query(query, (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(results);
        });
    });
}

async function getGroups() {
    let groups;
    try {
        groups = await fetchGroups();
    } catch (error) {
        console.error(error);
    }

    const groupsArray = groups.map((group) => [group.id, group.name, group.topic]);
    return groupsArray;
}

function fetchStudentGroups() {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM Student_Group";
        connection.query(query, (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(results);
        });
    });
}

async function getStudentGroups() {
    let groups;
    try {
        groups = await fetchStudentGroups();
    } catch (error) {
        console.error(error);
    }
    const studentGroupsArray = groups.map(({ student, group }) => [student, group]);

    return studentGroupsArray;
}

function fetchSupervisorGroups() {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM Supervisor_Group";
        connection.query(query, (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(results);
        });
    });
}

async function getSupervisorGroups() {
    let groups;
    try {
        groups = await fetchSupervisorGroups();
    } catch (error) {
        console.error(error);
    }
    const supervisors = groups.map(({ supervisor, group }) => [supervisor, group]);

    return supervisors;
}

function fetchSelections(studentEmail) {
    return new Promise((resolve, reject) => {
        const query = `SELECT topic, choice FROM Selection WHERE student = '${studentEmail}' ORDER BY choice ASC`;
        connection.query(query, (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(results);
        });
    });
}

async function getSelections(studentEmail) {
    let selections;
    try {
        selections = await fetchSelections(studentEmail);
    } catch (error) {
        console.error(error);
    }
    return selections;
}

function fetchSuperSelections(studentEmail) {
    return new Promise((resolve, reject) => {
        const query = `SELECT topic, choice FROM Supervisor_Selection WHERE supervisor = '${studentEmail}' ORDER BY choice ASC`;
        connection.query(query, (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(results);
        });
    });
}

async function getSuperSelections(studentEmail) {
    let selections;
    try {
        selections = await fetchSuperSelections(studentEmail);
    } catch (error) {
        console.error(error);
    }
    return selections;
}

function fetchSupervisorSelections() {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM Supervisor_Selection ORDER BY choice ASC`;
        connection.query(query, (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(results);
        });
    });
}

async function getSupervisorSelections() {
    let selections;
    try {
        selections = await fetchSupervisorSelections();
    } catch (error) {
        console.error(error);
    }
    const arr = selections.map((obj) => [obj.supervisor, obj.topic, obj.choice]);
    return arr;
}

function deleteSelectionsFromDatabse(id) {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM Selection WHERE student = '${id}'`;
        connection.query(query, (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(results);
        });
    });
}

async function deleteSelections(id) {
    try {
        const results = await deleteSelectionsFromDatabse(id);
    } catch (error) {
        console.error(error);
    }
}

function deleteSuperSelectionsFromDatabse(id) {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM Supervisor_Selection WHERE supervisor = '${id}'`;
        connection.query(query, (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(results);
        });
    });
}

async function deleteSuperSelections(id) {
    try {
        const results = await deleteSuperSelectionsFromDatabse(id);
    } catch (error) {
        console.error(error);
    }
}

function deleteGroupsFromDatabse() {
    return new Promise((resolve, reject) => {
        const query = "DELETE FROM `Group`";
        connection.query(query, (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(results);
        });
    });
}

async function deleteGroups() {
    try {
        const results = await deleteGroupsFromDatabse();
    } catch (error) {
        console.error(error);
    }
}

function deleteStudentGroupsFromDatabse() {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM Student_Group`;
        connection.query(query, (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(results);
        });
    });
}

async function deleteStudentGroups() {
    try {
        const results = await deleteStudentGroupsFromDatabse();
    } catch (error) {
        console.error(error);
    }
}

function deleteSupervisorGroupsFromDatabse() {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM Supervisor_Group`;
        connection.query(query, (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(results);
        });
    });
}

async function deleteSupervisorGroups() {
    try {
        const results = await deleteSupervisorGroupsFromDatabse();
    } catch (error) {
        console.error(error);
    }
}

function insertSelectionsInDatabse(id, selections) {
    return new Promise((resolve, reject) => {
        for (const [key, value] of selections) {
            if (value !== "-") {
                const query = `INSERT INTO Selection VALUES (?,?,?)`;
                connection.query(query, [id, key, value], (error, results) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                });
            }
        }
        resolve();
    });
}

async function insertSelections(id, selections) {
    try {
        await insertSelectionsInDatabse(id, selections);
    } catch (error) {
        console.error(error);
    }
}

function insertSuperSelectionsInDatabse(id, selections) {
    return new Promise((resolve, reject) => {
        for (const [key, value] of selections) {
            if (value !== "-") {
                const query = `INSERT INTO Supervisor_Selection VALUES (?,?,?)`;
                connection.query(query, [id, key, value], (error, results) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                });
            }
        }
        resolve();
    });
}

async function insertSuperSelections(id, selections) {
    try {
        await insertSuperSelectionsInDatabse(id, selections);
    } catch (error) {
        console.error(error);
    }
}

function fetchNewGroupId() {
    return new Promise((resolve, reject) => {
        const query = "SELECT COUNT(*)+1 FROM `Group`";
        connection.query(query, (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(results[0]["COUNT(*)+1"]);
        });
    });
}

async function getNewGroupId() {
    let selections;
    try {
        selections = await fetchNewGroupId();
    } catch (error) {
        console.error(error);
    }
    return selections;
}

function fetchGroupCount() {
    return new Promise((resolve, reject) => {
        const query = "SELECT COUNT(*) FROM `Group`";
        connection.query(query, (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(results[0]["COUNT(*)"]);
        });
    });
}

async function getGroupCount() {
    let selections;
    try {
        selections = await fetchGroupCount();
    } catch (error) {
        console.error(error);
    }
    return selections;
}

function createNewGroupInDatabse(topic) {
    return new Promise(async (resolve, reject) => {
        const id = await getNewGroupId();
        const name = "Group " + id;
        const query = "INSERT INTO `Group` VALUES (?,?,?)";
        connection.query(query, [id, name, topic], (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(name);
        });
    });
}
async function createGroup(topic) {
    let selections;
    try {
        selections = await createNewGroupInDatabse(topic);
    } catch (error) {
        console.error(error);
    }
    return selections;
}

function createNewGroupWithNameInDatabse(name, topic) {
    return new Promise(async (resolve, reject) => {
        const id = await getNewGroupId();
        const query = "INSERT INTO `Group` VALUES (?,?,?)";
        connection.query(query, [id, name, topic], (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(name);
        });
    });
}
async function createGroupWithName(name, topic) {
    let selections;
    try {
        selections = await createNewGroupWithNameInDatabse(name, topic);
    } catch (error) {
        console.error(error);
    }
    return selections;
}

function insertStudentToGroupInDatabse(student, group) {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO Student_Group VALUES (?,?)`;
        connection.query(query, [student, group], (error, results) => {
            if (error) {
                reject(error);
                return;
            }
        });
        resolve();
    });
}

async function insertStudentToGroup(student, group) {
    try {
        await insertStudentToGroupInDatabse(student, group);
    } catch (error) {
        console.error(error);
    }
}

function insertSuperToGroupInDatabse(student, group) {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO Supervisor_Group VALUES (?,?)`;
        connection.query(query, [student, group], (error, results) => {
            if (error) {
                reject(error);
                return;
            }
        });
        resolve();
    });
}

async function insertSuperToGroup(student, group) {
    try {
        await insertSuperToGroupInDatabse(student, group);
    } catch (error) {
        console.error(error);
    }
}

async function findStudentWithAlternativeForTopic(choicesPerTopic, selectedStudents, studentChoices, topic) {
    let studentsWithTopic = [];
    for (var i = 0; i < selectedStudents.length; i++) {
        if (selectedStudents[i][1][0] == topic) {
            studentsWithTopic.push(selectedStudents[i]);
        }
    }
    for (var i = 0; i < studentsWithTopic.length; i++) {
        let index = choicesPerTopic.findIndex((choice) => choice[0] === studentsWithTopic[i][1][1]);
        let numOfStudents = choicesPerTopic[index][1];
        if (numOfStudents != 6 && numOfStudents > 3) {
            return [studentChoices.findIndex((student) => student[0] === studentsWithTopic[i][0]), 1];
        }
    }

    for (var i = 0; i < studentsWithTopic.length; i++) {
        let index = choicesPerTopic.findIndex((choice) => choice[0] === studentsWithTopic[i][1][2]);
        let numOfStudents = choicesPerTopic[index][1];
        if (numOfStudents != 6 && numOfStudents > 3) {
            return [studentChoices.findIndex((student) => student[0] === studentsWithTopic[i][0]), 2];
        }
    }

    return [-1, -1];
}

async function findStudentWithAlternative(studentChoices, selectedStudents) {
    for (var choice = 0; choice < 3; choice++) {
        for (var i = 0; i < selectedStudents.length; i++) {
            let student = studentChoices.findIndex((student) => student[0] == selectedStudents[i][0]);
            if (studentChoices[student][1] != selectedStudents[i][1][choice]) {
                return [student, choice];
            }
        }
    }
    return [-1, -1];
}

async function dealWithTopicsOf7(choicesPerTopic, unselectedStudents, selectedStudents, studentChoices) {
    let index = choicesPerTopic.findIndex((topic) => topic[1] == 7);
    while (index != -1) {
        if (unselectedStudents.length != 0) {
            let topic = choicesPerTopic[index][0];
            studentChoices.push([unselectedStudents[0], topic]);
            unselectedStudents.splice(0, 1);
            choicesPerTopic[index][1]++;
        } else {
            let [studentToMove, newTopicChoice] = await findStudentWithAlternativeForTopic(
                choicesPerTopic,
                selectedStudents,
                studentChoices,
                choicesPerTopic[index][0]
            );
            if (studentToMove == -1) {
                studentToMove = studentChoices.findIndex((student) => student[1] == choicesPerTopic[index][0]);
                unselectedStudents.push(studentChoices[studentToMove][0]);
                studentChoices.splice(studentToMove, 1);
                choicesPerTopic[index][1]--;
            } else {
                let selectedStudentsIndex = selectedStudents.findIndex(
                    (student) => student[0] == studentChoices[studentToMove][0]
                );
                let newTopic = selectedStudents[selectedStudentsIndex][1][newTopicChoice];
                studentChoices[studentToMove][1] = newTopic;
                choicesPerTopic[index][1]--;
                choicesPerTopic[choicesPerTopic.findIndex((topic) => topic[0] == newTopic)][1]++;
            }
        }
        index = choicesPerTopic.findIndex((topic) => topic[1] == 7);
    }
    return [choicesPerTopic, unselectedStudents, selectedStudents, studentChoices];
}

async function dealWithTopicsOfLessThanGroupMin(choicesPerTopic, unselectedStudents, selectedStudents, studentChoices) {
    let index = choicesPerTopic.findIndex((topic) => topic[1] <= 3 && topic[1] != 0);
    while (index != -1) {
        if (unselectedStudents.length + choicesPerTopic[index][1] >= 4) {
            let topic = choicesPerTopic[index][0];
            studentChoices.push([unselectedStudents[0], topic]);
            unselectedStudents.splice(0, 1);
            choicesPerTopic[index][1]++;
        } else {
            let topic = choicesPerTopic[index][0];
            let student = studentChoices.findIndex((student) => student[1] == topic);
            while (student != -1) {
                let [studentToMove, newTopicChoice] = await findStudentWithAlternativeForTopic(
                    choicesPerTopic,
                    selectedStudents,
                    studentChoices,
                    choicesPerTopic[index][0]
                );
                if (studentToMove == -1) {
                    studentToMove = studentChoices.findIndex((student) => student[1] == choicesPerTopic[index][0]);
                    unselectedStudents.push(studentChoices[studentToMove][0]);
                    studentChoices.splice(studentToMove, 1);
                    choicesPerTopic[index][1]--;
                } else {
                    let selectedStudentsIndex = selectedStudents.findIndex(
                        (student) => student[0] == studentChoices[studentToMove][0]
                    );
                    let newTopic = selectedStudents[selectedStudentsIndex][1][newTopicChoice];
                    studentChoices[studentToMove][1] = newTopic;
                    choicesPerTopic[index][1]--;
                    choicesPerTopic[choicesPerTopic.findIndex((topic) => topic[0] == newTopic)][1]++;
                }

                student = studentChoices.findIndex((student) => student[1] == topic);
                if (choicesPerTopic[index][1] == 0) {
                    break;
                }
            }
        }
        index = choicesPerTopic.findIndex((topic) => topic[1] <= 3 && topic[1] != 0);
    }
    return [choicesPerTopic, unselectedStudents, selectedStudents, studentChoices];
}
async function createChoicesPerTopicAndStudentChoices(topics, selectedStudents) {
    let choicesPerTopic = [];
    let studentChoices = [];
    for (var i = 0; i < topics.length; i++) {
        choicesPerTopic.push([topics[i].name, 0]);
    }

    for (var i = 0; i < selectedStudents.length; i++) {
        let topicIndex = choicesPerTopic.findIndex((group) => group[0] === selectedStudents[i][1][0]);
        choicesPerTopic[topicIndex][1]++;
        studentChoices.push([selectedStudents[i][0], selectedStudents[i][1][0]]);
    }
    return [choicesPerTopic, studentChoices];
}

async function areAllSpecialCases(choicesPerTopic) {
    for (let i = 0; i < choicesPerTopic.length; i++) {
        if (choicesPerTopic[i][1] != 6) {
            return false;
        }
    }
    return true;
}

async function findTopicToAddUnselected(choicesPerTopic, unselectedStudents) {
    let idealsize = 5;
    for (let i = 0; i < choicesPerTopic.length; i++) {
        if (choicesPerTopic[i][1] == idealsize - 1) {
            return [i, 1];
        }
    }
    for (let i = 0; i < choicesPerTopic.length; i++) {
        if (
            idealsize - (choicesPerTopic[i][1] % idealsize) <= unselectedStudents.length &&
            choicesPerTopic[i][1] % idealsize != 0
        ) {
            return [i, idealsize - (choicesPerTopic[i][1] % idealsize)];
        }
    }
    for (let i = 0; i < choicesPerTopic.length; i++) {
        if (choicesPerTopic[i][1] != 6 && choicesPerTopic[i][1] % idealsize != 0) {
            return [i, unselectedStudents.length];
        }
    }

    return [-1, -1];
}

async function dealWithUnselectedStudents(choicesPerTopic, unselectedStudents, selectedStudents, studentChoices) {
    while (unselectedStudents.length != 0) {
        if (unselectedStudents.length == 1 && (await areAllSpecialCases(choicesPerTopic))) {
            let [student, choice] = await findStudentWithAlternative(studentChoices, selectedStudents);
            let newTopic = selectedStudents[student][1][choice];
            let oldTopic = studentChoices[student][1];
            studentChoices[student][1] = newTopic;
            choicesPerTopic[choicesPerTopic.findIndex((topic) => topic[0] == oldTopic)][1]--;
            studentChoices.push([unselectedStudents[0], newTopic]);
            unselectedStudents.splice(0, 1);
            choicesPerTopic[choicesPerTopic.findIndex((topic) => topic[0] == newTopic)][1] += 2;
        } else {
            let [topic, amount] = await findTopicToAddUnselected(choicesPerTopic, unselectedStudents);

            choicesPerTopic[topic][1] += amount;
            for (let i = 0; i < amount; i++) {
                studentChoices.push([unselectedStudents[i], choicesPerTopic[topic][0]]);
            }
            unselectedStudents.splice(0, amount);
        }
    }
    return [choicesPerTopic, unselectedStudents, selectedStudents, studentChoices];
}

async function createChoices(topics, selectedStudents, unselectedStudents) {
    let [choicesPerTopic, studentChoices] = await createChoicesPerTopicAndStudentChoices(topics, selectedStudents);

    // console.log("\n\nInitial");
    // console.log(choicesPerTopic);
    // console.log("selected: " + studentChoices.length);
    // console.log("unselected: " + unselectedStudents.length);

    [choicesPerTopic, unselectedStudents, selectedStudents, studentChoices] = await dealWithTopicsOf7(
        choicesPerTopic,
        unselectedStudents,
        selectedStudents,
        studentChoices
    );

    // console.log("\n\nAfter Dealing With Special Case");
    // console.log(choicesPerTopic);
    // console.log("selected: " + studentChoices.length);
    // console.log("unselected: " + unselectedStudents.length);

    [choicesPerTopic, unselectedStudents, selectedStudents, studentChoices] = await dealWithTopicsOfLessThanGroupMin(
        choicesPerTopic,
        unselectedStudents,
        selectedStudents,
        studentChoices
    );

    // console.log("\n\nAfter Dealing With Less Than Group Min");
    // console.log(choicesPerTopic);
    // console.log("selected: " + studentChoices.length);
    // console.log("unselected: " + unselectedStudents.length);

    [choicesPerTopic, unselectedStudents, selectedStudents, studentChoices] = await dealWithUnselectedStudents(
        choicesPerTopic,
        unselectedStudents,
        selectedStudents,
        studentChoices
    );

    // console.log("\n\nDeal With Unselelected");
    // console.log(choicesPerTopic);
    // console.log("selected: " + studentChoices.length);
    // console.log("unselected: " + unselectedStudents.length);

    return [studentChoices, choicesPerTopic];
}

async function allocate(selectedStudents, unselectedStudents) {
    let idealsize = 5;
    unselectedStudents = unselectedStudents.map((student) => student.email);
    let unallocateStudents = [];
    let groups = [];
    const topics = await getTopics();
    for (var i = 0; i < selectedStudents.length; i++) {
        unallocateStudents.push(selectedStudents[i][0]);
    }
    for (var i = 0; i < unselectedStudents.length; i++) {
        unallocateStudents.push(unselectedStudents[i].email);
    }

    let [studentChoices, choicesPerTopic] = await createChoices(topics, selectedStudents, unselectedStudents);

    await deleteStudentGroups();
    await deleteGroups();

    for (const topic of choicesPerTopic) {
        while (topic[1] != 0) {
            if ((topic[1] - idealsize > 3 && topic[1] - idealsize != 7) || topic[1] == 5) {
                const group = await createGroup(topic[0]);
                for (let i = 0; i < 5; i++) {
                    const index = studentChoices.findIndex((element) => element[1] === topic[0]);
                    const student = studentChoices[index][0];
                    await insertStudentToGroup(student, group);
                    studentChoices.splice(index, 1);
                }
                topic[1] = topic[1] - 5;
            } else if (topic[1] - 6 > 3 || topic[1] == 6) {
                const group = await createGroup(topic[0]);
                for (let i = 0; i < 6; i++) {
                    const index = studentChoices.findIndex((element) => element[1] === topic[0]);
                    const student = studentChoices[index][0];
                    await insertStudentToGroup(student, group);
                    studentChoices.splice(index, 1);
                }
                topic[1] = topic[1] - 6;
            } else if (topic[1] - 4 > 3 || topic[1] == 4) {
                const group = await createGroup(topic[0]);
                for (let i = 0; i < 4; i++) {
                    const index = studentChoices.findIndex((element) => element[1] === topic[0]);
                    const student = studentChoices[index][0];
                    await insertStudentToGroup(student, group);
                    studentChoices.splice(index, 1);
                }
                topic[1] = topic[1] - 4;
            }
        }
    }
    groups = await getGroups();
    const superSelec = await getSupervisorSelections();
    const supervisors = await getSupervisor();
    for (let i = 0; i < groups.length; i++) {
        let choice = 10;
        let sup = "";
        for (let j = 0; j < superSelec.length; j++) {
            if (superSelec[j][1] == groups[i][2] && superSelec[j][2] < choice) {
                choice = superSelec[j][2];
                sup = superSelec[j][1];
            }
        }
        if (choice == 10) {
            const randomIndex = Math.floor(Math.random() * supervisors.length);
            await insertSuperToGroup(supervisors[randomIndex], groups[i][1]);
        } else {
            await insertSuperToGroup(sup, groups[i][1]);
        }
    }
}

module.exports = {
    getSHA256: getSHA256,
    getUser: getUser,
    getUnselectedStudents: getUnselectedStudents,
    getSelectedStudents: getSelectedStudents,
    getTopics: getTopics,
    getSelections: getSelections,
    deleteSelections: deleteSelections,
    insertSelections: insertSelections,
    createGroup: createGroup,
    insertStudentToGroup: insertStudentToGroup,
    getGroups: getGroups,
    getStudentGroups: getStudentGroups,
    allocate: allocate,
    createGroupWithName: createGroupWithName,
    deleteGroups: deleteGroups,
    deleteStudentGroups: deleteStudentGroups,
    getGroupCount: getGroupCount,
    deleteTopics: deleteTopics,
    insertTopic: insertTopic,
    getStudents: getStudents,
    generateToken: generateToken,
    getRegistered: getRegistered,
    insertRegister: insertRegister,
    sendRegistrationEmail: sendRegistrationEmail,
    deleteStudent: deleteStudent,
    deleteRegister: deleteRegister,
    getRegisteredWithToken: getRegisteredWithToken,
    insertStudent: insertStudent,
    sendGroupEmail: sendGroupEmail,
    getSuperSelections: getSuperSelections,
    deleteSuperSelections: deleteSuperSelections,
    insertSuperSelections: insertSuperSelections,
    getSupervisorGroups: getSupervisorGroups,
    getSupervisor: getSupervisor,
    deleteSupervisorGroups: deleteSupervisorGroups,
    insertSuperToGroup: insertSuperToGroup,
    sendSupervisorEmail: sendSupervisorEmail,
};
