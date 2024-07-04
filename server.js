const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

let posts = [];
let currentPostId = 1;
let currentCommentId = 1;

app.get('/posts', (req, res) => {
    res.json(posts);
});

app.post('/posts', (req, res) => {
    const post = {
        id: currentPostId++,
        content: req.body.content,
        comments: []
    };
    posts.push(post);
    res.json(post);
});

app.post('/posts/:postId/comments', (req, res) => {
    const postId = parseInt(req.params.postId, 10);
    const post = posts.find(p => p.id === postId);
    if (post) {
        const comment = {
            id: currentCommentId++,
            content: req.body.content
        };
        post.comments.push(comment);
        res.json(comment);
    } else {
        res.status(404).send('Post not found');
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
