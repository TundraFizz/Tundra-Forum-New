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
  var data = {
    "name"      : null,
    "permission": 0
  };

  if(!token){
    resolve(data);
    return;
  }else{
    var sql = `
    SELECT u.name, u.permission FROM users u
    JOIN tokens t on t.users_id=u.id
    WHERE t.token=?`;
    var args = [token];

    con.query(sql, args, function(err, rows){
      if(rows.length == 0){
        // If the user gave us a token that doesn't exist in the database
        resolve(data);
        return;
      }else{
        data["name"]       = rows[0]["name"];
        data["permission"] = rows[0]["permission"];
        resolve(data);
        return;
      }
    });
  }
})}

GenerateToken = function(length){return new Promise((resolve) => {
  GenerateTokenHelper = function(length){return new Promise((resolve) => {
    if(length % 4){
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
  .then(vals => {
    var name       = vals.name;
    var permission = vals.permission;

    var sql  = "SELECT id, name, description, thread_count, post_count, icon FROM boards WHERE permission <= ?";
    var args = [permission];
    con.query(sql, args, function(err, rows){
      res.json({
        "boards": rows,
        "name"  : name
      });
    });
  });
});

app.post("/api/create-account", function(req, res){
  var ip       = req.connection.remoteAddress;
  var post     = req.body;
  var email    = post["email"].trim();
  var password = post["password"];
  var confirm  = post["confirm"];
  var name     = post["name"].trim();
  var tou      = post["tou"];
  var captcha  = post["captcha"];

  console.log("email   :", email);
  console.log("password:", password);
  console.log("confirm :", confirm);
  console.log("name    :", name);
  console.log("tou     :", tou);
  console.log("captcha :", captcha);

  // ACE = Allowed Characters: Email
  // a-z
  // A-Z
  // À-ÿ All accented characters (diacritics)
  // 0-9
  // Period, underscore, dash
  var ACE        = "[a-zA-ZÀ-ÿ0-9._-]*";
  ACE            = `${ACE}@${ACE}\\.${ACE}[^.]$`;
  var regexEmail = RegExp(ACE, "g");

  // ACN = Allowed Characters: Name
  // a-z
  // A-Z
  // À-ÿ All accented characters (diacritics)
  // 0-9
  // Space, period, underscore, dash
  var ACN = "[a-zA-ZÀ-ÿ0-9 ._-]*";
  var regexName = RegExp(ACN, "g");

  // Validate these:
  // - Email
  // - Display Name
  // - Passwords matching
  // - Password strength
  // - TOU
  // - Captcha

  if(email.match(regexEmail) === null || email.match(regexEmail)[0] != email){
    res.json({"msg": "Bad email!", "err": 1});
    return;
  }else if(name.match(regexName) === null || name.match(regexName)[0] != name){
    res.json({"msg": "Bad display name!", "err": 1});
    return;
  }else if(false){
    res.json({"msg": "Password isn't strong enough", "err": 1});
    return;
  }else if(false){
    res.json({"msg": "Passwords don't match", "err": 1});
    return;
  }else if(false){
    res.json({"msg": "Terms of use wasn't accepted", "err": 1});
    return;
  }else if(false){
    res.json({"msg": "Captcha wasn't solved", "err": 1});
    return;
  }

  // All validations have succeeded

  var sql  = "SELECT id FROM users WHERE email=?";
  var args = [email];

  con.query(sql, args, function(err, rows){
    if(rows.length){
      res.json({"msg": "That email is already in use", "err": 1});
      return;
    }

    var sql  = "SELECT id FROM users WHERE name=?";
    var args = [name];

    con.query(sql, args, function(err, rows){
      if(rows.length){
        res.json({"msg": "That name is already in use", "err": 1});
        return;
      }

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

              res.json({"msg": "Account created! You may now log in", "err": 0});
              return;

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
      var users_id       = rows[0]["id"];
      var hashedPassword = rows[0]["password"];

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
    if(err){
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
