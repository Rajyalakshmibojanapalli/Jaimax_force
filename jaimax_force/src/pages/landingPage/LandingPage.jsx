// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { ArrowRight } from "lucide-react";
// import FuturisticLanding from "./FuturisticLanding";
// import { StatsSection } from "./StatsSection";
// import { TeamSection } from "./TeamSection";
// import AnimatedJ from "./Animated";

// export default function LandingPage() {
//   const [isVisible, setIsVisible] = useState(false);
//   const [scrollY, setScrollY] = useState(0);
//   const navigate = useNavigate();

//   useEffect(() => {
//     setIsVisible(true);
//     const handleScroll = () => setScrollY(window.scrollY);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans">
//       <style>
//         {`
//           @keyframes fadeInUp {
//             0% { opacity: 0; transform: translateY(30px); }
//             100% { opacity: 1; transform: translateY(0); }
//           }
//           @keyframes slideIn {
//             0% { opacity: 0; transform: translateX(-30px); }
//             100% { opacity: 1; transform: translateX(0); }
//           }
//           @keyframes drawLine {
//             0% { width: 0; }
//             100% { width: 100%; }
//           }
//           .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
//           .animate-slideIn { animation: slideIn 0.8s ease-out forwards; }

//           .gradient-text {
//             background: linear-gradient(135deg, #FFD700 0%, #FFFFFF 100%);
//             -webkit-background-clip: text;
//             background-clip: text;
//             -webkit-text-fill-color: transparent;
//           }

//           .grid-pattern {
//             background-image: linear-gradient(#FFD700 1px, transparent 1px),
//                               linear-gradient(90deg, #FFD700 1px, transparent 1px);
//             background-size: 50px 50px;
//             opacity: 0.05;
//           }

//           .line-accent::after {
//             content: '';
//             position: absolute;
//             bottom: 0;
//             left: 0;
//             height: 2px;
//             background: linear-gradient(90deg, #FFD700, transparent);
//             animation: drawLine 1s ease-out forwards;
//           }
//         `}
//       </style>

//       {/* Minimal Background */}
//       <div className="absolute inset-0 bg-black">
//         <div className="grid-pattern absolute inset-0"></div>
//         <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-[#FFD700]/5 to-transparent"></div>
//         <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-[#FFD700]/5 to-transparent"></div>
//       </div>

//       {/* Navigation */}
//       <nav
//         className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
//           scrollY > 50 ? "bg-black/80 backdrop-blur-lg" : ""
//         }`}
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
//           <div className="flex justify-between items-center py-4 sm:py-6 border-b border-[#FFD700]/10">
//             <div className="text-2xl sm:text-3xl font-bold tracking-tight">
//               <span className="text-white">JAI</span>
//               <span className="text-[#FFD700]">MAX</span>
//             </div>

//             {/* Desktop Menu */}
//             <div className="hidden md:flex gap-8 lg:gap-12 items-center">
//               {["FEATURES", "SOLUTIONS", "ABOUT"].map((item) => (
//                 <a
//                   key={item}
//                   href="#"
//                   className="text-sm text-gray-400 hover:text-white transition-colors duration-300 tracking-wide"
//                 >
//                   {item}
//                 </a>
//               ))}
//               <button
//                 className="px-5 py-2.5 bg-[#FFD700] text-black text-sm font-semibold tracking-wide hover:bg-white transition-colors duration-300"
//                 onClick={() => navigate("/login")}
//               >
//                 GET STARTED
//               </button>
//             </div>

//             {/* Mobile Menu Button */}
//             <button
//               onClick={() => navigate("/login")}
//               className="md:hidden px-4 py-2 bg-[#FFD700] text-black rounded font-medium text-sm"
//             >
//               Get Started
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 pt-28 sm:pt-32 pb-20">
//         <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 items-center min-h-[70vh] sm:min-h-[80vh]">
//           <div>
//             <div
//               className={`inline-flex items-center gap-2 mb-6 sm:mb-8 ${
//                 isVisible ? "animate-fadeInUp" : "opacity-0"
//               }`}
//               style={{ animationDelay: "0.1s" }}
//             >
//               <div className="w-8 h-px bg-[#FFD700]"></div>
//               <span className="text-xs sm:text-sm text-[#FFD700] font-semibold tracking-[0.2em] uppercase">
//                 Enterprise Solutions
//               </span>
//             </div>

//             <h1
//               className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 leading-[1.1] ${
//                 isVisible ? "animate-fadeInUp" : "opacity-0"
//               }`}
//               style={{ animationDelay: "0.2s" }}
//             >
//               <div className="text-white mb-1 sm:mb-2">Build Your</div>
//               <div className="gradient-text">Digital Future</div>
//             </h1>

