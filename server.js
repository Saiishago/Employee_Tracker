const inquirer = require("inquirer");
const mysql = require("mysql2");
const cfonts = require("cfonts");

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        port: '3306',
        database: 'staffTail_db',
    },
);

db.connect((error) => {
    if(error) throw error;
    console.log(`Stuff Tail, tailing...`);
    start();
});

cfonts.say('Stuff Tailer');

//function to begin the application
function start() {
  inquirer
    .prompt({
        type: "list",
        name: "action",
        message: "What needs to be done?",
        choices: [
            "Show current Departments",
            "Show all Roles",
            "Display current Employees",
            "Add a Department",
            "Add a Role",
            "New Employee",
            "Add a Director | Manager",
            "Promote an Employee",
            "Demote an Employee",
            "Show Employees by Director",
            "Show Employees by Department",
            "Remove Departments | Roles | Employees",
            "Show the combined salaries of all Employees in a Department",
            "Done",
        ],
    })
    .then((answer) => {
        switch (answer.action) {
            case "Show current Departments":
                showCurrentDepartments();
                break;
            case "Show all Roles":
                showAllRoles();
                break;
            case "Display current Employees":
                displayCurrentEmployees();
                break;
            case "Add a Department":
                addDepartment();
                break;
            case "Add a Role":
                addRole();
                break;
            case "New Employee":
                newEmployee();
                break;
            case "Add a Director | Manager":
                addDirectorManager();
                break;
            case "Promote an Employee":
                promoteAnEmployee();
                break;
            case "Demote an Employee":
                demoteAnEmployee();
                break;
            case "Show Employees by Director":
                showEmployeesByDirector();
                break;
            case "Show Employees by Department":
                showEmployeesByDepartment();
                break;
            case "Remove Departments | Roles | Employees":
                removeDepartmentsRolesEmployees();
                break;
            case "Show the combined salaries of all Employees in a Department":
                showCombinedSaloariesOfAllEmployeesInDepartment();
                break;
            case "Done":
                connection.end();
                console.log("Good Day.");
                break;
        }
    });
}