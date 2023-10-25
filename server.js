const inquirer = require("inquirer");
const mysql = require("mysql2");
const cfonts = require("cfonts");

const db = mysql.createConnection(
    {
        host: '127.0.0.1',//'localhost', //
        user: 'root',
        password: 'root',
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

//begin the application
function start() {
  inquirer
    .prompt({
        type: "list",
        name: "action",
        message: "What needs to be done?",
        choices: [
            "Show current Department",
            "Show all Roles",
            "Display current Employees",
            "Add a Department",
            "Add a Role",
            "New Employee",
            "Add a Director | Manager",
            "Show Employees by Director",
            "Show Employees by Department",
            "Update Employee Role",
            "Remove Departments | Roles | Employees",
            "Show the combined salaries of all Employees in a Department",
            "Done",
        ],
    })
    .then((answer) => {
        switch (answer.action) {
            case "Add a Department":
                addDepartment();
                break;
            case "Show current Department":
                showCurrentDepartment();
                break;
            case "Add a Role":
                addRole();
                break;
            case "Show all Roles":
                showAllRoles();
                break;
            case "New Employee":
                newEmployee();
                break;
            case "Display current Employees":
                displayCurrentEmployees();
                break;
            case "Add a Director | Manager":
                addDirectorManager();
                break;
            case "Show Employees by Director":
                showEmployeesByDirector();
                break;
            case "Update Employee Role":
                updateEmployeeRole();
                break;
            case "Show Employees by Department":
                showEmployeesByDepartment();
                break;
            case "Remove Departments | Roles | Employees":
                removeDepartmentsRolesEmployees();
                break;
            case "Show the combined salaries of all Employees in a Department":
                showCombinedSalariesOfAllEmployeesInDepartment();
                break;
            case "Done":
                db.end();
                console.log("Good Day.");
                break;
        }
    });
}
////DEPARTMENT////

//lets add a Department
function addDepartment() {
    inquirer
        .prompt({
            type: "input",
            name: "name",
            message: "Name of new Department:",
        })
        .then((answer) => {
            console.log(answer.name);
            const query = `INSERT INTO department (dept_name) VALUES ("${answer.name}")`;
            db.query(query, (err, res) => {
                if (err) throw err;
                console.log(`Added department ${answer.name} to the database!`);
                start();
                console.log(answer.name);
            });
        });
}

//lets see the Company Departments
function showCurrentDepartment() {
    const query = "SELECT * FROM department";
    db.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}
////ROLE////

//lets add a Role
function addRole() {
    const query = "SELECT * FROM department";
    db.query(query, (err, res) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    type: "input",
                    name: "title",
                    message: "Title of new Role:",
                },
                {
                    type: "input",
                    name: "salary",
                    message: "Income of the new Role:",
                },
                {
                    type: "list",
                    name: "department",
                    message: "Which Department does it fall under:",
                    choices: res.map(
                        (department) => department.dept_name
                    ),
                },
            ])
            .then((answers) => {
                const department = res.find(
                    (department) => department.name === answers.department
                );
                const query = "INSERT INTO role SET ?";
                db.query(
                    query,
                    {
                        title: answers.title,
                        salary: answers.salary,
                        department_id: department,
                    },
                    (err, res) => {
                        if (err) throw err;
                        console.log(
                            `Added role ${answers.title} with salary ${answers.salary} to the ${answers.department} department in the database!`
                        );
                        start();
                    }
                );
            });
    });
}

