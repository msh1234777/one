const express = require('express');
const db = require('./db');
const app = express();
const PORT = 3001;

app.use(express.json());


async function AllPosts(req, res) {
  try {
    const results = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM posts ORDER BY date DESC', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    res.json(results);
  } catch {
    res.send('error');
  }
}

async function SinglePost(req, res) {
  try {
    const post = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM posts WHERE id = ?', [req.params.id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    if (post.length === 0) return res.send('not found');
    res.json(post[0]);
  } catch {
    res.send('error');
  }
}

// 생성
async function createPost(req, res) {
  const { title, content } = req.body;
  try {
    await new Promise((resolve, reject) => {
      db.query('INSERT INTO posts (title, content) VALUES (?, ?)', [title, content], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    res.send('created');
  } catch {
    res.send('error');
  }
}

// 수정
async function updatePost(req, res) {
  const { title, content } = req.body;
  try {
    const result = await new Promise((resolve, reject) => {
      db.query(
        'UPDATE posts SET title = ?, content = ? WHERE id = ?',
        [title, content, req.params.id],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
    if (result.affectedRows === 0) return res.send('not found');
    res.send('updated');
  } catch {
    res.send('error');
  }
}

// 삭제
async function deletePost(req, res) {
  try {
    const result = await new Promise((resolve, reject) => {
      db.query('DELETE FROM posts WHERE id = ?', [req.params.id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    if (result.affectedRows === 0) return res.send('not found');
    res.send('deleted');
  } catch {
    res.send('error');
  }
}

app.get('/posts', AllPosts);
app.get('/posts/:id', SinglePost);
app.post('/posts', createPost);
app.put('/posts/:id', updatePost);
app.delete('/posts/:id', deletePost);

app.listen(PORT, () => {
  console.log('server started');
});