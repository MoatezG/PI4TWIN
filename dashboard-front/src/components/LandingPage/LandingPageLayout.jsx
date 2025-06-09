// components/LandingPage/LandingPageLayout.jsx
import Navbar from "./NavBar";
import LandingHero from "./LandingHero";
import FoodCategories from "./FoodCategories";
import SustainaFoodSection from "./SustainaFoodSection";
import BlogPostSection from "./BlogPost";
import NewsletterSubscription from "./NewsletterSubscription";
import NewsletterEmail from "./NewsletterEmail";
import Footer from "./footer";
import "../../assets/css/landing-scroll.css";

const LandingPageLayout = () => {
  return (
    <>
      <Navbar />
      <LandingHero />
      <div id="categories">
        <FoodCategories />
      </div>
      <div id="about-us">
        <SustainaFoodSection />
      </div>
      <div id="blog">
        <BlogPostSection />
      </div>
      <div id="newsletter">
        <NewsletterSubscription />
      </div>
      <div id="newsletter-email">
        <NewsletterEmail />
      </div>
      <Footer />
    </>
  );
};

export default LandingPageLayout;
