var app     = require("./server.js").app;
var version = require("./package.json").version;
var db      = require("./package.json").db;
var mysql   = require("mysql");
var bcrypt  = require("bcrypt");
var crypto  = require("crypto");
var fs      = require("fs");

const PURPOSE_NEW_ACCOUNT     = 1;
const PURPOSE_FORGOT_PASSWORD = 2;
const PURPOSE_LOGGED_IN       = 3;

var con = mysql.createConnection({
  host:     db["host"],
  user:     db["user"],
  password: db["password"],
  database: db["database"]
});

GetUser = function(token){return new Promise((resolve) => {
  if(!token){
    resolve(0);
    return;
  }else{
    var sql = `
    SELECT u.permission FROM users u
    JOIN tokens t on t.users_id=u.id
    WHERE t.token=?`;
    var args = [token];

    con.query(sql, args, function(err, rows){
      if(rows.length == 0){
        // If the user gave us a token that doesn't exist in the database
        resolve(0);
        return;
      }else{
        resolve(rows[0]["permission"]);
        return;
      }
    });
  }
})}

GenerateToken = function(length){return new Promise((resolve) => {
  GenerateTokenHelper = function(length){return new Promise((resolve) => {
    if(length % 4){
      console.log("ERROR! GenerateToken must be a multiple of four");
      resolve("DEAD");
      return;
    }

    var bytes = length * 3 / 4;
    crypto.randomBytes(bytes, function(err, buffer){
      var token = buffer.toString("base64");
      token     = encodeURIComponent(token); // Ensure that's safe for URLs
      token     = token.replace(/(%2B|%2F)/gi, "");

      if(length != token.length){
        // Make sure multiple of four
        var more = length - token.length;
        more = Math.ceil(more/4) * 4;

        GenerateTokenHelper(more)
        .then((q) => {
          resolve(token+q);
          return;
        });
      }else{
        resolve(token);
        return;
      }
    });
  })}

  GenerateTokenHelper(length).then(result => {
    result = result.substring(0, length);
    resolve(result);
    return;
  });
})}

app.post("/api/get-boards", function(req, res){
  GetUser(req.body["token"])
  .then((permission) => {
    console.log("PERMISSION LEVEL IS:", permission);
    var sql  = "SELECT id, name, description, thread_count, post_count, icon FROM boards WHERE permission <= ?";
    var args = [permission];
    con.query(sql, args, function(err, rows){
      res.json(rows);
    });
  });
});

app.post("/api/sign-up", function(req, res){
  var ip       = req.connection.remoteAddress;
  var post     = req.body;
  var name     = post["name"];
  var email    = post["email"];
  var password = post["password"];
  var confirm  = post["confirm"];
  var tou      = post["tou"];
  var captcha  = post["captcha"];

  // Check if name exists
  // Check if email exists
  // Check password strength
  // Check if passwords match
  // Check if TOU accepted
  // Check if captcha passed

  bcrypt.hash(password, 10, function(err, hashedPassword){
    var sql  = "INSERT INTO users (name, email, password, join_date, last_seen) VALUES (?,?,?,NOW(),NOW())";
    var args = [name, email, hashedPassword];

    con.query(sql, args, function(err, rows){
      if(err){
        res.json({"msg": err, "err": 1});
        return;
      }

      var user_id = rows.insertId;

      // Generate a token for verification after the user was created
      GenerateToken(16)
      .then((token) => {
        var sql  = "INSERT INTO tokens (users_id, purpose, ip_address, token) VALUES (?,?,?,?)";
        var args = [user_id, PURPOSE_NEW_ACCOUNT, ip, token];

        con.query(sql, args, function(err, rows){
          console.log("========== TOKEN ==========");
          console.log(token);

          // var transporter = emailer.createTransport({
          //   service: "gmail",
          //   auth: {
          //     user: "fizz.gg.site@gmail.com",
          //     pass: "aaaaaaaaaaaaaaaaaaaa"
          //   }
          // });

          // var mailOptions = {
          //   "from"   : "fizz.gg.site@gmail.com",
          //   "to"     : email,
          //   "subject": "Your verification code for fizz.gg",
          //   "text"   : `https://fizz.gg/verify?token=${token}`
          // };

          // transporter.sendMail(mailOptions, function(error, info){
          //   res.json({"msg":"User created", "err":"false"});
          // });
        });
      });
    });
  });
});

app.post("/api/login", function(req, res){
  var ip       = req.connection.remoteAddress;
  var post     = req.body;
  var email    = post["email"];
  var password = post["password"];

  // Pull the hash from the database
  var sql  = "SELECT id, password FROM users WHERE email=?";
  var args = [email];

  con.query(sql, args, function(err, rows){
    if(err){
      res.json({"msg": err, "err": 1});
    }
    else if(rows.length == 0){
      res.json({"msg":"Incorrect email/password", "err": 1});
    }else{
      var hashedPassword = rows[0]["password"];
      var users_id       = rows[0]["id"];

      bcrypt.compare(password, hashedPassword, function(err, res2){
        if(res2){
          GenerateToken(100)
          .then((token) => {
            var sql  = "INSERT INTO tokens (users_id, purpose, ip_address, token) VALUES (?,?,?,?)";
            var args = [users_id, PURPOSE_LOGGED_IN, ip, token];

            con.query(sql, args, function(err, rows){
              res.json({"msg": "Logged in", "token": token, "err": 0});
            });
          });
        }else{
          res.json({"msg":"Incorrect email/password", "err": 1});
        }
      });
    }
  });
});

app.post("/api/logout", function(req, res){
  var post  = req.body;
  var token = post["token"];

  // The user wants to logout; delete the token he's been using from the database
  var sql  = "DELETE FROM tokens WHERE token=?";
  var args = [token];

  con.query(sql, args, function(err, rows){
    console.log(rows);
    if(err){
      console.log(err);
      res.json({"msg": err, "err": 1});
    }else{
      res.json({"msg":"You've been logged out", "err": 0});
    }
  });
});

app.use(function(req, res){
  res.status(404);
  res.render("404.ejs");
});
