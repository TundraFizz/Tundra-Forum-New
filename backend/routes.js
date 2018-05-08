var app     = require("./server.js").app;
var version = require("./package.json").version;
var db      = require("./package.json").db;
var mysql   = require("mysql");
var bcrypt  = require("bcrypt");
var crypto  = require("crypto");
var fs      = require("fs");

var con = mysql.createConnection({
  host:     db["host"],
  user:     db["user"],
  password: db["password"],
  database: db["database"]
});

GenerateToken = function(length){return new Promise((resolve) => {
  // GenerateToken takes one paramter, which is how long the token will be
  // The length needs to be converted into bytes
  // Every 3 bytes = 4 characters long
  // Therefore, length MUST be a multiple of 4
  // [length] * (3/4) = [bytes]
  // [bytes]  * (4/3) = [length]
  if(length % 4){
    console.log("ERROR! GenerateToken must be a multiple of four");
    return;
  }

  var bytes = length * 3 / 4;

  var processing = false;
  var timer      = setInterval(function(){
    if(!processing){
      processing = true;
      crypto.randomBytes(bytes, function(err, buffer){
        var token = buffer.toString("base64");
        token     = encodeURIComponent(token); // Ensure that's safe for URLs
        var sql   = "SELECT id FROM tokens WHERE token=?";
        var args  = [token];

        con.query(sql, args, function(err, rows){
          if(rows.length)
            processing = false; // Token already exists, try again
          else{
            processing = false;
            clearInterval(timer);
            resolve(token);
          }
        });
      });
    }
  }, 100);
})}

/**************/
/* DEPRECATED */
/**************/
function Encrypt(password){
  var algorithm = "aes-256-gcm";
  var specialKey = "3zTvzr3p67VC61jmV54rIYu1545x4TlY";
  var trimmedKey = specialKey.substring(0, 32-password.length);
  var appendedKey = password+trimmedKey;

  var iv = crypto.randomBytes(32);

  var cipher = crypto.createCipheriv(algorithm, appendedKey, iv);
  var encrypted = cipher.update(password, "utf-8", "base64");
  encrypted += cipher.final("base64");
  var tag = cipher.getAuthTag();

  // The tag and IV are both byte arrays, so they need to be
  // converted into base64 so that the database can store them
  return {
    content: encrypted,
    tag: tag.toString("base64"),
    iv: iv.toString("base64")
  };
}

/**************/
/* DEPRECATED */
/**************/
function Decrypt(encryptedData, password, passwordIv){
  var algorithm = "aes-256-gcm";
  var specialKey = "3zTvzr3p67VC61jmV54rIYu1545x4TlY";
  var trimmedKey = specialKey.substring(0, 32-password.length);
  var appendedKey = password+trimmedKey;
  var decipher = crypto.createDecipheriv(algorithm, appendedKey, passwordIv);
  decipher.setAuthTag(encryptedData.tag);
  var dec = decipher.update(encryptedData.content, "base64", "utf-8");

  try{
    dec += decipher.final("utf-8");
  }catch(e){
    return false;
  }

  return dec;
}

/**************/
/* DEPRECATED */
/**************/
app.post("/sign-up", function(req, res){
  var post  = req.body;
  var name  = post["name"];
  var email = post["email"];

  // Create an encrypted object from the password that the user gave
  var password        = Encrypt(post["pass"]);
  var passwordContent = password["content"];
  var passwordTag     = password["tag"];
  var passwordIv      = password["iv"];

  var sql  = "SELECT COUNT(*) AS count FROM users WHERE name=?";
  var args = [name];
  con.query(sql, args, function(err, rows){
    if(rows[0]["count"]){
      res.json({"msg": `${name} That account already exists!`, "err": 1});
    }else{
      var newUser = {name: name, password_content: passwordContent, password_tag: passwordTag, password_iv: passwordIv, email: email};
      con.query("INSERT INTO users SET ?", newUser, function(err){
        res.json({"msg": `Account created ${name}`, "err": 0});
      });
    }
  });
});

/**************/
/* DEPRECATED */
/**************/
app.post("/login", function(req, res){
  var post     = req.body;
  var name     = post["name"];
  var password = post["pass"];

  var sql  = "SELECT COUNT(*) AS count, password_content, password_tag, password_iv FROM users WHERE ?";
  var args = [{name: name}];
  con.query(sql, args, function(err, rows){
    if(rows[0]["count"]){
      var passwordContent = rows[0]["password_content"];
      var passwordTag     = rows[0]["password_tag"];
      var passwordIv      = rows[0]["password_iv"];

      // The password tag and IV were stored as base64,
      // so they need to be converted into a byte buffer
      passwordTag = Buffer.from(passwordTag, "base64");
      passwordIv  = Buffer.from(passwordIv,  "base64");

      // Create an encrypted data object which will then be decrypted
      var encryptedData = {};
      encryptedData["content"] = passwordContent;
      encryptedData["tag"]     = passwordTag;

      // Check if the password was invalid
      if(Decrypt(encryptedData, password, passwordIv) === false){
        res.json({"msg": "Invalid username or password", "err": 1});
        return;
      }

      // Create a token for the now logged-in user and
      // store it in the database and give it to them
      var token = crypto.randomBytes(48).toString("hex");
      var sql   = "UPDATE users SET ? WHERE ?";
      var args  = [
        {token: token},
        {name: name}
      ];

      con.query(sql, args, function(err, rows){
        res.json({"msg": token, "err": 0});
      });
    }else{
      res.json({"msg": `Invalid username or password`, "err": 1});
    }
  });
});

/**************/
/* DEPRECATED */
/**************/
app.post("/logout", function(req, res){
  var data = {"logout": true};
  res.json(data);
});

app.get("/api/get-boards", function(req, res){
  // res.render("index.ejs", {version: version});
  var sql  = "SELECT id, name, description, thread_count, post_count, icon FROM boards";
  var args = [];
  con.query(sql, args, function(err, rows){
    res.json(rows);
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
        var args = [user_id, 1, ip, token];

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
          GenerateToken(40)
          .then((token) => {
            var sql  = "INSERT INTO tokens (users_id, purpose, ip_address, token) VALUES (?,?,?,?)";
            var args = [users_id, 3, ip, token];

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

app.use(function(req, res){
  res.status(404);
  res.render("404.ejs");
});
