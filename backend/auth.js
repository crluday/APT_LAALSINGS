import bcrypt from "bcrypt";

const users = [
  // username: admin, password: admin123 (hashed)
  {
    username: "admin",
    passwordHash:
      "$2b$10$pvx1Y8Q3Zt7c9e4Rj2d8s.w1Q7tlh9Qm2dSdy8b8Cw2zK7Xb7r8hS",
  },
];

export function findUser(username) {
  return users.find((u) => u.username === username);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}
