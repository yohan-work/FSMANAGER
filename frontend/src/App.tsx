import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./components/pages/Home";
import MatchDetail from "./components/pages/MatchDetail";
import CreateMatch from "./components/pages/CreateMatch";
import MatchList from "./components/pages/MatchList";
import Chat from "./components/pages/Chat";
import ChatHome from "./components/pages/ChatHome";
// Profile 컴포넌트는 아직 구현되지 않았으므로 import 제거
// import { RecoilRoot } from "recoil";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/matches" element={<MatchList />} />
        <Route path="/match" element={<Navigate to="/matches" replace />} />
        <Route path="/matches/create" element={<CreateMatch />} />
        <Route path="/matches/:id" element={<MatchDetail />} />
        
        {/* 채팅 관련 라우트 */}
        <Route path="/chat" element={<ChatHome />} />
        <Route path="/chat/:chatId" element={<ChatHome />} />
        <Route path="/chat-simple" element={<Chat />} />
        
        {/* <Route path="/profile" element={<Profile />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
