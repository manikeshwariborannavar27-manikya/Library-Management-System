import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const DB_FILE = path.join(process.cwd(), 'books.json');

  // Initialize books.json if it doesn't exist
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([
      { id: '1', title: 'The Art of Racing in the Rain', author: 'Garth Stein', genre: 'Fiction', quantity: 5, status: 'Available' },
      { id: '2', title: 'F1: The Official History', author: 'Maurice Hamilton', genre: 'Sports', quantity: 2, status: 'Available' },
      { id: '3', title: 'Speed Secrets', author: 'Ross Bentley', genre: 'Technical', quantity: 3, status: 'Reserved' }
    ], null, 2));
  }

  const getBooks = () => JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  const saveBooks = (books: any) => fs.writeFileSync(DB_FILE, JSON.stringify(books, null, 2));

  // API Routes
  app.get('/api/books', (req, res) => {
    res.json(getBooks());
  });

  app.post('/api/books', (req, res) => {
    const books = getBooks();
    const newBook = { ...req.body, id: Date.now().toString() };
    books.push(newBook);
    saveBooks(books);
    res.status(201).json(newBook);
  });

  app.put('/api/books/:id', (req, res) => {
    const { id } = req.params;
    const books = getBooks();
    const index = books.findIndex((b: any) => b.id === id);
    if (index !== -1) {
      books[index] = { ...books[index], ...req.body, id };
      saveBooks(books);
      res.json(books[index]);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  });

  app.delete('/api/books/:id', (req, res) => {
    const { id } = req.params;
    const books = getBooks();
    const filtered = books.filter((b: any) => b.id !== id);
    if (filtered.length !== books.length) {
      saveBooks(filtered);
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
