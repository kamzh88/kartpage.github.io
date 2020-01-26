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

app.get("/scrape",(req, res) => {
    axios.get("https://www.infoworld.com/category/javascript/").then(function (response) {
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

            // console.log(result); 
            db.Article.create(result)
            .then(dbArticle => {
                console.log(dbArticle);
            })
            .catch(err => {
                console.log(err);
            })
        })
        
        res.send("Scrape Complete");
    });
});

app.get("/articles",(req, res) => {
    db.Article.find({})
    .then((dbArticle) => {
        res.json(dbArticle);
    })
    .catch((err) => {
        res.json(err);
    });
});

app.listen(PORT,()=>{
    console.log("App running on port " + PORT + "!");
});