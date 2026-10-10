/* eslint-env node */
/* global process */
import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const coursesFile = path.join(__dirname, "data", "courses.json");
const usersFile = path.join(__dirname, "data", "users.json");
const adminSecret = process.env.ADMIN_SECRET || "ADMIN123";

const app = express();

app.use(cors());
app.use(express.json());

const readCourses = async () => {
  try {
    const content = await fs.readFile(coursesFile, "utf8");
    return JSON.parse(content);
  } catch (err) {
    if (err.code === "ENOENT") {
      return [];
    }
    throw err;
  }
};

const writeCourses = async (courses) => {
  await fs.writeFile(coursesFile, JSON.stringify(courses, null, 2), "utf8");
};

const readUsers = async () => {
  try {
    const content = await fs.readFile(usersFile, "utf8");
    return JSON.parse(content);
  } catch (err) {
    if (err.code === "ENOENT") {
      return [];
    }
    throw err;
  }
};

const writeUsers = async (users) => {
  await fs.writeFile(usersFile, JSON.stringify(users, null, 2), "utf8");
};

const hashPassword = (password) =>
  crypto.createHash("sha256").update(password).digest("hex");

const sanitizeUser = (user) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  isAdmin: Boolean(user.isAdmin),
  purchasedCourses: Array.isArray(user.purchasedCourses) ? user.purchasedCourses : [],
});

const validateCourse = (course) => {
  const { title, image, level, likes, duration, learners, certificate } = course;
  return (
    typeof title === "string" && title.trim() &&
    typeof image === "string" && image.trim() &&
    typeof level === "string" && level.trim() &&
    (typeof likes === "number" || typeof likes === "string") &&
    typeof duration === "string" && duration.trim() &&
    typeof learners === "string" && learners.trim() &&
    (certificate === undefined || typeof certificate === "boolean")
  );
};

const validateUserPayload = (user) => {
  return (
    typeof user.username === "string" && user.username.trim() &&
    typeof user.password === "string" && user.password.length >= 6 &&
    typeof user.email === "string" && user.email.trim()
  );
};

app.get("/api/courses", async (req, res) => {
  try {
    const courses = await readCourses();
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to load courses" });
  }
});

app.get("/api/courses/:id", async (req, res) => {
  try {
    const courses = await readCourses();
    const course = courses.find((item) => item.id === Number(req.params.id));
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to load course" });
  }
});

app.post("/api/courses", async (req, res) => {
  try {
    const newCourse = req.body;
    if (!validateCourse(newCourse)) {
      return res.status(400).json({ error: "Invalid course payload" });
    }

    const courses = await readCourses();
    const nextId = courses.length ? Math.max(...courses.map((c) => c.id)) + 1 : 1;
    const courseToSave = {
      id: nextId,
      certificate: false,
      ...newCourse,
    };

    courses.push(courseToSave);
    await writeCourses(courses);

    res.status(201).json(courseToSave);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to save course" });
  }
});

app.put("/api/courses/:id", async (req, res) => {
  try {
    const courseId = Number(req.params.id);
    const update = req.body;

    if (!validateCourse(update)) {
      return res.status(400).json({ error: "Invalid course payload" });
    }

    const courses = await readCourses();
    const index = courses.findIndex((item) => item.id === courseId);
    if (index === -1) {
      return res.status(404).json({ error: "Course not found" });
    }

    const updatedCourse = {
      id: courseId,
      certificate: update.certificate === undefined ? courses[index].certificate : update.certificate,
      ...update,
    };
    courses[index] = updatedCourse;
    await writeCourses(courses);

    res.json(updatedCourse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to update course" });
  }
});

app.delete("/api/courses/:id", async (req, res) => {
  try {
    const courseId = Number(req.params.id);
    const courses = await readCourses();
    const filtered = courses.filter((item) => item.id !== courseId);
    if (filtered.length === courses.length) {
      return res.status(404).json({ error: "Course not found" });
    }

    await writeCourses(filtered);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to delete course" });
  }
});

app.post("/api/users/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!validateUserPayload({ username, email, password })) {
      return res.status(400).json({ error: "Username, email, and password are required. Password should be at least 6 characters." });
    }

    const users = await readUsers();
    if (users.some((user) => user.username === username)) {
      return res.status(409).json({ error: "Username already exists" });
    }

    const nextId = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;
    const newUser = {
      id: nextId,
      username,
      email,
      password: hashPassword(password),
      isAdmin: false,
      purchasedCourses: [],
    };
    users.push(newUser);
    await writeUsers(users);

    res.status(201).json(sanitizeUser(newUser));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to create user" });
  }
});

app.post("/api/users/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const users = await readUsers();
    const user = users.find((u) => u.username === username);
    if (!user || user.password !== hashPassword(password)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json(sanitizeUser(user));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to log in" });
  }
});

app.post("/api/admin/signup", async (req, res) => {
  try {
    const { username, email, password, adminCode } = req.body;
    if (!validateUserPayload({ username, email, password }) || !adminCode) {
      return res.status(400).json({ error: "Username, email, password, and admin code are required" });
    }
    if (adminCode !== adminSecret) {
      return res.status(403).json({ error: "Invalid admin code" });
    }

    const users = await readUsers();
    if (users.some((user) => user.username === username)) {
      return res.status(409).json({ error: "Admin username already exists" });
    }

    const nextId = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;
    const newAdmin = {
      id: nextId,
      username,
      email,
      password: hashPassword(password),
      isAdmin: true,
      purchasedCourses: [],
    };
    users.push(newAdmin);
    await writeUsers(users);

    res.status(201).json(sanitizeUser(newAdmin));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to create admin" });
  }
});

app.post("/api/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const users = await readUsers();
    const user = users.find((u) => u.username === username && u.isAdmin);
    if (!user || user.password !== hashPassword(password)) {
      return res.status(401).json({ error: "Invalid admin credentials" });
    }

    res.json(sanitizeUser(user));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to log in admin" });
  }
});

app.post("/api/users/:id/purchase", async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const { courseIds } = req.body;
    if (!Array.isArray(courseIds) || courseIds.length === 0) {
      return res.status(400).json({ error: "Please provide courseIds to purchase" });
    }

    const users = await readUsers();
    const user = users.find((item) => item.id === userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const courses = await readCourses();
    const validCourseIds = courses.map((course) => course.id);
    const purchased = new Set([...(user.purchasedCourses || [])]);
    courseIds.forEach((courseId) => {
      const id = Number(courseId);
      if (validCourseIds.includes(id)) {
        purchased.add(id);
      }
    });

    user.purchasedCourses = Array.from(purchased);
    await writeUsers(users);
    res.json(sanitizeUser(user));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to process purchase" });
  }
});

app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  console.log("Name:", name);
  console.log("Email:", email);
  console.log("Message:", message);

  res.json({ success: true, message: "contact form submitted successfully" });
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`backend running on http://localhost:${port}`);
});
