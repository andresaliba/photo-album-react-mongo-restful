// drop collection if already exists
db.comments.drop();
// insert new documents into collection
db.comments.insert([
    {
        "_id": "1",
        "comment": "For testing purposes of course ;)",
        "author": "This is a new comment added here!",
    },
    {
        "_id": "2",
        "comment": "And another comment added!",
        "author": "Sean Morrow",
    },
    {
        "_id": "3",
        "comment": "Some comments added to this picture :P",
        "author": "Some Guy",
    },
    {
        "_id": "4",
        "comment": "and another comment here",
        "author": "another guy",
    },
    {
        "_id": "5",
        "comment": "Take this picture down now!",
        "author": "Annonymous",
    },
    {
        "_id": "6",
        "comment": "Josh was here!",
        "author": "Some guy",
    },
    {
        "_id": "7",
        "comment": "first posting!",
        "author": "testing dude",
    },
]);