//             <div
//               className={`w-20 sm:w-24 h-1 bg-[#FFD700] mb-6 sm:mb-8 ${
//                 isVisible ? "animate-slideIn" : "opacity-0"
//               }`}
//               style={{ animationDelay: "0.3s" }}
//             ></div>

//             <p
//               className={`text-base sm:text-lg text-gray-400 mb-8 sm:mb-10 max-w-xl leading-relaxed ${
//                 isVisible ? "animate-fadeInUp" : "opacity-0"
//               }`}
//               style={{ animationDelay: "0.4s" }}
//             >
//               Jaimax delivers enterprise-grade technology solutions with precision, reliability, and performance. Transform your business with tools designed for scale.
//             </p>

//             <div
//               className={`flex flex-col sm:flex-row gap-4 mb-10 sm:mb-12 ${
//                 isVisible ? "animate-fadeInUp" : "opacity-0"
//               }`}
//               style={{ animationDelay: "0.5s" }}
//             >
//               <button
//                 className="px-7 py-3 sm:px-8 sm:py-4 bg-[#FFD700] text-black font-semibold hover:bg-white transition-all duration-300 flex items-center justify-center gap-2"
//                 onClick={() => navigate("/login")}
//               >
//                 Get Started
//                 <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
//               </button>

//               <button className="px-7 py-3 sm:px-8 sm:py-4 border border-white/20 text-white hover:border-white hover:bg-white/5 transition-all duration-300">
//                 Schedule Demo
//               </button>
//             </div>

//             <div
//               className={`flex flex-wrap items-center gap-6 sm:gap-8 pt-6 sm:pt-8 border-t border-white/10 ${
//                 isVisible ? "animate-fadeInUp" : "opacity-0"
//               }`}
//               style={{ animationDelay: "0.6s" }}
//             >
//               <div>
//                 <div className="text-xl sm:text-2xl font-bold text-white">10,000+</div>
//                 <div className="text-xs text-gray-500 uppercase tracking-wider">
//                   Active Users
//                 </div>
//               </div>
//               <div className="hidden sm:block w-px h-10 bg-white/10"></div>
//               <div>
//                 <div className="text-xl sm:text-2xl font-bold text-white">99.9%</div>
//                 <div className="text-xs text-gray-500 uppercase tracking-wider">
//                   Uptime SLA
//                 </div>
//               </div>
//               <div className="hidden sm:block w-px h-10 bg-white/10"></div>
//               <div>
//                 <div className="text-xl sm:text-2xl font-bold text-white">150+</div>
//                 <div className="text-xs text-gray-500 uppercase tracking-wider">
//                   Countries
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div
//             className={`relative flex justify-center items-center ${
//               isVisible ? "animate-fadeInUp" : "opacity-0"
//             }`}
//             style={{ animationDelay: "0.3s" }}
//           >
//             <div className="relative aspect-square w-64 sm:w-80 md:w-96">
//               <div className="absolute inset-0 border border-[#FFD700]/20"></div>
//               <div className="absolute inset-6 border border-white/10"></div>
//               <div className="absolute top-0 right-0 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 border-t-2 border-r-2 border-[#FFD700]"></div>
//               <div className="absolute bottom-0 left-0 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 border-b-2 border-l-2 border-[#FFD700]"></div>

//               <div className="absolute inset-0 flex items-center justify-center">
//                 <div className="text-center">
//                   <div className="text-7xl sm:text-8xl md:text-9xl font-black text-[#fae570] mb-4">
//                     J
//                   </div>
//                   <div className="w-24 sm:w-32 h-px bg-gradient-to-r from-transparent via-[#FFD700] to-transparent"></div>
//                 </div>
//               </div>

//               <div className="absolute top-1/4 -left-6 sm:-left-8 w-12 sm:w-16 h-12 sm:h-16 border border-[#FFD700]/30"></div>
//               <div className="absolute bottom-1/4 -right-6 sm:-right-8 w-14 sm:w-20 h-14 sm:h-20 border border-white/20"></div>
//             </div>
//           </div>
//         </div>

