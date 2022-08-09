const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

mongoose.connect("mongodb://localhost:27017/wikiDB");
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")

// Request targeting all elements
.get(function(req,res){
    Article.find(function(err, foundArticles){
        if(err){
            res.send(err);
        }else{
            res.send(foundArticles);
        }
    })
})

.post(function(req, res){

    const newArticle = new Article({
       title: req.body.title,
       content: req.body.content
    });
   
    newArticle.save(function(err){
       if(err){
           console.log(err);
       }
    });
   
   })

.delete(function(req, res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Successfully deleted");
        }else{
            res.send(err);
        }
    });
});

// Request targeting specific element
app.route("/articles/:articleTitle")
.get(function(req, res){
   Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
     if(foundArticle){
      res.send(foundArticle);
     }else{
        res.send("Nothing Found!");
     }
   });
})

.put(function(req, res){
   Article.update(
    {title: req.params.articleTitle}, 
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
        if(!err){
            res.send("Successfully Updated");
        }
    }
   )
})

app.listen(3000, function(){
    console.log("Server Started");
})

