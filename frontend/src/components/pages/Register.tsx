import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const Register = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5001/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, username }),
    });
    const data = await response.json();
    alert(data.message);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center">
        <Link to="/" className="text-[#333D4B] mr-4">
          <FiArrowLeft size={20} />
        </Link>
        <h1 className="text-lg font-bold text-[#333D4B]">회원가입</h1>
      </div>

      <div className="px-5 py-8">
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#333D4B] mb-1.5">
              이름
            </label>
            <input
              type="text"
              placeholder="이름을 입력해주세요"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3182F6] focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#333D4B] mb-1.5">
              이메일
            </label>
            <input
              type="email"
              placeholder="이메일을 입력해주세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3182F6] focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#333D4B] mb-1.5">
              비밀번호
            </label>
            <input
              type="password"
              placeholder="비밀번호를 입력해주세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3182F6] focus:border-transparent transition-all"
              required
            />
            <p className="mt-1.5 text-xs text-[#8B95A1]">
              영문, 숫자를 포함한 8자 이상의 비밀번호를 입력해주세요
            </p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-[#3182F6] text-white font-medium py-3.5 rounded-lg hover:bg-[#1b64da] transition-colors"
            >
              회원가입
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[#8B95A1] text-sm">
            이미 계정이 있으신가요?{" "}
            <Link to="/login" className="text-[#3182F6] font-medium">
              로그인
            </Link>
          </p>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-100">
          <p className="text-center text-[#8B95A1] text-sm mb-5">간편 가입</p>
          <div className="flex justify-center space-x-4">
            <button className="w-12 h-12 rounded-full bg-[#F1F3F5] flex items-center justify-center">
              <span className="text-[#333D4B] font-medium text-sm">K</span>
            </button>
            <button className="w-12 h-12 rounded-full bg-[#F1F3F5] flex items-center justify-center">
              <span className="text-[#333D4B] font-medium text-sm">G</span>
            </button>
            <button className="w-12 h-12 rounded-full bg-[#F1F3F5] flex items-center justify-center">
              <span className="text-[#333D4B] font-medium text-sm">A</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
