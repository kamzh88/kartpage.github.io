const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");

const db = require("./models");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || "mongodb://user:password1@ds129098.mlab.com:29098/heroku_hxdh4c6z", { useNewUrlParser: true });
mongoose.connect(process.env.MONGODB_URI || "mongodb://user:password1@ds129098.mlab.com:29098/heroku_hxdh4c6z", { useFindAndModify: false });

app.get("/", function (req, res) {
    res.render('index');
});

app.get("/scrape", (req, res) => {

    axios.get("https://www.infoworld.com/category/javascript/")
        .then(response => articles(response))
        .catch(err => console.log(err));

    const articles = (response) => {
        const $ = cheerio.load(response.data);

        $(".article").each((i, element) => {
            const result = {};
            result.title = $(element)
                .find("h3")
                .text();
            result.summary = $(element)
                .find("h4")
                .text();
            result.link = $(element)
                .find("a")
                .attr("href");

            if (result.link && result.title && result.summary) {
                db.Article.findOneAndUpdate({ title: result.title, summary: result.summary, link: result.link }, { $set: result }, { upsert: true }).catch(
                    err => res.send(err)
                );
            }

        });
        res.send("Scrape Complete");
    }
});

app.get("/articles", (req, res) => {
    db.Article.find({})
        .then((dbArticle) => {
            res.json(dbArticle);
        })
        .catch((err) => {
            res.json(err);
        });
});

app.get('/articles/:id', (req, res) => {
    db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then((dbArticle) => {
            res.json(dbArticle);
        })
        .catch((err) => {
            res.json(err);
        });
});

app.delete("/articles", (req, res) => {
    db.Article.deleteMany({})
        .then(dbArticle => {
            res.json(dbArticle);
        })
        .catch(err => {
            res.json(err);
        });
});

app.post("/articles/:id", (req, res) => {
    db.Note.create(req.body)
        .then(dbNote => {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id } }, { new: true });
        })
        .then(dbArticle => {
            res.json(dbArticle);
        })
        .catch(err => {
            res.json(err);
        });
});

app.listen(PORT, () => {
    console.log("App running on port " + PORT + "!");
});