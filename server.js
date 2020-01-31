const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");

const db = require("./models");

const PORT = 3000;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/newsletter", { useNewUrlParser: true });
mongoose.connect("mongodb://localhost/newsletter", { useFindAndModify: false });

app.get("/scrape", (req, res) => {

    axios.get("https://www.infoworld.com/category/javascript/")
        .then(response => articles(response))
        .catch(err => console.log(err));

    const articles = (response) => {
        const resultArray = [];
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
            resultArray.push(result);
        });

        for (let i = 0; i < resultArray.length; i++) {
            let linkArray = resultArray[i].link;
            let titleArray = resultArray[i].title;
            let summary = resultArray[i].summary;

            if (linkArray && titleArray && summary) {
                db.Article.findOneAndUpdate({ title: titleArray, summary: summary, link: linkArray }, { $set: resultArray }, { upsert: true }).catch(
                    err => res.send(err)
                );
            }
        }
    }
    res.send("Scrape Complete");
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