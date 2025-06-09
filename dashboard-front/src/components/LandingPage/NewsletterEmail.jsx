"use client";
import React from "react";
import promoImage from "../../assets/22.04.26+Sodexo+Volunteering-0093.jpg";

const NewsletterEmail = () => {
  const [email, setEmail] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      console.log("Subscribing email:", email);
      setEmail("");
    }
  };

  return (
    <section className="relative flex flex-col items-center py-10 bg-white overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/111249bf3ec91cc3dfc96d31e0a837b99d1ec78af6ade5be9731ca5302af5278?placeholderIfAbsent=true&apiKey=3f5214a6ea9f4f1683a0e4ee385ff9c5"
          alt="Newsletter background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content container */}
      <div className="relative z-10 w-full max-w-6xl px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          {/* Circular Promo Image */}
          <div className="flex-shrink-0">
            <img
              src={promoImage}
              alt="Promotional"
              className="w-80 h-80 rounded-full object-cover shadow-lg" // Increased image size
            />
          </div>

          {/* Newsletter Form */}
          <div className="w-full md:w-1/2 flex flex-col items-center">
            <h2 className="text-4xl font-bold text-white mb-6 text-center">
              Subscribe to Newsletter
            </h2>
            <form onSubmit={handleSubmit} className="w-full max-w-md">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 rounded-lg bg-lime-700 border-2 border-white text-white placeholder-white focus:outline-none"
                  aria-label="Email address input"
                />
                <button
                  type="submit"
                  className="px-8 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors whitespace-nowrap"
                >
                  SUBSCRIBE
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterEmail;
