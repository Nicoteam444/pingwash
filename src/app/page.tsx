import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSearch from "@/components/HeroSearch";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-pingwash-ice via-white to-blue-50" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-pingwash-blue/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-72 h-72 bg-pingwash-green/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-pingwash-green/10 text-pingwash-green rounded-full text-sm font-medium mb-6">
                <span>🌍</span> Jusqu&apos;à 99% d&apos;eau économisée
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                Votre véhicule lavé.{" "}
                <span className="text-gradient">La banquise protégée.</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-lg">
                PINGWASH envoie un laveur professionnel chez vous ou au bureau.
                Voiture, moto ou vélo — en 30 secondes, c&apos;est réservé.
              </p>

              <HeroSearch />

              <div className="mt-8 flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">★★★★★</span>
                  <span>4.9/5</span>
                </div>
                <span className="text-gray-300">|</span>
                <span>+2 000 lavages réalisés</span>
              </div>
            </div>

            {/* Hero illustration - Animated Penguin washing car */}
            <div className="relative flex items-center justify-center">
              <div className="w-80 h-80 sm:w-96 sm:h-96 relative">
                <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible">
                  <defs>
                    {/* Scrubbing arm animation */}
                    <style>{`
                      @keyframes scrub {
                        0%, 100% { transform: rotate(-5deg); }
                        50% { transform: rotate(15deg); }
                      }
                      @keyframes bubble1 {
                        0% { transform: translate(0, 0); opacity: 0.7; }
                        100% { transform: translate(-15px, -60px); opacity: 0; }
                      }
                      @keyframes bubble2 {
                        0% { transform: translate(0, 0); opacity: 0.6; }
                        100% { transform: translate(10px, -70px); opacity: 0; }
                      }
                      @keyframes bubble3 {
                        0% { transform: translate(0, 0); opacity: 0.5; }
                        100% { transform: translate(-8px, -55px); opacity: 0; }
                      }
                      @keyframes bubble4 {
                        0% { transform: translate(0, 0); opacity: 0.6; }
                        100% { transform: translate(12px, -65px); opacity: 0; }
                      }
                      @keyframes sparkle {
                        0%, 100% { opacity: 0; transform: scale(0.5); }
                        50% { opacity: 1; transform: scale(1.2); }
                      }
                      @keyframes penguinBounce {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-4px); }
                      }
                      @keyframes spongeWipe {
                        0%, 100% { transform: translate(0, 0) rotate(0deg); }
                        25% { transform: translate(15px, -5px) rotate(5deg); }
                        50% { transform: translate(30px, 0) rotate(0deg); }
                        75% { transform: translate(15px, 5px) rotate(-5deg); }
                      }
                      @keyframes waterDrip {
                        0% { transform: translateY(0); opacity: 0.8; }
                        100% { transform: translateY(25px); opacity: 0; }
                      }
                      @keyframes shine {
                        0% { transform: translateX(-40px); opacity: 0; }
                        50% { opacity: 0.6; }
                        100% { transform: translateX(200px); opacity: 0; }
                      }
                      .scrub-arm { animation: scrub 0.8s ease-in-out infinite; transform-origin: 85px 260px; }
                      .bubble-1 { animation: bubble1 2.5s ease-out infinite; }
                      .bubble-2 { animation: bubble2 3s ease-out infinite 0.5s; }
                      .bubble-3 { animation: bubble3 2.8s ease-out infinite 1s; }
                      .bubble-4 { animation: bubble4 3.2s ease-out infinite 1.5s; }
                      .sparkle-1 { animation: sparkle 2s ease-in-out infinite; }
                      .sparkle-2 { animation: sparkle 2s ease-in-out infinite 0.7s; }
                      .sparkle-3 { animation: sparkle 2s ease-in-out infinite 1.4s; }
                      .sparkle-4 { animation: sparkle 1.8s ease-in-out infinite 0.3s; }
                      .penguin-body { animation: penguinBounce 0.8s ease-in-out infinite; }
                      .sponge { animation: spongeWipe 1.2s ease-in-out infinite; }
                      .water-drip-1 { animation: waterDrip 1.5s ease-in infinite 0.2s; }
                      .water-drip-2 { animation: waterDrip 1.5s ease-in infinite 0.8s; }
                      .water-drip-3 { animation: waterDrip 1.5s ease-in infinite 1.4s; }
                      .car-shine { animation: shine 3s ease-in-out infinite; }
                    `}</style>
                  </defs>

                  {/* Ice / ground with shadow */}
                  <ellipse cx="200" cy="350" rx="170" ry="30" fill="#e0f2fe" />
                  <ellipse cx="200" cy="352" rx="140" ry="18" fill="#bae6fd" opacity="0.4" />

                  {/* Car body */}
                  <rect x="100" y="240" width="220" height="75" rx="12" fill="#64748b" />
                  <path d="M145 240 L168 185 L290 185 L310 240Z" fill="#475569" />
                  {/* Car shine effect */}
                  <rect className="car-shine" x="100" y="240" width="40" height="75" rx="12" fill="white" opacity="0.15" />
                  {/* Windows */}
                  <rect x="173" y="192" width="52" height="42" rx="5" fill="#bae6fd" opacity="0.8" />
                  <rect x="233" y="192" width="52" height="42" rx="5" fill="#bae6fd" opacity="0.8" />
                  {/* Window reflections */}
                  <line x1="178" y1="197" x2="190" y2="228" stroke="white" strokeWidth="1.5" opacity="0.4" />
                  <line x1="238" y1="197" x2="250" y2="228" stroke="white" strokeWidth="1.5" opacity="0.4" />
                  {/* Door handle */}
                  <rect x="210" y="265" width="18" height="4" rx="2" fill="#94a3b8" />
                  {/* Headlights */}
                  <circle cx="310" cy="268" r="8" fill="#fbbf24" opacity="0.8" />
                  <circle cx="110" cy="268" r="8" fill="#fbbf24" opacity="0.6" />
                  {/* Wheels */}
                  <circle cx="160" cy="320" r="24" fill="#1e293b" />
                  <circle cx="160" cy="320" r="12" fill="#475569" />
                  <circle cx="160" cy="320" r="4" fill="#94a3b8" />
                  <circle cx="290" cy="320" r="24" fill="#1e293b" />
                  <circle cx="290" cy="320" r="12" fill="#475569" />
                  <circle cx="290" cy="320" r="4" fill="#94a3b8" />

                  {/* Penguin */}
                  <g className="penguin-body">
                    {/* Feet */}
                    <ellipse cx="50" cy="305" rx="12" ry="5" fill="#f97316" />
                    <ellipse cx="72" cy="305" rx="12" ry="5" fill="#f97316" />
                    {/* Body */}
                    <ellipse cx="60" cy="265" rx="32" ry="48" fill="#0c1e2c" />
                    {/* Belly */}
                    <ellipse cx="60" cy="275" rx="22" ry="32" fill="white" />
                    {/* Head */}
                    <circle cx="60" cy="222" r="22" fill="#0c1e2c" />
                    {/* Face */}
                    <ellipse cx="60" cy="228" rx="14" ry="12" fill="white" opacity="0.15" />
                    {/* Eyes */}
                    <circle cx="52" cy="218" r="6" fill="white" />
                    <circle cx="68" cy="218" r="6" fill="white" />
                    <circle cx="53" cy="217" r="3.5" fill="#0ea5e9" />
                    <circle cx="69" cy="217" r="3.5" fill="#0ea5e9" />
                    <circle cx="54" cy="216" r="1.5" fill="white" />
                    <circle cx="70" cy="216" r="1.5" fill="white" />
                    {/* Beak */}
                    <ellipse cx="60" cy="228" rx="5" ry="3" fill="#f97316" />
                    {/* Happy blush */}
                    <circle cx="44" cy="224" r="4" fill="#fda4af" opacity="0.3" />
                    <circle cx="76" cy="224" r="4" fill="#fda4af" opacity="0.3" />
                    {/* Crown / hat */}
                    <path d="M48 202 L60 192 L72 202" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="60" cy="191" r="3" fill="#fbbf24" />
                  </g>

                  {/* Scrubbing arm + sponge */}
                  <g className="scrub-arm">
                    <line x1="85" y1="260" x2="115" y2="248" stroke="#0c1e2c" strokeWidth="8" strokeLinecap="round" />
                    <g className="sponge">
                      <rect x="110" y="238" width="24" height="18" rx="6" fill="#fbbf24" />
                      <rect x="113" y="241" width="4" height="4" rx="1" fill="#f59e0b" opacity="0.5" />
                      <rect x="120" y="244" width="4" height="4" rx="1" fill="#f59e0b" opacity="0.5" />
                      <rect x="126" y="240" width="4" height="4" rx="1" fill="#f59e0b" opacity="0.5" />
                    </g>
                  </g>

                  {/* Foam / bubbles rising */}
                  <circle className="bubble-1" cx="125" cy="235" r="5" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="1" />
                  <circle className="bubble-2" cx="140" cy="228" r="4" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="1" />
                  <circle className="bubble-3" cx="118" cy="222" r="3.5" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="1" />
                  <circle className="bubble-4" cx="148" cy="240" r="3" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="1" />
                  <circle className="bubble-2" cx="132" cy="245" r="2.5" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="1" />

                  {/* Water drips from car */}
                  <ellipse className="water-drip-1" cx="180" cy="315" rx="2" ry="4" fill="#0ea5e9" opacity="0.6" />
                  <ellipse className="water-drip-2" cx="230" cy="315" rx="1.5" ry="3.5" fill="#0ea5e9" opacity="0.5" />
                  <ellipse className="water-drip-3" cx="260" cy="315" rx="2" ry="4" fill="#0ea5e9" opacity="0.6" />

                  {/* Sparkle stars */}
                  <text className="sparkle-1" x="320" y="200" fontSize="22" fill="#fbbf24">✦</text>
                  <text className="sparkle-2" x="340" y="255" fontSize="16" fill="#0ea5e9">✦</text>
                  <text className="sparkle-3" x="85" y="175" fontSize="18" fill="#10b981">✦</text>
                  <text className="sparkle-4" x="300" y="170" fontSize="14" fill="#0ea5e9">✧</text>
                  <text className="sparkle-1" x="30" y="195" fontSize="12" fill="#fbbf24">✧</text>

                  {/* Water bucket next to penguin */}
                  <rect x="15" y="290" width="22" height="18" rx="3" fill="#0284c7" />
                  <rect x="12" y="288" width="28" height="4" rx="2" fill="#0369a1" />
                  <ellipse cx="26" cy="295" rx="6" ry="2" fill="#7dd3fc" opacity="0.5" />
                  <path d="M18 286 Q26 280 34 286" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="comment-ca-marche" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-pingwash-navy">
              Propre en <span className="text-gradient">3 étapes</span>
            </h2>
            <p className="mt-4 text-gray-500 text-lg">Plus simple qu&apos;un Uber. Plus propre que jamais.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                icon: "📍",
                title: "Choisissez votre créneau",
                desc: "Maintenant ou dans les jours qui viennent. Notre IA vous recommande le forfait idéal.",
              },
              {
                step: "2",
                icon: "🐧",
                title: "Un laveur vient à vous",
                desc: "Formé, équipé et noté. Il arrive chez vous ou au bureau avec tout le matériel écologique.",
              },
              {
                step: "3",
                icon: "✨",
                title: "Véhicule impeccable",
                desc: "Notez votre laveur. Profitez de votre véhicule comme neuf, sans avoir bougé.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative p-8 rounded-2xl bg-gradient-to-b from-pingwash-ice/50 to-white border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="absolute -top-4 -left-2 w-10 h-10 bg-pingwash-blue text-white rounded-full flex items-center justify-center font-black text-sm">
                  {item.step}
                </div>
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-pingwash-navy mb-2">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Forfaits */}
      <section id="forfaits" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-pingwash-navy">
              Nos <span className="text-gradient">forfaits</span>
            </h2>
            <p className="mt-4 text-gray-500 text-lg">Voiture, moto ou vélo — il y a un forfait pour vous.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Essentiel",
                price: "99",
                color: "pingwash-blue",
                features: [
                  "Lavage extérieur complet",
                  "Jantes & pneus",
                  "Vitres & rétroviseurs",
                  "Produits 100% éco",
                ],
                popular: false,
              },
              {
                name: "Premium",
                price: "149",
                color: "pingwash-green",
                features: [
                  "Tout l'Essentiel +",
                  "Intérieur complet",
                  "Aspiration & dépoussiérage",
                  "Tableau de bord & plastiques",
                  "Parfum longue durée",
                ],
                popular: true,
              },
              {
                name: "Royal",
                price: "199",
                color: "pingwash-orange",
                features: [
                  "Tout le Premium +",
                  "Shampooing sièges",
                  "Rénovation plastiques",
                  "Traitement hydrophobe",
                  "Nettoyage moteur",
                  "Check-list IA 50 points",
                ],
                popular: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`relative p-8 rounded-2xl border-2 transition-all hover:shadow-xl hover:-translate-y-1 ${
                  plan.popular
                    ? "border-pingwash-green bg-white shadow-lg scale-105"
                    : "border-gray-100 bg-white"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-pingwash-green text-white text-xs font-bold rounded-full">
                    Le plus populaire
                  </div>
                )}
                <h3 className="text-xl font-bold text-pingwash-navy">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-pingwash-navy">{plan.price}€</span>
                  <span className="text-gray-400 text-sm">/ lavage</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-pingwash-green mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/connexion"
                  className={`mt-8 block text-center px-6 py-3 rounded-full font-semibold text-sm transition-all ${
                    plan.popular
                      ? "bg-pingwash-green text-white hover:bg-pingwash-green-dark"
                      : "bg-gray-100 text-pingwash-navy hover:bg-gray-200"
                  }`}
                >
                  Choisir {plan.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement écologique */}
      <section id="eco" className="py-24 bg-pingwash-navy text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-pingwash-green/20 text-pingwash-green rounded-full text-sm font-medium mb-6">
                🌍 Notre engagement RSE
              </div>
              <h2 className="text-3xl sm:text-4xl font-black leading-tight">
                Chaque lavage PINGWASH,{" "}
                <span className="text-pingwash-blue">c&apos;est de la banquise sauvée.</span>
              </h2>
              <p className="mt-6 text-gray-300 text-lg leading-relaxed">
                Un lavage classique consomme 200L d&apos;eau. Un lavage PINGWASH ? Moins de 5L grâce à nos produits biodégradables et notre technique vapeur/microfibre.
              </p>

              <div className="mt-10 grid grid-cols-2 gap-6">
                {[
                  { value: "99%", label: "d'eau économisée" },
                  { value: "0", label: "produit chimique" },
                  { value: "100%", label: "biodégradable" },
                  { value: "5L", label: "par lavage max" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-3xl font-black text-pingwash-blue">{stat.value}</div>
                    <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <svg viewBox="0 0 300 300" className="w-72 h-72 animate-float">
                {/* Earth */}
                <circle cx="150" cy="150" r="120" fill="#0ea5e9" opacity="0.15" />
                <circle cx="150" cy="150" r="90" fill="#0ea5e9" opacity="0.25" />
                <circle cx="150" cy="150" r="60" fill="#10b981" opacity="0.3" />
                {/* Penguin on earth */}
                <ellipse cx="150" cy="145" rx="25" ry="38" fill="#0c1e2c" />
                <ellipse cx="150" cy="152" rx="17" ry="25" fill="white" />
                <circle cx="143" cy="130" r="4" fill="#0ea5e9" />
                <circle cx="157" cy="130" r="4" fill="#0ea5e9" />
                <ellipse cx="150" cy="137" rx="3.5" ry="2" fill="#f97316" />
                {/* Shield */}
                <path d="M150 80 L180 100 L180 140 L150 160 L120 140 L120 100Z" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.5" />
                {/* Leaf */}
                <path d="M200 100 Q220 80 230 100 Q220 120 200 100Z" fill="#10b981" opacity="0.6" />
                <path d="M100 200 Q80 180 100 170 Q120 180 100 200Z" fill="#10b981" opacity="0.4" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Devenir laveur */}
      <section className="py-24 bg-gradient-to-br from-pingwash-green/5 to-pingwash-blue/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-pingwash-navy">
            Devenez laveur <span className="text-gradient">PINGWASH</span>
          </h2>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            Gagnez jusqu&apos;à 2 500€/mois en étant votre propre patron. On vous forme, on vous équipe, vous lavez.
          </p>

          <div className="mt-8 grid sm:grid-cols-3 gap-6 text-left max-w-2xl mx-auto">
            {[
              { icon: "🎓", text: "Formation offerte" },
              { icon: "🧰", text: "Matériel fourni" },
              { icon: "📱", text: "App laveur avec check-list IA" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-sm font-medium text-pingwash-navy">{item.text}</span>
              </div>
            ))}
          </div>

          <Link
            href="/devenir-laveur"
            className="inline-flex items-center justify-center mt-10 px-10 py-4 text-base font-bold text-white bg-pingwash-green hover:bg-pingwash-green-dark rounded-full transition-all hover:scale-105 shadow-lg shadow-pingwash-green/30"
          >
            Rejoindre l&apos;équipe
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
