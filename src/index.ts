import express, { Request, Response } from 'express';
const cors = require('cors');
const bodyParser = require('body-parser');
import { connection } from './db';
const app = express();
const port = 3000;
app.use(bodyParser.json());

type Book = {
  id: number | string;
  name: string;
  author: string;
  genre: string;
  year: number;
  createdAt: Date;
};

app.use(
  cors({
    origin: '*',
  })
);

app.get('/books', async (req: Request<{}, {}, Book>, res) => {
  connection.query('SELECT * FROM books', (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});

app.get('/books/:id', async (req: Request<{ id: string }, {}, {}>, res) => {
  connection.query(`SELECT * FROM books WHERE id = '${req.params.id}'`, (error: any, results: string[]) => {
    console.log(results);
    if (error) {
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results[0]);
  });
});

app.delete('/books/:id', async (req: Request<{ id: string }, {}, {}>, res) => {
  connection.query(`DELETE FROM books WHERE id = '${req.params.id}'`, (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});

app.post('/book', async (req, res) => {
  const { name, author, genre, year, createdAt } = req.body;

  if (!name || !author || !genre || !year || !createdAt) {
    res.status(400).json({
      error: {
        message: 'Some data are missing!',
      },
    });
    return;
  }
  connection.query(
    `
    INSERT INTO books (name, author, genre, year, createdAt)
    VALUES ('${name}', '${author}', '${genre}', '${year}','${createdAt}')
  `,
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      res.json(results);
    }
  );
});

app.put('/books/:id', async (req, res) => {
  const { name, author, genre, year, createdAt } = req.body;

  const id = parseInt(req.params.id);
  console.log('id', id);

  if (!name || !author || !genre || !year || !createdAt) {
    res.status(400).json({
      error: {
        message: 'Some data are missing!',
      },
    });
    return;
  }
  connection.query(
    `
    UPDATE books 
    SET name = '${name}', author = '${author}', genre = '${genre}', year = '${year}', createdAt = '${createdAt}'
    WHERE id = ${id}
  `,
    (error, results) => {
      console.log(error);
      if (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      res.json(results);
    }
  );
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
