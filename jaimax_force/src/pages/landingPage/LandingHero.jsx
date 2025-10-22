import { useEffect } from "react";
import gsap from "gsap";
import bgImage from "../../assets/images/image1.jpg";

export default function LandingHero() {
  useEffect(() => {
  // Split text into spans for letter animation
  const logo = document.querySelector(".logo-text");
  if (logo) {
    const letters = logo.textContent.split("");
    logo.innerHTML = letters
      .map(
        (char) =>
          `<span class="char inline-block">${char}</span>`
      )
      .join("");
  }

  gsap.set(".pill-fill", { transformOrigin: "left center", scaleX: 0 });
  gsap.set(".hero-bg", { opacity: 0, scale: 1.05 });
  gsap.set([".hero-title", ".hero-subtext", ".hero-buttons"], {
    opacity: 0,
    y: 40,
  });

  const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

  tl.set(".preloader", { opacity: 0 })
    .to(".preloader", { opacity: 1, duration: 0.6 }) // slight appear delay

    // === Letter juggling: up/down bounce 2–3 times before settling ===
    .fromTo(
      ".logo-text .char",
      {
        y: (i) => (i % 2 === 0 ? -40 : 40),
        opacity: 0,
      },
      {
        y: (i) => (i % 2 === 0 ? 20 : -20),
        opacity: 1,
        duration: 1.2,
        stagger: 0.05,
        ease: "power3.inOut",
      }
    )
    .to(".logo-text .char", {
      y: (i) => (i % 2 === 0 ? -10 : 10),
      duration: 0.25,
      ease: "sine.inOut",
    })
    .to(".logo-text .char", {
      y: 0,
      duration: 0.25,
      ease: "sine.out",
    })

    // === Pill fill with mid-pause ===
    .to(".pill-fill", { scaleX: 0.5, duration: 1, ease: "power1.inOut" })
    .to(".pill-fill", { scaleX: 1, duration: 1, ease: "power1.inOut" }, "+=0.2")

    // === Glow + pulse ===
    .to(
      ".pill",
      { boxShadow: "0 0 40px rgba(255,215,0,0.35)", duration: 0.4 },
      "-=0.8"
    )

    // === Scale + fade pill, gold softens ===
    .to(".pill", { scale: 2.5, duration: 0.9, ease: "power3.out" })
    .to(".pill-fill", { opacity: 0.1, duration: 0.6, ease: "power1.inOut" }, "<")
    .to(".preloader", { opacity: 0, duration: 0.8, pointerEvents: "none" }, "<")
    .set(".preloader", { display: "none" })

    // === Hero transition ===
    .to(".hero-bg", { opacity: 1, scale: 1, duration: 2, ease: "power3.out" }, "-=0.3")
    .to(".hero-title", { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, "-=1.2")
    .to(".hero-subtext", { opacity: 1, y: 0, duration: 0.8 }, "-=0.6")
    .to(".hero-buttons", { opacity: 1, y: 0, duration: 0.8 }, "-=0.55");

  return () => tl.kill();
}, [])

  return (
    <div className="relative w-full h-screen overflow-hidden text-white bg-[#151513]">
      {/* === PRELOADER (centered pill) === */}
      <div className="preloader fixed inset-0 z-50 flex items-center justify-center bg-[#151513]">
        <div
          className="pill relative overflow-hidden rounded-[56px] border border-white/5 bg-[#1b1816]"
          style={{
            width: "min(72vw, 680px)",
            height: "min(24vw, 250px)",
            boxShadow: "0 10px 50px rgba(0,0,0,0.35)",
          }}
        >
          <div className="pill-fill absolute inset-0 bg-[#FFD700] will-change-transform" />

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="logo-text select-none text-white text-3xl sm:text-4xl md:text-5xl font-semibold tracking-wider">
              JAIMAX
            </span>
          </div>
        </div>
      </div>

      {/* === HERO BG === */}
      <div
        className="hero-bg absolute inset-0 bg-cover bg-center will-change-transform"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/20 to-black/70 pointer-events-none" />

      {/* === HERO COPY === */}
      <div className="relative z-10 h-full max-w-6xl mx-auto flex items-center px-6 md:px-10">
        <div className="max-w-3xl">
          <h1 className="hero-title text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6">
            <span className="block text-white">Build Your</span>
            <span className="block text-[#FFD700]">Digital Future</span>
          </h1>

          <p className="hero-subtext text-gray-300 text-base sm:text-lg mb-10 max-w-xl leading-relaxed">
            Jaimax delivers enterprise-grade technology solutions with precision,
            reliability, and performance. Transform your business with tools designed
            for scale.
          </p>

          <div className="hero-buttons flex flex-wrap gap-4">
            <button className="px-8 py-3 bg-[#FFD700] text-black font-semibold rounded-md hover:bg-white transition-all duration-300">
              Get Started →
            </button>
            <button className="px-8 py-3 border border-[#FFD700]/50 text-white rounded-md hover:bg-[#FFD700]/10 transition-all duration-300">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
