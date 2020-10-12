const restify = require("restify");
const { bottender } = require("bottender");
const ngrok = require("ngrok");
const localtunnel = require("localtunnel");
const cors = require("cors");
const logger = require("morgan");
const storage = require("node-persist");

const port = Number(process.env.PORT) || 5000;

storage.init({ dir: "./data" });

var url;
(async function () {
  url = await ngrok.connect(port);
})().then(() => {
  console.log(url);
});

localtunnel(port, { subdomain: "hi-project" })
  .then((res) => console.log(res.url))
  .catch((err) => console.log(err));

const app = bottender({
  dev: process.env.NODE_ENV !== "production",
});

const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = restify.createServer();
  server.use(logger("dev"));
  server.use(restify.plugins.queryParser());
  server.use(restify.plugins.bodyParser());
  server.use(cors());

  server.get("/users", (req, res) => {
    storage.getItem("users").then((data) => {
      res.send(data);
      console.log(data);
    });
  });

  server.get("*", (req, res) => {
    return handle(req, res);
  });
  server.post("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