//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#FFD700]/10 mt-16 sm:mt-20 border border-[#FFD700]/10">
//           {[
//             {
//               title: "Performance",
//               desc: "Optimized infrastructure delivering sub-second response times globally",
//               metric: "< 50ms",
//             },
//             {
//               title: "Security",
//               desc: "Enterprise-grade encryption with SOC 2 Type II compliance",
//               metric: "256-bit",
//             },
//             {
//               title: "Scalability",
//               desc: "Seamlessly handle millions of requests without degradation",
//               metric: "∞ Scale",
//             },
//           ].map((feature, i) => (
//             <div
//               key={i}
//               className={`bg-black p-6 sm:p-8 group hover:bg-[#FFD700]/5 transition-all duration-300 ${
//                 isVisible ? "animate-fadeInUp" : "opacity-0"
//               }`}
//               style={{ animationDelay: `${0.7 + i * 0.1}s` }}
//             >
//               <div className="text-3xl sm:text-4xl font-bold text-[#FFD700] mb-3 sm:mb-4">
//                 {feature.metric}
//               </div>
//               <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-white">
//                 {feature.title}
//               </h3>
//               <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
//               <div className="w-10 sm:w-12 h-px bg-[#FFD700] mt-4 sm:mt-6 group-hover:w-full transition-all duration-500"></div>
//             </div>
//           ))}
//         </div>

// <FuturisticLanding />
// <StatsSection />
// <TeamSection />

//       </div>

