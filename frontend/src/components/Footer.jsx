import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="h-6 w-6 text-primary-500" />
              <span className="text-white font-bold text-lg">Universelle Ariana</span>
            </div>
            <p className="text-sm text-gray-400">
              Plateforme numérique solidaire connectant les associations aux donateurs pour un impact social mesurable.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-primary-500 transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-sm hover:text-primary-500 transition-colors">
                  Événements
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-sm hover:text-primary-500 transition-colors">
                  Devenir association
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Légal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm hover:text-primary-500 transition-colors">
                  Conditions d'utilisation
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary-500 transition-colors">
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary-500 transition-colors">
                  Mentions légales
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-primary-500" />
                <a href="mailto:universellecellulearianna@gmail.com" className="hover:text-primary-500 transition-colors">
                  universellecellulearianna@gmail.com
                </a>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-primary-500" />
                <a href="tel:95403001" className="hover:text-primary-500 transition-colors">
                  95403001
                </a>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-primary-500" />
                <span>Ariana, Tunisie</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Universelle Cellule Ariana. Tous droits réservés.</p>
          <p className="mt-2">Développé avec ❤️ pour Maratech 2026</p>
        </div>
      </div>
    </footer>
  );
}
