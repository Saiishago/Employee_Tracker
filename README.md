# Employee_Tracker
In this challenge, we were supposed to create an Employee Tracker that can be started using the command-line.

## Installation
Be sure to install; *inquirer*, *mysql*, *cfonts*.
This way your application can actually run.

## Code Files
```md
schema.sql
This file contains the three tables *department*, *role*, and *employee*
and the *staffTail_db*. This file is needed in order to create the seeds file.

seeds.sql
The seeds file is populated with all the content from the tables created in the schema file.

server.js
Now that all the sql files have been populated, the server file has to be written so the commad-line application can run. Once this file is populated, run npm start to start the application.
NB: When creating a connetion for your mysql database, play around with >>>> host: *'127.0.0.1'* or *'localhost'* <<<< it all depends on what your machine will allow.
```
## Links Required for This Challenge
```md
Github https://github.com/Saiishago/Employee_Tracker
Walkthrough Video
```
## Test
```md
To run a table test, type the below text in your command-line

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;

Just in case a user forgets the text, I have placed it as a comment in the file named testing.sql.
```
## Author
Salome K Mphago

## Credits
W3 Schools

Thomas Calle YouTube tutorial

- - -

© 2023 salomeKmphago. All Rights Reserved.