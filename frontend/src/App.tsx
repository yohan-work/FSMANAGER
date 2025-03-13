import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import MatchDetail from "./components/pages/MatchDetail";
// import { RecoilRoot } from "recoil";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/matches/:id" element={<MatchDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
