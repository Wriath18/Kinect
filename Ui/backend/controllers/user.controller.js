import bcryptjs from "bcryptjs";

import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";

export const test = (req, res) => {
  res.json({
    message: "API works",
  });
};

// update user
export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "you can only update your account!"));
  }
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    console.log("Data: ", req.body);
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );

    console.log("updated user: ", updatedUser);

    res.status(200).json(updateUser);
  } catch (error) {
    next(error);
  }
};

export const upload = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "you can only update your account!"));
  }

  try {
    const updatedPrescription = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          currentPrescription: req.body.currentPrescription,
        },
      },
      { new: true }
    );

    res.status(200).json(updatedPrescription);
  } catch (error) {
    next(error);
  }
};

export const getPrescription = async (req, res, next) => {
  try {
    console.log('hi')
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    const { medicine, frequency, time, how, AM } = user;
    console.log(user);
    res.status(200).json({ medicine, frequency, time, how, AM });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "you can only delete your account!"));
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted...");
  } catch (error) {
    next(error);
  }
};
