import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "scriptsolutions_secret";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const tenant = await prisma.tenant.findUnique({
      where: { email },
    });

    if (!tenant) {
      res.status(401).json({ error: "Credenciales incorrectas" });
      return;
    }

    const passwordOk = await bcrypt.compare(password, tenant.password);
    if (!passwordOk) {
      res.status(401).json({ error: "Credenciales incorrectas" });
      return;
    }

    const token = jwt.sign(
      { tenantId: tenant.id, role: "admin" },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      tenant: {
        id: tenant.id,
        nombre: tenant.nombre,
        email: tenant.email,
        role: "admin",
      },
    });
  } catch {
    res.status(500).json({ error: "Error al iniciar sesion" });
  }
};

export const loginKiosco = async (req: Request, res: Response) => {
  try {
    const { tenantId, pin } = req.body;

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant || tenant.pin_kiosco !== pin) {
      res.status(401).json({ error: "PIN incorrecto" });
      return;
    }

    const token = jwt.sign(
      { tenantId: tenant.id, role: "kiosco" },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      tenant: {
        id: tenant.id,
        nombre: tenant.nombre,
        role: "kiosco",
      },
    });
  } catch {
    res.status(500).json({ error: "Error al iniciar sesion" });
  }
};