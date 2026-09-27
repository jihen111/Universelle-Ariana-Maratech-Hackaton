import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { casesAPI } from '../services/api';
import { Calendar, MapPin, Heart, ExternalLink } from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';

export default function CaseDetail() {
  const { id } = useParams();
  const { data, isLoading } = useQuery(['case', id], () => casesAPI.getById(id));
  
  const caseItem = data?.data?.case;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!caseItem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Cas non trouvé</p>
      </div>
    );
  }

  const progress = caseItem.target_amount > 0 
    ? Math.min((caseItem.current_amount / caseItem.target_amount) * 100, 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              {caseItem.main_photo_url && (
                <img
                  src={caseItem.main_photo_url}
                  alt={caseItem.title}
                  className="w-full h-96 object-cover rounded-lg mb-6"
                />
              )}
              
              <div className="flex items-center gap-2 mb-4">
                <Badge variant={caseItem.is_urgent ? 'danger' : 'primary'}>
                  {caseItem.category}
                </Badge>
                {caseItem.is_urgent && <Badge variant="danger">🔥 Urgent</Badge>}
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {caseItem.title}
              </h1>

              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line">
                  {caseItem.description}
                </p>
              </div>
            </Card>

            {/* Photos Gallery */}
            {caseItem.photos && caseItem.photos.length > 0 && (
              <Card>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Galerie photos</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {caseItem.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo.photo_url}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Progression</h3>
              
              {caseItem.target_amount > 0 && (
                <>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Collecté</span>
                      <span className="font-semibold text-primary-600">
                        {progress.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-primary-600 h-3 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {caseItem.current_amount} DT
                      </p>
                      <p className="text-sm text-gray-600">
                        sur {caseItem.target_amount} DT
                      </p>
                    </div>
                  </div>
                </>
              )}

              {caseItem.chaqaqa_link && (
                <a
                  href={caseItem.chaqaqa_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full">
                    <Heart className="mr-2 h-5 w-5" />
                    Soutenir via Cha9a9a
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              )}
            </Card>

            <Card>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Informations</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2 text-sm">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-600">Publié le</p>
                    <p className="font-medium text-gray-900">
                      {new Date(caseItem.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-600">Association</p>
                    <p className="font-medium text-gray-900">
                      {caseItem.association_name || 'Non spécifié'}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
