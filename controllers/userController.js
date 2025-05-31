const User = require("../models/User");

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    const user = new User({ email, password, role });
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    const userUpdated = await User.replaceOne(
      { _id: req.params.id },
      { email, password, role }
    );
    if (userUpdated.modifiedCount > 0) res.status(204).send();
    else res.status(404).json({ message: "User not found" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const result = await User.deleteOne({ _id: req.params.id });
    if (result.deletedCount > 0) res.status(204).send();
    else res.status(404).json({ message: "User not found" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