//lets see all the Company Roles
function showAllRoles() {
    const query = "SELECT role.title, role.id, department.dept_name, role.salary from roles join departments on role.department_id = department.id";
    db.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

////EMPLOYEE////

//lets add an Employee
function newEmployee() {
    db.query("SELECT id, title FROM role", (error, results) => {
        if (error) {
            console.error(error);
            return;
        }

        const role = results.map(({ id, title }) => ({
            name: title,
            value: id,
        }));
        db.query(
            'SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee',
            (error, results) => {
                if (error) {
                    console.error(error);
                    return;
                }

                const director = results.map(({ id, name }) => ({
                    name,
                    value: id,
                }));
                inquirer
                    .prompt([
                        {
                            type: "input",
                            name: "firstName",
                            message: "First name:",
                        },
                        {
                            type: "input",
                            name: "lastName",
                            message: "Last name:",
                        },
                        {
                            type: "list",
                            name: "roleId",
                            message: "Role:",
                            choices: role,
                        },
                        {
                            type: "list",
                            name: "managerId",
                            message: "Select the employee director:",
                            choices: [
                                { name: "None", value: null },
                                //...managers,
                            ],
                        },
                    ])
                    .then((answers) => {
                        const sql =
                            "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
                        const values = [
                            answers.firstName,
                            answers.lastName,
                            answers.roleId,
                            answers.managerId,
                        ];
                        db.query(sql, values, (error) => {
                            if (error) {
                                console.error(error);
                                return;
                            }

                            console.log("Employee added");
                            start();
                        });
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        );
    });
}



//lets see all the Company Employees
function displayCurrentEmployees() {
    const query = `
    SELECT e.id, e.first_name, e.last_name, r.title, d.department_name, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name
    FROM employee e
    LEFT JOIN roles r ON e.role_id = r.id
    LEFT JOIN departments d ON r.department_id = d.id
    LEFT JOIN employee m ON e.manager_id = m.id;
    `;
    db.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

//lets promote/add Manager/Director
function addDirectorManager() {
    const queryDepartment = "SELECT * FROM department";
    const queryEmployee = "SELECT * FROM employee";

    db.query(queryDepartment, (err, resDepartment) => {
        if (err) throw err;
        db.query(queryEmployee, (err, resEmployee) => {
            if (err) throw err;
            inquirer
                .prompt([
                    {
                        type: "list",
                        name: "department",
                        message: "Choose relevent Department:",
                        choices: resDepartment.map(
                            (department) => department.dept_name
                        ),
                    },
                    {
                        type: "list",
                        name: "employee",
                        message: "Choose the Employee this role applies to:",
                        choices: resEmployee.map(
                            (employee) =>
                                `${employee.first_name} ${employee.last_name}`
                        ),
                    },
                    {
                        type: "list",
                        name: "manager",
                        message: "Who is the Employee's Manager/Director?:",
                        choices: resEmployee.map(
                            (employee) =>
                                `${employee.first_name} ${employee.last_name}`
                        ),
                    },
                ])
                .then((answers) => {
                    const department = resDepartment.find(
                        (department) =>
                            department.dept_name === answers.department
                    );
                    const employee = resEmployee.find(
                        (employee) =>
                            `${employee.first_name} ${employee.last_name}` ===
                            answers.employee
                    );
                    const manager = resEmployee.find(
                        (employee) =>
                            `${employee.first_name} ${employee.last_name}` ===
                            answers.manager
                    );
                    const query =
                        "UPDATE employee SET manager_id = ? WHERE id = ? AND role_id IN (SELECT id FROM role WHERE department_id = ?)";
                        db.query(
                        query,
                        [manager.id, employee.id, department.id],
                        (err, res) => {
                            if (err) throw err;
                            console.log(
                                `Added manager/director ${manager.first_name} ${manager.last_name} in department ${department.department_name} to employee ${employee.first_name} ${employee.last_name}!`
                            );
                            start();
                        }
                    );
                });
        });
    });
}

//lets update one employee role
function updateEmployeeRole() {
    const queryEmployee =
        "SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role ON employee.role_id = role.id";
    const queryRole = "SELECT * FROM role";
    db.query(queryEmployee, (err, resEmployee) => {
        if (err) throw err;
        db.query(queryRole, (err, resRole) => {
            if (err) throw err;
            inquirer
                .prompt([
                    {
                        type: "list",
                        name: "employee",
                        message: "Select the employee to update:",
                        choices: resEmployee.map(
                            (employee) =>
                                `${employee.first_name} ${employee.last_name}`
                        ),
                    },
                    {
                        type: "list",
                        name: "role",
                        message: "Select the new role:",
                        choices: resRole.map((role) => role.title),
                    },
                ])
                .then((answers) => {
                    const employee = resEmployee.find(
                        (employee) =>
                            `${employee.first_name} ${employee.last_name}` ===
                            answers.employee
                    );
                    const role = resRole.find(
                        (role) => role.title === answers.role
                    );
                    const query =
                        "UPDATE employee SET role_id = ? WHERE id = ?";
                    db.query(
                        query,
                        [role.id, employee.id],
                        (err, res) => {
                            if (err) throw err;
                            console.log(
                                `Updated ${employee.first_name} ${employee.last_name}'s role to ${role.title} in the database!`
                            );
                            start();
                        }
                    );
                });
        });
    });
}

//more employee info
//...by director
function showEmployeesByDirector() {
    const query = `
      SELECT 
        e.id, 
        e.first_name, 
        e.last_name, 
        r.title, 
        d.dept_name, 
        CONCAT(m.first_name, ' ', m.last_name) AS manager_name
      FROM 
        employee e
        INNER JOIN role r ON e.role_id = r.id
        INNER JOIN department d ON r.department_id = d.id
        LEFT JOIN employee m ON e.manager_id = m.id
      ORDER BY 
        manager_name, 
        e.last_name, 
        e.first_name
    `;
    db.query(query, (err, res) => {
        if (err) throw err;

        const employeesByManager = res.reduce((acc, cur) => {
            const managerName = cur.manager_name;
            if (acc[managerName]) {
                acc[managerName].push(cur);
            } else {
                acc[managerName] = [cur];
            }
            return acc;
        }, {});

        console.log("Employees by Director/Manager:");
        for (const managerName in employeesByManager) {
            console.log(`\n${managerName}:`);
            const employee = employeesByManager[managerName];
            employee.forEach((employee) => {
                console.log(
                    `  ${employee.first_name} ${employee.last_name} | ${employee.title} | ${employee.dept_name}`
                );
            });
        }
        start();
    });
}

//...by dept
function showEmployeesByDepartment() {
    const query =
        "SELECT department.dept_name, employee.first_name, employee.last_name FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY department.dept_name ASC";

    db.query(query, (err, res) => {
        if (err) throw err;
        console.log("\nEmployees by department:");
        console.table(res);
        start();
    });
}

////REMOVE////
//...bye felicia removeDepartmentsRolesEmployees
function removeDepartmentsRolesEmployees() {
    inquirer
        .prompt({
            type: "list",
            name: "data",
            message: "What would you like to delete?",
            choices: ["Employee", "Role", "Department"],
        })
        .then((answer) => {
            switch (answer.data) {
                case "Employee":
                    deleteEmployee();
                    break;
                case "Role":
                    deleteRole();
                    break;
                case "Department":
                    deleteDepartment();
                    break;
                default:
                    console.log(`Invalid data: ${answer.data}`);
                    start();
                    break;
            }
        });
}

//since we cannot delete them as a bundle, they need separate code
//dept
function deleteDepartment() {
    const query = "SELECT * FROM department";
    db.query(query, (err, res) => {
        if (err) throw err;
        const departmentChoices = res.map((department) => ({
            name: department.dept_name,
            value: department.id,
        }));
        inquirer
            .prompt({
                type: "list",
                name: "departmentId",
                message: "Which department do you want to delete?",
                choices: [
                    ...departmentChoices,
                    { name: "Go Back", value: "back" },
                ],
            })
            .then((answer) => {
                if (answer.departmentId === "back") {
                    removeDepartmentsRolesEmployees();
                } else {
                    const query = "DELETE FROM department WHERE id = ?";
                    db.query(
                        query,
                        [answer.departmentId],
                        (err, res) => {
                            if (err) throw err;
                            console.log(
                                `Deleted department with ID ${answer.departmentId} from the database!`
                            );
                            start();
                        }
                    );
                }
            });
    });
}

//role
function deleteRole() {
    const query = "SELECT * FROM role";
    db.query(query, (err, res) => {
        if (err) throw err;
        const choices = res.map((role) => ({
            name: `${role.title} (${role.id}) - ${role.salary}`,
            value: role.id,
        }));
        choices.push({ name: "Go Back", value: null });
        inquirer
            .prompt({
                type: "list",
                name: "roleId",
                message: "Select the role you want to delete:",
                choices: choices,
            })
            .then((answer) => {
                if (answer.roleId === null) {
                    removeDepartmentsRolesEmployees();
                    return;
                }
                const query = "DELETE FROM role WHERE id = ?";
                db.query(query, [answer.roleId], (err, res) => {
                    if (err) throw err;
                    console.log(
                        `Deleted role with ID ${answer.roleId} from the database!`
                    );
                    start();
                });
            });
    });
}

//employee 
function deleteEmployee() {
    const query = "SELECT * FROM employee";
    db.query(query, (err, res) => {
        if (err) throw err;
        const employeeList = res.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
        }));
        employeeList.push({ name: "Go Back", value: "back" });
        inquirer
            .prompt({
                type: "list",
                name: "id",
                message: "Select the employee you want to delete:",
                choices: employeeList,
            })
            .then((answer) => {
                if (answer.id === "back") {
                    removeDepartmentsRolesEmployees();
                    return;
                }
                const query = "DELETE FROM employee WHERE id = ?";
                db.query(query, [answer.id], (err, res) => {
                    if (err) throw err;
                    console.log(
                        `Deleted employee with ID ${answer.id} from the database!`
                        
                    );
                    start();
                });
            });
    });
}

////PAYROLL////
//lets talk money showCombinedSalariesOfAllEmployeesInDepartment
function showCombinedSalariesOfAllEmployeesInDepartment() {
    const query = "SELECT * FROM department";
    db.query(query, (err, res) => {
        if (err) throw err;
        const departmentChoices = res.map((department) => ({
            name: department.dept_name,
            value: department.id,
        }));

        inquirer
            .prompt({
                type: "list",
                name: "departmentId",
                message:
                    "Which department are you looking to view and calculate for?",
                choices: departmentChoices,
            })
            .then((answer) => {
                const query =
                `SELECT 
                departments.department_name AS department,
                SUM(roles.salary) AS total_salary
              FROM 
                departments
                INNER JOIN roles ON departments.id = roles.department_id
                INNER JOIN employee ON roles.id = employee.role_id
              WHERE 
                departments.id = ?
              GROUP BY 
                departments.id;`;
            db.query(query, [answer.departmentId], (err, res) => {
                if (err) throw err;
                const totalSalary = res[0].total_salary;
                console.log(
                    `The total pay for employees in this department is $${totalSalary}`
                );
                start();
            });
        });
    });
}

//this is the end...
process.on("done", () => {
    connection.end();
});