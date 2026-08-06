import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Hero from "../components/home/Hero";
import FeaturedJobs from "../components/home/FeaturedJobs";
import StatsBand from "../components/home/statsBand";
import Testimonials from "../components/home/Testimonial";
import CTASection from "../components/home/CTASection";

const HomePage = () => {
  return (
    <>
      <Hero />
      <FeaturedJobs />
      <StatsBand />
      <Testimonials />
      <CTASection />
      <Footer />
    </>
  );
};

export default HomePage;
