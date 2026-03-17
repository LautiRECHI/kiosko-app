import express from "express";
import productsRouter from "./routes/products";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ mensaje: "API Kiosco funcionando 🚀" });
});

app.use("/products", productsRouter);

export default app;