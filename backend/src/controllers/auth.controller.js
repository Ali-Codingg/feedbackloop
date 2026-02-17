import * as authService from "../services/auth.service.js";

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    const user = await authService.register({ name, email, password });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: String(err.message || err) });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: String(err.message || err) });
  }
}
