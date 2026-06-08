export function AustraliaIdentitySection() {
  const stats = [
    { num: "1 in 5", label: "Australians face housing stress" },
    { num: "40%", label: "Rise in grocery prices since 2021" },
    { num: "18 months", label: "Average mental health wait time" },
  ];

  return (
    <section className="py-20 relative overflow-hidden bg-navy-deep">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, #F4C300 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Large background flag emoji */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="text-[30rem] opacity-[0.03]">🇦🇺</span>
      </div>

      <div className="container-wide relative z-10 text-center">
        <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-4">
          Our Purpose
        </p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 text-balance">
          Built for Australians.{" "}
          <span className="text-gold">Driven by Australians.</span>
        </h2>
        <p className="text-white/60 text-lg max-w-2xl mx-auto mb-14 leading-relaxed">
          NationLovers exists to close the gap between Australians and the systems that serve them.
          Every issue reported. Every solution submitted. Every vote cast. It all matters.
        </p>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-14">
          {stats.map(({ num, label }) => (
            <div
              key={label}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:border-gold/30 transition-colors"
            >
              <p className="text-4xl font-extrabold text-gold mb-2">{num}</p>
              <p className="text-white/70 text-sm leading-relaxed">{label}</p>
            </div>
          ))}
        </div>

        {/* Issue categories grid */}
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3 max-w-4xl mx-auto">
          {[
            { icon: "🛒", label: "Cost of Living" },
            { icon: "🏠", label: "Housing" },
            { icon: "🏥", label: "Healthcare" },
            { icon: "✈️", label: "Immigration" },
            { icon: "🚆", label: "Transport" },
            { icon: "📚", label: "Education" },
            { icon: "🛡️", label: "Safety" },
            { icon: "🌿", label: "Climate" },
            { icon: "🏛️", label: "Government" },
          ].map(({ icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1.5 bg-white/5 rounded-xl p-3 hover:bg-white/10 transition-colors"
            >
              <span className="text-2xl">{icon}</span>
              <span className="text-white/50 text-xs text-center leading-tight">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
