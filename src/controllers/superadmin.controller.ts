import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "scriptsolutions_secret";

export const loginSuperadmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const superadmin = await prisma.superadmin.findUnique({ where: { email } });

    if (!superadmin) {
      res.status(401).json({ error: "Credenciales incorrectas" });
      return;
    }

    const ok = await bcrypt.compare(password, superadmin.password);
    if (!ok) {
      res.status(401).json({ error: "Credenciales incorrectas" });
      return;
    }

    const token = jwt.sign({ superadminId: superadmin.id, role: "superadmin" }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, email: superadmin.email });
  } catch {
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

export const getTenants = async (req: Request, res: Response) => {
  try {
    const tenants = await prisma.tenant.findMany({
      include: {
        kioscos: { select: { id: true } },
        _count: { select: { productos: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(tenants);
  } catch {
    res.status(500).json({ error: "Error al obtener clientes" });
  }
};

export const createTenant = async (req: Request, res: Response) => {
  try {
    const { nombre, email, password, pin_kiosco, plan, suscripcion_vence } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const tenant = await prisma.tenant.create({
      data: {
        nombre,
        email,
        password: hash,
        pin_kiosco: pin_kiosco || "1234",
        plan: plan || "basic",
        suscripcion_vence: suscripcion_vence ? new Date(suscripcion_vence) : null,
      },
    });
    res.json(tenant);
  } catch {
    res.status(500).json({ error: "Error al crear cliente" });
  }
};

export const toggleTenant = async (req: Request, res: Response) => {
  try {
   const id = req.params.id as string; 
    const tenant = await prisma.tenant.findUnique({ where: { id } });
    if (!tenant) {
      res.status(404).json({ error: "Cliente no encontrado" });
      return;
    }
    const updated = await prisma.tenant.update({
      where: { id },
      data: { activo: !tenant.activo },
    });
    res.json(updated);
  } catch {
    res.status(500).json({ error: "Error al actualizar cliente" });
  }
};