import { motion } from "framer-motion";

export function TeamSection() {
  const team = [
    {
      name: "Swetha Ashok",
      role: "Founder & Visionary",
      quote: "Building innovation through purpose and precision.",
    },
    {
      name: "Arjun Menon",
      role: "Lead Developer",
      quote: "Engineering the future, one scalable system at a time.",
    },
    {
      name: "Riya Patel",
      role: "Creative Director",
      quote: "Design is intelligence made visible.",
    },
    {
      name: "Karthik Rao",
      role: "Operations Head",
      quote: "Scaling teams to match our vision of excellence.",
    },
  ];

  // Reusable animation variant for staggered motion
  const cardVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { delay: i * 0.15, duration: 0.8, ease: "easeOut" },
    }),
  };

  return (
    <section className="relative pb-24 pt-5 bg-gradient-to-b from-black to-[#0a0a0a] text-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-10">
        {/* --- Section Header --- */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold gradient-text mb-3">
            Meet Our Team
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Behind Jaimax’s innovation lies a passionate team dedicated to
            pushing boundaries in technology, design, and impact.
          </p>
        </motion.div>

        {/* --- Cards Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              className="group bg-gradient-to-b from-[#111] to-[#0a0a0a] border border-[#FFD700]/20 hover:border-[#FFD700]/40 
                         rounded-2xl p-8 flex flex-col items-center text-center 
                         transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(255,215,0,0.15)]"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
            >
              {/* Avatar placeholder */}
              <div
                className="w-28 h-28 rounded-full mb-4 flex items-center justify-center text-3xl font-semibold 
                           text-black bg-gradient-to-tr from-[#FFD700] to-[#FFF5A5] 
                           border border-[#FFD700]/50 shadow-[0_0_20px_rgba(255,215,0,0.3)]
                           group-hover:scale-105 transition-transform duration-300"
              >
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>

              <h3 className="text-lg sm:text-xl font-semibold mb-1">
                {member.name}
              </h3>
              <p className="text-[#FFD700] text-sm sm:text-base mb-3">
                {member.role}
              </p>
              <p className="text-gray-400 text-sm sm:text-base italic leading-relaxed">
                “{member.quote}”
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
