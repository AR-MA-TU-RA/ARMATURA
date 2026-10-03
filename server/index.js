import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import db from './db.js';

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'domi_moldova_jwt_secret_2026';

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Middleware: JWT Authenticate ──────────────────────────────────────────
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// ─── Health Check ──────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// ─── Auth: Register ────────────────────────────────────────────────────────
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password, district, budgetMin, budgetMax, avatar, bio } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check existing
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(400).json({ error: 'Acest email este deja înregistrat' });
    }

    const userId = `user-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
    const password_hash = bcrypt.hashSync(password, 10);
    const defaultAvatar = avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80';
    const userName = name || email.split('@')[0];

    // Insert user
    db.prepare(`
      INSERT INTO users (id, name, email, password_hash, avatar, role)
      VALUES (?, ?, ?, ?, ?, 'user')
    `).run(userId, userName, email, password_hash, defaultAvatar);

    // Insert profile
    db.prepare(`
      INSERT INTO profiles (user_id, district, budget_min, budget_max, smoking, pets, bio)
      VALUES (?, ?, ?, ?, 'no', 'no_pets', ?)
    `).run(
      userId,
      district || 'Centru',
      budgetMin || 200,
      budgetMax || 300,
      bio || 'Student / Tânăr profesionist în căutare de chirie în Chișinău'
    );

    const userPayload = {
      id: userId,
      name: userName,
      email,
      avatar: defaultAvatar,
      role: 'user',
      district: district || 'Centru',
      budgetMin: budgetMin || 200,
      budgetMax: budgetMax || 300,
      budgetFormatted: `€${budgetMin || 200}–${budgetMax || 300} / month`,
      compatibility: 90
    };

    const token = jwt.sign(
      { id: userId, email, name: userName, role: 'user' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      token,
      user: userPayload
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Server error during registration' });
  }
});

// ─── Auth: Login ───────────────────────────────────────────────────────────
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.prepare(`
      SELECT u.id, u.name, u.email, u.password_hash, u.avatar, u.role,
             p.district, p.budget_min, p.budget_max, p.smoking, p.pets, p.bio
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE LOWER(u.email) = LOWER(?)
    `).get(email);

    if (!user) {
      return res.status(401).json({ error: 'Email sau parolă incorectă' });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Email sau parolă incorectă' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      district: user.district || 'Centru',
      budgetMin: user.budget_min || 220,
      budgetMax: user.budget_max || 320,
      budgetFormatted: `€${user.budget_min || 220}–${user.budget_max || 320} / month`,
      smoking: user.smoking,
      pets: user.pets,
      bio: user.bio,
      compatibility: 93
    };

    return res.json({
      token,
      user: userPayload
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Server error during login' });
  }
});

// ─── Auth: Current User (/api/auth/me) ─────────────────────────────────────
app.get('/api/auth/me', authenticateToken, (req, res) => {
  try {
    const user = db.prepare(`
      SELECT u.id, u.name, u.email, u.avatar, u.role, u.created_at,
             p.district, p.budget_min, p.budget_max, p.smoking, p.pets, p.bio
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.id = ?
    `).get(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      district: user.district || 'Centru',
      budgetMin: user.budget_min || 200,
      budgetMax: user.budget_max || 300,
      budgetFormatted: `€${user.budget_min || 200}–${user.budget_max || 300} / month`,
      smoking: user.smoking,
      pets: user.pets,
      bio: user.bio,
      compatibility: 93
    };

    return res.json({ user: userPayload });
  } catch (error) {
    console.error('Me error:', error);
    return res.status(500).json({ error: 'Server error retrieving profile' });
  }
});

// ─── Auth: Update Profile & Avatar ─────────────────────────────────────────
app.put('/api/auth/profile', (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    let userId = req.body.userId;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.id;
      } catch (err) {
        // fallback to body userId
      }
    }

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const { avatar, name, district, budgetMin, budgetMax, bio } = req.body;

    if (avatar) {
      db.prepare('UPDATE users SET avatar = ? WHERE id = ?').run(avatar, userId);
    }
    if (name) {
      db.prepare('UPDATE users SET name = ? WHERE id = ?').run(name, userId);
    }
    if (district || budgetMin || budgetMax || bio) {
      db.prepare(`
        UPDATE profiles
        SET district = COALESCE(?, district),
            budget_min = COALESCE(?, budget_min),
            budget_max = COALESCE(?, budget_max),
            bio = COALESCE(?, bio)
        WHERE user_id = ?
      `).run(district || null, budgetMin || null, budgetMax || null, bio || null, userId);
    }

    const updatedUser = db.prepare(`
      SELECT u.id, u.name, u.email, u.avatar, u.role,
             p.district, p.budget_min, p.budget_max, p.smoking, p.pets, p.bio
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.id = ?
    `).get(userId);

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
        district: updatedUser.district || 'Centru',
        budgetMin: updatedUser.budget_min || 200,
        budgetMax: updatedUser.budget_max || 300,
        budgetFormatted: `€${updatedUser.budget_min || 200}–${updatedUser.budget_max || 300} / month`,
        smoking: updatedUser.smoking,
        pets: updatedUser.pets,
        bio: updatedUser.bio,
        compatibility: 93
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ error: 'Server error updating profile' });
  }
});

// ─── Apartments: Apply ─────────────────────────────────────────────────────
app.post('/api/apartments/:id/apply', (req, res) => {
  try {
    const apartmentId = req.params.id;
    
    // Resolve user ID from JWT token or request body
    let userId = req.body.userId;
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.id;
      } catch (err) {
        // Fall back to body userId if valid
      }
    }

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required to apply' });
    }

    // Verify user exists
    const user = db.prepare('SELECT id FROM users WHERE id = ?').get(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    db.prepare(`
      INSERT OR IGNORE INTO applications (user_id, apartment_id)
      VALUES (?, ?)
    `).run(userId, apartmentId);

    return res.json({
      success: true,
      message: 'Application recorded successfully',
      apartmentId,
      userId
    });
  } catch (error) {
    console.error('Apply error:', error);
    return res.status(500).json({ error: 'Server error saving application' });
  }
});

// ─── Apartments: Applicants ────────────────────────────────────────────────
app.get('/api/apartments/:id/applicants', (req, res) => {
  try {
    const apartmentId = req.params.id;

    const applicants = db.prepare(`
      SELECT u.id, u.name, u.avatar,
             p.district, p.budget_min, p.budget_max, p.smoking, p.pets, p.bio,
             a.created_at as appliedAt
      FROM applications a
      JOIN users u ON a.user_id = u.id
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE a.apartment_id = ?
      ORDER BY a.created_at DESC
    `).all(apartmentId);

    const formatted = applicants.map(appItem => ({
      id: appItem.id,
      name: appItem.name,
      avatar: appItem.avatar,
      district: appItem.district || 'Centru',
      budgetFormatted: `€${appItem.budget_min || 200}–${appItem.budget_max || 300} / month`,
      budgetMin: appItem.budget_min || 200,
      budgetMax: appItem.budget_max || 300,
      occupation: 'Student / Young Professional',
      compatibility: 92,
      appliedAt: appItem.appliedAt
    }));

    return res.json({
      apartmentId,
      applicants: formatted
    });
  } catch (error) {
    console.error('Applicants error:', error);
    return res.status(500).json({ error: 'Server error retrieving applicants' });
  }
});

// ─── Messages (Bonus) ──────────────────────────────────────────────────────
app.get('/api/messages', (req, res) => {
  try {
    const { userId1, userId2 } = req.query;
    if (!userId1 || !userId2) {
      return res.status(400).json({ error: 'userId1 and userId2 required' });
    }

    const messages = db.prepare(`
      SELECT * FROM messages
      WHERE (sender_id = ? AND receiver_id = ?)
         OR (sender_id = ? AND receiver_id = ?)
      ORDER BY created_at ASC
    `).all(userId1, userId2, userId2, userId1);

    return res.json({ messages });
  } catch (error) {
    return res.status(500).json({ error: 'Server error retrieving messages' });
  }
});

app.post('/api/messages', (req, res) => {
  try {
    const { senderId, receiverId, apartmentContext, text } = req.body;
    if (!senderId || !receiverId || !text) {
      return res.status(400).json({ error: 'senderId, receiverId, and text are required' });
    }

    const result = db.prepare(`
      INSERT INTO messages (sender_id, receiver_id, apartment_context, text)
      VALUES (?, ?, ?, ?)
    `).run(senderId, receiverId, apartmentContext ? JSON.stringify(apartmentContext) : null, text);

    return res.status(201).json({
      id: result.lastInsertRowid,
      senderId,
      receiverId,
      apartmentContext,
      text,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({ error: 'Server error sending message' });
  }
});

// ─── Start Server ──────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`domi backend server running on http://localhost:${PORT}`);
});
