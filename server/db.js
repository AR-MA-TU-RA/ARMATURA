import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'database.sqlite');

const db = new Database(dbPath);

// Enable WAL mode & foreign keys
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize schema as specified
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    avatar TEXT,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS profiles (
    user_id TEXT PRIMARY KEY,
    district TEXT,
    budget_min INTEGER,
    budget_max INTEGER,
    smoking TEXT,
    pets TEXT,
    bio TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    apartment_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, apartment_id),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id TEXT NOT NULL,
    receiver_id TEXT NOT NULL,
    apartment_context TEXT,
    text TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(sender_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

// Seed default demo users if they don't exist
const checkUser = db.prepare('SELECT id FROM users WHERE email = ?');

const defaultUsers = [
  {
    id: 'anna-moraru',
    name: 'Anna Moraru',
    email: 'anna.moraru@utm.md',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    role: 'user',
    profile: {
      district: 'Centru',
      budget_min: 250,
      budget_max: 300,
      smoking: 'no',
      pets: 'cat_friendly',
      bio: 'Studentă la UTM (Design & Tehnologii) și UI/UX freelancer. Caut o colegă prietenoasă și ordonată.'
    }
  },
  {
    id: 'mihai-ceban',
    name: 'Mihai Ceban',
    email: 'mihai.ceban@utm.md',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    role: 'user',
    profile: {
      district: 'Botanica',
      budget_min: 220,
      budget_max: 320,
      smoking: 'no',
      pets: 'no_pets',
      bio: 'Student la Calculatoare și Developer Junior la o companie IT. Liniștit, pasionat de tech și sport.'
    }
  }
];

const insertUser = db.prepare(`
  INSERT INTO users (id, name, email, password_hash, avatar, role)
  VALUES (@id, @name, @email, @password_hash, @avatar, @role)
`);

const insertProfile = db.prepare(`
  INSERT INTO profiles (user_id, district, budget_min, budget_max, smoking, pets, bio)
  VALUES (@user_id, @district, @budget_min, @budget_max, @smoking, @pets, @bio)
`);

for (const u of defaultUsers) {
  const existing = checkUser.get(u.email);
  if (!existing) {
    const password_hash = bcrypt.hashSync(u.password, 10);
    insertUser.run({
      id: u.id,
      name: u.name,
      email: u.email,
      password_hash,
      avatar: u.avatar,
      role: u.role
    });
    insertProfile.run({
      user_id: u.id,
      district: u.profile.district,
      budget_min: u.profile.budget_min,
      budget_max: u.profile.budget_max,
      smoking: u.profile.smoking,
      pets: u.profile.pets,
      bio: u.profile.bio
    });
  }
}

export default db;
