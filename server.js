const express = require('express')
const mysql = require('mysql')
const hbs = require('express-hbs')
const bodyParser = require('body-parser')
//const cors = require('cors')
const app = express();
const port = 3000;
const path = require("path");


app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'produits'
})

connection.connect((err) => {
    if (err) {
        console.log(err)
    } else {
        console.log("Connected to database")
    }
})

app.engine('hbs', hbs.express4({
    //partialsDir: __dirname + '/views/partials',
    layoutsDir: __dirname + '/views/layouts'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');



app.get("/api/like/:idProduit",(req,res)=>{
    const idProduit = req.params.idProduit;
    const query = "UPDATE likes SET likeCounts = likeCounts + 1 WHERE idProduit like ?";
    connection.query(query, [idProduit], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send("An error occurred while updating likes.");
        }
        else {
            console.log(results.affectedRows + " record(s) updated");
            res.send("done");
        }
    });
});

app.get("/",(req,res)=>{
    const sql = `
        SELECT praduit.*, likes.likeCounts
        FROM praduit,likes
        where
        praduit.id = likes.idProduit;

`;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result)
        res.render("index",{
            "layout":"main",
            "certif":result
        });
    })
})

app.listen(port,()=>console.log(`Connected to ${port}`));