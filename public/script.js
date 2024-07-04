document.addEventListener("DOMContentLoaded", loadPosts);

function loadPosts() {
    fetch('/posts')
        .then(response => response.json())
        .then(posts => {
            const postsContainer = document.getElementById('posts');
            postsContainer.innerHTML = '';
            posts.forEach(post => {
                const postElement = createPostElement(post);
                postsContainer.appendChild(postElement);
            });
        });
}

function addPost() {
    const content = document.getElementById('post-content').value;
    fetch('/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
    })
    .then(response => response.json())
    .then(post => {
        const postsContainer = document.getElementById('posts');
        const postElement = createPostElement(post);
        postsContainer.insertBefore(postElement, postsContainer.firstChild);
        document.getElementById('post-content').value = '';
    });
}

function addComment(postId) {
    const content = document.getElementById(`comment-content-${postId}`).value;
    fetch(`/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
    })
    .then(response => response.json())
    .then(comment => {
        const postElement = document.getElementById(`post-${postId}`);
        const commentsContainer = postElement.querySelector('.comments');
        const commentElement = createCommentElement(comment);
        commentsContainer.appendChild(commentElement);
        document.getElementById(`comment-content-${postId}`).value = '';
    });
}

function createPostElement(post) {
    const postElement = document.createElement('div');
    postElement.className = 'post';
    postElement.id = `post-${post.id}`;
    postElement.innerHTML = `
        <p>${post.content}</p>
        <div class="comments"></div>
        <div class="comment-form">
            <textarea id="comment-content-${post.id}" placeholder="Write a comment..."></textarea>
            <button onclick="addComment(${post.id})">Comment</button>
        </div>
    `;
    post.comments.forEach(comment => {
        const commentElement = createCommentElement(comment);
        postElement.querySelector('.comments').appendChild(commentElement);
    });
    return postElement;
}

function createCommentElement(comment) {
    const commentElement = document.createElement('div');
    commentElement.className = 'comment';
    commentElement.innerHTML = `<p>${comment.content}</p>`;
    return commentElement;
}
