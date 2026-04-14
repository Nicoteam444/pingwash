import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSearch from "@/components/HeroSearch";
import BookingWidget from "@/components/BookingWidget";
import ScrollReveal from "@/components/ScrollReveal";
import WhatsAppButton from "@/components/WhatsAppButton";

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
                Propreté véhicule & bureau.{" "}
                <span className="text-gradient">La planète préservée.</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-lg">
                PINGWASH envoie un professionnel chez vous ou au bureau.
                Lavage auto, moto, vélo & ménage de bureaux — en 30 secondes, c&apos;est réservé.
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

            {/* Hero illustration - Minimal SVG penguin */}
            <div className="relative flex items-center justify-center animate-float">
              <svg viewBox="0 0 320 320" className="w-72 h-72 sm:w-96 sm:h-96" fill="none">
                {/* Soft circle background */}
                <circle cx="160" cy="160" r="140" fill="#e0f2fe" opacity="0.5" />
                {/* Car - simple flat */}
                <rect x="90" y="185" width="180" height="55" rx="14" fill="#0ea5e9" />
                <path d="M120 185 Q130 148 155 148 L220 148 Q245 148 255 185" fill="#0284c7" />
                <rect x="138" y="155" width="35" height="27" rx="5" fill="#bae6fd" />
                <rect x="180" y="155" width="35" height="27" rx="5" fill="#bae6fd" />
                <circle cx="130" cy="242" r="16" fill="#1e293b" />
                <circle cx="130" cy="242" r="7" fill="#475569" />
                <circle cx="230" cy="242" r="16" fill="#1e293b" />
                <circle cx="230" cy="242" r="7" fill="#475569" />
                {/* Penguin - minimal cute */}
                <ellipse cx="65" cy="200" rx="28" ry="40" fill="#0c1e2c" />
                <ellipse cx="65" cy="208" rx="18" ry="26" fill="white" />
                <circle cx="65" cy="164" r="22" fill="#0c1e2c" />
                <circle cx="57" cy="160" r="5" fill="white" />
                <circle cx="73" cy="160" r="5" fill="white" />
                <circle cx="58" cy="159" r="2.5" fill="#0c1e2c" />
                <circle cx="74" cy="159" r="2.5" fill="#0c1e2c" />
                <ellipse cx="65" cy="170" rx="4" ry="2.5" fill="#f97316" />
                <path d="M57 174 Q65 181 73 174" fill="none" stroke="#0c1e2c" strokeWidth="1.5" strokeLinecap="round" />
                {/* Flipper with cloth */}
                <line x1="88" y1="195" x2="100" y2="190" stroke="#0c1e2c" strokeWidth="5" strokeLinecap="round" />
                <rect x="96" y="184" width="14" height="10" rx="3" fill="#7dd3fc" />
                {/* Sparkles */}
                <circle cx="250" cy="145" r="4" fill="#fbbf24" opacity="0.7" />
                <circle cx="270" cy="170" r="3" fill="#0ea5e9" opacity="0.5" />
                <circle cx="100" cy="130" r="3" fill="#10b981" opacity="0.6" />
                {/* Bubbles */}
                <circle cx="105" cy="175" r="4" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="0.8" />
                <circle cx="115" cy="165" r="3" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="0.8" />
                <circle cx="95" cy="168" r="2.5" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="0.8" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Widget */}
      <BookingWidget />

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
            <p className="mt-4 text-gray-500 text-lg">Véhicules & bureaux — il y a un forfait pour vous.</p>
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

      {/* Testimonials */}
      <ScrollReveal>
        <section className="py-24 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-black text-pingwash-navy">
                Ils adorent <span className="text-gradient">PINGWASH</span>
              </h2>
              <p className="mt-3 text-gray-500 text-lg">+2 000 véhicules lavés, 4.9/5 de satisfaction</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                {
                  name: "Sophie M.",
                  city: "Paris",
                  rating: 5,
                  text: "Service incroyable ! Le laveur est arrivé en 20 min, ma voiture était impeccable. Et tout ça sans gaspiller d'eau !",
                  avatar: "SM",
                },
                {
                  name: "Thomas L.",
                  city: "Lyon",
                  rating: 5,
                  text: "J'ai pris le forfait Royal pour ma Tesla. Résultat bluffant, même le moteur était propre. Je recommande à 100%.",
                  avatar: "TL",
                },
                {
                  name: "Amira K.",
                  city: "Bordeaux",
                  rating: 5,
                  text: "Plus besoin d'aller au car wash ! Le laveur vient au bureau pendant que je travaille. Gain de temps énorme.",
                  avatar: "AK",
                },
              ].map((review) => (
                <div key={review.name} className="p-6 rounded-2xl bg-gradient-to-b from-pingwash-ice/30 to-white border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-pingwash-blue text-white flex items-center justify-center text-sm font-bold">
                      {review.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-pingwash-navy">{review.name}</p>
                      <p className="text-xs text-gray-500">📍 {review.city}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <span key={i} className="text-yellow-400 text-sm">★</span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">&ldquo;{review.text}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      <WhatsAppButton />

      <Footer />
    </>
  );
}
