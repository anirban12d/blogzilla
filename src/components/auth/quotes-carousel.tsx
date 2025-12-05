"use client";

import { useState, useEffect } from "react";

const quotes = [
    {
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs",
    },
    {
        text: "The best way to predict the future is to invent it.",
        author: "Alan Kay",
    },
    {
        text: "Simplicity is the ultimate sophistication.",
        author: "Leonardo da Vinci",
    },
    {
        text: "First, solve the problem. Then, write the code.",
        author: "John Johnson",
    },
    {
        text: "Any sufficiently advanced technology is indistinguishable from magic.",
        author: "Arthur C. Clarke",
    },
    {
        text: "The function of good software is to make the complex appear simple.",
        author: "Grady Booch",
    },
    {
        text: "Talk is cheap. Show me the code.",
        author: "Linus Torvalds",
    },
    {
        text: "Make it work, make it right, make it fast.",
        author: "Kent Beck",
    },
];

export function QuotesCarousel() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % quotes.length);
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative h-full w-full flex flex-col justify-end p-12 lg:p-16 text-white bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

            {/* Content */}
            <div className="z-10 max-w-xl relative min-h-[180px] mb-8">
                {quotes.map((quote, index) => (
                    <div
                        key={index}
                        className={`absolute bottom-0 left-0 transition-all duration-700 ease-out transform ${index === current
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-6"
                            }`}
                    >
                        <blockquote className="text-xl lg:text-2xl font-medium leading-relaxed text-white/90 tracking-tight">
                            &ldquo;{quote.text}&rdquo;
                        </blockquote>
                        <footer className="mt-5 text-sm font-medium text-blue-300/60">
                            {quote.author}
                        </footer>
                    </div>
                ))}
            </div>

            {/* Progress indicators */}
            <div className="z-10 flex gap-2">
                {quotes.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`h-1 rounded-full transition-all duration-500 ${index === current
                            ? "w-10 bg-blue-400"
                            : "w-2 bg-white/20 hover:bg-white/30"
                        }`}
                    />
                ))}
            </div>

            {/* Subtle corner accent */}
            <div className="absolute top-8 left-8">
                <div className="w-12 h-12 border border-blue-400/20 rounded-xl" />
            </div>
        </div>
    );
}
