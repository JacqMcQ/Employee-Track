# Employee Tracker

A command-line application for managing an employee database. This app allows you to view and manage departments, roles, and employees in a PostgreSQL database.

## Features

- **View all departments**: List all departments in the database.
- **View all roles**: List all roles and their associated departments.
- **View all employees**: List all employees with their roles, departments, and managers.
- **Add a department**: Insert a new department into the database.
- **Add a role**: Insert a new role into the database and associate it with a department.
- **Add an employee**: Insert a new employee into the database, assigning them a role and optional manager.
- **Update an employee role**: Change the role of an existing employee.

## Prerequisites

- [Node.js](https://nodejs.org/) - JavaScript runtime
- [PostgreSQL](https://www.postgresql.org/) - Database system

## Installation

1. **Clone the repository**

   ```bash
   git clone <https://github.com/JacqMcQ/Employee-Track>
   navigate (cd).

2. **Install dependencies**

    npm install

3. **Create a .env file**
    :
    DB_USER=your-db-username
    DB_PASSWORD=your-db-password
    DB_HOST=your-db-host
    DB_DATABASE=your-db-database
    PORT=3001

4. **Set up the PostgreSQL database**
    Make sure you have a PostgreSQL database set up with the necessary tables. You can reate the database schema manually if not provided.

## Usage
1. Start the application
2. Follow the prompts (The application will display a series of prompts in the terminal. Use these prompts to view and manage your employee database.)

## Code Overview

index.js: The main file that initializes the application, sets up the database connection, and provides a CLI interface for interacting with the database.

**Dependencies:**

    dotenv: Loads environment variables from a .env file.
    express: Web framework (though not used in this version, included for potential future use).
    pg: PostgreSQL client for Node.js.
    inquirer: CLI prompt library for user interaction.
    console.table: Utility for displaying tabular data in the console.

**Functions:**

    startPrompt(): Initiates the command-line interface and handles user choices.
    viewDepartments(): Displays all departments.
    viewRoles(): Displays all roles and their departments.
    viewEmployees(): Displays all employees with their roles, departments, and managers.
    addDepartment(): Adds a new department.
    addRole(): Adds a new role.
    addEmployee(): Adds a new employee.
    updateEmployeeRole(): Updates an employee's role.

## Acknowledgements
    Node.js
    PostgreSQL
    Inquirer.js
    Console.table

## Cotributions

Course material from the UT Austin Coding Bootcamp was referenced throught the project to include the generation of the dotenv file. AI was used to troubleshoot for issues with syntactical errors as well as correct fommating for the pool.query method used in the code to retrieve the id, title, salary, and name (aliased as department) from the roles table and then join the roles table with the departments table on the department_id column. Stack overflow was cited for usage of Inquiry library,  https://stackoverflow.com/questions/78085379/inquirer-doesnt-wait-for-input-after-prompt.

## License: NA