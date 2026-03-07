import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("career_advisor.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS career_profiles (
    id INTEGER PRIMARY KEY,
    career_name TEXT,
    description TEXT,
    traits JSON,
    required_skills JSON,
    education_path TEXT,
    salary_range TEXT,
    future_demand TEXT,
    learning_roadmap JSON
  );

  CREATE TABLE IF NOT EXISTS user_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    traits JSON,
    top_matches JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS chat_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    message TEXT,
    response TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

// Seed data if empty
const seedData = () => {
  const careerCount = db.prepare("SELECT count(*) as count FROM career_profiles").get() as { count: number };
  if (careerCount.count === 0) {
    const careers = JSON.parse(fs.readFileSync(path.join(__dirname, "datasets/career_profiles.json"), "utf8"));
    const insert = db.prepare(`
      INSERT INTO career_profiles (id, career_name, description, traits, required_skills, education_path, salary_range, future_demand, learning_roadmap)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const career of careers) {
      insert.run(
        career.id,
        career.career_name,
        career.description,
        JSON.stringify(career.traits),
        JSON.stringify(career.required_skills),
        career.education_path,
        career.salary_range,
        career.future_demand,
        JSON.stringify(career.learning_roadmap)
      );
    }
    console.log("Seeded career profiles.");
  }
};

seedData();

