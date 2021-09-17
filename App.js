const result = require("dotenv").config();
if (result.error) throw result.error;

const express = require("express");
const bot = require("./utils/linebot");
const getContent = require("./line/content");
const linebotParser = bot.parser();

const app = express();
// for line webhook usage
app.post("/linewebhook", linebotParser);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// a http endpoint for trigger broadcast
app.post("/broadcast", (req, res) => {
  bot
    .broadcast(req.body.message)
    .then(() => {
      res.send("broadcast ok");
    })
    .catch(function (error) {
      res.send("broadcast fail");
    });
});

app.get("/bus/:number", async (req, res) => {
  let body = await getBody(req.params.number);
  res.json(body);
});

bot.on("message", async (event) => {
  console.log(event.message.text);
  const encodeNumber = encodeURI(event.message.text);
  const header = getContent.getHeader(encodeNumber);
  const body = await getContent.getBody(encodeNumber);
  var replyMsg = {
    type: "flex",
    altText: "公車資訊",
    contents: {
      type: "carousel",
      contents: [
        {
          type: "bubble",
          size: "mega",
          header: header,
          body: {
            type: "box",
            layout: "vertical",
            contents: body, //body,
          },
        },
      ],
    },
  };

  event
    .reply(replyMsg)
    .then((data) => {
      console.log("ok");
    })
    .catch((error) => {
      console.error(error);
    });
});

app.listen(3000);
