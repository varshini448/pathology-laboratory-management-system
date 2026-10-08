import HomeNavbar from "../../components/home/HomeNavbar";
import HeroSection from "../../components/home/HeroSection";
import CapabilitiesSection from "../../components/home/CapabilitiesSection";
import WorkflowSection from "../../components/home/WorkflowSection";
import AISection from "../../components/home/AISection";
import RolesSection from "../../components/home/RolesSection";
import SecuritySection from "../../components/home/SecuritySection";
import HomeFooter from "../../components/home/HomeFooter";
import "../../styles/home/home.css";
import "../../styles/home/home-navbar.css";
import "../../styles/home/home-hero.css";
import "../../styles/home/home-capabilities.css";
import "../../styles/home/home-workflow.css";
import "../../styles/home/home-ai.css";
import "../../styles/home/home-roles.css";
import "../../styles/home/home-security.css";
import "../../styles/home/home-footer.css";
import "../../styles/home/home-responsive.css";
const Home = () => {
  return (
    <div className="home-page">
      <HomeNavbar />

      <main>
        <HeroSection />
        <CapabilitiesSection />
        <WorkflowSection />
        <AISection />
        <RolesSection />
        <SecuritySection />
      </main>

      <HomeFooter />
    </div>
  );
};

export default Home;
