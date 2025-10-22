import CountUp from "react-countup";
import { motion } from "framer-motion";

export function StatsSection() {
  const stats = [
    { label: "Active Users", value: 10000, suffix: "+" },
    { label: "Uptime SLA", value: 99.9, suffix: "%" },
    { label: "Countries", value: 150, suffix: "+" },
  ];

  return (
    <section className="relative py-20 bg-black text-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <motion.div
          className="grid sm:grid-cols-3 gap-12 text-center"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {stats.map((s, i) => (
            <div key={i}>
              <div className="text-5xl sm:text-6xl font-bold text-[#FFD700] mb-2">
                <CountUp end={s.value} duration={3.5} separator="," decimals={s.value % 1 ? 1 : 0} />
                {s.suffix}
              </div>
              <p className="text-sm uppercase tracking-widest text-gray-400">{s.label}</p>
              <div className="w-12 h-px mx-auto mt-3 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent"></div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
