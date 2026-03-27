import express from "express";
import cors from "cors";
import productsRouter from "./routes/products";
import importRouter from "./routes/import";
import salesRouter from "./routes/sales";
import clientsRouter from "./routes/clients";
import stockRouter from "./routes/stock";
import configRouter from "./routes/config";
import authRouter from "./routes/auth";
import superadminRouter from "./routes/superadmin";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ mensaje: "API Kiosco funcionando 🚀" });
});

app.use("/auth", authRouter);
app.use("/superadmin", superadminRouter);
app.use("/products", productsRouter);
app.use("/import", importRouter);
app.use("/sales", salesRouter);
app.use("/clients", clientsRouter);
app.use("/stock", stockRouter);
app.use("/config", configRouter);

export default app;