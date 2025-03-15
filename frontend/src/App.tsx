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
import Profile from "./components/pages/Profile";
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
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
