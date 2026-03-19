import express from "express";
import cors from "cors";
import productsRouter from "./routes/products";
import importRouter from "./routes/import";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ mensaje: "API Kiosco funcionando 🚀" });
});

app.use("/products", productsRouter);
app.use("/import", importRouter);

export default app;