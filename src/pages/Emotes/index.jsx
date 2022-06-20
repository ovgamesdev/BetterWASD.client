import useTitle from "../../hooks/useTitle/index.tsx";
import NavbarEmotes from "../../components/UI/Navbar/Emotes";

import { Navigate, Route, Routes } from "react-router-dom";

import EmotesTop from "./Top";
import EmotesShared from "./Shared";
import EmotesGlobal from "./Global";
import Emote from "./Emote";

const EmotesRoutes = () => {
  useTitle("BetterWASYA | Эмоции");

  return (
    <section className="question-section" style={{ paddingBottom: "160px" }}>
      <div className="items">
        <div className="item item_left">
          <NavbarEmotes defaultActiveKey="#/emotes/global" />
        </div>

        <Routes>
          <Route path="top" element={<EmotesTop />} />
          <Route path="shared" element={<EmotesShared />} />
          <Route path="global" element={<EmotesGlobal />} />

          <Route path=":id" element={<Emote />} />

          <Route path="*" element={<Navigate to="/emotes/top" />} />
        </Routes>
      </div>
    </section>
  );
};

export default EmotesRoutes;
