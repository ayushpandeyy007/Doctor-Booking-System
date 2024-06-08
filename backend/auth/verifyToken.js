import jwt, { decode } from "jsonwebtoken";
import Doctor from "../models/DoctorSchema.js";
import User from "../models/UserSchema.js";

export const authenticate = async (req, res, next) => {
  //token retrive from headers
  const authToken = req.headers.authorization;

  //'bearer' actual token
  //check if the token exsits or not
  if (!authToken || !authToken.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "No token, authorization denied" });
  }
  try {
    const token = authToken.split(" ")[1];

    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Set userId from the 'id' property in the decoded token payload
    req.userId = decoded.id;
    req.role = decoded.role;
    next(); //must call next function to work
  } catch (err) {
    if (err.name == "TokenExpiredError") {
      return res.status(401).json({ message: "Token is expired" });
    }
    return res.status(401).json({ success: false, messgae: "Invalid Token" });
  }
};

// ... (rest of the code remains the same)
export const restrict = (roles) => async (req, res, next) => {
  try {
    const userId = req.userId;
    let user;

    // Ensure userId is valid
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid user ID in token" });
    }

    // Check if the user exists
    const patient = await User.findById(userId);
    const doctor = await Doctor.findById(userId);

    if (patient) {
      user = patient;
    } else if (doctor) {
      user = doctor;
    } else {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if the user's role is defined and authorized
    if (!user.role || !roles.includes(user.role)) {
      return res
        .status(401)
        .json({ success: false, message: "You are not authorized" });
    }

    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};
