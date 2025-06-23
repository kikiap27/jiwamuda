import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, BookOpen, Quote } from 'lucide-react';

interface RoleModel {
  id: number;
  name: string;
  field: string;
  nationality: string;
  image: string;
  description: string;
  achievement: string;
  quote: string;
  category: string;
  inspiration: string;
}

const RoleModel: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  const roleModels: RoleModel[] = [
    {
      id: 1,
      name: "B.J. Habibie",
      field: "Teknik Dirgantara & Presiden Indonesia",
      nationality: "Indonesia",
      image: "👨‍✈️",
      description: "Ahli teknik dirgantara Indonesia yang menjadi Presiden RI ke-3. Beliau dikenal sebagai 'Bapak Teknologi Indonesia'.",
      achievement: "Menciptakan pesawat N-250 dan berkontribusi besar dalam teknologi Indonesia",
      quote: "Mulailah dengan mimpi, karena mimpi adalah awal dari semua pencapaian.",
      category: "teknologi",
      inspiration: "Membuktikan bahwa orang Indonesia bisa bersaing di kancah internasional dalam bidang teknologi"
    },
    {
      id: 2,
      name: "Najwa Shihab",
      field: "Jurnalis & Presenter",
      nationality: "Indonesia",
      image: "👩‍💼",
      description: "Jurnalis dan presenter televisi Indonesia yang dikenal dengan program 'Mata Najwa' dan jurnalisme investigatifnya.",
      achievement: "Menjadi salah satu jurnalis paling berpengaruh di Indonesia",
      quote: "Pertanyaan yang tepat lebih penting daripada jawaban yang sempurna.",
      category: "komunikasi",
      inspiration: "Menunjukkan bahwa perempuan bisa memimpin dalam dunia jurnalisme dan media"
    },
    {
      id: 3,
      name: "Susi Pudjiastuti",
      field: "Entrepreneur & Menteri",
      nationality: "Indonesia",
      image: "👩‍💼",
      description: "Pengusaha sukses dan mantan Menteri Kelautan dan Perikanan yang tegas dalam memberantas illegal fishing.",
      achievement: "Membangun bisnis penerbangan dari nol dan menjadi menteri berpengaruh",
      quote: "Jangan takut bermimpi besar, tapi jangan lupa untuk bekerja keras.",
      category: "bisnis",
      inspiration: "Membuktikan bahwa tanpa latar belakang pendidikan tinggi, seseorang tetap bisa sukses dengan kerja keras"
    },
    {
      id: 4,
      name: "Raditya Dika",
      field: "Penulis & Content Creator",
      nationality: "Indonesia",
      image: "👨‍💻",
      description: "Penulis, komedian, dan content creator yang berhasil mengubah hobi menulis menjadi karir yang sukses.",
      achievement: "Menulis puluhan buku best-seller dan memiliki jutaan pengikut",
      quote: "Kreativitas tidak mengenal batasan, yang penting berani memulai.",
      category: "kreatif",
      inspiration: "Menunjukkan bahwa passion dalam berkreativitas bisa menjadi profesi yang menguntungkan"
    },
    {
      id: 5,
      name: "Gita Savitri",
      field: "Content Creator & Researcher",
      nationality: "Indonesia",
      image: "👩‍🎓",
      description: "PhD holder dan content creator yang berhasil mengombinasikan dunia akademik dengan konten edukasi di media sosial.",
      achievement: "Meraih gelar PhD dan memiliki jutaan subscriber di YouTube",
      quote: "Pendidikan adalah investasi terbaik untuk masa depan.",
      category: "pendidikan",
      inspiration: "Membuktikan bahwa belajar tinggi dan menjadi content creator bisa berjalan bersama"
    },
    {
      id: 6,
      name: "Teman Macet",
      field: "Music Producer & Entrepreneur",
      nationality: "Indonesia",
      image: "🎵",
      description: "Produser musik dan entrepreneur yang sukses membangun brand musik dari bedroom producer menjadi label ternama.",
      achievement: "Membangun label musik independen yang sukses di Indonesia",
      quote: "Passion yang konsisten akan mengalahkan talent yang tidak diasah.",
      category: "kreatif",
      inspiration: "Menunjukkan bahwa industri kreatif musik bisa menjadi bisnis yang berkelanjutan"
    }
  ];

  const categories = [
    { id: 'all', label: 'Semua', icon: '🌟' },
    { id: 'teknologi', label: 'Teknologi', icon: '💻' },
    { id: 'komunikasi', label: 'Komunikasi', icon: '📺' },
    { id: 'bisnis', label: 'Bisnis', icon: '💼' },
    { id: 'kreatif', label: 'Kreatif', icon: '🎨' },
    { id: 'pendidikan', label: 'Pendidikan', icon: '📚' }
  ];

  const filteredRoleModels = selectedCategory === 'all' 
    ? roleModels 
    : roleModels.filter(person => person.category === selectedCategory);

  const toggleFavorite = (id: number) => {
    setFavoriteIds(prev => 
      prev.includes(id) 
        ? prev.filter(fId => fId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="p-4 pb-20 min-h-screen bg-gradient-to-br from-lifeguide-cream to-lifeguide-light-blue">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Star className="w-6 h-6 text-lifeguide-blue mr-2" />
          <h1 className="text-xl font-bold text-lifeguide-blue">Role Model</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Temukan inspirasi dari tokoh-tokoh sukses Indonesia 🇮🇩
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex overflow-x-auto gap-2 pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-1 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'bg-lifeguide-blue text-white'
                  : 'bg-white text-lifeguide-blue border border-lifeguide-blue/30'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Role Models Grid */}
      <div className="space-y-4">
        {filteredRoleModels.map((person, index) => (
          <Card key={person.id} className="lifeguide-shadow animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="text-4xl">{person.image}</div>
                  <div className="flex-1">
                    <CardTitle className="text-lg text-lifeguide-blue">{person.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{person.field}</p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {person.nationality}
                    </Badge>
                  </div>
                </div>
                <button
                  onClick={() => toggleFavorite(person.id)}
                  className="p-1"
                >
                  <Heart 
                    className={`w-5 h-5 ${
                      favoriteIds.includes(person.id) 
                        ? 'text-red-500 fill-red-500' 
                        : 'text-muted-foreground'
                    }`} 
                  />
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-700">{person.description}</p>
              
              <div className="bg-lifeguide-cream p-3 rounded-lg">
                <div className="flex items-start space-x-2">
                  <BookOpen className="w-4 h-4 text-lifeguide-blue mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-lifeguide-blue text-sm">Pencapaian:</h4>
                    <p className="text-sm text-gray-700 mt-1">{person.achievement}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border-l-4 border-lifeguide-blue">
                <div className="flex items-start space-x-2">
                  <Quote className="w-4 h-4 text-lifeguide-blue mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-700 italic">"{person.quote}"</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-card p-3 rounded-lg">
                <h4 className="font-medium text-lifeguide-blue text-sm mb-2">Kenapa Inspiratif:</h4>
                <p className="text-sm text-gray-700">{person.inspiration}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRoleModels.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🔍</div>
          <p className="text-muted-foreground">Tidak ada role model di kategori ini</p>
        </div>
      )}

      {/* Inspirational Message */}
      <Card className="mt-6 gradient-card lifeguide-shadow">
        <CardContent className="p-4 text-center">
          <div className="text-2xl mb-2">✨</div>
          <p className="text-sm text-gray-700">
            "Setiap orang sukses pernah memulai dari nol. Yang membedakan adalah konsistensi dan kerja keras mereka!"
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleModel;