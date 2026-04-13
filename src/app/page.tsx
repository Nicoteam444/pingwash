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

            {/* Hero illustration - Cute penguin with clean car */}
            <div className="relative flex items-center justify-center">
              <div className="w-80 h-80 sm:w-96 sm:h-96 relative">
                <svg viewBox="0 0 400 420" className="w-full h-full overflow-visible">
                  <defs>
                    <style>{`
                      @keyframes gentleSway {
                        0%, 100% { transform: translateY(0) rotate(0deg); }
                        50% { transform: translateY(-6px) rotate(1deg); }
                      }
                      @keyframes wave {
                        0%, 60%, 100% { transform: rotate(0deg); }
                        10% { transform: rotate(12deg); }
                        20% { transform: rotate(-6deg); }
                        30% { transform: rotate(10deg); }
                        40% { transform: rotate(-4deg); }
                        50% { transform: rotate(6deg); }
                      }
                      @keyframes blink {
                        0%, 42%, 44%, 100% { transform: scaleY(1); }
                        43% { transform: scaleY(0.1); }
                      }
                      @keyframes floatBubble {
                        0% { transform: translateY(0) scale(1); opacity: 0.6; }
                        100% { transform: translateY(-80px) scale(0.4); opacity: 0; }
                      }
                      @keyframes twinkle {
                        0%, 100% { opacity: 0.2; transform: scale(0.8); }
                        50% { opacity: 1; transform: scale(1.1); }
                      }
                      @keyframes carShine {
                        0%, 100% { opacity: 0.08; }
                        50% { opacity: 0.2; }
                      }
                      @keyframes heartFloat {
                        0% { transform: translateY(0) scale(0); opacity: 0; }
                        20% { transform: translateY(-5px) scale(1); opacity: 1; }
                        100% { transform: translateY(-35px) scale(0.6); opacity: 0; }
                      }
                      .penguin-sway { animation: gentleSway 3s ease-in-out infinite; }
                      .penguin-wave { animation: wave 3s ease-in-out infinite; transform-origin: 252px 250px; }
                      .penguin-eyes { animation: blink 4s ease-in-out infinite; transform-origin: 200px 195px; }
                      .fb-1 { animation: floatBubble 4s ease-out infinite; }
                      .fb-2 { animation: floatBubble 4.5s ease-out infinite 0.8s; }
                      .fb-3 { animation: floatBubble 3.8s ease-out infinite 1.6s; }
                      .fb-4 { animation: floatBubble 5s ease-out infinite 2.4s; }
                      .fb-5 { animation: floatBubble 4.2s ease-out infinite 3.2s; }
                      .tw-1 { animation: twinkle 2.5s ease-in-out infinite; }
                      .tw-2 { animation: twinkle 2.5s ease-in-out infinite 0.8s; }
                      .tw-3 { animation: twinkle 2.5s ease-in-out infinite 1.6s; }
                      .tw-4 { animation: twinkle 3s ease-in-out infinite 0.4s; }
                      .car-glow { animation: carShine 3s ease-in-out infinite; }
                      .heart-1 { animation: heartFloat 3s ease-out infinite 0.5s; }
                      .heart-2 { animation: heartFloat 3s ease-out infinite 2s; }
                    `}</style>
                    {/* Soft gradient for ground */}
                    <radialGradient id="groundGlow" cx="50%" cy="50%">
                      <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.1" />
                    </radialGradient>
                  </defs>

                  {/* Soft ground */}
                  <ellipse cx="200" cy="370" rx="180" ry="35" fill="url(#groundGlow)" />
                  <ellipse cx="200" cy="370" rx="150" ry="22" fill="#e0f2fe" opacity="0.6" />

                  {/* Clean sparkling car — rounded, friendly shape */}
                  <g>
                    {/* Car shadow */}
                    <ellipse cx="220" cy="368" rx="120" ry="12" fill="#cbd5e1" opacity="0.3" />
                    {/* Car body */}
                    <rect x="110" y="265" width="220" height="75" rx="18" fill="#0ea5e9" />
                    <rect x="110" y="265" width="220" height="75" rx="18" fill="white" opacity="0.15" className="car-glow" />
                    {/* Car roof */}
                    <path d="M155 265 Q165 210 195 210 L270 210 Q300 210 310 265" fill="#0284c7" />
                    {/* Windows */}
                    <rect x="180" y="218" width="45" height="40" rx="8" fill="#bae6fd" opacity="0.9" />
                    <rect x="233" y="218" width="45" height="40" rx="8" fill="#bae6fd" opacity="0.9" />
                    {/* Window reflections */}
                    <line x1="186" y1="225" x2="192" y2="250" stroke="white" strokeWidth="2" opacity="0.35" strokeLinecap="round" />
                    <line x1="239" y1="225" x2="245" y2="250" stroke="white" strokeWidth="2" opacity="0.35" strokeLinecap="round" />
                    {/* Bumpers rounded */}
                    <rect x="105" y="310" width="230" height="10" rx="5" fill="#0284c7" opacity="0.6" />
                    {/* Headlights — friendly round */}
                    <circle cx="320" cy="295" r="10" fill="#fde68a" />
                    <circle cx="320" cy="295" r="6" fill="#fbbf24" opacity="0.6" />
                    <circle cx="118" cy="295" r="10" fill="#fde68a" />
                    <circle cx="118" cy="295" r="6" fill="#fbbf24" opacity="0.6" />
                    {/* Smile on car (cute!) */}
                    <path d="M300 300 Q310 308 320 300" fill="none" stroke="#0369a1" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
                    {/* Wheels */}
                    <circle cx="170" cy="340" r="22" fill="#1e293b" />
                    <circle cx="170" cy="340" r="13" fill="#334155" />
                    <circle cx="170" cy="340" r="5" fill="#94a3b8" />
                    <circle cx="290" cy="340" r="22" fill="#1e293b" />
                    <circle cx="290" cy="340" r="13" fill="#334155" />
                    <circle cx="290" cy="340" r="5" fill="#94a3b8" />
                  </g>

                  {/* Cute penguin — big, round, happy */}
                  <g className="penguin-sway">
                    {/* Penguin shadow */}
                    <ellipse cx="70" cy="368" rx="35" ry="8" fill="#cbd5e1" opacity="0.3" />
                    {/* Feet */}
                    <ellipse cx="52" cy="345" rx="14" ry="7" fill="#f97316" />
                    <ellipse cx="88" cy="345" rx="14" ry="7" fill="#f97316" />
                    {/* Body — big round belly */}
                    <ellipse cx="70" cy="290" rx="42" ry="60" fill="#0c1e2c" />
                    {/* White belly — big and round */}
                    <ellipse cx="70" cy="300" rx="30" ry="42" fill="white" />
                    {/* Head — big and round */}
                    <circle cx="70" cy="225" r="32" fill="#0c1e2c" />
                    {/* White face area */}
                    <ellipse cx="70" cy="230" rx="22" ry="18" fill="white" opacity="0.08" />
                    {/* Eyes — big, round, friendly */}
                    <g className="penguin-eyes">
                      <circle cx="57" cy="220" r="9" fill="white" />
                      <circle cx="83" cy="220" r="9" fill="white" />
                      <circle cx="59" cy="219" r="5" fill="#0c1e2c" />
                      <circle cx="85" cy="219" r="5" fill="#0c1e2c" />
                      {/* Eye shine */}
                      <circle cx="61" cy="217" r="2" fill="white" />
                      <circle cx="87" cy="217" r="2" fill="white" />
                    </g>
                    {/* Happy beak — smiling */}
                    <ellipse cx="70" cy="233" rx="6" ry="4" fill="#f97316" />
                    {/* Big smile */}
                    <path d="M60 238 Q70 248 80 238" fill="none" stroke="#0c1e2c" strokeWidth="2" strokeLinecap="round" />
                    {/* Rosy cheeks */}
                    <circle cx="46" cy="232" r="6" fill="#fda4af" opacity="0.25" />
                    <circle cx="94" cy="232" r="6" fill="#fda4af" opacity="0.25" />
                    {/* Left flipper — holding cloth gently */}
                    <path d="M30 270 Q20 285 30 300" fill="#0c1e2c" stroke="#0c1e2c" strokeWidth="3" strokeLinecap="round" />
                    {/* Cloth in left flipper */}
                    <rect x="18" y="292" width="18" height="12" rx="4" fill="#7dd3fc" />
                    <line x1="21" y1="296" x2="21" y2="301" stroke="#bae6fd" strokeWidth="1" />
                    <line x1="26" y1="295" x2="26" y2="302" stroke="#bae6fd" strokeWidth="1" />
                    <line x1="31" y1="296" x2="31" y2="301" stroke="#bae6fd" strokeWidth="1" />
                  </g>

                  {/* Waving right flipper */}
                  <g className="penguin-wave">
                    <path d="M108 265 Q125 250 118 232" fill="none" stroke="#0c1e2c" strokeWidth="10" strokeLinecap="round" />
                  </g>

                  {/* Floating hearts */}
                  <text className="heart-1" x="115" y="210" fontSize="16" fill="#f472b6">&#x2665;</text>
                  <text className="heart-2" x="90" y="195" fontSize="12" fill="#fb923c">&#x2665;</text>

                  {/* Gentle floating bubbles */}
                  <circle className="fb-1" cx="40" cy="280" r="6" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="0.8" />
                  <circle className="fb-2" cx="55" cy="270" r="4.5" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="0.8" />
                  <circle className="fb-3" cx="25" cy="290" r="3.5" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="0.8" />
                  <circle className="fb-4" cx="95" cy="275" r="5" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="0.8" />
                  <circle className="fb-5" cx="45" cy="260" r="3" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="0.8" />

                  {/* Sparkle stars around car */}
                  <text className="tw-1" x="340" y="215" fontSize="18" fill="#fbbf24">&#x2726;</text>
                  <text className="tw-2" x="145" y="200" fontSize="14" fill="#0ea5e9">&#x2726;</text>
                  <text className="tw-3" x="310" y="260" fontSize="12" fill="#10b981">&#x2726;</text>
                  <text className="tw-4" x="355" y="290" fontSize="16" fill="#0ea5e9">&#x2727;</text>

                  {/* "CLEAN!" badge on car */}
                  <g>
                    <rect x="200" y="275" width="60" height="22" rx="11" fill="#10b981" />
                    <text x="210" y="291" fontSize="11" fill="white" fontWeight="bold" fontFamily="sans-serif">CLEAN</text>
                    <text x="250" y="289" fontSize="10" fill="white">&#x2728;</text>
                  </g>
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
