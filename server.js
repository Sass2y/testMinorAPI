import express from 'express';
import mysql from 'mysql2';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config(); // Load .env variables

const app = express();
app.use(express.json()); // Middleware to parse JSON
app.use(cors()); // Allow frontend connections

// Connect to MySQL database




// 🔹 SIGNUP ROUTE
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if user exists
    const [existingUser] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.promise().query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get("/", (req, res) => {
    res.send("Server is working!");
  });

//   {/* charlie@example.com */}
// {/* hashed_password_3 */}
// 🔹 LOGIN ROUTE
app.post('/login', async (req, res) => {

  const db = mysql.createConnection({
    host: 'sql12.freesqldatabase.com',      // Your MySQL host (could be an IP or 'localhost')
    user: 'sql12762708',           // Your MySQL username
    password: 'rGkZr1GDbM',   // Your MySQL password
    database: 'sql12762708',  // The name of your database
    port: '3306',
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.message);
  } else {
    console.log('✅ Connected to MySQL database');
  }
});

const { email, password } = req.body;
    
const query = "SELECT * FROM users WHERE email = ? AND password = ?";
db.query(query, [email, password], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
        const browserInfo = {
            userAgent: req.headers["user-agent"],
            ip: req.ip,
            timestamp: new Date().toISOString(),
        };
        const token = jwt.sign({ email }, "secret_key", { expiresIn: "1h" });
        res.json({ success: true, token, qrData: JSON.stringify(browserInfo) });
    } else {
        res.json({ success: false, message: "Invalid credentials" });
    }
});



  // const { email, password } = req.body;
  // console.log(email);
  // let usersCount = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
  // console.log(usersCount[0].length);
  // console.log(usersCount[0].length);
  // res.json(usersCount[0]);



//   if (!email || !password) {
//     return res.status(400).json({ message: 'Email and password are required' });
//   }

//   try {
//     const [user] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);

//     if (user.length === 0) {
//       return res.status(400).json({ message: 'Invalid email or password' });
//     }

//     const isMatch = await bcrypt.compare(password, user[0].password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid email or password' });
//     }

    // Generate JWT Token
//     const token = jwt.sign({ id: user[0].id, email: user[0].email }, process.env.SECRET_KEY, { expiresIn: '1h' });

//     res.json({ message: 'Login successful', token });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
db.end(err => {
  if (err) throw err;
  console.log("MySQL connection closed.");
});

});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
