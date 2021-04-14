const express = require("express");
const server = express();
const routes = require("./routes"); //cria as rotas
const path = require("path");

// usando template engine
server.set("view engine", "ejs");

// habilitar arquivos statics
server.use(express.static("public"));

// Mudar a localizacão da pasta views
server.set("views", path.join(__dirname, "views"));

// usar o req.body
server.use(express.urlencoded({ extended: true }));

// routes
server.use(routes);

server.listen(3000, () => console.log("rodando"));
