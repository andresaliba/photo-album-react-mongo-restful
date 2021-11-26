let express = require("express");
let cors = require("cors");
let path = require("path");
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
    let photoArray = await db
        .collection("photos")
        .find()
        .sort("id", 1)
        .toArray();
    let json = { "photos": photoArray};

    // test for empty photo album <---
    // let json = { "photos": []};

    console.log(json);
    // serializes sampleJSON to string format
    response.status(200);
    response.send(json);
  } catch (error) {
    console.log(`>>> ERROR : ${error.message}`);
    response.status(500);
    response.send({ error: error.message });
  } finally {
    mongoClient.close();
  }
});

app.post("/comment", async (request, response) => {
  // construct a MongoClient object, passing in additional options
  let mongoClient = new MongoClient(URL, { useUnifiedTopology: true });
  // let id = new ObjectId(request.body._id);
  try {
      await mongoClient.connect();
      console.log(request.body);
    // sanitize form input
    request.body.id = request.sanitize(request.body.id);
    request.body.author = request.sanitize(request.body.author);
    request.body.comment = request.sanitize(request.body.comment);
    let commentsCollection = mongoClient.db(DB_NAME).collection("photos");
    let newValues = { $set : request.body};
    let result = await commentsCollection.updateOne({"id": request.body.id},
                                                        {"$push":{
                                                              "comments": {
                                                                "comment": request.body.comment,
                                                                "author": request.body.author
                                                              }
                                                            }
                                                        }
                                                    );
                                                    
    // let result = await commentsCollection.updateOne(
    //                                             {"_id": objectID}, 
    //                                               {$push: 
    //                                                 {"comments": 
    //                                                   {
    //                                                     "comment": request.body.comment
    //                                                     "author": request.body.author
    //                                                   }
    //                                                 }
    //                                               }
    //                                             );


    response.status(200);
    response.send(result);
  } catch (error) {
    console.log(`>>> ERROR : ${error.message}`);
    response.status(500);
    response.send({ error: error.message });
  } finally {
    mongoClient.close();
  }
});

// wildcard to handle all other non-api URL routings and point to index.html
app.use((request, response) => {
  response.sendFile(path.join(CLIENT_BUILD_PATH, "index.html"));
});

app.listen(8080, () => console.log("Listening on port 8080"));