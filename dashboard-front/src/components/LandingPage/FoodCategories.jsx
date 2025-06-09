"use client";
import * as React from "react";

const FoodCategories = () => {
  return (
    <section className="flex flex-col justify-center items-center px-8 pt-16 pb-20 bg-neutral-50 max-md:px-5">
      <header className="px-4 pb-2.5 text-3xl font-semibold border-b-4 border-green-600 text-zinc-800 max-md:max-w-full">
        <h2>Explore Food Categories</h2>
      </header>
      <div className="flex flex-wrap gap-8 items-start mt-20 max-w-full w-[1092px] max-md:mt-10">
        <article className="flex flex-col flex-1 shrink items-center px-4 pt-4 pb-6 bg-white rounded-xl basis-0 min-w-60 shadow-[0px_4px_20px_rgba(0,0,0,0.15)] w-[249px]">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/4eb3362d051c5d11ed45091606cb49211712fbc27cfedf61f5877063f9568c82?placeholderIfAbsent=true&apiKey=3f5214a6ea9f4f1683a0e4ee385ff9c5"
            alt="Fresh Produce"
            className="object-contain self-stretch w-full rounded-md aspect-[1.25]"
          />
          <div className="flex flex-col items-start mt-8 max-w-full text-center w-[164px]">
            <h3 className="text-base font-bold leading-7 text-zinc-800">
              Fresh Produce
            </h3>
            <p className="mt-2 text-sm leading-5 text-zinc-800">
              Fruits and vegetables saved from going to waste.
            </p>
          </div>
          <button className="gap-2.5 self-stretch px-6 py-4 mt-8 text-sm font-semibold rounded-lg border-2 border-solid border-neutral-700 min-h-12 text-neutral-700 max-md:px-5">
            Join the Movement
          </button>
        </article>

        <article className="flex flex-col flex-1 shrink items-center px-4 pt-4 pb-6 bg-white rounded-xl basis-0 min-w-60 shadow-[0px_4px_20px_rgba(0,0,0,0.15)] w-[249px]">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/77599783083ae5d395df5941653bcf5ed5b6d32c023d5a9e6b6ee14e8f2a719e?placeholderIfAbsent=true&apiKey=3f5214a6ea9f4f1683a0e4ee385ff9c5"
            alt="Bakery & Pantry"
            className="object-contain self-stretch w-full rounded-md aspect-[1.25]"
          />
          <div className="flex flex-col items-start mt-8 max-w-full text-center w-[164px]">
            <h3 className="text-base font-bold leading-7 text-zinc-800">
              Bakery & Pantry
            </h3>
            <p className="mt-2 text-sm leading-5 text-zinc-800">
              Bread, pastries, and pantry staples ready for a second chance.
            </p>
          </div>
          <button className="gap-2.5 self-stretch px-6 py-4 mt-8 text-sm font-semibold rounded-lg border-2 border-solid border-neutral-700 min-h-12 text-neutral-700 max-md:px-5">
            Join the Movement
          </button>
        </article>

        <article className="flex flex-col flex-1 shrink items-center px-4 pt-4 pb-6 bg-white rounded-xl basis-0 min-w-60 shadow-[0px_4px_20px_rgba(0,0,0,0.15)] w-[249px]">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/729b6347a56cf9d6e370f4782bb3489890babb5ba599d02c7a5986eb0fbbc959?placeholderIfAbsent=true&apiKey=3f5214a6ea9f4f1683a0e4ee385ff9c5"
            alt="Dairy & Eggs"
            className="object-contain self-stretch w-full rounded-md aspect-[1.25]"
          />
          <div className="flex flex-col items-start mt-8 max-w-full text-center w-[164px]">
            <h3 className="text-base font-bold leading-7 text-zinc-800">
              Dairy & Eggs
            </h3>
            <p className="mt-2 text-sm leading-5 text-zinc-800">
              Fresh dairy products and eggs rescued from surplus stocks.
            </p>
          </div>
          <button className="gap-2.5 self-stretch px-6 py-4 mt-8 text-sm font-semibold rounded-lg border-2 border-solid border-neutral-700 min-h-12 text-neutral-700 max-md:px-5">
            Join the Movement
          </button>
        </article>

        <article className="flex overflow-hidden relative flex-col flex-1 shrink justify-center items-center self-stretch px-4 pt-4 pb-6 text-white bg-[#259B00] rounded-xl basis-0 min-w-60 shadow-[0px_4px_20px_rgba(0,0,0,0.15)]">
          <div className="flex z-10 flex-col items-center max-w-full text-center w-[164px]">
            <h3 className="text-base font-bold leading-7">Others</h3>
            <p className="mt-2 text-sm leading-none">
              Milk, Tools, Spice, etc.
            </p>
          </div>
          <button className="flex z-10 gap-2.5 items-center px-6 py-4 mt-8 text-sm font-semibold bg-[#259B00] text-white rounded-lg border-2 border-white border-solid min-h-12 max-md:px-5 hover:bg-white hover:text-[#259B00]">
            <span className="self-stretch my-auto">See Others</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 transition-colors duration-200"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/c0aa4980a12200168f00059b7864aa4be10629aa6975fb7cadd9b49a06128093?placeholderIfAbsent=true&apiKey=3f5214a6ea9f4f1683a0e4ee385ff9c5"
            className="object-cover absolute inset-0 z-0 w-full h-full"
            alt="Background pattern"
          />
        </article>
      </div>
    </section>
  );
};

export default FoodCategories;
