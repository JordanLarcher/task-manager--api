const User = require('../models/User');

exports.getAllUsers = async (req, res, next) => {
  try{
      const users = await User.find();
  } catch (err) {
      return res.status(500).json({ message: err.message});
  }
};


exports.createUser = async (req, res, next) => {
  try {
      const { email, password, role } = req.body;
      const user = new User({email, password, role});
      await user.save();
      return res.status(201).json(user);
  }  catch (err) {
      return res.status(400).json({ message: err.message});
  }
};

exports.updateUser = async (req, res, next) => {
    try {
        const {email, password, role} = req.body;
        const user = await User.findByIdAndUpdate(
            req.param.id,
            { email,password, role},
            { new: true, runValidators: true}
        );

        if(!user) {
            return res.status(404).json({message: 'User not found'});
        }
        return res.status(200).json(user);
    } catch (err) {
        return res.status(400).json({ message: err.message});
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        const result = await User.findByIdAndDelete(req.params.id);
        if(!result) return res.status(404).json({ message: 'User not found'});
    }catch (err) {
        return res.status(500).json({ message: err.message});
    }
}