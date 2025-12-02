"use client";

import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion"; // Removed as not installed
// I will use standard CSS transitions.

const quotes = [
    {
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs",
    },
    {
        text: "Innovation distinguishes between a leader and a follower.",
        author: "Steve Jobs",
    },
    {
        text: "Stay hungry, stay foolish.",
        author: "Steve Jobs",
    },
    {
        text: "Your time is limited, so don't waste it living someone else's life.",
        author: "Steve Jobs",
    },
    {
        text: "Design is not just what it looks like and feels like. Design is how it works.",
        author: "Steve Jobs",
    },
];

export function QuotesCarousel() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % quotes.length);
        }, 4000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative h-full w-full flex flex-col justify-between p-12 text-white bg-zinc-900">
            {/* Logo removed */}

            <div className="z-10 max-w-lg relative min-h-[200px]">
                {quotes.map((quote, index) => (
                    <div
                        key={index}
                        className={`absolute top-0 left-0 transition-all duration-700 ease-in-out transform ${index === current
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-8"
                            }`}
                    >
                        <blockquote className="text-2xl font-medium leading-relaxed">
                            "{quote.text}"
                        </blockquote>
                        <footer className="mt-4 text-sm font-medium text-white/60">
                            — {quote.author}
                        </footer>
                    </div>
                ))}
            </div>

            <div className="z-10 flex gap-2">
                {quotes.map((_, index) => (
                    <div
                        key={index}
                        className={`h-1 rounded-full transition-all duration-500 ${index === current ? "w-8 bg-white" : "w-2 bg-white/20"
                            }`}
                    />
                ))}
            </div>

            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-20">
                <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                </svg>
            </div>
        </div>
    );
}
