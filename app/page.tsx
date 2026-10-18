/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { RadialScrollGallery } from '@/components/ui/portfolio-and-image-gallery';
import dynamic from 'next/dynamic';
import {
  ArrowUpRight,
  Phone,
  Mail,
  Mic,
  Video,
  Eye,
  MessageSquare,
  PenTool,
  Play,
  ChevronDown,
  ArrowRight,
  X,
  ExternalLink,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Copy,
} from 'lucide-react';
import { portfolioContent } from './content';

const InfiniteGallery = dynamic(
  () => import('@/components/ui/3d-gallery-photography'),
  { ssr: false }
);

/* ── Social icons ── */
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);
const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

/* ── Extract YouTube Video ID ── */
function getYouTubeId(url: string) {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i);
  return match ? match[1] : null;
}

/* ── ALL VIDEOS (from content.ts) ── */
const allVideos = portfolioContent.videos;
const featuredIndices = portfolioContent.featuredVideoIndices || [0, 1, 2];
const featuredVideos = featuredIndices.map((i) => allVideos[i]).filter(Boolean);
const restVideos = allVideos.filter((_, i) => !featuredIndices.includes(i));

/* ── ALL PHOTOS (from content.ts) ── */
const allPhotos = portfolioContent.photos;

/* ── YOUTUBE VIDEOS & POSTERS ── */
const youtubeList = portfolioContent.youtubeVideos || [];
const postersList = portfolioContent.posters || [];

/* ── SKILLS ── */
const skills = [
  { icon: Mic, title: 'Public Speaking', desc: 'Captivating audiences with confidence and clarity.' },
  { icon: Video, title: 'Content Creation', desc: 'Crafting engaging content that resonates.' },
  { icon: Eye, title: 'On-Camera Presence', desc: 'Natural delivery that builds trust.' },
  { icon: MessageSquare, title: 'Brand Communication', desc: 'Turning brand messages into impact.' },
  { icon: PenTool, title: 'Scriptwriting', desc: 'Stories that hold attention till the end.' },
];

