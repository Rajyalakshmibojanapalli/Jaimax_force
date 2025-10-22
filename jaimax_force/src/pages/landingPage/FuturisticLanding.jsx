import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import team1 from "../../assets/images/image1.jpg";
import team2 from "../../assets/images/image2.jpg";
import team3 from "../../assets/images/image3.jpg";
import team4 from "../../assets/images/image4.jpg";

const teamData = [
  {
    id: 1,
    title: "Empowering Teams",
    desc: "We believe success starts with people. Our team management platform empowers every member to collaborate seamlessly, stay aligned, and achieve shared goals.",
    img: team1,
    color: "#FFD700", // gold
  },
  {
    id: 2,
    title: "Smart Collaboration",
    desc: "From task tracking to performance insights — every detail is designed to keep teams connected, efficient, and motivated for the future of work.",
    img: team2,
    color: "#18A04A", // green accent
  },
  {
    id: 3,
    title: "Innovation Culture",
    desc: "We foster innovation through transparency and communication — ensuring every voice contributes to growth, creativity, and collective excellence.",
    img: team3,
    color: "#0A545A", // deep teal
  },
  {
    id: 4,
    title: "Scalable Growth",
    desc: "Our ecosystem scales with your organization — empowering leaders, streamlining workflows, and driving measurable impact across every department.",
    img: team4,
    color: "#C1D42C", // lime accent
  },
];

export default function TeamShowcase() {
  const [active, setActive] = useState(teamData[0]);

  // Auto transition every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => {
        const currentIndex = teamData.findIndex((item) => item.id === prev.id);
        const nextIndex = (currentIndex + 1) % teamData.length;
        return teamData[nextIndex];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative w-full flex flex-col justify-center items-center overflow-hidden"
      style={{
        background: `#000`,
        minHeight: "70vh"
      }}
    >
      {/* Content Row */}
      <div className="flex w-full justify-between items-center mt-12 relative px-4">
        {/* Text block */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            className="max-w-md text-white"
            initial={{ opacity: 0, y: 100, x: -100 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -100, x: 100 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            <h1 className="text-4xl font-bold mb-4 text-[#FFD700]">{active.title}</h1>
            <p className="text-sm leading-relaxed text-white/80">{active.desc}</p>
          </motion.div>
        </AnimatePresence>

        {/* Image / Illustration */}
        <AnimatePresence mode="wait">
          <motion.img
            key={active.img}
            src={active.img}
            alt={active.title}
            className="w-64 h-auto rounded"
            initial={{ opacity: 0, y: -120, x: 120 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 120, x: -120 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          />
        </AnimatePresence>
      </div>

      {/* Indicator dots */}
      <div className="flex gap-4 mt-16">
        {teamData.map((item) => (
          <div
            key={item.id}
            className={`w-3 h-3 rounded-full transition-all duration-500 ${
              item.id === active.id ? "bg-[#FFD700]" : "bg-gray-500/40"
            }`}
          ></div>
        ))}
      </div>
    </section>
  );
}