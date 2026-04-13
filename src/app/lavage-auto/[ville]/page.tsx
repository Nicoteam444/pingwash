import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";

const CITIES: Record<string, { name: string; description: string; postalCode: string }> = {
  paris: { name: "Paris", description: "la capitale", postalCode: "75000" },
  lyon: { name: "Lyon", description: "la Ville des Lumi\u00e8res", postalCode: "69000" },
  marseille: { name: "Marseille", description: "la cit\u00e9 phoc\u00e9enne", postalCode: "13000" },
  toulouse: { name: "Toulouse", description: "la Ville Rose", postalCode: "31000" },
  bordeaux: { name: "Bordeaux", description: "la Belle Endormie", postalCode: "33000" },
  nantes: { name: "Nantes", description: "la cit\u00e9 des Ducs", postalCode: "44000" },
  lille: { name: "Lille", description: "la capitale des Flandres", postalCode: "59000" },
  nice: { name: "Nice", description: "la perle de la C\u00f4te d\u2019Azur", postalCode: "06000" },
  strasbourg: { name: "Strasbourg", description: "la capitale europ\u00e9enne", postalCode: "67000" },
  montpellier: { name: "Montpellier", description: "la surdou\u00e9e", postalCode: "34000" },
  rennes: { name: "Rennes", description: "la capitale bretonne", postalCode: "35000" },
  grenoble: { name: "Grenoble", description: "la capitale des Alpes", postalCode: "38000" },
};

export function generateStaticParams() {
  return Object.keys(CITIES).map((ville) => ({ ville }));
}

export async function generateMetadata({ params }: { params: Promise<{ ville: string }> }) {
  const { ville } = await params;
  const city = CITIES[ville];
  if (!city) return {};
  return {
    title: `Lavage auto \u00e0 ${city.name} \u2014 PINGWASH | \u00c9cologique \u00e0 domicile`,
    description: `R\u00e9servez un lavage auto \u00e9cologique \u00e0 domicile \u00e0 ${city.name}. PINGWASH envoie un laveur professionnel chez vous. 99% d\u2019eau \u00e9conomis\u00e9e.`,
  };
}

export default async function CityPage({ params }: { params: Promise<{ ville: string }> }) {
  const { ville } = await params;
  const city = CITIES[ville];
  if (!city) notFound();

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        {/* Hero */}
        <section className="bg-gradient-to-b from-pingwash-ice to-white py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-pingwash-green/10 text-pingwash-green rounded-full text-sm font-medium mb-6">
              <span>📍</span> Disponible \u00e0 {city.name}
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-pingwash-navy leading-tight">
              Lavage auto \u00e9cologique{" "}
              <span className="text-gradient">\u00e0 {city.name}</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
              PINGWASH arrive \u00e0 {city.description} ! R\u00e9servez un laveur professionnel
              \u00e0 domicile ou au bureau. Voiture, moto ou v\u00e9lo — en 30 secondes.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#reserver"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-pingwash-blue hover:bg-pingwash-blue-dark rounded-xl transition-all shadow-lg shadow-pingwash-blue/30"
              >
                R\u00e9server \u00e0 {city.name}
              </Link>
              <Link
                href="/devenir-laveur"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-pingwash-navy bg-white border-2 border-gray-200 hover:border-pingwash-green rounded-xl transition-all"
              >
                Devenir laveur \u00e0 {city.name}
              </Link>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-black text-pingwash-navy text-center mb-10">
              Nos forfaits \u00e0 {city.name}
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { name: "Essentiel", price: 99, features: ["Lavage ext\u00e9rieur", "Jantes & pneus", "Vitres", "Produits \u00e9co"] },
                { name: "Premium", price: 149, popular: true, features: ["Tout Essentiel +", "Int\u00e9rieur complet", "Aspiration", "Parfum longue dur\u00e9e"] },
                { name: "Royal", price: 199, features: ["Tout Premium +", "Si\u00e8ges", "Hydrophobe", "Moteur", "IA 50 points"] },
              ].map((f) => (
                <div key={f.name} className={`relative p-6 rounded-2xl border-2 ${f.popular ? "border-pingwash-green shadow-lg" : "border-gray-200"}`}>
                  {f.popular && (
                    <span className="absolute -top-3 right-4 px-3 py-0.5 bg-pingwash-green text-white text-xs font-bold rounded-full">
                      Populaire
                    </span>
                  )}
                  <div className="text-3xl font-black text-pingwash-navy">{f.price}\u20ac</div>
                  <div className="text-lg font-bold text-pingwash-navy mt-1">{f.name}</div>
                  <div className="mt-4 space-y-2">
                    {f.features.map((feat) => (
                      <div key={feat} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="text-pingwash-green">✓</span> {feat}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Eco */}
        <section className="py-16 bg-pingwash-ice/30">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-black text-pingwash-navy mb-4">
              \ud83c\udf0d Pourquoi PINGWASH \u00e0 {city.name} ?
            </h2>
            <div className="grid sm:grid-cols-3 gap-6 mt-8">
              {[
                { icon: "💧", title: "99% d\u2019eau \u00e9conomis\u00e9e", desc: "5L au lieu de 200L par lavage" },
                { icon: "⚡", title: "Sous 30 minutes", desc: "Un laveur arrive chez vous" },
                { icon: "⭐", title: "4.9/5 de satisfaction", desc: "+2000 lavages r\u00e9alis\u00e9s" },
              ].map((item) => (
                <div key={item.title} className="p-6 bg-white rounded-2xl">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="font-bold text-pingwash-navy">{item.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
