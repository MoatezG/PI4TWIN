"use client";
import * as React from "react";

const LandingHero = () => {
  return (
    <main className="relative" style={{ backgroundColor: '#44a326' }}>
      <section className="relative flex flex-wrap gap-10 justify-between items-start px-8 w-full bg-white min-h-[695px] max-md:px-5 max-md:max-w-full overflow-hidden">
        <div className="pt-24 min-w-60 max-md:max-w-full z-10">
          <div className="flex flex-col max-md:max-w-full">
            <header className="max-md:max-w-full">
              <div className="max-md:max-w-full">
                <h2 className="text-2xl font-medium text-zinc-800">
                  Every Item Counts
                </h2>
                <div className="text-8xl font-bold leading-none max-md:max-w-full max-md:text-4xl">
                  <h1 className="max-md:max-w-full max-md:text-4xl" style={{ color: '#3CB018' }}>
                    Save More,
                  </h1>
                  <p className="mt-4 text-zinc-600 max-md:max-w-full max-md:text-4xl">
                    Waste Less.
                  </p>
                </div>
              </div>
              <p className="mt-2 text-base font-medium leading-7 text-zinc-800 max-md:max-w-full">
                Sustainable Stock Management for a Greener Future
                <br />
                Take Your stock management to the next level
              </p>
            </header>
            <div className="flex gap-4 items-start self-start mt-10 text-base">
              <button className="gap-2.5 self-stretch px-6 py-3.5 text-white bg-red-500 rounded-lg border-2 border-red-500 border-solid min-h-12 font-semibold max-md:px-5">
                Get Started
              </button>
              <button className="gap-2.5 self-stretch px-6 py-3.5 text-black rounded-lg border-2 border-black border-solid min-h-12 font-semibold max-md:px-5">
                Learn More
              </button>
            </div>
          </div>
        </div>
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/6ac77795a837cacb800f4cdf7eca2bb4a82b7ce9089be84bacbad6c1627b17af?placeholderIfAbsent=true&apiKey=3f5214a6ea9f4f1683a0e4ee385ff9c5"
          alt="Stock Management Illustration"
          className="object-contain aspect-[1.09] min-w-60 w-full max-w-[683px] max-md:max-w-full z-10"
        />
        <img
          src="https://cdn.builder.io/api/v1/image/assets/3f5214a6ea9f4f1683a0e4ee385ff9c5/26290010d3f960d86bac0b460fc5c0417f456a4545e4fa3ea63169f66cbe09e0?placeholderIfAbsent=true"
          className="absolute bottom-0 left-0 w-full h-auto object-cover z-0"
          alt="Vector graphic"
        />
        <img
          src="https://cdn.builder.io/api/v1/image/assets/3f5214a6ea9f4f1683a0e4ee385ff9c5/747354bdc206e3aa52d4fd2508f7ac433364821e150a30fa182a35ba28059129?placeholderIfAbsent=true"
          className="absolute bottom-0 left-0 w-full h-auto object-cover z-0"
          alt="Vector graphic"
        />
      </section>

      <section className="flex overflow-hidden relative flex-col md:flex-row gap-10 justify-center items-center px-11 pt-24 pb-36 w-full text-white bg-[#259B00] rounded-[80px_80px_0px_0px] max-md:px-5 max-md:pb-24 max-md:max-w-full">        <div className="absolute inset-0 bg-gradient-to-b from-[#259B00] to-transparent z-0"></div>
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/699a5259281e18464a2924bc6385dabc869cce7a468af9493b5463080a2352c8?placeholderIfAbsent=true&apiKey=3f5214a6ea9f4f1683a0e4ee385ff9c5"
          alt="Background Pattern"
          className="object-contain absolute top-2/4 left-2/4 z-0 self-start -translate-x-2/4 -translate-y-2/4 aspect-[4.12] h-[350px] rounded-[80px_80px_0px_0px] w-[1440px] max-md:max-w-full opacity-50"
        />

        <article className="flex z-10 flex-col items-center self-stretch my-auto min-w-60 max-w-xs md:max-w-sm lg:max-w-md text-center mx-auto">
          <h3 className="text-3xl font-semibold mb-4">Optimize Your Inventory</h3>
          <p className="text-base font-medium leading-6 whitespace-pre-line">
            Keep your stock fresh and avoid over-ordering by matching supply to
            real-time demand.
          </p>
        </article>

        <article className="flex z-10 flex-col items-center self-stretch my-auto min-w-60 max-w-xs md:max-w-sm lg:max-w-md text-center mx-auto">
          <h3 className="text-3xl font-semibold mb-4">Sustain the Environment</h3>
          <p className="text-base font-medium leading-6 whitespace-pre-line">
            Extend the life of perishable goods less waste means a healthier
            planet.
          </p>
        </article>

        <article className="flex z-10 flex-col items-center self-stretch my-auto min-w-60 max-w-xs md:max-w-sm lg:max-w-md text-center mx-auto">
          <h3 className="text-3xl font-semibold mb-4">Empower Your Community</h3>
          <p className="text-base font-medium leading-6 whitespace-pre-line">
            Support local businesses and share resources for a more resilient,
            sustainable network.
          </p>
        </article>

        <div className="flex absolute left-1/2 transform -translate-x-1/2 bottom-0 z-0 bg-white h-[50px] min-h-[50px] rounded-[80px_80px_0px_0px] w-[100vw] shadow-lg" />
      </section>
    </main>
  );
};

export default LandingHero;