/* ── Scroll Reveal ── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('is-visible'); }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    el.querySelectorAll('.fade-up').forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ── Video Card ── */
function VideoCard({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWide, setIsWide] = useState(false);

  const handlePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { 
      v.play(); 
    } else { 
      v.pause(); 
    }
  };

  return (
    <div onClick={handlePlay} style={{
      position: 'relative', aspectRatio: '9/16', borderRadius: 16, overflow: 'hidden',
      background: '#111', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.06)',
      transition: 'transform 0.4s ease, box-shadow 0.4s ease',
    }}>
      {isWide && (
        <video
          src={src}
          autoPlay loop muted playsInline
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(16px)', transform: 'scale(1.25)', opacity: 0.4 }}
        />
      )}
      <video ref={videoRef} src={src} playsInline preload="metadata" controls={isPlaying}
        onLoadedMetadata={(e) => {
          if (e.currentTarget.videoWidth > e.currentTarget.videoHeight) {
            setIsWide(true);
          }
        }}
        onPlay={(e) => {
          setIsPlaying(true);
          // Pause/mute all other videos on the page
          document.querySelectorAll('video').forEach(v => {
            if (v !== e.currentTarget) {
              v.muted = true;
              if (!v.autoplay) v.pause();
            }
          });
        }}
        onPause={() => setIsPlaying(false)}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          objectFit: isWide ? 'contain' : 'cover',
          display: 'block',
          zIndex: 1,
        }}
      />
      {!isPlaying && (
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 2,
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(255,255,255,0.2)',
          }}>
            <Play size={24} fill="white" color="white" />
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Wheel Video Card (with 16:9 ambient backdrop detection) ── */
function WheelVideoCard({ vid, index, isActive }: { vid: string; index: number; isActive: boolean }) {
  const [isLandscape, setIsLandscape] = useState(false);
  const mainVideoRef = useRef<HTMLVideoElement>(null);

  const handleClick = () => {
    const video = mainVideoRef.current;
    if (video) {
      document.querySelectorAll('video').forEach(v => {
        if (v !== video) {
          v.muted = true;
          if (!v.autoplay) v.pause();
        }
      });
      video.muted = false;
      video.currentTime = 0;
      video.play();
    }
  };

  return (
    <div
      key={index}
      className={`relative group ${
        isLandscape
          ? 'w-[280px] h-[158px] sm:w-[400px] sm:h-[225px]'
          : 'w-[160px] h-[280px] sm:w-[240px] sm:h-[400px]'
      } rounded-2xl overflow-hidden cursor-pointer shadow-[0_0_30px_rgba(255,255,255,0.05)] border border-white/10 transition-all duration-500 will-change-transform bg-black`}
      onClick={handleClick}
    >
      <div className="absolute inset-0 overflow-hidden cursor-pointer flex items-center justify-center bg-black">
        {/* Ambient backdrop for landscape videos so it never letterboxes harshly */}
        {isLandscape && (
          <video
            src={vid}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover blur-xl opacity-30 scale-125 pointer-events-none"
          />
        )}
        <video
          ref={mainVideoRef}
          src={vid}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          onLoadedMetadata={(e) => {
            setIsLandscape(e.currentTarget.videoWidth > e.currentTarget.videoHeight);
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: isLandscape ? 'contain' : 'cover',
          }}
          className={`relative z-[1] transition-all duration-700 ease-out ${
            isActive ? 'scale-105 blur-0' : 'scale-100 blur-[1px] grayscale-[30%]'
          }`}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 transition-opacity duration-300 z-[2] pointer-events-none" />

        {isActive && (
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur rounded-full px-3 py-1.5 text-white/80 text-[10px] tracking-widest uppercase border border-white/10 z-[3]">
            Tap for Sound
          </div>
        )}
      </div>

      <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none z-[3]">
        <div className="flex justify-end">
          <div className={`w-6 h-6 rounded-full bg-white text-black flex items-center justify-center transition-all duration-500 ${isActive ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-45'}`}>
            <ArrowUpRight size={12} />
          </div>
        </div>
        <div className={`transition-transform duration-500 ${isActive ? 'translate-y-0' : 'translate-y-2'}`}>
          <div className={`h-0.5 bg-white mt-2 transition-all duration-500 ${isActive ? 'w-full opacity-100' : 'w-0 opacity-0'}`} />
        </div>
      </div>
    </div>
  );
}

