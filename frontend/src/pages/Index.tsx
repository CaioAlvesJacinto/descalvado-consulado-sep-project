import Layout from "@/components/Layout";
import HeroSection from "@/components/sections/HeroSection";
import FeaturedEventsSection from "@/components/sections/FeaturedEventsSection";
import MerchandiseSection from "@/components/sections/MerchandiseSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import CTASection from "@/components/sections/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturedEventsSection />
      <MerchandiseSection />
      <HowItWorksSection />
      <CTASection />
    </Layout>
  );
};

export default Index;