const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

app.use(express.json());

// Create a MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'todo_app',
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Create a new todo
app.post('/todos', (req, res) => {
  const { title } = req.body;
  const query = 'INSERT INTO todos (title) VALUES (?)';
  db.query(query, [title], (err, result) => {
    if (err) {
      console.error('Error creating todo:', err);
      res.status(500).json({ error: 'Error creating todo' });
    } else {
      res.status(201).json({ id: result.insertId, title });
    }
  });
});

// Get all todos
app.get('/todos', (req, res) => {
  const query = 'SELECT * FROM todos';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching todos:', err);
      res.status(500).json({ error: 'Error fetching todos' });
    } else {
      res.json(results);
    }
  });
});

// Get a specific todo by ID
app.get('/todos/:id', (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM todos WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching todo:', err);
      res.status(500).json({ error: 'Error fetching todo' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'Todo not found' });
    } else {
      res.json(results[0]);
    }
  });
});

// Update a todo by ID
app.put('/todos/:id', (req, res) => {
  const id = req.params.id;
  const { title } = req.body;
  const query = 'UPDATE todos SET title = ? WHERE id = ?';
  db.query(query, [title, id], (err, result) => {
    if (err) {
      console.error('Error updating todo:', err);
      res.status(500).json({ error: 'Error updating todo' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Todo not found' });
    } else {
      res.json({ id, title });
    }
  });
});

// Delete a todo by ID
app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM todos WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting todo:', err);
      res.status(500).json({ error: 'Error deleting todo' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Todo not found' });
    } else {
      res.json({ id });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
