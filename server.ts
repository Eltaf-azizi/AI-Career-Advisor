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

const db = new Database("career_advisor_v2.db");

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
    tagline TEXT,
    description TEXT,
    responsibilities TEXT,
    traits JSON,
    required_skills JSON,
    education_path TEXT,
    work_environment TEXT,
    salary_range TEXT,
    future_demand TEXT,
    difficulty_level TEXT,
    learning_roadmap JSON,
    core_philosophy TEXT,
    curriculum JSON,
    tools_software JSON,
    sub_disciplines JSON,
    student_reality JSON
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
      INSERT INTO career_profiles (id, career_name, tagline, description, responsibilities, traits, required_skills, education_path, work_environment, salary_range, future_demand, difficulty_level, learning_roadmap, core_philosophy, curriculum, tools_software, sub_disciplines, student_reality)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const career of careers) {
      insert.run(
        career.id,
        career.career_name,
        career.tagline || null,
        career.description,
        career.responsibilities || "",
        JSON.stringify(career.traits),
        JSON.stringify(career.required_skills),
        career.education_path,
        career.work_environment || "",
        career.salary_range,
        career.future_demand,
        career.difficulty_level || "Medium",
        JSON.stringify(career.learning_roadmap),
        career.core_philosophy || null,
        career.curriculum ? JSON.stringify(career.curriculum) : null,
        career.tools_software ? JSON.stringify(career.tools_software) : null,
        career.sub_disciplines ? JSON.stringify(career.sub_disciplines) : null,
        career.student_reality ? JSON.stringify(career.student_reality) : null
      );
    }
    console.log("Seeded career profiles.");
  }
};

