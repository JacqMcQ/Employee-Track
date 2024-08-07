const express = require('express');
const { Pool } = require('pg');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

const app = express();
const PORT = process.env.PORT || 3001;

const pool = new Pool(
  {
    user: 'postgres',
    password: 'NolRow20',
    host: 'localhost',
    database: 'employee_tracker_db'
  },

  console.log(`Connected to the books_db database.`)
)

pool.connect()
  .then(() => console.log('Connected to the employee_tracker_db database.'))
  .catch(err => console.error('Connection error', err.stack));

function startPrompt() {
  inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'View employees by manager',
        'View employees by department',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Update an employee manager',
        'Delete a department',
        'Delete a role',
        'Delete an employee',
        'View total utilized budget by department',
        'Exit'
      ]
    }
  ])
  .then((answer) => {
    switch (answer.action) {
      case 'View all departments':
        viewDepartments();
        break;
      case 'View all roles':
        viewRoles();
        break;
      case 'View all employees':
        viewEmployees();
        break;
      case 'View employees by manager':
        viewEmployeesByManager();
        break;
      case 'View employees by department':
        viewEmployeesByDepartment();
        break;
      case 'Add a department':
        addDepartment();
        break;
      case 'Add a role':
        addRole();
        break;
      case 'Add an employee':
        addEmployee();
        break;
      case 'Update an employee role':
        updateEmployeeRole();
        break;
      case 'Update an employee manager':
        updateEmployeeManager();
        break;
      case 'Delete a department':
        deleteDepartment();
        break;
      case 'Delete a role':
        deleteRole();
        break;
      case 'Delete an employee':
        deleteEmployee();
        break;
      case 'View total utilized budget by department':
        viewTotalBudgetByDepartment();
        break;
      case 'Exit':
        pool.end();
        break;
    }
  });
}

function viewDepartments() {
  pool.query('SELECT id, name FROM departments', (err, res) => {
    if (err) throw err;
    console.table(res.rows);
    startPrompt();
  });
}

function viewRoles() {
  pool.query(`
    SELECT roles.id, roles.title, roles.salary, departments.name AS department 
    FROM roles 
    JOIN departments ON roles.department_id = departments.id
  `, (err, res) => {
    if (err) throw err;
    console.table(res.rows);
    startPrompt();
  });
}

function viewEmployees() {
  pool.query(`
    SELECT e.id, e.first_name, e.last_name, r.title AS role, d.name AS department, r.salary, m.first_name AS manager
    FROM employees e
    LEFT JOIN roles r ON e.role_id = r.id
    LEFT JOIN departments d ON r.department_id = d.id
    LEFT JOIN employees m ON e.manager_id = m.id
  `, (err, res) => {
    if (err) throw err;
    console.table(res.rows);
    startPrompt();
  });
}

function viewEmployeesByManager() {
  pool.query('SELECT id, CONCAT(first_name, \' \', last_name) AS name FROM employees', (err, res) => {
    if (err) throw err;
    const employees = res.rows.map(emp => ({ name: emp.name, value: emp.id }));
    
    inquirer.prompt([
      {
        type: 'list',
        name: 'managerId',
        message: 'Select the manager to view their employees:',
        choices: employees
      }
    ])
    .then(answer => {
      pool.query(`
        SELECT e.id, e.first_name, e.last_name, r.title AS role, d.name AS department
        FROM employees e
        LEFT JOIN roles r ON e.role_id = r.id
        LEFT JOIN departments d ON r.department_id = d.id
        WHERE e.manager_id = $1
      `, [answer.managerId], (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        startPrompt();
      });
    });
  });
}

function viewEmployeesByDepartment() {
  pool.query('SELECT id, name FROM departments', (err, res) => {
    if (err) throw err;
    const departments = res.rows.map(dept => ({ name: dept.name, value: dept.id }));
    
    inquirer.prompt([
      {
        type: 'list',
        name: 'departmentId',
        message: 'Select the department to view its employees:',
        choices: departments
      }
    ])
    .then(answer => {
      pool.query(`
        SELECT e.id, e.first_name, e.last_name, r.title AS role
        FROM employees e
        LEFT JOIN roles r ON e.role_id = r.id
        WHERE r.department_id = $1
      `, [answer.departmentId], (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        startPrompt();
      });
    });
  });
}

function addDepartment() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'departmentName',
      message: 'Enter the name of the new department:'
    }
  ])
  .then((answer) => {
    pool.query('INSERT INTO departments (name) VALUES ($1)', [answer.departmentName], (err) => {
      if (err) throw err;
      console.log('Department added successfully.');
      startPrompt();
    });
  });
}

function addRole() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'roleName',
      message: 'Enter the title of the new role:'
    },
    {
      type: 'input',
      name: 'salary',
      message: 'Enter the salary for this role:',
      validate: input => !isNaN(input) || 'Please enter a valid number.'
    },
    {
      type: 'list',
      name: 'department',
      message: 'Select the department for this role:',
      choices: async () => {
        const res = await pool.query('SELECT id, name FROM departments');
        return res.rows.map(dept => ({ name: dept.name, value: dept.id }));
      }
    }
  ])
  .then((answer) => {
    pool.query('INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)', [answer.roleName, answer.salary, answer.department], (err) => {
      if (err) throw err;
      console.log('Role added successfully.');
      startPrompt();
    });
  });
}

