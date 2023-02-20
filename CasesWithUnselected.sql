DROP DATABASE IF EXISTS StudentAlloc;
CREATE DATABASE StudentAlloc;
USE StudentAlloc;

DROP TABLE IF EXISTS `User`;
CREATE TABLE `User` (
  email VARCHAR(100),
  password VARCHAR(255),
  role VARCHAR(10),
  PRIMARY KEY(email)
);

DROP TABLE IF EXISTS `Topic`;
CREATE TABLE `Topic` (
	id INT,
    name varchar(100),
    PRIMARY KEY(id)
);

DROP TABLE IF EXISTS `Selection`;
CREATE TABLE `Selection`(
	student VARCHAR(100),
    topic VARCHAR(100),
    choice SMALLINT
);

DROP TABLE IF EXISTS `Group`;
CREATE TABLE `Group`(
	id SMALLINT,
    name VARCHAR(100),
    topic VARCHAR(100)
);

DROP TABLE IF EXISTS `Student_Group`;
CREATE TABLE `Student_Group`(
	student VARCHAR(100),
    `group` VARCHAR(100)
);


/*
Admin: 		admin@leicester.ac.uk 		password:admin1234%
Users: 		test1@student.le.ac.uk  	password:test1234%
					.
                    .
                    .
			test30@student.le.ac.uk		password:test1234%
*/
INSERT INTO User VALUES
('admin@leicester.ac.uk','7c2761f969cefc416bc5287f8d3d5e29ef5aad5bfe88da393c9410539713391b','admin'),
('test1@student.le.ac.uk','83808955f2b94011bf1c6006b7802e117444d8cb9f66e152f243d119efbd2e12','student'),
('test2@student.le.ac.uk','83808955f2b94011bf1c6006b7802e117444d8cb9f66e152f243d119efbd2e12','student'),
('test3@student.le.ac.uk','83808955f2b94011bf1c6006b7802e117444d8cb9f66e152f243d119efbd2e12','student'),
('test4@student.le.ac.uk','83808955f2b94011bf1c6006b7802e117444d8cb9f66e152f243d119efbd2e12','student'),
('test5@student.le.ac.uk','83808955f2b94011bf1c6006b7802e117444d8cb9f66e152f243d119efbd2e12','student'),
('test6@student.le.ac.uk','83808955f2b94011bf1c6006b7802e117444d8cb9f66e152f243d119efbd2e12','student'),
('test7@student.le.ac.uk','83808955f2b94011bf1c6006b7802e117444d8cb9f66e152f243d119efbd2e12','student'),
('test8@student.le.ac.uk','83808955f2b94011bf1c6006b7802e117444d8cb9f66e152f243d119efbd2e12','student'),
('test9@student.le.ac.uk','83808955f2b94011bf1c6006b7802e117444d8cb9f66e152f243d119efbd2e12','student'),
('test10@student.le.ac.uk','83808955f2b94011bf1c6006b7802e117444d8cb9f66e152f243d119efbd2e12','student'),
('test11@student.le.ac.uk','83808955f2b94011bf1c6006b7802e117444d8cb9f66e152f243d119efbd2e12','student'),
('test12@student.le.ac.uk','83808955f2b94011bf1c6006b7802e117444d8cb9f66e152f243d119efbd2e12','student'),
('test13@student.le.ac.uk','83808955f2b94011bf1c6006b7802e117444d8cb9f66e152f243d119efbd2e12','student'),
('test14@student.le.ac.uk','83808955f2b94011bf1c6006b7802e117444d8cb9f66e152f243d119efbd2e12','student'),
('test15@student.le.ac.uk','83808955f2b94011bf1c6006b7802e117444d8cb9f66e152f243d119efbd2e12','student'),
('test16@student.le.ac.uk','83808955f2b94011bf1c6006b7802e117444d8cb9f66e152f243d119efbd2e12','student'),
('test17@student.le.ac.uk','83808955f2b94011bf1c6006b7802e117444d8cb9f66e152f243d119efbd2e12','student'),
('test18@student.le.ac.uk','83808955f2b94011bf1c6006b7802e117444d8cb9f66e152f243d119efbd2e12','student'),
('test19@student.le.ac.uk','83808955f2b94011bf1c6006b7802e117444d8cb9f66e152f243d119efbd2e12','student'),
('test20@student.le.ac.uk','83808955f2b94011bf1c6006b7802e117444d8cb9f66e152f243d119efbd2e12','student'),
('test21@student.le.ac.uk','83808955f2b94011bf1c6006b7802e117444d8cb9f66e152f243d119efbd2e12','student'),
('test22@student.le.ac.uk','83808955f2b94011bf1c6006b7802e117444d8cb9f66e152f243d119efbd2e12','student'),
('test23@student.le.ac.uk','83808955f2b94011bf1c6006b7802e117444d8cb9f66e152f243d119efbd2e12','student'),
('test24@student.le.ac.uk','83808955f2b94011bf1c6006b7802e117444d8cb9f66e152f243d119efbd2e12','student'),
('test25@student.le.ac.uk','83808955f2b94011bf1c6006b7802e117444d8cb9f66e152f243d119efbd2e12','student'),
('test26@student.le.ac.uk','83808955f2b94011bf1c6006b7802e117444d8cb9f66e152f243d119efbd2e12','student'),
('test27@student.le.ac.uk','83808955f2b94011bf1c6006b7802e117444d8cb9f66e152f243d119efbd2e12','student'),
('test28@student.le.ac.uk','83808955f2b94011bf1c6006b7802e117444d8cb9f66e152f243d119efbd2e12','student'),
('test29@student.le.ac.uk','83808955f2b94011bf1c6006b7802e117444d8cb9f66e152f243d119efbd2e12','student'),
('test30@student.le.ac.uk','83808955f2b94011bf1c6006b7802e117444d8cb9f66e152f243d119efbd2e12','student'),
('test31@student.le.ac.uk','83808955f2b94011bf1c6006b7802e117444d8cb9f66e152f243d119efbd2e12','student'),
('test32@student.le.ac.uk','83808955f2b94011bf1c6006b7802e117444d8cb9f66e152f243d119efbd2e12','student'),
('test33@student.le.ac.uk','83808955f2b94011bf1c6006b7802e117444d8cb9f66e152f243d119efbd2e12','student'),
('test34@student.le.ac.uk','83808955f2b94011bf1c6006b7802e117444d8cb9f66e152f243d119efbd2e12','student'),
('test35@student.le.ac.uk','83808955f2b94011bf1c6006b7802e117444d8cb9f66e152f243d119efbd2e12','student'),
('test36@student.le.ac.uk','83808955f2b94011bf1c6006b7802e117444d8cb9f66e152f243d119efbd2e12','student'),
('test37@student.le.ac.uk','83808955f2b94011bf1c6006b7802e117444d8cb9f66e152f243d119efbd2e12','student'),
('test38@student.le.ac.uk','83808955f2b94011bf1c6006b7802e117444d8cb9f66e152f243d119efbd2e12','student'),
('test39@student.le.ac.uk','83808955f2b94011bf1c6006b7802e117444d8cb9f66e152f243d119efbd2e12','student'),
('test40@student.le.ac.uk','83808955f2b94011bf1c6006b7802e117444d8cb9f66e152f243d119efbd2e12','student'),
('test41@student.le.ac.uk','83808955f2b94011bf1c6006b7802e117444d8cb9f66e152f243d119efbd2e12','student');

