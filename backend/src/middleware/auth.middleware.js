import { clerkClient } from "@clerk/express";

export const protectRoute = async (req, res, next) => {
  if (!req.auth.userId) {
    return res
      .status(401)
      .json({ message: "Unauthorized -You are not logged in" });
  }
  next();
};
export const requireAdmin = async (req, res, next) => {
  try {
    const user = await clerkClient.users.getUser(req.auth.userId);
    const isAdmin =
      process.env.ADMIN_EMAIL === user.primaryEmailAddress?.emailAddress;
    if (!isAdmin) {
      return res
        .status(403)
        .json({ message: "Forbidden - You are not an admin" });
    }
    next();
  } catch (error) {
    // return res.status(500).json({ message: "Internal Server Error" });
    next(error);
  }
};
