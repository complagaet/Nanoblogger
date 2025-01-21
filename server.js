const express = require('express');
const { ObjectId } = require("mongodb");

const app = express();
const PORT = 3000;

app.use(express.static('static'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/user?:name', (req, res) => {
    console.log(`[GET /user]: Query received with name: ${req.query.name}`);
    res.send(`${req.query.name}`);
});

const MongoClient = require("mongodb").MongoClient;
const dbClient = new MongoClient("mongodb://127.0.0.1:27017/");
const collection = dbClient.db("blogs").collection("posts");

app.set('view engine', 'ejs');
app.set('views', './views');

app.get("/blogs", async (req, res) => {
    console.log("[GET /blogs]: Fetching all blogs...");
    let response = "";
    await dbClient.connect();

    try {
        response = await collection.find({}).toArray();
        console.log("[GET /blogs]: Blogs fetched successfully");
        res.send(response);
    } catch (err) {
        console.error("[GET /blogs Error]:", err);
        res.status(500).send("Internal Server Error");
    } finally {
        await dbClient.close();
        console.log("[GET /blogs]: MongoDB connection closed.");
    }
});

app.get("/blogs/:id", async (req, res) => {
    const id = req.params.id;
    console.log(`[GET /blogs/${id}]: Fetching blog post by ID...`);
    let post = "";
    await dbClient.connect();

    try {
        post = await collection.find({ _id: new ObjectId(id) }).toArray();
        if (post.length === 0) {
            console.log(`[GET /blogs/${id}]: Blog post not found.`);
            res.status(404).send("Blog post not found");
        } else {
            console.log(`[GET /blogs/${id}]: Blog post fetched successfully:`, post[0]);
            res.send(post[0]);
        }
    } catch (err) {
        console.error(`[GET /blogs/${id} Error]:`, err);
        res.status(500).send("Internal Server Error");
    } finally {
        await dbClient.close();
        console.log(`[GET /blogs/${id}]: MongoDB connection closed.`);
    }
});

app.post("/blogs", async (req, res) => {
    console.log("[POST /blogs]: New blog post received:", req.body);
    await dbClient.connect();

    try {
        const blogPost = {
            ...req.body,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        await collection.insertOne(blogPost);
        console.log("[POST /blogs]: Blog post inserted successfully.");
        res.status(201).send(JSON.stringify(blogPost));
    } catch (err) {
        console.error("[POST /blogs Error]:", err);
        res.status(500).send("Internal Server Error");
    } finally {
        await dbClient.close();
        console.log("[POST /blogs]: MongoDB connection closed.");
    }
});

app.delete("/blogs/:id", async (req, res) => {
    const id = req.params.id;
    console.log(`[DELETE /blogs/${id}]: Deleting blog post...`);
    await dbClient.connect();

    try {
        await collection.deleteOne({ _id: new ObjectId(id) });
        console.log(`[DELETE /blogs/${id}]: Blog post deleted successfully.`);
        res.send("deleted");
    } catch (err) {
        console.error(`[DELETE /blogs/${id} Error]:`, err);
        res.status(500).send("Internal Server Error");
    } finally {
        await dbClient.close();
        console.log(`[DELETE /blogs/${id}]: MongoDB connection closed.`);
    }
});

app.put("/blogs/:id", async (req, res) => {
    const id = req.params.id;
    console.log(`[PUT /blogs/${id}]: Updating blog post with data:`, req.body);
    await dbClient.connect();

    try {
        const updatedData = {
            ...req.body,
            updatedAt: new Date().toISOString(),
        };

        await collection.updateOne({ _id: new ObjectId(id) }, { $set: updatedData });
        console.log(`[PUT /blogs/${id}]: Blog post updated successfully.`);
        res.send(JSON.stringify(updatedData));
    } catch (err) {
        console.error(`[PUT /blogs/${id} Error]:`, err);
        res.status(500).send("Internal Server Error");
    } finally {
        await dbClient.close();
        console.log(`[PUT /blogs/${id}]: MongoDB connection closed.`);
    }
});


app.get("/post/:id", async (req, res) => {
    const id = req.params.id;
    console.log(`[GET /blogs/${id}]: Fetching blog post by ID...`);
    let post = "";
    await dbClient.connect();

    try {
        post = await collection.find({ _id: new ObjectId(id) }).toArray();
        if (post.length === 0) {
            console.log(`[GET /blogs/${id}]: Blog post not found.`);
            res.status(404).send("Blog post not found");
        } else {
            console.log(`[GET /blogs/${id}]: Blog post fetched successfully:`, post[0]);
            res.render('post', { post: post[0] });
        }
    } catch (err) {
        console.error(`[GET /blogs/${id} Error]:`, err);
        res.status(500).send("Internal Server Error");
    } finally {
        await dbClient.close();
        console.log(`[GET /blogs/${id}]: MongoDB connection closed.`);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
