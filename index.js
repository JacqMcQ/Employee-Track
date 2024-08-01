const { Client } = require('pg');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

const client = new Client({
  host: 'localhost',
  user: 'postgres',
  password: 'Wxv2y8bw',
  database: 'employee_tracker_db'
});

client.connect()
  .then(() => {
    console.log('Connected to the database.');
    startPrompt();
  })
  .catch(err => {
    console.error('Connection error', err.stack);
  });

// Main function to display the menu options-TBC