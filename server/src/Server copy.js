let express = require("express");
let cors = require('cors');
let path = require('path');
let MongoClient = require("mongodb").MongoClient;
let sanitizer = require("express-sanitizer");
let ObjectId = require("mongodb").ObjectId;

// MongoDB constants
const URL = "mongodb://mongo:27017/";
const DB_NAME = "dbPhotoAlbum";

// construct application object via express
let app = express();
// add cors as middleware to handle CORs errors while developing
app.use(cors());

// middleware body parser to isolate data in incoming JSON
app.use(express.json());
// add middleware for sanitizer to check on incoming JSON data
app.use(sanitizer());

// get absolute path to /build folder (production build of react web app)
const CLIENT_BUILD_PATH = path.join(__dirname, "./../../client/build");
// adding middleware to define static files location
app.use("/", express.static(CLIENT_BUILD_PATH));

app.get("/get", async (request, response) => {
    // construct a MongoClient object, passing in additional options
    let mongoClient = new MongoClient(URL, { useUnifiedTopology: true });
    try {
        await mongoClient.connect();
        // get reference to database via name
        let db = mongoClient.db(DB_NAME);
        let photoArray = await db.collection("photos").find().sort("name",1).toArray();
        let json = { "photos": photoArray };
        // serializes sampleJSON to string format
        response.status(200);
        response.send(json);
    } catch (error) {
        console.log(`>>> ERROR : ${error.message}`);
        response.status(500);
        response.send({error: error.message});
    } finally {
        mongoClient.close();
    }
});

app.post("/post", async (request, response) => {
    // construct a MongoClient object, passing in additional options
    let mongoClient = new MongoClient(URL, { useUnifiedTopology: true });

    try {
        await mongoClient.connect();
        // sanitize form input
        request.body.title = request.sanitize(request.body.title);
        request.body.caption = request.sanitize(request.body.caption);
        request.body.source = request.sanitize(request.body.source);
        request.body.comments.forEach(comment => {
            comment.comment = request.sanitize(comment.comment);
            comment.author = request.sanitize(comment.author);
        });
        // get reference to collection
        let photoAlbum = mongoClient.db(DB_NAME).collection("photos");
        // add new technology document into collection
        let result = await photoAlbum.insertOne(request.body);
        // status code
        response.status(200);
        response.send(result);
    } catch (error) {
        console.log(`>>> ERROR : ${error.message}`);
        response.status(500);
        response.send({error: error.message});
    } finally {
        mongoClient.close();
    }
});

app.put("/put/:id", async (request, response) => {
    // construct a MongoClient object, passing in additional options
    let mongoClient = new MongoClient(URL, { useUnifiedTopology: true });

    // isolate route parameter and convert to ObjectId object
    let id = new ObjectId(request.sanitize(request.params.id));

    try {
        await mongoClient.connect();

        // sanitize form input
        request.body.title = request.sanitize(request.body.title);
        request.body.caption = request.sanitize(request.body.caption);
        request.body.source = request.sanitize(request.body.source);
        request.body.comments.forEach(comment => {
            comment.comment = request.sanitize(comment.comment);
            comment.author = request.sanitize(comment.author);
        });
        // get reference to collection
        let photoAlbum = mongoClient.db(DB_NAME).collection("photos");
        // setup the update query
        let selector = {"_id" : id};
        let newValues = { $set : request.body};
        // make it happen
        let result = await photoAlbum.updateOne(selector, newValues);

        if (result.matchedCount <= 0) {
            response.status(404);
            response.send({error: "No photos documents found with ID"});
            mongoClient.close();
            return;
        }
        // status code
        response.status(200);
        response.send(result);
    } catch (error) {
        console.log(`>>> ERROR : ${error.message}`);
        response.status(500);
        response.send({error: error.message});
    } finally {
        mongoClient.close();
    }
});

// wildcard to handle all other non-api URL routings and point to index.html
app.use((request, response) => {
    response.sendFile(path.join(CLIENT_BUILD_PATH, 'index.html'));
});

app.listen(8080, () => console.log("Listening on port 8080"));