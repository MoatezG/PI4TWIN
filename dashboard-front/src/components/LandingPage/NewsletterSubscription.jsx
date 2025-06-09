"use client";
import * as React from "react";

const NewsletterSubscription = () => {
    return (
        <section className="flex flex-col justify-center items-center py-16">
            <div className="flex flex-col justify-center items-center px-2.5 pt-12 pb-2.5 max-md:max-w-full text-center">
                <h2 className="text-3xl font-semibold border-b-4 border-green-600 text-zinc-800">
                    Subscribe <span className="text-[rgba(48,48,48,1)]">to</span>{" "}
                    <span className="text-[rgba(48,48,48,1)]">Newsl</span>e
                    <span className="text-[rgba(48,48,48,1)]">tter</span>
                </h2>
                <p className="mt-2.5 text-base leading-7 text-zinc-800">
                    To get weekly updates
                </p>
            </div>
        </section>
    );
};

export default NewsletterSubscription;
