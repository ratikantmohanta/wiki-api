//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');


mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

const wikiSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", wikiSchema);


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


/////////////////////////////////////////request targeting all articles////////////////////////////////////////////////

app.route("/articles")
    .get(function (req, res) {
        Article.find({}, function (err, foundArticles) {
            if (!err) {
                res.send(foundArticles);
            }
            else {
                res.send(err);
            }
        });
    })
    .post(function (req, res) {
        const article = new Article({
            title: req.body.title,
            content: req.body.content
        });
        article.save(function (err) {
            if (!err) {
                res.send("Successfully added a new article.")
            } else {
                res.send(err);
            }
        });
    })
    .delete(function (req, res) {
        Article.deleteMany({}, function (err) {
            if (!err) {
                res.send("Successfully deleted all articles.")
            } else {
                res.send(err);
            }
        });
    });


/////////////////////////////////////////request targeting a specific articles////////////////////////////////////////////////

app.route("/articles/:articleTitle")
    .get((req, res) => {
        Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
            if (!err) {
                res.send(foundArticle);
            }
            else {
                res.send(err);
            }
        });
    })
    .put((req, res) => {
        Article.updateOne(
            { title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            function (err) {
                if (!err) {
                    res.send("successfull updated article.");
                }
            });
    })
    .patch((req, res) => {

        Article.updateOne(
            { title: req.params.articleTitle },
            { $set: req.body },
            function (err) {
                if (!err) {
                    res.send("successfull updated article.");
                }
            });
    })
    .delete(function (req, res) {
        Article.deleteOne(
            { title: req.params.articleTitle },
            function (err) {
                if (!err) {
                    res.send("Successfully deleted article.")
                } else {
                    res.send(err);
                }
            });
    });



// app.get("/articles", function (req, res) {
//     Article.find({}, function (err, foundArticles) {
//         if (!err) {
//             res.send(foundArticles);
//         }
//         else {
//             res.send(err);
//         }
//     });
// });

// app.post("/articles", function (req, res) {
//     const article = new Article({
//         title: req.body.title,
//         content: req.body.content
//     });
//     article.save(function (err) {
//         if (!err) {
//             res.send("Successfully added a new article.")
//         } else {
//             res.send(err);
//         }
//     });
// });

// app.delete("/articles", function (req, res) {
//     Article.deleteMany({}, function (err) {
//         if (!err) {
//             res.send("Successfully deleted all articles.")
//         } else {
//             res.send(err);
//         }
//     });
// });


app.listen(3000, function () {
    console.log("Server started on port 3000");
});