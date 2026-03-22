const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

//show files
app.get("/", function (req, res) {
  fs.readdir("./files", "utf-8", function (err, files) {
    if (err) return res.status(500).send(err);
    res.render("index", { files: files });
  });
});

//create page
app.get("/create", function (req, res) {
  res.render("create");
});

//create hisaab
app.post("/createhisaab", function (req, res) {
  let today = new Date();
  let date = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;

  fs.readdir("./files", function (err, files) {
    if (err) return res.status(500).send(err);

    let sameDateFiles = files.filter((file) => file.startsWith(date));
    let count = sameDateFiles.length + 1;

    let filename = `${date}_${count}.txt`;

    fs.writeFile(`./files/${filename}`, req.body.content, function (err) {
      if (err) return res.status(500).send(err);
      res.redirect("/");
    });
  });
});

//edit page
app.get("/edit/:filename", function (req, res) {
  fs.readFile(`./files/${req.params.filename}`, "utf-8", function (err, data) {
    if (err) return res.status(500).send(err);
    res.render("edit", { data, filename: req.params.filename });
  });
});

//update route
app.post("/update/:filename", function (req, res) {
  fs.writeFile(
    `./files/${req.params.filename}`,
    req.body.content,
    function (err) {
      if (err) return res.status(500).send(err);
      res.redirect("/");
    },
  );
});

//show files
app.get("/hisaab/:filename", function (req, res) {
  fs.readFile(`./files/${req.params.filename}`, "utf-8", function (err, data) {
    if (err) return res.status(500).send(err);
    res.render("hisaab", { data, filename: req.params.filename });
  });
});

//delete files

app.get("/delete/:filename", function (req, res) {
  fs.unlink(`./files/${req.params.filename}`, function (err) {
    if (err) return res.status(500).send(err);
    res.redirect("/");
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);