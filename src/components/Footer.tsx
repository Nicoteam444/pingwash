import Link from "next/link";
import PingwashLogo from "./PingwashLogo";

export default function Footer() {
  return (
    <footer className="bg-pingwash-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <PingwashLogo className="h-8 brightness-0 invert" />
            <p className="mt-4 text-sm text-gray-400 max-w-md">
              Le laveur qui protège la banquise. Lavage écologique de voitures, motos et vélos à domicile ou en entreprise.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-pingwash-green">
              <span>🌍</span>
              <span>Jusqu&apos;à 99% d&apos;eau économisée par lavage</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">Clients</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#comment-ca-marche" className="hover:text-white transition-colors">Comment ça marche</a></li>
              <li><a href="#forfaits" className="hover:text-white transition-colors">Nos forfaits</a></li>
              <li><Link href="/connexion" className="hover:text-white transition-colors">Se connecter</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">Laveurs</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/devenir-laveur" className="hover:text-white transition-colors">Devenir laveur</Link></li>
              <li><Link href="/connexion" className="hover:text-white transition-colors">Espace laveur</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">&copy; 2026 PINGWASH. Tous droits réservés.</p>
          <div className="flex gap-6 text-xs text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-white transition-colors">CGU</a>
            <a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
