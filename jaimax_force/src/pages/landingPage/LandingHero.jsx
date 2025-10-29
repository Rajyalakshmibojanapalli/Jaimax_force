import { useEffect, useState } from "react";
import gsap from "gsap";
import preloadImageDesktop from "../../assets/images/image9.jpg";
import preloadImageMobile from "../../assets/images/preload-bg-mobile.jpeg";
import bg from "../../assets/images/grids.webp";

export default function LandingHero({ onAnimationComplete }) {
  useEffect(() => {
    const logo = document.querySelector(".logo-text");
    if (logo) {
      const letters = logo.textContent.split("");
      logo.innerHTML = letters
        .map((char) => `<span class="char inline-block">${char}</span>`)
        .join("");
    }

    gsap.set(".pill-fill", { transformOrigin: "left center", scaleX: 0 });
    gsap.set(".hero-bg", { opacity: 0, scale: 1.05 });
    gsap.set([".hero-title", ".hero-subtext", ".hero-buttons"], {
      opacity: 0,
      y: 40,
    });

    const animateTextWave = () =>
      gsap
        .timeline()
        .fromTo(
          ".logo-text .char",
          {
            yPercent: (i) => (i % 2 === 0 ? -120 : 120),
            opacity: 0,
          },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.inOut",
            stagger: {
              each: 0.04,
              from: "random",
            },
          }
        )
        .to(".logo-text .char", {
          yPercent: (i) => (i % 2 === 0 ? -20 : 20),
          duration: 0.25,
          ease: "sine.inOut",
          stagger: 0.03,
        })
        .to(".logo-text .char", {
          yPercent: 0,
          duration: 0.25,
          ease: "sine.out",
          stagger: 0.02,
        });

    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      onComplete: () => {
        if (onAnimationComplete) onAnimationComplete();
      },
    });

    tl.set(".preloader", { opacity: 0 })
      .to(".preloader", { opacity: 1, duration: 0.6 })
      .add(animateTextWave())
      .to(".pill-fill", { scaleX: 0.5, duration: 1.2 })
      .to(".pill-fill", { scaleX: 1, duration: 1.2 }, "+=0.25")
      .add(animateTextWave(), "+=0.2")
      .to(
        ".pill",
        { boxShadow: "0 0 40px rgba(255,215,0,0.35)", duration: 0.4 },
        "-=0.6"
      )
      .to(".pill", { scale: 2.5, duration: 1, ease: "power3.out" })
      .to(".pill-fill", { opacity: 0.01, duration: 0.6 }, "<")
      .to(
        ".preloader",
        { opacity: 0, duration: 0.8, pointerEvents: "none" },
        "<"
      )
      .set(".preloader", { display: "none" })
      .to(
        ".hero-bg",
        { opacity: 1, scale: 1, duration: 2, ease: "power3.out" },
        "-=0.3"
      )
      .to(
        ".hero-title",
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" },
        "-=1.2"
      )
      .to(".hero-subtext", { opacity: 1, y: 0, duration: 2.5 }, "-=0.6")
      .to(".hero-buttons", { opacity: 1, y: 0, duration: 0.8 }, "-=0.55");

    return () => tl.kill();
  }, [onAnimationComplete]);

  const [bgImage, setBgImage] = useState(preloadImageDesktop);

   useEffect(() => {
      const updateBg = () => {
        if (window.innerWidth < 768) {
          setBgImage(preloadImageMobile);
        } else {
          setBgImage(preloadImageDesktop);
        }
      };
  
      updateBg(); 
      window.addEventListener("resize", updateBg);
      return () => window.removeEventListener("resize", updateBg);
    }, []);

  return (
    <div
      className="relative w-full h-screen overflow-hidden text-white"
      style={{ 
      backgroundImage: `linear-gradient(180deg, #000000e6, #000c 70%, #050505), url(${bg})`,
    backgroundSize: "cover",
    }}
    >
      {/* === PRELOADER === */}
      <div
  className="preloader fixed inset-0 z-50 flex items-center justify-center bg-cover bg-center"
  style={{
   backgroundImage: `linear-gradient(180deg, #000000e6, #000c 70%, #050505), url(${bg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
        <div
          className="pill relative overflow-hidden rounded-full border border-white/5 bg-[#1b1816] flex items-center justify-center"
          style={{
            width: "min(75vw, 500px)",
            height: "min(28vw, 160px)",
            boxShadow: "0 10px 50px rgba(0,0,0,0.35)",
          }}
        >
          <div className="pill-fill absolute inset-0 bg-[#FFD700] will-change-transform" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="logo-text select-none text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-wider">
              JAIMAX
            </span>
          </div>
        </div>
      </div>

      {/* === HERO BACKGROUND === */}
      <div
        className="hero-bg absolute inset-0 bg-cover bg-center sm:bg-center md:bg-top lg:bg-center xl:bg-center will-change-transform"
        style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/80 pointer-events-none" />

      {/* === HERO TEXT === */}
      <div className="relative z-10 h-full flex flex-col justify-center px-4 sm:px-6 md:px-10 lg:px-10 xl:px-12">
        <div className="max-w-[95%] sm:max-w-2xl md:max-w-3xl lg:max-w-5xl text-center md:text-left lg:text-left">
          <h1 className="hero-title text-5xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight mb-4 sm:mb-6">
            <span className="block text-white">Build Your</span>
            <span className="block text-[#FFD700]">Digital Future</span>
          </h1>

          <p className="hero-subtext text-gray-300 text-sm sm:text-base md:text-lg lg:text-xl mb-8 sm:mb-10 max-w-xl md:max-w-2xl leading-relaxed mx-auto md:mx-0">
            Jaimax delivers enterprise-grade technology solutions with
            precision, reliability, and performance. Transform your business
            with tools designed for scale.
          </p>

          {/* <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className="px-6 sm:px-8 py-3 bg-[#FFD700] text-black font-semibold rounded-md hover:bg-white transition-all duration-300 text-sm sm:text-base">
              Get Started →
            </button>
            <button className="px-6 sm:px-8 py-3 border border-[#FFD700]/50 text-white rounded-md hover:bg-[#FFD700]/10 transition-all duration-300 text-sm sm:text-base">
              Schedule Demo
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
