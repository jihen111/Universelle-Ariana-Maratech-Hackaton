import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { casesAPI } from '../services/api';
import { Search, Filter, Heart, Users, TrendingUp, ArrowRight } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';

const categories = [
  { value: 'all', label: 'Tous', color: 'primary' },
  { value: 'health', label: 'Santé', color: 'danger' },
  { value: 'disability', label: 'Handicap', color: 'info' },
  { value: 'children', label: 'Enfants', color: 'warning' },
  { value: 'education', label: 'Éducation', color: 'success' },
  { value: 'renovation', label: 'Rénovation', color: 'secondary' },
  { value: 'emergency', label: 'Urgence', color: 'danger' },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading } = useQuery(
    ['cases', selectedCategory, searchQuery],
    () => casesAPI.getAll({
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      search: searchQuery || undefined,
      limit: 12
    })
  );

  const cases = data?.data?.cases || [];

  const getProgressPercentage = (current, target) => {
    if (!target) return 0;
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Donnez de la visibilité à l'invisible
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Connectez les associations aux donateurs pour un impact social mesurable et transparent
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                  Commencer maintenant
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/events">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Découvrir les événements
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-primary-100 rounded-full">
                  <Heart className="h-8 w-8 text-primary-600" />
                </div>
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">+300 000</div>
              <div className="text-gray-600">Bénéficiaires aidés</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-secondary-100 rounded-full">
                  <Users className="h-8 w-8 text-secondary-600" />
                </div>
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">44</div>
              <div className="text-gray-600">Membres actifs</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-green-100 rounded-full">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">100%</div>
              <div className="text-gray-600">Transparence garantie</div>
            </div>
          </div>
        </div>
      </section>

      {/* Cases Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Cas sociaux en cours
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez les histoires qui ont besoin de votre soutien
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un cas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cases Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600">Chargement des cas...</p>
            </div>
          ) : cases.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Aucun cas social trouvé</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cases.map((caseItem) => (
                <Link key={caseItem.id} to={`/cases/${caseItem.id}`}>
                  <Card hover className="h-full flex flex-col">
                    {/* Image */}
                    {caseItem.main_photo_url && (
                      <img
                        src={caseItem.main_photo_url}
                        alt={caseItem.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}

                    {/* Category & Urgent badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant={caseItem.is_urgent ? 'danger' : 'primary'}>
                        {caseItem.category}
                      </Badge>
                      {caseItem.is_urgent && (
                        <Badge variant="danger">🔥 Urgent</Badge>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                      {caseItem.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                      {caseItem.description}
                    </p>

                    {/* Progress */}
                    {caseItem.target_amount > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Collecté</span>
                          <span className="font-semibold text-primary-600">
                            {caseItem.current_amount} / {caseItem.target_amount} DT
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${getProgressPercentage(caseItem.current_amount, caseItem.target_amount)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* CTA */}
                    <Button className="w-full" size="sm">
                      Soutenir maintenant
                    </Button>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-4">
            Prêt à faire la différence ?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Rejoignez notre communauté et aidez ceux qui en ont besoin
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
              Créer un compte gratuitement
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
