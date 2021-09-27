const express = require("express");
const OAuth2Data = require("./credentials.json");
const axios = require('axios');
var authed = false;
var name,pic,userId;
var token = "";


const { google } = require("googleapis");

const app = express();
app.use(express.urlencoded({extended:false}));
app.use( express.static( "views" ) );
const CLIENT_ID = OAuth2Data.web.client_id;
const CLIENT_SECRET = OAuth2Data.web.client_secret;
const REDIRECT_URL = OAuth2Data.web.redirect_uris[0];

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);

const SCOPES = "https://www.googleapis.com/auth/blogger https://www.googleapis.com/auth/userinfo.profile";

app.set("view engine", "ejs");

app.get("/",(req, res) => {
    if (!authed) {
      // Generate an OAuth URL and redirect there
      var url = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
      });
      console.log(url);
      res.render("index", { url: url });
    } else {
      var oauth2 = google.oauth2({
        auth: oAuth2Client,
        version: "v2",
      });
      oauth2.userinfo.get(function (err, response) {
        if (err) {
          console.log(err);
        } else {
          console.log(response.data);
          userId = response.data.id
          name = response.data.name
          pic = response.data.picture
          //getBlogLIst();
          // res.render("success", {
          //   name: response.data.name,
          //   pic: response.data.picture,
          //   list:items,
          //   success:false
          // });
          res.redirect('/home')
  
        }
      });
    }
  });

  // logout
app.get('/logout',(req,res) => {
    authed = false
    res.redirect('/')
})

// callback from google auth
app.get("/google/callback", function (req, res) {
  const code = req.query.code;
  if (code) {
    // Get an access token based on our OAuth code
    oAuth2Client.getToken(code, function (err, tokens) {
      if (err) {
        console.log("Error authenticating");
        console.log(err);
      } else {
        console.log("Successfully authenticated");
        console.log(tokens)
        oAuth2Client.setCredentials(tokens);
        token = tokens.access_token;
        authed = true;
        res.redirect("/");
      }
    });
  }
});


app.listen(5000, () => {
    console.log("app started on Port 5000");
});