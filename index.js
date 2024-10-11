import express from "express";
import uniqolor from "uniqolor";
import cors from "cors";

import websocketSetup from "./websockets/index.js";

const app = express();
const port = process.env.PORT || 5001;
const corsOptions = {
  origin: ["http://192.168.5.70:5173", "localhost:5173"],
};

app.use(cors());

const server = app.listen(port, "0.0.0.0", () => {
  if (process.send) {
    if (process.send) {
      process.send(`Server running at http://localhost:${port}\n\n`);
    }
  }
});

websocketSetup(server);

app.get("/userColor/:uid", (req, res) => {
  const color = uniqolor(req.params.uid);
  res.send(JSON.stringify(color));
});

process.on("message", (message) => {
  console.log(message);
});