INSERT INTO Topic VALUES
(1,'Topic 1'),
(2,'Topic 2'),
(3,'Topic 3'),
(4,'Topic 4'),
(5,'Topic 5');

INSERT INTO Selection VALUES
('test1@student.le.ac.uk','Topic 1',1),
('test1@student.le.ac.uk','Topic 2',2),
('test1@student.le.ac.uk','Topic 3',3),
('test2@student.le.ac.uk','Topic 1',1),
('test2@student.le.ac.uk','Topic 2',2),
('test2@student.le.ac.uk','Topic 3',3),
('test3@student.le.ac.uk','Topic 1',1),
('test3@student.le.ac.uk','Topic 2',2),
('test3@student.le.ac.uk','Topic 3',3),
('test4@student.le.ac.uk','Topic 1',1),
('test4@student.le.ac.uk','Topic 2',2),
('test4@student.le.ac.uk','Topic 3',3),
('test5@student.le.ac.uk','Topic 1',1),
('test5@student.le.ac.uk','Topic 2',2),
('test5@student.le.ac.uk','Topic 3',3),
('test6@student.le.ac.uk','Topic 1',1),
('test6@student.le.ac.uk','Topic 2',2),
('test6@student.le.ac.uk','Topic 3',3),
('test7@student.le.ac.uk','Topic 1',1),
('test7@student.le.ac.uk','Topic 2',2),
('test7@student.le.ac.uk','Topic 3',3),
('test8@student.le.ac.uk','Topic 2',1),
('test8@student.le.ac.uk','Topic 1',2),
('test8@student.le.ac.uk','Topic 3',3),
('test9@student.le.ac.uk','Topic 2',1),
('test9@student.le.ac.uk','Topic 1',2),
('test9@student.le.ac.uk','Topic 3',3),
('test10@student.le.ac.uk','Topic 2',1),
('test10@student.le.ac.uk','Topic 1',2),
('test10@student.le.ac.uk','Topic 3',3),
('test11@student.le.ac.uk','Topic 2',1),
('test11@student.le.ac.uk','Topic 1',2),
('test11@student.le.ac.uk','Topic 3',3),
('test12@student.le.ac.uk','Topic 2',1),
('test12@student.le.ac.uk','Topic 1',2),
('test12@student.le.ac.uk','Topic 3',3),
('test13@student.le.ac.uk','Topic 2',1),
('test13@student.le.ac.uk','Topic 1',2),
('test13@student.le.ac.uk','Topic 3',3),
('test14@student.le.ac.uk','Topic 2',1),
('test14@student.le.ac.uk','Topic 1',2),
('test14@student.le.ac.uk','Topic 3',3),
('test15@student.le.ac.uk','Topic 3',1),
('test15@student.le.ac.uk','Topic 1',2),
('test15@student.le.ac.uk','Topic 2',3),
('test16@student.le.ac.uk','Topic 3',1),
('test16@student.le.ac.uk','Topic 1',2),
('test16@student.le.ac.uk','Topic 2',3),
('test17@student.le.ac.uk','Topic 3',1),
('test17@student.le.ac.uk','Topic 1',2),
('test17@student.le.ac.uk','Topic 2',3),
('test18@student.le.ac.uk','Topic 3',1),
('test18@student.le.ac.uk','Topic 1',2),
('test18@student.le.ac.uk','Topic 2',3),
('test19@student.le.ac.uk','Topic 3',1),
('test19@student.le.ac.uk','Topic 1',2),
('test19@student.le.ac.uk','Topic 2',3),
('test20@student.le.ac.uk','Topic 3',1),
('test20@student.le.ac.uk','Topic 1',2),
('test20@student.le.ac.uk','Topic 2',3),
('test21@student.le.ac.uk','Topic 3',1),
('test21@student.le.ac.uk','Topic 1',2),
('test21@student.le.ac.uk','Topic 2',3),
('test22@student.le.ac.uk','Topic 4',1),
('test22@student.le.ac.uk','Topic 1',2),
('test22@student.le.ac.uk','Topic 2',3),
('test23@student.le.ac.uk','Topic 4',1),
('test23@student.le.ac.uk','Topic 1',2),
('test23@student.le.ac.uk','Topic 2',3),
('test24@student.le.ac.uk','Topic 4',1),
('test24@student.le.ac.uk','Topic 1',2),
('test24@student.le.ac.uk','Topic 2',3),
('test25@student.le.ac.uk','Topic 4',1),
('test25@student.le.ac.uk','Topic 1',2),
('test25@student.le.ac.uk','Topic 2',3),
('test26@student.le.ac.uk','Topic 4',1),
('test26@student.le.ac.uk','Topic 1',2),
('test26@student.le.ac.uk','Topic 2',3),
('test27@student.le.ac.uk','Topic 4',1),
('test27@student.le.ac.uk','Topic 1',2),
('test27@student.le.ac.uk','Topic 2',3),
('test28@student.le.ac.uk','Topic 4',1),
('test28@student.le.ac.uk','Topic 1',2),
('test28@student.le.ac.uk','Topic 2',3),
('test29@student.le.ac.uk','Topic 5',1),
('test29@student.le.ac.uk','Topic 1',2),
('test29@student.le.ac.uk','Topic 2',3),
('test30@student.le.ac.uk','Topic 5',1),
('test30@student.le.ac.uk','Topic 1',2),
('test30@student.le.ac.uk','Topic 2',3);


