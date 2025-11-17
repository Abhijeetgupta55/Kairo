const User = require('../models/User');

// Render signup page
exports.getSignup = (req, res) => {
  res.render('signup', { 
    title: 'Sign Up - Kairo',
    error: null 
  });
};

// Handle signup
exports.postSignup = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      return res.render('signup', {
        title: 'Sign Up - Kairo',
        error: 'All fields are required',
        username,
        email
      });
    }

    if (password !== confirmPassword) {
      return res.render('signup', {
        title: 'Sign Up - Kairo',
        error: 'Passwords do not match',
        username,
        email
      });
    }

    if (password.length < 6) {
      return res.render('signup', {
        title: 'Sign Up - Kairo',
        error: 'Password must be at least 6 characters',
        username,
        email
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'Email' : 'Username';
      return res.render('signup', {
        title: 'Sign Up - Kairo',
        error: `${field} already exists`,
        username: field === 'Email' ? username : '',
        email: field === 'Username' ? email : ''
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password
    });

    await user.save();

    // Create session
    req.session.userId = user._id;
    req.session.username = user.username;

    res.redirect('/dashboard');
  } catch (error) {
    console.error('Signup error:', error);
    res.render('signup', {
      title: 'Sign Up - Kairo',
      error: 'An error occurred. Please try again.',
      username: req.body.username,
      email: req.body.email
    });
  }
};

// Render login page
exports.getLogin = (req, res) => {
  res.render('login', { 
    title: 'Login - Kairo',
    error: null 
  });
};

// Handle login
exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.render('login', {
        title: 'Login - Kairo',
        error: 'Email and password are required',
        email
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.render('login', {
        title: 'Login - Kairo',
        error: 'Invalid email or password',
        email
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.render('login', {
        title: 'Login - Kairo',
        error: 'Invalid email or password',
        email
      });
    }

    // Create session
    req.session.userId = user._id;
    req.session.username = user.username;

    res.redirect('/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    res.render('login', {
      title: 'Login - Kairo',
      error: 'An error occurred. Please try again.',
      email: req.body.email
    });
  }
};

// Handle logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.redirect('/dashboard');
    }
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
};