seedData();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/questions", (req, res) => {
    try {
      const questions = JSON.parse(fs.readFileSync(path.join(__dirname, "datasets/questions.json"), "utf8"));
      res.json(questions);
    } catch (error) {
      res.status(500).json({ error: "Failed to load questions" });
    }
  });

  app.post("/api/submit-answers", (req, res) => {
    const { answers } = req.body; // Array of { questionId: number, score: number }
    
    try {
      const questions = JSON.parse(fs.readFileSync(path.join(__dirname, "datasets/questions.json"), "utf8"));
      const careerProfiles = db.prepare("SELECT * FROM career_profiles").all() as any[];

      // Calculate user traits
      const userTraits: Record<string, number> = {
        analytical: 0, technical: 0, creativity: 0, social: 0, helping: 0,
        organization: 0, business: 0, risk: 0, communication: 0, detail: 0,
        leadership: 0, problem_solving: 0
      };

      answers.forEach((ans: any) => {
        const question = questions.find((q: any) => q.id === ans.questionId);
        if (question && question.traits) {
          Object.entries(question.traits).forEach(([trait, weight]: [string, any]) => {
            // Score is 1-5. Normalize to -2 to 2 or something? 
            // Let's just use (score - 3) * weight
            if (userTraits[trait] !== undefined) {
              userTraits[trait] += (ans.score - 3) * weight;
            }
          });
        }
      });

      // Normalize user traits to 0-10 scale
      const traitEntries = Object.entries(userTraits);
      const minTrait = Math.min(...traitEntries.map(([_, v]) => v));
      const maxTrait = Math.max(...traitEntries.map(([_, v]) => v));
      const range = maxTrait - minTrait || 1;

      const normalizedTraits: Record<string, number> = {};
      traitEntries.forEach(([trait, value]) => {
        normalizedTraits[trait] = Math.round(((value - minTrait) / range) * 10);
      });

      // Recommendation Engine: Cosine Similarity
      const calculateSimilarity = (vecA: Record<string, number>, vecB: Record<string, number>) => {
        const traits = Object.keys(vecA);
        let dotProduct = 0;
        let magA = 0;
        let magB = 0;
        traits.forEach(trait => {
          const valA = vecA[trait] || 0;
          const valB = vecB[trait] || 0;
          dotProduct += valA * valB;
          magA += valA * valA;
          magB += valB * valB;
        });
        return dotProduct / (Math.sqrt(magA) * Math.sqrt(magB));
      };

      const matches = careerProfiles.map(career => {
        const careerTraits = JSON.parse(career.traits);
        const similarity = calculateSimilarity(normalizedTraits, careerTraits);
        return {
          id: career.id,
          career_name: career.career_name,
          match_percentage: Math.round(similarity * 100),
          description: career.description
        };
      }).sort((a, b) => b.match_percentage - a.match_percentage).slice(0, 5);

      // Save results (anonymous for now or link to user if provided)
      const stmt = db.prepare("INSERT INTO user_results (traits, top_matches) VALUES (?, ?)");
      const result = stmt.run(JSON.stringify(normalizedTraits), JSON.stringify(matches));

      res.json({
        resultId: result.lastInsertRowid,
        traits: normalizedTraits,
        matches
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to process results" });
    }
  });

  app.get("/api/careers", (req, res) => {
    try {
      const careers = db.prepare("SELECT id, career_name FROM career_profiles").all();
      res.json(careers);
    } catch (error) {
      res.status(500).json({ error: "Failed to load careers" });
    }
  });

  app.get("/api/compare-careers", (req, res) => {
    const { ids } = req.query; // Expecting comma-separated IDs
    if (!ids) return res.status(400).json({ error: "IDs are required" });
    
    const idList = (ids as string).split(",");
    try {
      const careers = db.prepare(`SELECT * FROM career_profiles WHERE id IN (${idList.map(() => "?").join(",")})`).all(...idList) as any[];
      
      const formattedCareers = careers.map(career => ({
        ...career,
        traits: JSON.parse(career.traits),
        required_skills: JSON.parse(career.required_skills),
        learning_roadmap: JSON.parse(career.learning_roadmap),
        curriculum: career.curriculum ? JSON.parse(career.curriculum) : null,
        tools_software: career.tools_software ? JSON.parse(career.tools_software) : null,
        sub_disciplines: career.sub_disciplines ? JSON.parse(career.sub_disciplines) : null,
        student_reality: career.student_reality ? JSON.parse(career.student_reality) : null
      }));
      
      res.json(formattedCareers);
    } catch (error) {
      res.status(500).json({ error: "Failed to compare careers" });
    }
  });

  app.get("/api/career-details/:id", (req, res) => {
    const { id } = req.params;
    const career = db.prepare("SELECT * FROM career_profiles WHERE id = ?").get(id) as any;
    if (career) {
      career.traits = JSON.parse(career.traits);
      career.required_skills = JSON.parse(career.required_skills);
      career.learning_roadmap = JSON.parse(career.learning_roadmap);
      career.curriculum = career.curriculum ? JSON.parse(career.curriculum) : null;
      career.tools_software = career.tools_software ? JSON.parse(career.tools_software) : null;
      career.sub_disciplines = career.sub_disciplines ? JSON.parse(career.sub_disciplines) : null;
      career.student_reality = career.student_reality ? JSON.parse(career.student_reality) : null;
      res.json(career);
    } else {
      res.status(404).json({ error: "Career not found" });
    }
  });

  app.get("/api/career-by-name/:name", (req, res) => {
    const { name } = req.params;
    const career = db.prepare("SELECT * FROM career_profiles WHERE career_name = ?").get(name) as any;
    if (career) {
      career.traits = JSON.parse(career.traits);
      career.required_skills = JSON.parse(career.required_skills);
      career.learning_roadmap = JSON.parse(career.learning_roadmap);
      career.curriculum = career.curriculum ? JSON.parse(career.curriculum) : null;
      career.tools_software = career.tools_software ? JSON.parse(career.tools_software) : null;
      career.sub_disciplines = career.sub_disciplines ? JSON.parse(career.sub_disciplines) : null;
      career.student_reality = career.student_reality ? JSON.parse(career.student_reality) : null;
      res.json(career);
    } else {
      // Return a partial object so the frontend knows it needs to generate via AI
      res.json({ career_name: name, needs_generation: true });
    }
  });

  app.get("/api/career-fields", (req, res) => {
    try {
      const fields = JSON.parse(fs.readFileSync(path.join(__dirname, "datasets/career_fields.json"), "utf8"));
      res.json(fields);
    } catch (error) {
      res.status(500).json({ error: "Failed to load career fields" });
    }
  });

  app.get("/api/career-fields/:field", (req, res) => {
    try {
      const fields = JSON.parse(fs.readFileSync(path.join(__dirname, "datasets/career_fields.json"), "utf8"));
      const field = fields.find((f: any) => (f.field_name || f.field).toLowerCase() === req.params.field.toLowerCase());
      if (field) {
        res.json(field);
      } else {
        res.status(404).json({ error: "Field not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to load career field" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
