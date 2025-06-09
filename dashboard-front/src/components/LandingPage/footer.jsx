"use client";
import * as React from "react";

const footer = () => {
  const socialIcons = [
    {
      src: "https://cdn.builder.io/api/v1/image/assets/3f5214a6ea9f4f1683a0e4ee385ff9c5/5a118dd6d0f9c82695b80fefb115104ebcf484fdd3f37803aa9d8e8ceebd3ced?placeholderIfAbsent=true",
      alt: "Social Media Icon 1",
      className: "w-6 aspect-[0.86]",
    },
    {
      src: "https://cdn.builder.io/api/v1/image/assets/3f5214a6ea9f4f1683a0e4ee385ff9c5/e332fabf5d82e2277a922497e2a7c53078b42d4f8dc92a93ff7f6ae3af17ff1f?placeholderIfAbsent=true",
      alt: "Social Media Icon 2",
      className: "w-6 aspect-[0.86]",
    },
    {
      src: "https://cdn.builder.io/api/v1/image/assets/3f5214a6ea9f4f1683a0e4ee385ff9c5/59d741edc91c68f5608dda3f3ccb97fba8a7d3a6cd1c9f2fb47b51098045b9ce?placeholderIfAbsent=true",
      alt: "Social Media Icon 3",
      className: "w-6 aspect-square",
    },
    {
      src: "https://cdn.builder.io/api/v1/image/assets/3f5214a6ea9f4f1683a0e4ee385ff9c5/b29b4d4adc6432750042ca683635646c1f0e92e3b295ee26b47368b97e393dea?placeholderIfAbsent=true",
      alt: "Social Media Icon 4",
      className: "w-6 aspect-[0.86]",
    },
    {
      src: "https://cdn.builder.io/api/v1/image/assets/3f5214a6ea9f4f1683a0e4ee385ff9c5/d4472028c9b6392b1e20adee6afc02739342abe4ac2ad437516129434eb6e40c?placeholderIfAbsent=true",
      alt: "Social Media Icon 5",
      className: "w-6 aspect-[1.09]",
    },
  ];

  return (
    <footer className="flex flex-col items-center pt-48 max-md:pt-24">
      <div className="flex flex-wrap items-center px-6 py-2 max-w-full bg-red-700 rounded-xl min-h-[104px] w-[1200px] max-md:px-5">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/3f5214a6ea9f4f1683a0e4ee385ff9c5/9608e51125036e00b54b726246b7d0a3e97104af121c03f7f0c8f2688fe72328?placeholderIfAbsent=true"
          className="object-contain shrink-0 self-stretch my-auto aspect-[2.46] w-[216px]"
          alt="Company Logo"
        />

        <p className="flex-1 shrink self-stretch my-auto text-base leading-7 text-center text-white basis-0 max-md:max-w-full">
          ©2022 | AbyssalCoding | All Rights Reserved
        </p>

        <nav
          className="flex gap-4 items-center self-stretch my-auto"
          aria-label="Social Media Links"
        >
          {socialIcons.map((icon, index) => (
            <a
              href="#"
              key={index}
              className="hover:opacity-80 transition-opacity"
              aria-label={icon.alt}
            >
              <img
                loading="lazy"
                src={icon.src}
                className={`object-contain shrink-0 self-stretch my-auto ${icon.className}`}
                alt={icon.alt}
              />
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
};

export default footer;
 
