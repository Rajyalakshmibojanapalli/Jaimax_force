import { useEffect, useRef } from "react";
import anime from "animejs/lib/anime.es.js";

export default function AnimatedJEntrance() {
  const svgRef = useRef(null);
  const pathRef = useRef(null);

  useEffect(() => {
    const path = pathRef.current;
    const svg = svgRef.current;
    if (!path || !svg) return;

    const pathLength = path.getTotalLength();
    path.style.strokeDasharray = pathLength;
    path.style.strokeDashoffset = pathLength;

    // Timeline for cinematic animation
    const tl = anime.timeline({
      easing: "easeInOutSine",
      autoplay: true,
    });

    // 1️⃣ Zoom-in and fade
    tl.add({
      targets: svg,
      scale: [0.6, 1],
      opacity: [0, 1],
      duration: 1000,
    })
      // 2️⃣ Draw the stroke
      .add({
        targets: path,
        strokeDashoffset: [pathLength, 0],
        duration: 1200,
      })
      // 3️⃣ Slide to right side
      .add({
        targets: svg,
        translateX: "40vw",
        duration: 800,
      })
      // 4️⃣ Reveal the hero text
      .add({
        targets: ".hero-text",
        opacity: [0, 1],
        translateX: [-60, 0],
        duration: 900,
        offset: "-=400", // slight overlap
      });
  }, []);

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-black overflow-hidden">
      {/* SVG Logo */}
      <svg
        ref={svgRef}
        viewBox="0 0 200 200"
        className="absolute left-1/2 transform -translate-x-1/2 w-[280px] h-[280px] sm:w-[340px] sm:h-[340px]"
        fill="none"
      >
        <defs>
          <linearGradient id="goldStroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#FFF8DC" />
          </linearGradient>
        </defs>

        <path
          ref={pathRef}
          d="
            M140 40
            Q140 120 100 150
            Q70 170 60 170
            Q50 170 45 160
            M60 170
            Q100 180 130 160
            Q160 140 160 40
          "
          stroke="url(#goldStroke)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      {/* Hero Text Section */}
      <div className="hero-text absolute left-[10vw] text-left opacity-0">
        <div className="flex flex-col gap-4">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-tight">
            <span className="block">Build Your</span>
            <span className="text-[#FFD700]">Digital Future</span>
          </h1>
          <p className="text-gray-400 max-w-lg text-base sm:text-lg leading-relaxed">
            Jaimax delivers enterprise-grade technology solutions with
            precision, reliability, and performance. Transform your business
            with tools designed for scale.
          </p>
          <div className="flex flex-wrap gap-4 mt-6">
            <button className="px-8 py-3 bg-[#FFD700] text-black font-semibold rounded-md hover:bg-white transition-all duration-300">
              Get Started →
            </button>
            <button className="px-8 py-3 border border-[#FFD700]/40 text-white rounded-md hover:bg-[#FFD700]/10 transition-all duration-300">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
