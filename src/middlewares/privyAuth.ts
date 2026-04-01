import { Request, Response, NextFunction } from "express";
import { PrivyClient } from "@privy-io/server-auth";

const privy = new PrivyClient(
  process.env.PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!
);

export const verifyPrivy = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const authHeader = req.headers.authorization as string;

  if (!authHeader) {
    return res.status(401).json({
      message: "Token tidak ada"
    });
  }

  const token = authHeader.split(" ")[1];

  try {

    const user = await privy.verifyAuthToken(token);

    console.log(user);
    (req as any).user = user; 

    next();

  } catch (error) {

    return res.status(401).json({
      message: "Token tidak valid"
    });

  }
};