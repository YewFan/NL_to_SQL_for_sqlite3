<<<<<<< HEAD
# NL_to_SQL_for_sqlite3
Translate natural language into SQL by calling openai api
=======
# Database Querying with Natural Language

This project lets users query a database using natural language instead of writing SQL manually.

## Overview

The application uses the OpenAI API to translate user input into SQL queries. It also requires the user to provide the database file path so the app can generate a summary file for fine-tuning purposes. Once the SQL is generated, it can be used to query the database and display the results.

The desktop interface is built with Electron, and the main application logic is written in JavaScript.

It is the first version. 

## Features

- Natural language to SQL conversion
- Database file path support
- OpenAI-powered query generation
- Simple desktop interface powered by Electron

## Installation

1. Install the project dependencies:

   ```bash
   npm install
   ```

2. Start the app:

   ```bash
   npm start
   ```

## Usage

Before running the app, make sure your OpenAI API key is set in the `.env` file.

After the app starts successfully, it will display a `Ready` state. Then enter:

- the natural language description of the query you want to run
- the file path to the database you want to work with

then click "NL_to_SQL" button. 

The app will generate SQL from your input and allow you to view the database results.
If the app throws an error, close the window and restart it.

## License

MIT
>>>>>>> 99205f8 (Initial commit)
