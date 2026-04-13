import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

              {/* Address search bar */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl">
                <div className="flex-1 relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Saisissez votre adresse"
                    className="w-full pl-12 pr-4 py-4 bg-white rounded-xl text-[15px] text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pingwash-blue/30 border border-gray-200 shadow-sm"
                  />
                </div>
                <Link
                  href="/connexion"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-pingwash-blue hover:bg-pingwash-blue-dark rounded-xl transition-all shadow-sm whitespace-nowrap"
                >
                  Réserver
                </Link>
              </div>

              <div className="mt-4">
                <Link
                  href="/devenir-laveur"
                  className="text-sm font-medium text-pingwash-green hover:text-pingwash-green-dark transition-colors"
                >
                  Devenir laveur →
                </Link>
              </div>

              <div className="mt-8 flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">★★★★★</span>
                  <span>4.9/5</span>
                </div>
                <span className="text-gray-300">|</span>
                <span>+2 000 lavages réalisés</span>
              </div>
            </div>

            {/* Hero illustration - Penguin with car */}
            <div className="relative flex items-center justify-center animate-float">
              <div className="w-80 h-80 sm:w-96 sm:h-96 relative">
                <svg viewBox="0 0 400 400" className="w-full h-full">
                  {/* Ice / ground */}
                  <ellipse cx="200" cy="350" rx="160" ry="30" fill="#e0f2fe" />

                  {/* Car body */}
                  <rect x="100" y="240" width="200" height="70" rx="10" fill="#64748b" />
                  <path d="M140 240 L160 190 L280 190 L300 240Z" fill="#475569" />
                  <rect x="165" y="195" width="50" height="40" rx="4" fill="#bae6fd" opacity="0.7" />
                  <rect x="225" y="195" width="50" height="40" rx="4" fill="#bae6fd" opacity="0.7" />
                  <circle cx="155" cy="315" r="22" fill="#1e293b" />
                  <circle cx="155" cy="315" r="10" fill="#64748b" />
                  <circle cx="285" cy="315" r="22" fill="#1e293b" />
                  <circle cx="285" cy="315" r="10" fill="#64748b" />

                  {/* Penguin */}
                  <ellipse cx="60" cy="260" rx="30" ry="45" fill="#0c1e2c" />
                  <ellipse cx="60" cy="270" rx="20" ry="30" fill="white" />
                  <circle cx="52" cy="235" r="5" fill="#0ea5e9" />
                  <circle cx="68" cy="235" r="5" fill="#0ea5e9" />
                  <ellipse cx="60" cy="243" rx="4" ry="2.5" fill="#f97316" />

                  {/* Penguin arm with sponge */}
                  <line x1="85" y1="255" x2="105" y2="250" stroke="#0c1e2c" strokeWidth="6" strokeLinecap="round" />
                  <circle cx="108" cy="248" r="10" fill="#fbbf24" />

                  {/* Water sparkles */}
                  <circle cx="130" cy="230" r="3" fill="#0ea5e9" opacity="0.6" />
                  <circle cx="150" cy="220" r="2" fill="#0ea5e9" opacity="0.4" />
                  <circle cx="120" cy="215" r="2.5" fill="#0ea5e9" opacity="0.5" />
                  <circle cx="140" cy="240" r="2" fill="#0ea5e9" opacity="0.3" />

                  {/* Sparkle stars */}
                  <text x="310" y="200" fontSize="20" fill="#fbbf24" opacity="0.8">✦</text>
                  <text x="330" y="250" fontSize="14" fill="#0ea5e9" opacity="0.6">✦</text>
                  <text x="80" y="180" fontSize="16" fill="#10b981" opacity="0.7">✦</text>
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
