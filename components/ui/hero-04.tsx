/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useRef } from "react";
import { ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection04() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    // Smooth entrance animation
    const children = el.querySelectorAll('.animate-in');
    children.forEach((child, i) => {
      const htmlChild = child as HTMLElement;
      htmlChild.style.opacity = '0';
      htmlChild.style.transform = 'translateY(40px)';
      htmlChild.style.transition = `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.15}s`;
      
      setTimeout(() => {
        htmlChild.style.opacity = '1';
        htmlChild.style.transform = 'translateY(0)';
      }, 100);
    });
  }, []);

  return (
    <section ref={heroRef} className="min-h-screen overflow-hidden relative py-20 flex flex-col justify-center">
      <div className="mx-auto max-w-7xl relative z-20 px-6 w-full">
        {/* Main heading */}
        <div className="relative pt-10 md:pt-0">
          <p className="animate-in text-xs absolute -top-6 left-0 md:left-20 font-medium tracking-[0.3em] text-neutral-500 uppercase">
            Creator · Speaker · Storyteller
          </p>
          <h1
            className="animate-in z-20 text-white relative font-black text-center leading-[0.85] tracking-[-0.06em] text-6xl md:text-8xl xl:text-[10rem]"
          >
            SACHIN
            <br />
            PRADHAN
          </h1>
          <p className="animate-in text-lg md:text-xl text-center mt-6 font-light tracking-[0.15em] uppercase text-neutral-400">
            Public Speaker &nbsp;|&nbsp; Content Creator &nbsp;|&nbsp; On-Camera Personality
          </p>
        </div>

        {/* Central card with tagline + CTA */}
        <div className="grid relative mt-16 md:mt-20">
          <div className="flex gap-6 justify-center">
            <div className="animate-in flex flex-col md:flex-row gap-8 w-full max-w-5xl items-center relative">
              
              {/* Sachin's photo - layered */}
              <div className="relative w-full md:w-auto flex-shrink-0 flex justify-center">
                <div className="relative">
                  <div className="w-64 h-80 md:w-72 md:h-96 overflow-hidden border border-white/10 shadow-2xl shadow-white/5">
                    <img
                      src="/jpg/sachin-3.jpeg"
                      alt="Sachin Pradhan"
                      className="h-full w-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                  </div>
                  <div className="absolute -bottom-3 -right-3 w-64 h-80 md:w-72 md:h-96 border border-white/5 -z-10" />
                  <div className="absolute -bottom-6 -right-6 w-64 h-80 md:w-72 md:h-96 border border-white/[0.02] -z-20" />
                </div>
              </div>

              {/* Tagline + CTA */}
              <div className="flex-1 space-y-8 text-center md:text-left">
                <blockquote className="text-2xl md:text-4xl lg:text-5xl font-light italic text-white/90 leading-tight">
                  &ldquo;I turn ideas into stories that people actually <span className="font-bold not-italic text-white">feel.</span>&rdquo;
                </blockquote>
                <p className="text-sm md:text-base text-neutral-500 tracking-wide max-w-lg">
                  Helping brands connect, engage, and grow through powerful storytelling.
                </p>
                <div className="flex gap-4 flex-wrap justify-center md:justify-start">
                  <Button size="lg" className="rounded-none text-sm px-8 py-6 uppercase tracking-[0.2em] font-bold">
                    Watch My Videos
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-none text-sm px-8 py-6 uppercase tracking-[0.2em] font-bold">
                    Hire Me
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="animate-in md:flex mt-28 md:mt-36 items-end justify-between">
          <div className="relative hidden md:block">
            <div className="w-60 h-36 shadow-2xl border border-white/10 overflow-hidden mb-8 md:mb-0 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
              <img
                src="/jpg/sachin-6.jpeg"
                alt="Sachin - Speaking"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div className="w-60 h-36 absolute left-6 -top-6 shadow-2xl border border-white/10 overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <img
                src="/jpg/sachin-2.jpeg"
                alt="Sachin - Content"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div className="w-60 h-36 absolute left-12 -top-12 shadow-2xl border border-white/10 overflow-hidden transform -rotate-1 hover:rotate-0 transition-transform duration-500">
              <img
                src="/jpg/sachin-4.jpeg"
                alt="Sachin - Stage"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>
          <div className="w-full md:w-auto text-center md:text-right">
            <div className="flex items-center justify-center md:justify-end gap-2 text-neutral-500 hover:text-white transition-colors cursor-pointer group">
              <span className="text-sm font-medium tracking-[0.2em] uppercase">
                Explore My Work
              </span>
              <ArrowDownRight className="size-5 transform group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
            </div>
            <div className="mt-4">
              <h2 className="text-4xl md:text-6xl uppercase tracking-[-0.04em] font-black text-white">
                Stories Without<br/>Limits
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Grid background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          maskImage: `radial-gradient(ellipse 80% 70% at 50% 30%, #000 30%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(ellipse 80% 70% at 50% 30%, #000 30%, transparent 100%)`,
        }}
      />

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-transparent to-black/50 pointer-events-none" />
    </section>
  );
}