//       {/* Footer Accent */}
//       <div className="absolute bottom-0 left-0 right-0">
//         <div className="h-px bg-gradient-to-r from-transparent via-[#FFD700]/50 to-transparent"></div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import LandingHero from "./LandingHero";
import { StatsSection } from "./StatsSection";
import { TeamSection } from "./TeamSection";
import heroImage from "../../assets/images/28385.jpg";
import { Mail, Phone, MapPin, Linkedin, Twitter, Instagram } from "lucide-react";

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans">
      {/* === Step 1: Preloader === */}
      {!showContent && (
        <LandingHero onAnimationComplete={() => setShowContent(true)} />
      )}

      {/* === Step 2: Real Page === */}
      {showContent && (
        <>
          {/* === NAVBAR === */}
          <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-in ${
              scrollY > 50 ? "bg-black/80 backdrop-blur-lg" : "bg-transparent"
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
              <div className="flex justify-between items-center py-5 border-b border-[#FFD700]/10">
                {/* Logo */}
                <div className="text-2xl sm:text-3xl font-bold tracking-tight">
                  <span className="text-white">JAI</span>
                  <span className="text-[#FFD700]">MAX</span>
                </div>

                {/* Desktop Links */}
                <div className="hidden md:flex gap-10 items-center">
                  {["FEATURES", "SOLUTIONS", "ABOUT"].map((item) => (
                    <a
                      key={item}
                      href="#"
                      className="text-sm text-gray-400 hover:text-white transition-colors duration-300 tracking-wide"
                    >
                      {item}
                    </a>
                  ))}
                  <button
                    className="px-5 py-2.5 bg-[#FFD700] text-black text-sm font-semibold tracking-wide hover:bg-[#e1c839] rounded-full transition-colors duration-300"
                    onClick={() => navigate("/login")}
                  >
                    GET STARTED
                  </button>
                </div>

                {/* Mobile Hamburger */}
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="md:hidden text-white"
                >
                  {menuOpen ? <X size={26} /> : <Menu size={26} />}
                </button>
              </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {menuOpen && (
              <div className="
      fixed z-40 bg-black/100 backdrop-blur-lg md:hidden
      top-0 right-0 w-[70%] sm:w-[60%] lg:w-[40%]
      rounded-l-xl shadow-2xl p-6 sm:p-8
      transition-all duration-300 ease-in-out
      [@media(max-width:360px)]:p-4
      [@media(max-width:360px)]:w-[85%]
    ">
                <div className="flex justify-end pt-1 ">
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="text-white"
                  >
                    <X size={30} />
                  </button>
                </div>

                <div className="flex flex-col items-center justify-center mt-6 space-y-8 mb-5 ">
                  {["FEATURES", "SOLUTIONS", "ABOUT"].map((item) => (
                    <a
                      key={item}
                      href="#"
                      className="text-gray-300 hover:text-[#FFD700] text-base tracking-wide"
                      onClick={() => setMenuOpen(false)}
                    >
                      {item}
                    </a>
                  ))}
                  <button
                    className="px-6 py-3 bg-[#FFD700] text-black text-base font-semibold rounded-full hover:bg-[#e1c839] transition-all"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/login");
                    }}
                  >
                    Get Started
                  </button>
                </div>
              </div>
            )}
          </nav>

          {/* === HERO SECTION === */}
          <section className="relative h-screen flex items-center justify-center text-center pt-24 sm:pt-28 md:pt-0">
            {/* Background image */}
            <div
              className="absolute inset-0 bg-cover bg-center md:bg-top lg:bg-center"
              style={{
                backgroundImage: `url(${heroImage})`,
                minHeight: "100vh",
              }}
            ></div>
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/10 sm:bg-black/10"></div>

            {/* Text content */}
            <div className="relative z-10 px-4 sm:px-6 md:px-10 max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight mb-5 sm:mb-6">
                <div className="text-white mb-1 sm:mb-2">Build Your</div>
                <div className="text-[#FFD700]">Digital Future</div>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto">
                Jaimax delivers enterprise-grade technology solutions with
                precision, reliability, and performance. Transform your business
                with tools designed for scale.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  className="px-6 py-3 sm:px-8 sm:py-4 bg-[#FFD700] text-black font-semibold hover:bg-[#e1c839] rounded-full transition-all duration-300 text-sm sm:text-base"
                  onClick={() => navigate("/login")}
                >
                  Get Started →
                </button>
                {/* <button className="px-6 py-3 sm:px-8 sm:py-4 border border-white/20 text-white rounded-md hover:border-white hover:bg-white/5 transition-all duration-300 text-sm sm:text-base">
                  Schedule Demo
                </button> */}
              </div>
            </div>
          </section>

          {/* === Additional Sections === */}
          <StatsSection />
          <TeamSection />

          {/* Footer line */}
          <footer className="relative bg-[#FFD700] text-black overflow-hidden">
      {/* Top gradient divider */}
      <div className="absolute top-0 left-0 right-0">
        <div className="h-px bg-gradient-to-r from-transparent via-black/40 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* 1. Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-3">
              <span className="text-black">JAI</span>
              <span className="text-white drop-shadow-md">MAX</span>
            </h3>
            <p className="text-black/80 text-sm leading-relaxed max-w-xs">
              Empowering businesses through secure, scalable, and future-ready
              blockchain technology.
            </p>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h4 className="font-semibold mb-3 text-black uppercase tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-black/80">
              {["About Us", "Solutions", "Careers", "Contact"].map((link) => (
                <li key={link} className="relative group overflow-hidden">
                  <a
                    href="#"
                    className="inline-block transition-all duration-300 group-hover:text-black font-medium"
                  >
                    {link}
                  </a>
                  {/* underline animation */}
                  <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-black transition-all duration-300 group-hover:w-16"></span>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Contact */}
          <div>
            <h4 className="font-semibold mb-3 text-black uppercase tracking-wide">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-black/80">
              {[
                { Icon: Mail, text: "support@jaimax.io" },
                { Icon: Phone, text: "+91 98765 43210" },
                { Icon: MapPin, text: "Hyderabad, India" },
              ].map(({ Icon, text }, idx) => (
                <li key={idx} className="flex items-center gap-2 group relative overflow-hidden">
                  <Icon size={16} className="text-black flex-shrink-0" />
                  <span className="transition-colors duration-300 group-hover:text-black font-medium">
                    {text}
                  </span>
                  {/* left-to-right highlight */}
                  <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-black transition-all duration-300 group-hover:w-40"></span>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Social Links */}
          <div>
            <h4 className="font-semibold mb-3 text-black uppercase tracking-wide">
              Follow Us
            </h4>
            <div className="flex gap-4">
              {/* LinkedIn */}
              <a
                href="#"
                className="p-2 rounded-full border border-black/10 hover:bg-[#0A66C2] transition-all duration-300 hover:text-white"
              >
                <Linkedin
                  size={18}
                  className="transition-colors duration-300 "
                />
              </a>

              {/* Twitter */}
              <a
                href="#"
                className="p-2 rounded-full border border-black/10 hover:bg-[#1DA1F2] transition-all duration-300 hover:text-white"
              >
                <Twitter
                  size={18}
                  className="transition-colors duration-300 "
                />
              </a>

              {/* Instagram */}
              <a
                href="#"
                className="p-2 rounded-full border border-black/10 hover:bg-[#E1306C] transition-all duration-300 hover:text-white"
              >
                <Instagram
                  size={18}
                  className="transition-colors duration-300 "
                />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom divider and copyright */}
        <div className="mt-12 pt-6 border-t border-black/20 text-center text-sm text-black/70">
          © {new Date().getFullYear()} <span className="font-semibold text-black">Jaimax</span>. All rights reserved.
        </div>
      </div>
    </footer>
        </>
      )}
    </div>
  );
}


// import LandingHero from "./LandingHero";

// export default function LandingPage() {
//   return (
//     <div className="bg-black text-white min-h-screen">
//       <LandingHero />
//       {/* Keep other sections below */}
//     </div>
//   );
// }
