const postData = async (url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

const submitPost = async () => {
    const author = document.getElementById('author').value;
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    if (!title || !content) {
        alert('Title and content are required!');
        return;
    }

    let res = await postData("/blogs", {title: title, content: content, author: author ? author : "Anonymous"})
    if (res !== "error") {
        document.location.href = "/";
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    bobatron.scanner()
})

window.addEventListener('resize', () => {
    bobatron.scanner()
})