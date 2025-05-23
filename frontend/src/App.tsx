import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import StoryPage from "./pages/story";
import WeddingPartyPage from "./pages/weddingparty";
import FAQPage from "./pages/faq";
import TravelPage from "./pages/travel";
import ThingsToDoPage from "./pages/thingstodo";
import RegistryPage from "./pages/registry";
import RSVPPage from "./pages/rsvp";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<StoryPage />} path="/story" />
      <Route element={<WeddingPartyPage />} path="/weddingparty" />
      <Route element={<FAQPage />} path="/faq" />
      <Route element={<TravelPage />} path="/travel" />
      <Route element={<ThingsToDoPage />} path="/thingstodo" />
      <Route element={<RegistryPage />} path="/registry" />
      <Route element={<RSVPPage />} path="/rsvp" />
    </Routes>
  );
}

export default App;