/* ── Poster & Carousel Card ── */
function PosterCard({
  poster,
  onOpenModal,
}: {
  poster: { id: string; image: string; slides?: string[] };
  onOpenModal: (poster: { id: string; image: string; slides?: string[] }, slideIndex: number) => void;
}) {
  const slides = poster.slides && poster.slides.length > 0 ? poster.slides : [poster.image];
  const isCarousel = slides.length > 1;
  const [currentSlide, setCurrentSlide] = useState(0);

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      onClick={() => onOpenModal(poster, currentSlide)}
      className="group"
      style={{
        position: 'relative',
        aspectRatio: '4/5',
        borderRadius: 16,
        overflow: 'hidden',
        background: '#0a0a0a',
        border: '1px solid rgba(255,255,255,0.08)',
        cursor: 'pointer',
        transition: 'transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(59,130,246,0.6)';
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = '0 16px 36px rgba(0,0,0,0.6)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Ambient glow backdrop */}
      <img
        src={slides[currentSlide]}
        alt="Backdrop glow"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'blur(24px)',
          opacity: 0.25,
          transform: 'scale(1.2)',
          pointerEvents: 'none',
        }}
      />

      {/* Main Poster Image - 100% visible, zero cropping */}
      <img
        key={slides[currentSlide]}
        src={slides[currentSlide]}
        alt="Poster artwork"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
          zIndex: 1,
          transition: 'transform 0.5s ease',
        }}
        className="group-hover:scale-[1.02]"
      />

      {/* Carousel Badge in top-right corner */}
      {isCarousel && (
        <div
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 100,
            padding: '5px 12px',
            color: '#fff',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.05em',
          }}
        >
          <Copy size={12} className="text-blue-400" />
          <span>{currentSlide + 1}/{slides.length}</span>
        </div>
      )}

      {/* Carousel Navigation Buttons on Hover */}
      {isCarousel && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            style={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'opacity 0.25s, transform 0.25s',
            }}
            className="opacity-0 group-hover:opacity-100 hover:scale-110"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            onClick={nextSlide}
            aria-label="Next slide"
            style={{
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'opacity 0.25s, transform 0.25s',
            }}
            className="opacity-0 group-hover:opacity-100 hover:scale-110"
          >
            <ChevronRight size={18} />
          </button>

          {/* Dots Indicator at bottom */}
          <div
            style={{
              position: 'absolute',
              bottom: 12,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(6px)',
              padding: '4px 8px',
              borderRadius: 20,
            }}
          >
            {slides.map((_, i) => (
              <span
                key={i}
                style={{
                  width: i === currentSlide ? 14 : 5,
                  height: 5,
                  borderRadius: 10,
                  background: i === currentSlide ? '#3b82f6' : 'rgba(255,255,255,0.4)',
                  transition: 'all 0.3s ease',
                  display: 'inline-block',
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* Expand Icon for single posters on hover */}
      {!isCarousel && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0)',
            transition: 'background 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 5,
          }}
          className="group-hover:!bg-black/25"
        >
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 rounded-full bg-black/70 border border-white/20 text-white backdrop-blur-md shadow-lg">
            <Maximize2 size={20} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════
   MAIN PAGE
   ════════════════════════════ */
export default function PortfolioPage() {
  const aboutRef = useReveal();
  const workRef = useReveal();
  const moreRef = useReveal();
  const youtubeRef = useReveal();
  const postersRef = useReveal();
  const skillsRef = useReveal();
  const contactRef = useReveal();

  const [showMore, setShowMore] = useState(false);
  const [activePosterModal, setActivePosterModal] = useState<{
    poster: { id: string; image: string; slides?: string[] };
    slideIndex: number;
  } | null>(null);

  // Keyboard navigation for active modal
  useEffect(() => {
    if (!activePosterModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActivePosterModal(null);
      if (e.key === 'ArrowLeft') {
        const slides = activePosterModal.poster.slides || [activePosterModal.poster.image];
        setActivePosterModal((prev) => prev ? {
          ...prev,
          slideIndex: prev.slideIndex === 0 ? slides.length - 1 : prev.slideIndex - 1
        } : null);
      }
      if (e.key === 'ArrowRight') {
        const slides = activePosterModal.poster.slides || [activePosterModal.poster.image];
        setActivePosterModal((prev) => prev ? {
          ...prev,
          slideIndex: prev.slideIndex === slides.length - 1 ? 0 : prev.slideIndex + 1
        } : null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePosterModal]);

  return (
    <>
      <style jsx global>{`
        .fade-up {
          opacity: 0;
          transform: translateY(50px);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .fade-up.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .delay-1 { transition-delay: 0.1s; }
        .delay-2 { transition-delay: 0.2s; }
        .delay-3 { transition-delay: 0.3s; }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
      `}</style>

      <main style={{ background: '#050505', color: '#fff', minHeight: '100vh', overflowX: 'hidden' }}>

        {/* ═══════════ 1. HERO ═══════════ */}
        <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
          {/* Grid bg */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 0,
            backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, #000 30%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, #000 30%, transparent 100%)',
          }} />

          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '120px 24px 80px', width: '100%', position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 700, marginBottom: 24 }}>
              Creator · Speaker · Storyteller
            </p>

            {/* NAME — BLUE */}
            <h1 style={{
              fontSize: 'clamp(3.5rem, 10vw, 10rem)',
              fontWeight: 900,
              lineHeight: 0.85,
              letterSpacing: '-0.06em',
              textTransform: 'uppercase',
              margin: 0,
              color: '#3b82f6',
            }}>
              SACHIN<br />PRADHAN
            </h1>

            <p style={{
              fontSize: 'clamp(0.85rem, 2vw, 1.15rem)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
              fontWeight: 300,
              marginTop: 24,
            }}>
              Public Speaker &nbsp;|&nbsp; Content Creator &nbsp;|&nbsp; On-Camera Personality
            </p>

            {/* Photo + Tagline */}
            <div style={{ display: 'flex', gap: 48, marginTop: 60, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{ width: 280, height: 380, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <img src="/jpg/sachin-3.jpeg" alt="Sachin Pradhan" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ position: 'absolute', width: 280, height: 380, border: '1px solid rgba(255,255,255,0.04)', top: 8, left: 8, zIndex: -1 }} />
              </div>

              <div style={{ flex: 1, minWidth: 280 }}>
                <blockquote style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                  fontStyle: 'italic', fontWeight: 300, lineHeight: 1.3,
                  color: 'rgba(255,255,255,0.85)', margin: 0, maxWidth: 540,
                }}>
                  &ldquo;I turn ideas into stories that people actually <span style={{ fontWeight: 700, fontStyle: 'normal', color: '#fff' }}>feel.</span>&rdquo;
                </blockquote>
                <p style={{ color: 'rgba(255,255,255,0.35)', marginTop: 20, fontSize: 14, maxWidth: 480 }}>
                  Helping brands connect, engage, and grow through powerful storytelling.
                </p>
                <div style={{ display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap' }}>
                  <a href="#work" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8, padding: '18px 40px',
                    background: '#fff', color: '#000', fontWeight: 800, fontSize: 13,
                    textTransform: 'uppercase', letterSpacing: '0.2em', textDecoration: 'none',
                  }}>Watch My Videos</a>
                  <a href="#contact" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8, padding: '18px 40px',
                    background: 'transparent', color: '#fff', fontWeight: 800, fontSize: 13,
                    textTransform: 'uppercase', letterSpacing: '0.2em', textDecoration: 'none',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}>Hire Me</a>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 80, display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.2)' }}>
              <ChevronDown size={16} style={{ animation: 'bounce 2s infinite' }} />
              <span style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase' }}>Scroll to explore</span>
            </div>
          </div>
        </section>

        {/* divider */}
        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)' }} />

        {/* ═══════════ 2. ABOUT ═══════════ */}
        <div ref={aboutRef}>
          <section style={{ padding: '120px 24px', maxWidth: 1280, margin: '0 auto', textAlign: 'center' }}>
            <h2 className="fade-up" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.04em', lineHeight: 0.95 }}>
              Creator. Speaker.<br />Storyteller.
            </h2>
            <div className="fade-up delay-1" style={{ maxWidth: 720, margin: '48px auto 0', display: 'flex', flexDirection: 'column', gap: 20 }}>
              <p style={{ fontSize: 'clamp(1rem, 1.8vw, 1.2rem)', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
                I&apos;m <span style={{ color: '#fff', fontWeight: 600 }}>Sachin Pradhan</span>, a content creator and public speaker who turns ideas into engaging stories. I bring energy, authenticity, and a strong on-camera presence that helps brands connect with real audiences.
              </p>
              <p style={{ fontSize: 'clamp(1rem, 1.8vw, 1.2rem)', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
                Every piece of content I create is designed to engage, inspire, and drive action — whether it&apos;s a brand collaboration or a live stage experience.
              </p>
            </div>
            <div className="fade-up delay-2" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: 48 }}>
              {['Public Speaking', 'Content Creation', 'Audience Engagement', 'Brand Communication', 'Scriptwriting'].map((s) => (
                <span key={s} style={{
                  padding: '10px 24px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 100,
                  fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)',
                }}>{s}</span>
              ))}
            </div>
          </section>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)' }} />

        {/* ═══════════ 3. PHOTO GALLERY (3D Immersive) ═══════════ */}
        <section style={{ position: 'relative', height: '100vh' }}>
          <div style={{ position: 'absolute', top: 32, left: 0, right: 0, zIndex: 10, textAlign: 'center', pointerEvents: 'none', padding: '0 24px' }}>
            <h2 style={{
              display: 'inline-block', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 900,
              textTransform: 'uppercase', letterSpacing: '0.1em',
              background: 'rgba(5,5,5,0.8)', backdropFilter: 'blur(12px)', padding: '12px 32px',
              border: '1px solid rgba(255,255,255,0.05)',
            }}>Gallery</h2>
          </div>

          <div style={{ width: '100%', height: '100%', position: 'relative', zIndex: 5 }}>
            <InfiniteGallery
              images={allPhotos}
              speed={1.2}
              zSpacing={3}
              visibleCount={10}
              falloff={{ near: 0.8, far: 14 }}
              className="h-full w-full"
            />
          </div>

          <div style={{ position: 'absolute', bottom: 32, left: 0, right: 0, textAlign: 'center', zIndex: 10, pointerEvents: 'none' }}>
            <p style={{ fontSize: 10, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.25)' }}>
              Use mouse wheel or arrow keys to navigate
            </p>
          </div>
        </section>

        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)' }} />

        {/* ═══════════ 4. WORK — FEATURED VIDEOS (Radial Scroll) ═══════════ */}
        <div ref={workRef} id="work">
          <div style={{ textAlign: 'center', padding: '120px 24px 0' }}>
            <p className="fade-up" style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 700, marginBottom: 16 }}>Portfolio</p>
            <h2 className="fade-up delay-1" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.05em' }}>My Work</h2>
            <p className="fade-up delay-2" style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'rgba(255,255,255,0.4)', marginTop: 16, fontWeight: 300, letterSpacing: '0.05em' }}>
              Content that connects. Stories that perform.
            </p>
          </div>

          <RadialScrollGallery
            className="!min-h-[600px] md:!min-h-[800px]"
            baseRadius={400}
            mobileRadius={140}
            visiblePercentage={50}
            scrollDuration={2000}
          >
            {(hoveredIndex) =>
              featuredVideos.map((vid, index) => (
                <WheelVideoCard
                  key={index}
                  vid={vid}
                  index={index}
                  isActive={hoveredIndex === index}
                />
              ))
            }
          </RadialScrollGallery>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)' }} />

        {/* ═══════════ 5. VIEW MORE VIDEOS ═══════════ */}
        <div ref={moreRef}>
          <section style={{ padding: '120px 24px', maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ textAlign: 'center' }}>
              <h2 className="fade-up" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.04em' }}>
                More Content
              </h2>
              <p className="fade-up delay-1" style={{ color: 'rgba(255,255,255,0.4)', marginTop: 12, fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)' }}>
                Tap any video to play with sound.
              </p>
            </div>

            <div className="fade-up delay-2" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 20,
              marginTop: 60,
              maxHeight: showMore ? 'none' : 900,
              overflow: 'hidden',
              transition: 'max-height 0.6s ease',
            }}>
              {restVideos.map((vid, i) => (
                <VideoCard key={i} src={vid} />
              ))}
            </div>

            {!showMore && restVideos.length > 3 && (
              <div style={{ textAlign: 'center', marginTop: 40 }}>
                <button
                  onClick={() => setShowMore(true)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 40px',
                    background: 'transparent', color: '#fff', fontWeight: 700, fontSize: 13,
                    textTransform: 'uppercase', letterSpacing: '0.2em', cursor: 'pointer',
                    border: '1px solid rgba(255,255,255,0.15)', transition: 'all 0.3s',
                  }}
                >
                  View More
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </section>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)' }} />

        {/* ═══════════ 6. YOUTUBE VIDEO SECTION ═══════════ */}
        <div ref={youtubeRef} id="youtube">
          <section style={{ padding: '120px 24px', maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ textAlign: 'center' }}>
              <p className="fade-up" style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 700, marginBottom: 16 }}>
                YouTube · Long-Form Stories
              </p>
              <h2 className="fade-up delay-1" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.04em', lineHeight: 0.95 }}>
                Featured Video
              </h2>
              <p className="fade-up delay-2" style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'rgba(255,255,255,0.4)', marginTop: 16, maxWidth: 640, margin: '16px auto 0', fontWeight: 300 }}>
                Deep dives, stage keynotes, and full-length storytelling.
              </p>
            </div>

            {/* Featured YouTube Video Embed Card */}
            {youtubeList.map((yt, idx) => {
              const ytId = getYouTubeId(yt.url);
              return (
                <div key={yt.id || idx} className="fade-up delay-2" style={{
                  maxWidth: 960, margin: '60px auto 0',
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: 24,
                  overflow: 'hidden',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
                }}>
                  {/* 16:9 Player Container */}
                  <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, background: '#000' }}>
                    {yt.url.endsWith('.mp4') || yt.url.startsWith('/videos/') ? (
                      <video
                        src={yt.url}
                        controls
                        playsInline
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                        }}
                      />
                    ) : ytId ? (
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${ytId}?rel=0`}
                        title={yt.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          border: 'none',
                        }}
                      />
                    ) : (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)' }}>
                        Paste YouTube Video or MP4 Link in content.ts
                      </div>
                    )}
                  </div>

                  {/* Video Info Banner */}
                  <div style={{
                    padding: '32px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 20,
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <div style={{ maxWidth: 600 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <YoutubeIcon className="w-4 h-4 text-red-500" />
                        <span style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>
                          YouTube Premiere
                        </span>
                      </div>
                      <h3 style={{ fontSize: 'clamp(1.25rem, 2vw, 1.75rem)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em', color: '#fff', margin: 0 }}>
                        {yt.title}
                      </h3>
                      {yt.description && (
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 10, lineHeight: 1.6 }}>
                          {yt.description}
                        </p>
                      )}
                    </div>

                    <a
                      href={yt.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '16px 32px',
                        background: '#fff',
                        color: '#000',
                        fontWeight: 800,
                        fontSize: 12,
                        textTransform: 'uppercase',
                        letterSpacing: '0.2em',
                        textDecoration: 'none',
                        borderRadius: 4,
                        transition: 'opacity 0.3s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                    >
                      Watch on YouTube
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              );
            })}
          </section>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)' }} />

        {/* ═══════════ 7. TRENDY POSTERS SECTION ═══════════ */}
        <div ref={postersRef} id="posters">
          <section style={{ padding: '120px 24px', maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ textAlign: 'center' }}>
              <p className="fade-up" style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#3b82f6', fontWeight: 700, marginBottom: 16 }}>
                Visual Arts & Graphic Design
              </p>
              <h2 className="fade-up delay-1" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.04em', lineHeight: 0.95 }}>
                Trendy Posters
              </h2>
              <p className="fade-up delay-2" style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'rgba(255,255,255,0.4)', marginTop: 16, maxWidth: 640, margin: '16px auto 0', fontWeight: 300 }}>
                Bold typography, editorial posters, and brand visuals created to stop the scroll.
              </p>
            </div>

            {/* Posters Grid */}
            <div className="fade-up delay-2" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 24,
              marginTop: 64,
            }}>
              {postersList.map((poster, idx) => (
                <PosterCard
                  key={poster.id || idx}
                  poster={poster}
                  onOpenModal={(p, slideIdx) => setActivePosterModal({ poster: p, slideIndex: slideIdx })}
                />
              ))}
            </div>
          </section>
        </div>

        {/* Poster Lightbox Modal (Clean Artwork & Carousel Showcase) */}
        {activePosterModal && (() => {
          const modalSlides = activePosterModal.poster.slides && activePosterModal.poster.slides.length > 0
            ? activePosterModal.poster.slides
            : [activePosterModal.poster.image];
          const isModalCarousel = modalSlides.length > 1;
          const currentSlideImg = modalSlides[activePosterModal.slideIndex] || activePosterModal.poster.image;

          const modalPrev = (e: React.MouseEvent) => {
            e.stopPropagation();
            setActivePosterModal((prev) => prev ? {
              ...prev,
              slideIndex: prev.slideIndex === 0 ? modalSlides.length - 1 : prev.slideIndex - 1
            } : null);
          };

          const modalNext = (e: React.MouseEvent) => {
            e.stopPropagation();
            setActivePosterModal((prev) => prev ? {
              ...prev,
              slideIndex: prev.slideIndex === modalSlides.length - 1 ? 0 : prev.slideIndex + 1
            } : null);
          };

          return (
            <div
              onClick={() => setActivePosterModal(null)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                background: 'rgba(0,0,0,0.96)',
                backdropFilter: 'blur(24px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px 16px',
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setActivePosterModal(null)}
                aria-label="Close viewer"
                style={{
                  position: 'fixed',
                  top: 24,
                  right: 24,
                  zIndex: 100,
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '50%',
                  width: 44,
                  height: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                  e.currentTarget.style.transform = 'scale(1.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <X size={22} />
              </button>

              {/* Carousel Slide Counter Badge at Top */}
              {isModalCarousel && (
                <div
                  style={{
                    position: 'fixed',
                    top: 28,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 100,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 100,
                    padding: '8px 18px',
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                  }}
                >
                  <Copy size={14} className="text-blue-400" />
                  <span>Slide {activePosterModal.slideIndex + 1} of {modalSlides.length}</span>
                </div>
              )}

              {/* Previous Carousel Button */}
              {isModalCarousel && (
                <button
                  onClick={modalPrev}
                  aria-label="Previous image"
                  style={{
                    position: 'fixed',
                    left: 24,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 100,
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.22)';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                  }}
                >
                  <ChevronLeft size={28} />
                </button>
              )}

              {/* Next Carousel Button */}
              {isModalCarousel && (
                <button
                  onClick={modalNext}
                  aria-label="Next image"
                  style={{
                    position: 'fixed',
                    right: 24,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 100,
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.22)';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                  }}
                >
                  <ChevronRight size={28} />
                </button>
              )}

              {/* Modal Image Wrapper - Full uncropped view */}
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: 'relative',
                  maxHeight: '90vh',
                  maxWidth: '92vw',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 16,
                  overflow: 'hidden',
                  boxShadow: '0 30px 90px rgba(0,0,0,0.95)',
                }}
              >
                <img
                  key={currentSlideImg}
                  src={currentSlideImg}
                  alt="Full poster artwork"
                  style={{
                    maxHeight: '88vh',
                    maxWidth: '88vw',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                    display: 'block',
                    borderRadius: 12,
                  }}
                />
              </div>

              {/* Dots at bottom of Modal */}
              {isModalCarousel && (
                <div
                  style={{
                    position: 'fixed',
                    bottom: 24,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 100,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background: 'rgba(0,0,0,0.65)',
                    backdropFilter: 'blur(12px)',
                    padding: '8px 16px',
                    borderRadius: 30,
                    border: '1px solid rgba(255,255,255,0.15)',
                  }}
                >
                  {modalSlides.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePosterModal({ ...activePosterModal, slideIndex: i });
                      }}
                      style={{
                        width: i === activePosterModal.slideIndex ? 22 : 8,
                        height: 8,
                        borderRadius: 10,
                        background: i === activePosterModal.slideIndex ? '#3b82f6' : 'rgba(255,255,255,0.4)',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        transition: 'all 0.3s ease',
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)' }} />

        {/* ═══════════ 8. SKILLS ═══════════ */}
        <div ref={skillsRef}>
          <section style={{ padding: '120px 24px', maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ textAlign: 'center' }}>
              <h2 className="fade-up" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.04em' }}>
                Skills That Drive Results
              </h2>
              <div className="fade-up delay-1" style={{ width: 60, height: 1, background: 'rgba(255,255,255,0.15)', margin: '32px auto 0' }} />
            </div>

            <div className="fade-up delay-2" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 16,
              marginTop: 60,
            }}>
              {skills.map((skill, i) => {
                const Icon = skill.icon;
                return (
                  <div key={i} style={{
                    padding: '40px 32px', border: '1px solid rgba(255,255,255,0.06)',
                    background: 'rgba(255,255,255,0.02)', transition: 'all 0.4s',
                  }}>
                    <Icon size={22} style={{ color: 'rgba(255,255,255,0.3)' }} />
                    <h3 style={{
                      fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase',
                      letterSpacing: '0.1em', marginTop: 20, marginBottom: 12, color: 'rgba(255,255,255,0.7)',
                    }}>{skill.title}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>{skill.desc}</p>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)' }} />

        {/* ═══════════ 9. CONTACT ═══════════ */}
        <div ref={contactRef} id="contact">
          <section style={{ padding: '120px 24px', maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ textAlign: 'center' }}>
              <h2 className="fade-up" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.04em', lineHeight: 0.95 }}>
                Let&apos;s Create Something<br />Amazing
              </h2>
              <p className="fade-up delay-1" style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'rgba(255,255,255,0.4)', marginTop: 16, fontWeight: 300 }}>
                Ready to collaborate? Let&apos;s build something impactful together.
              </p>
            </div>

            <div className="fade-up delay-2" style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 16, marginTop: 48,
            }}>
              {[
                { href: portfolioContent.contact.phoneLink, icon: <Phone size={18} />, type: 'Phone', value: portfolioContent.contact.phone },
                { href: portfolioContent.contact.emailLink, icon: <Mail size={18} />, type: 'Email', value: portfolioContent.contact.email },
                { href: portfolioContent.contact.instagramLink, icon: <InstagramIcon className="w-[18px] h-[18px]" />, type: 'Instagram', value: portfolioContent.contact.instagram, ext: true },
                { href: portfolioContent.contact.linkedinLink, icon: <LinkedinIcon className="w-[18px] h-[18px]" />, type: 'LinkedIn', value: portfolioContent.contact.linkedin, ext: true },
              ].map((c, i) => (
                <a key={i} href={c.href} target={c.ext ? '_blank' : undefined} rel={c.ext ? 'noreferrer' : undefined}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 16, padding: 24,
                    border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none',
                    color: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.02)',
                    transition: 'all 0.3s',
                  }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>{c.icon}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)' }}>{c.type}</span>
                    <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{c.value}</span>
                  </div>
                  <ArrowUpRight size={14} style={{ marginLeft: 'auto', opacity: 0.3 }} />
                </a>
              ))}
            </div>

            <div className="fade-up delay-3" style={{ textAlign: 'center', marginTop: 48 }}>
              <a href={portfolioContent.contact.emailLink} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, padding: '18px 48px',
                background: '#fff', color: '#000', fontWeight: 800, fontSize: 13,
                textTransform: 'uppercase', letterSpacing: '0.2em', textDecoration: 'none',
              }}>Contact Me</a>
              <p style={{ marginTop: 20, fontSize: 11, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
                Response time: Usually within 24 hours
              </p>
            </div>
          </section>
        </div>

        {/* ═══════════ 10. FOOTER ═══════════ */}
        <footer style={{ padding: '64px 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.04em', textTransform: 'uppercase', color: '#3b82f6' }}>
            SACHIN PRADHAN
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', marginTop: 8 }}>
            Creator · Speaker · Storyteller
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 32 }}>
            <a href={portfolioContent.contact.instagramLink} target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.25)' }}>
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a href={portfolioContent.contact.linkedinLink} target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.25)' }}>
              <LinkedinIcon className="w-4 h-4" />
            </a>
            <a href={portfolioContent.contact.emailLink} style={{ color: 'rgba(255,255,255,0.25)' }}>
              <Mail size={16} />
            </a>
          </div>
          <p style={{ marginTop: 40, color: 'rgba(255,255,255,0.1)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            © {new Date().getFullYear()} Sachin Pradhan. All rights reserved.
          </p>
        </footer>
      </main>
    </>
  );
}
