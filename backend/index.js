import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5501;

// Supabase 클라이언트 초기화
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Supabase와 연결된 풋살 매칭 백엔드 서버 실행 중!");
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});

app.post("/register", async (req, res) => {
  const { email, password, username } = req.body;

  // Supabase 인증 API 사용
  const { user, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) return res.status(400).json({ error: error.message });

  // 사용자 정보를 데이터베이스에 저장
  const { data, dbError } = await supabase
    .from("users")
    .insert([{ id: user.id, email, username }]);

  if (dbError) return res.status(400).json({ error: dbError.message });

  res.json({ message: "회원가입 성공!", user });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return res.status(400).json({ error: error.message });

  res.json({ message: "로그인 성공!", user: data.user });
});
