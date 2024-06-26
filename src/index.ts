import express from "express";
// import { middleware } from "./middleware";
import client from "prom-client";
import { metricsMiddleware } from "./metrics";
// import { requestCountMiddleware } from "./metrics/requestCount";

// import { cleanupMiddleware } from "./metrics";

const app = express();

app.use(express.json());

// app.use(middleware);

app.use(metricsMiddleware);

app.get("/metrics", async (req, res) => {
  const metrics = await client.register.metrics();
  res.set("Content-Type", client.register.contentType);
  res.end(metrics);
});

app.get("/user", async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  res.send({
    name: "John Doe",
    age: 25,
  });
});

app.post("/user", (req, res) => {
  const user = req.body;
  res.send({
    ...user,
    id: 1,
  });
});

app.listen(3000);
