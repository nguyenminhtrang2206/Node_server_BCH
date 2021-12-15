"use strict";

const http = require("http");
const path = require("path");

const express = require("express");
const app = express();

const { port, host, storage } = require("./serverConfig.json");

const Datastorage = require(path.join(
  __dirname,
  storage.storageFolder,
  storage.dataLayer
));

const dataStorage = new Datastorage();

const server = http.createServer(app);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "pageviews"));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

const menuPath = path.join(__dirname, "product-list.html");

app.get("/", (req, res) => res.sendFile(menuPath));

app.get("/all", (req, res) =>
  dataStorage.getAll().then(data => res.render("allProducts", { result: data }))
);

app.get("/getProduct", (req, res) =>
  res.render("getProduct", {
    title: "Get",
    header: "Get",
    action: "/getProduct",
  })
);

app.post("/getProduct", (req, res) => {
  if (!req.body) res.sendStatus(500);

  const productId = req.body.id;
  dataStorage
    .getOne(productId)
    .then(product => res.render("productPage", { result: product }))
    .catch(error => sendErrorPage(res, error));
});

app.get("/removeproduct", (req, res) =>
  res.render("getProduct", {
    title: "Remove",
    header: "Remove a product",
    action: "/removeproduct",
  })
);

app.post("/removeproduct", (req, res) => {
  if (!req.body) res.sendStatus(500);
  const productId = req.body.id;
  dataStorage
    .remove(productId)
    .then(status => sendStatusPage(res, status))
    .catch(error => sendErrorPage(res, error));
});

app.get("/inputform", (req, res) =>
  res.render("form", {
    title: "Add product",
    header: "Add a new product",
    action: "/insert",
    id: { value: "", readonly: "" },
    name: { value: "", readonly: "" },
    model: { value: "", readonly: "" },
    type: { value: "", readonly: "" },
    amount: { value: "", readonly: "" },
  })
);

app.post("/insert", (req, res) => {
  if (!req.body) res.sendStatus(500);
  dataStorage
    .insert(req.body)
    .then(status => sendStatusPage(res, status))
    .catch(error => sendErrorPage(res, error));
});

app.get("/updateform", (req, res) =>
  res.render("form", {
    title: "Update product",
    header: "Update product data",
    action: "/updatedata",
    id: { value: "", readonly: "" },
    name: { value: "", readonly: "readonly" },
    model: { value: "", readonly: "readonly" },
    type: { value: "", readonly: "readonly" },
    amount: { value: "", readonly: "readonly" },
  })
);

app.post("/updatedata", (req, res) => {
  if (!req.body) res.sendStatus(500);
  dataStorage
    .getOne(req.body.id)
    .then(product =>
      res.render("form", {
        title: "Update product",
        header: "Update product data",
        action: "/update",
        id: { value: product.id, readonly: "readonly" },
        name: { value: product.name, readonly: "" },
        model: { value: product.model, readonly: "" },
        type: { value: product.type, readonly: "" },
        amount: { value: product.amount, readonly: "" },
      })
    )
    .catch(error => sendErrorPage(res, error));
});

app.post("/update", (req, res) => {
  if (!req.body) res.sendStatus(500);
  dataStorage
    .update(req.body)
    .then(status => sendStatusPage(res, status))
    .catch(error => sendErrorPage(res, error));
});

server.listen(port, host, () => console.log(`${host}:${port} serving...`));

function sendErrorPage(res, error, title = "Error", header = "Error") {
  sendStatusPage(res, error, title, header);
}

function sendStatusPage(res, status, title = "Status", header = "Status") {
  return res.render("statusPage", { title, header, status });
}
