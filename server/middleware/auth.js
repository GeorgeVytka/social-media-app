import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).send("Acces Denied");
    }

    //Bearer is set in the frontend, we then splice to find the token after bearer
    if (token.startsWith("Bearer")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    req.user = verified;
    //need this to proceed to the next step
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
