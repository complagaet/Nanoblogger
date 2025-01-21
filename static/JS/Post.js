let postId = ""

async function deletePost(postId) {
    try {
        let response = await fetch(`/blogs/${postId}`, {
            method: "DELETE"
        });
        if (!response.ok) { throw new Error(`HTTP error! ${response.status}`); }
        return await response.text()
    } catch (err) {
        console.error("Error:", err);
    }
}

const updatePost = async () => {
    const author = document.getElementById('author').value;
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    if (!author || !title || !content) {
        alert('All fields are required!');
        return;
    }

    const response = await fetch(`/blogs/${postId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({title: title, content: content, author: author})
    });
    return await response.text()
}


document.addEventListener('DOMContentLoaded', async () => {
    console.log(postId);
    bobatron.scanner()

    document.getElementById("delete").onclick = async () => {
        let result = await deletePost(postId);
        if (result === "deleted") {
            document.location.href = "/";
        }
    }

    document.getElementById("update").onclick = async () => {
        let result = await updatePost();
        console.log(result);
        if (result) {
            document.location.href = "/";
        }
    }
})

window.addEventListener('resize', () => {
    bobatron.scanner()
})