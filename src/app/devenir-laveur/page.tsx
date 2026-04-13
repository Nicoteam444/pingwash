import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function DevenirLaveur() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pingwash-green/5 via-white to-pingwash-blue/5" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-pingwash-green/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-pingwash-green/10 text-pingwash-green rounded-full text-sm font-medium mb-6">
              🐧 On recrute !
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-pingwash-navy">
              Devenez laveur{" "}
              <span className="text-gradient">PINGWASH</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-xl">
              Soyez votre propre patron. On vous forme, on vous équipe, vous lavez et vous gagnez jusqu&apos;à 2 500€/mois.
            </p>

            <Link
              href="/connexion"
              className="inline-flex items-center justify-center mt-8 px-10 py-4 text-base font-bold text-white bg-pingwash-green hover:bg-pingwash-green-dark rounded-full transition-all hover:scale-105 shadow-lg shadow-pingwash-green/30"
            >
              Postuler maintenant
            </Link>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-black text-pingwash-navy text-center mb-16">
            Pourquoi devenir <span className="text-gradient">laveur PINGWASH</span> ?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "💰",
                title: "Revenus attractifs",
                desc: "Gagnez entre 1 500€ et 2 500€/mois selon votre rythme. Paiement chaque semaine.",
              },
              {
                icon: "🎓",
                title: "Formation complète",
                desc: "Apprenez les techniques de lavage écologique. Formation gratuite de 3 jours.",
              },
              {
                icon: "🧰",
                title: "Matériel fourni",
                desc: "Kit complet : produits éco, microfibres, aspirateur, uniforme PINGWASH.",
              },
              {
                icon: "📱",
                title: "App laveur intelligente",
                desc: "Check-list IA, navigation GPS, planning optimisé automatiquement.",
              },
              {
                icon: "⏰",
                title: "Horaires flexibles",
                desc: "Travaillez quand vous voulez. Matin, soir, week-end — c'est vous qui décidez.",
              },
              {
                icon: "🌍",
                title: "Impact positif",
                desc: "Chaque lavage économise 195L d'eau. Vous protégez la planète en travaillant.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-2xl bg-gradient-to-b from-gray-50 to-white border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-pingwash-navy mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-black text-pingwash-navy text-center mb-16">
            Comment <span className="text-gradient">rejoindre l&apos;équipe</span> ?
          </h2>

          <div className="space-y-8">
            {[
              {
                step: "1",
                title: "Postulez en ligne",
                desc: "Remplissez le formulaire en 2 minutes. On vous recontacte sous 48h.",
              },
              {
                step: "2",
                title: "Formation de 3 jours",
                desc: "Apprenez nos techniques de lavage écologique et l'utilisation de l'app.",
              },
              {
                step: "3",
                title: "Recevez votre kit",
                desc: "Tout le matériel nécessaire vous est fourni : produits, outils, uniforme.",
              },
              {
                step: "4",
                title: "Commencez à laver !",
                desc: "Activez-vous sur l'app et recevez vos premières missions immédiatement.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex items-start gap-6 p-6 bg-white rounded-2xl border border-gray-100"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-pingwash-green text-white rounded-full flex items-center justify-center font-black text-lg">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-pingwash-navy">{item.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/connexion"
              className="inline-flex items-center justify-center px-10 py-4 text-base font-bold text-white bg-pingwash-green hover:bg-pingwash-green-dark rounded-full transition-all hover:scale-105 shadow-lg shadow-pingwash-green/30"
            >
              Postuler maintenant
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
