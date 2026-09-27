import { useAuthStore } from '../stores/authStore';
import { Link } from 'react-router-dom';
import { Heart, TrendingUp, Users, Calendar } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';

export default function Dashboard() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Bienvenue, {user?.name} !
          </h1>
          <p className="text-gray-600">
            Voici un aperçu de votre activité
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total des dons</p>
                <p className="text-3xl font-bold text-gray-900">0 DT</p>
              </div>
              <div className="p-3 bg-primary-100 rounded-full">
                <Heart className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Cas soutenus</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <div className="p-3 bg-secondary-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-secondary-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Personnes aidées</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Événements</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {user?.role === 'association' && (
              <Link to="/cases/create">
                <Button className="w-full">Créer un nouveau cas</Button>
              </Link>
            )}
            <Link to="/">
              <Button variant="outline" className="w-full">Explorer les cas</Button>
            </Link>
            <Link to="/events">
              <Button variant="outline" className="w-full">Voir les événements</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
