const express = require('express');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const User = require('../model/user');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.post('/register', upload.single('image'), async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const image = req.file?.filename;

    if (!image) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      image,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ token }); 
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

router.get('/user', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);  
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});


router.put('/user/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const updatedData = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    };
    if (req.file) {
      updatedData.image = req.file.filename; 
    }

    const user = await User.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user' });
  }
});


router.get('/verify', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

router.get('/users', authMiddleware, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/deleteUser/:id', authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user' });
  }
});

router.put('/updateUsers/:id', authMiddleware, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    await User.findByIdAndUpdate(req.params.id, { name, email, phone });
    res.json({ message: 'User updated' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user' });
  }
});

module.exports = router;
