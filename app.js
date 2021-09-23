const express = require("express");


const app = express();

app.get("/",(req,res) => {
    res.send("login");
});


app.listen(5000, () => {
    console.log("app started on Port 5000");
});