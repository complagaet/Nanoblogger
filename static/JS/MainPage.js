const loadPosts = async () => {
    try {
        let response = await fetch("/blogs");
        if (!response.ok) { throw new Error(`HTTP error! ${response.status}`); }
        return await response.json()
    } catch (err) {
        console.error("Error:", err);
    }
}

const renderPosts = (posts) => {
    let html = ""
    for (let i of posts) {
        html += `
            <div class="post bobatron flex-column" Bt-CM="0.7" style="gap: 5px" onclick="window.location.href = 'post/${i._id}'">
                <h3>${i.title}</h3>
                <p>${i.content}</p>
            </div>
        `
    }
    document.getElementById("posts").innerHTML = html
    bobatron.scanner()
}

let posts = []

document.addEventListener('DOMContentLoaded', async () => {
    bobatron.scanner()
    posts = await loadPosts()
    renderPosts(posts)
})

window.addEventListener('resize', () => {
    bobatron.scanner()
})