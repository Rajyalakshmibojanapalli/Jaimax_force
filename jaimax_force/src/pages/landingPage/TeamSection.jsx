import { motion } from "framer-motion";

export function TeamSection() {
  const team = [
    {
      name: "Swetha Ashok",
      role: "Founder & Visionary",
      img: "/images/team1.jpg",
      quote: "Building innovation through purpose and precision.",
    },
    {
      name: "Arjun Menon",
      role: "Lead Developer",
      img: "/images/team2.jpg",
      quote: "Engineering the future, one scalable system at a time.",
    },
    {
      name: "Riya Patel",
      role: "Creative Director",
      img: "/images/team3.jpg",
      quote: "Design is intelligence made visible.",
    },
    {
      name: "Karthik Rao",
      role: "Operations Head",
      img: "/images/team4.jpg",
      quote: "Scaling teams to match our vision of excellence.",
    },
  ];

  return (
    <section className="relative py-24 bg-gradient-to-b from-black to-[#0a0a0a] text-white">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold gradient-text mb-4">Meet Our Team</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Behind Jaimax’s innovation lies a passionate team dedicated to pushing boundaries in technology, design, and impact.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, i) => (
            <motion.div
              key={i}
              className="bg-black/40 border border-[#FFD700]/10 hover:border-[#FFD700]/40 rounded-2xl overflow-hidden p-6 flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(255,215,0,0.2)]"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-28 h-28 rounded-full object-cover mb-4 border-2 border-[#FFD700]/40"
              />
              <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
              <p className="text-[#FFD700] text-sm mb-3">{member.role}</p>
              <p className="text-gray-400 text-sm italic">“{member.quote}”</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
