"use client";

import React from "react";

// AuthorInfo Component
const AuthorInfo = ({ authorImage, authorName, date }) => {
  return (
    <div className="flex gap-2 items-center mt-4 w-full text-xs">
            <img
        src={authorImage}
        alt={authorName}
        className="object-contain shrink-0 self-stretch my-auto rounded-full aspect-square w-[40px] md:w-[47px]"
      />
      <div className="flex-1 shrink self-stretch my-auto basis-0">
        <div className="font-bold text-zinc-800">{authorName}</div>
        <div className="text-zinc-800">{date}</div>
      </div>
    </div>
  );
};

// BlogCard Component
const BlogCard = ({
  image,
  category,
  title,
  description,
  authorImage,
  authorName,
  date,
  className = "",
}) => {
  return (
    <article
      className={`flex flex-col pb-6 bg-white rounded-xl shadow-md transition-all duration-300 border border-transparent overflow-hidden hover:shadow-lg hover:scale-105 hover:border-green-600 ${className}`}
    >
      <img
        src={image}
        alt={title}
        className="object-cover self-center max-w-full aspect-[1.84] min-h-[191px] w-full"
      />
      <div className="px-4 mt-4 w-full">
        <div className="w-full">
          <div className="w-full h-[50px]">
            <div className="text-xs text-zinc-800">{category}</div>
            <h3 className="text-sm font-bold leading-5 text-zinc-800">
              {title}
            </h3>
          </div>
          <p className="mt-3 text-sm leading-5 text-zinc-800">{description}</p>
        </div>
        <AuthorInfo
          authorImage={authorImage}
          authorName={authorName}
          date={date}
        />
      </div>
    </article>
  );
};

// BlogSection Component
const BlogSection = () => {
  const blogPosts = [
    {
      id: 1,
      image:
        "https://cdn.builder.io/api/v1/image/assets/3f5214a6ea9f4f1683a0e4ee385ff9c5/afb89541cfd535515b047902663ab613ddeeb16dd8c85453f0042c3df5bb5993?placeholderIfAbsent=true",
      category: "Lifestyle",
      title: "5 Ways Businesses Can Reduce Food Waste",
      description:
        "Practical tips for supermarkets and restaurants to minimize surplus food and improve sustainability",
      authorImage:
        "https://cdn.builder.io/api/v1/image/assets/3f5214a6ea9f4f1683a0e4ee385ff9c5/f5fc741cbbead282dc0c5578597cd955ff5b2e3be24930e32bdc7b7b441c498c?placeholderIfAbsent=true",
      authorName: "French Aldebra",
      date: "Apr 1, 2022",
    },
    {
      id: 2,
      image:
        "https://cdn.builder.io/api/v1/image/assets/3f5214a6ea9f4f1683a0e4ee385ff9c5/4dbbdf029d6739f1703c4fd46e01b246edfe66886358e545e3573763cd078628?placeholderIfAbsent=true",
      category: "Healthy",
      title: "AI in Food Redistribution: How Technology stops Food Waste",
      description:
        "Explore how AI is revolutionizing the way we manage and redistribute surplus food.",
      authorImage:
        "https://cdn.builder.io/api/v1/image/assets/3f5214a6ea9f4f1683a0e4ee385ff9c5/69072045f85188e251a238302b6ad6bb884f4dfc28647dd178301706ae96a489?placeholderIfAbsent=true",
      authorName: "Verencia Rodrigo",
      date: "May 21, 2022",
    },
    {
      id: 3,
      image:
        "https://cdn.builder.io/api/v1/image/assets/3f5214a6ea9f4f1683a0e4ee385ff9c5/7660cb78faacbad8b8f0b100b4ee40d30f1cf463eb73ca88909172a28cf9a0d9?placeholderIfAbsent=true",
      category: "Lifestyle",
      title: "Sustainable Practices for Restaurants: A Beginner's Guide",
      description:
        "Learn how restaurants can adopt eco-friendly practices and reduce their environmental footprint",
      authorImage:
        "https://cdn.builder.io/api/v1/image/assets/3f5214a6ea9f4f1683a0e4ee385ff9c5/460c2c1ad9e78fb8f3749d51d49bbf4882b6d3721ce1f803e475bac664468e47?placeholderIfAbsent=true",
      authorName: "Alvonzo Humuz",
      date: "Nov 22, 2022",
    },
    {
      id: 4,
      image:
        "https://cdn.builder.io/api/v1/image/assets/3f5214a6ea9f4f1683a0e4ee385ff9c5/20539b611689464f539943027f3273b22abbe60b82909e77291fb5d6f14f0946?placeholderIfAbsent=true",
      category: "Nutrition",
      title: "From Waste to Worth: The Journey of Surplus Food",
      description:
        "A deep dive into the lifecycle of surplus food and how it can be redirected to those in need.",
      authorImage:
        "https://cdn.builder.io/api/v1/image/assets/3f5214a6ea9f4f1683a0e4ee385ff9c5/945101e9d758c00c00797301d539fcefc66f79ad8df9b92ee30e13999038cb59?placeholderIfAbsent=true",
      authorName: "Vivian Airy",
      date: "Jul 22, 2022",
    },
  ];

  return (
    <section className="flex flex-col justify-center items-center px-4 md:px-32 pt-16 max-md:px-5">
      <header className="self-center">
        <h2 className="px-4 pb-2.5 text-3xl font-semibold border-b-4 border-green-600 text-zinc-800">
          Our Blog Post
        </h2>
      </header>
      <div className="flex flex-wrap justify-center gap-8 mt-10 w-full">
        {blogPosts.map((post) => (
          <BlogCard
            key={post.id}
            image={post.image}
            category={post.category}
            title={post.title}
            description={post.description}
            authorImage={post.authorImage}
            authorName={post.authorName}
            date={post.date}
            className="flex-1 min-w-[250px] max-w-[300px] md:max-w-[276px] mx-2"
          />
        ))}
      </div>
    </section>
  );
};

// BlogPostSection Component
const BlogPostSection = () => {
  return <BlogSection />;
};

export default BlogPostSection;