function addEmployee() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: 'Enter the employee\'s first name:'
    },
    {
      type: 'input',
      name: 'lastName',
      message: 'Enter the employee\'s last name:'
    },
    {
      type: 'list',
      name: 'role',
      message: 'Select the employee\'s role:',
      choices: async () => {
        const res = await pool.query('SELECT id, title FROM roles');
        return res.rows.map(role => ({ name: role.title, value: role.id }));
      }
    },
    {
      type: 'list',
      name: 'manager',
      message: 'Select the employee\'s manager (leave blank if none):',
      choices: async () => {
        const res = await pool.query('SELECT id, CONCAT(first_name, \' \', last_name) AS name FROM employees');
        return [{ name: 'None', value: null }].concat(res.rows.map(emp => ({ name: emp.name, value: emp.id })));
      }
    }
  ])
  .then((answer) => {
    pool.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [answer.firstName, answer.lastName, answer.role, answer.manager], (err) => {
      if (err) throw err;
      console.log('Employee added successfully.');
      startPrompt();
    });
  });
}

function updateEmployeeRole() {
  inquirer.prompt([
    {
      type: 'list',
      name: 'employee',
      message: 'Select the employee to update:',
      choices: async () => {
        const res = await pool.query('SELECT id, CONCAT(first_name, \' \', last_name) AS name FROM employees');
        return res.rows.map(emp => ({ name: emp.name, value: emp.id }));
      }
    },
    {
      type: 'list',
      name: 'newRole',
      message: 'Select the new role for this employee:',
      choices: async () => {
        const res = await pool.query('SELECT id, title FROM roles');
        return res.rows.map(role => ({ name: role.title, value: role.id }));
      }
    }
  ])
  .then((answer) => {
    pool.query('UPDATE employees SET role_id = $1 WHERE id = $2', [answer.newRole, answer.employee], (err) => {
      if (err) throw err;
      console.log('Employee role updated successfully.');
      startPrompt();
    });
  });
}

function updateEmployeeManager() {
  inquirer.prompt([
    {
      type: 'list',
      name: 'employee',
      message: 'Select the employee to update:',
      choices: async () => {
        const res = await pool.query('SELECT id, CONCAT(first_name, \' \', last_name) AS name FROM employees');
        return res.rows.map(emp => ({ name: emp.name, value: emp.id }));
      }
    },
    {
      type: 'list',
      name: 'newManager',
      message: 'Select the new manager for this employee (leave blank if none):',
      choices: async () => {
        const res = await pool.query('SELECT id, CONCAT(first_name, \' \', last_name) AS name FROM employees');
        return [{ name: 'None', value: null }].concat(res.rows.map(emp => ({ name: emp.name, value: emp.id })));
      }
    }
  ])
  .then((answer) => {
    pool.query('UPDATE employees SET manager_id = $1 WHERE id = $2', [answer.newManager, answer.employee], (err) => {
      if (err) throw err;
      console.log('Employee manager updated successfully.');
      startPrompt();
    });
  });
}

function deleteDepartment() {
  inquirer.prompt([
    {
      type: 'list',
      name: 'departmentId',
      message: 'Select the department to delete:',
      choices: async () => {
        const res = await pool.query('SELECT id, name FROM departments');
        return res.rows.map(dept => ({ name: dept.name, value: dept.id }));
      }
    }
  ])
  .then(answer => {
    pool.query('DELETE FROM departments WHERE id = $1', [answer.departmentId], (err) => {
      if (err) throw err;
      console.log('Department deleted successfully.');
      startPrompt();
    });
  });
}

function deleteRole() {
  inquirer.prompt([
    {
      type: 'list',
      name: 'roleId',
      message: 'Select the role to delete:',
      choices: async () => {
        const res = await pool.query('SELECT id, title FROM roles');
        return res.rows.map(role => ({ name: role.title, value: role.id }));
      }
    }
  ])
  .then(answer => {
    pool.query('DELETE FROM roles WHERE id = $1', [answer.roleId], (err) => {
      if (err) throw err;
      console.log('Role deleted successfully.');
      startPrompt();
    });
  });
}

function deleteEmployee() {
  inquirer.prompt([
    {
      type: 'list',
      name: 'employeeId',
      message: 'Select the employee to delete:',
      choices: async () => {
        const res = await pool.query('SELECT id, CONCAT(first_name, \' \', last_name) AS name FROM employees');
        return res.rows.map(emp => ({ name: emp.name, value: emp.id }));
      }
    }
  ])
  .then(answer => {
    pool.query('DELETE FROM employees WHERE id = $1', [answer.employeeId], (err) => {
      if (err) throw err;
      console.log('Employee deleted successfully.');
      startPrompt();
    });
  });
}

function viewTotalBudgetByDepartment() {
  pool.query('SELECT id, name FROM departments', (err, res) => {
    if (err) throw err;
    const departments = res.rows.map(dept => ({ name: dept.name, value: dept.id }));
    
    inquirer.prompt([
      {
        type: 'list',
        name: 'departmentId',
        message: 'Select the department to view its total budget:',
        choices: departments
      }
    ])
    .then(answer => {
      pool.query(`
        SELECT SUM(r.salary) AS total_budget
        FROM employees e
        JOIN roles r ON e.role_id = r.id
        WHERE r.department_id = $1
      `, [answer.departmentId], (err, res) => {
        if (err) throw err;
        console.log(`Total utilized budget for the department: $${res.rows[0].total_budget}`);
        startPrompt();
      });
    });
  });
}

startPrompt();
