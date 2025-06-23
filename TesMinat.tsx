
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, Brain, Lightbulb } from 'lucide-react';

const TesMinat: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      question: "Kamu lebih suka aktivitas yang mana?",
      options: [
        "Menggambar dan membuat desain",
        "Menghitung dan menganalisis data",
        "Berbicara dan berinteraksi dengan orang",
        "Menulis dan membaca"
      ]
    },
    {
      question: "Saat weekend, kamu paling senang...",
      options: [
        "Membuat karya seni atau craft",
        "Bermain puzzle atau game strategi",
        "Mengorganisir acara bersama teman",
        "Membaca buku atau menulis diary"
      ]
    },
    {
      question: "Mata pelajaran favorit kamu di sekolah?",
      options: [
        "Seni Budaya atau Prakarya",
        "Matematika atau IPA",
        "Bahasa atau Sosiologi",
        "Sejarah atau Sastra"
      ]
    },
    {
      question: "Jika bisa memilih, kamu ingin bekerja di...",
      options: [
        "Studio desain atau galeri seni",
        "Laboratorium atau perusahaan teknologi",
        "Kantor dengan banyak meeting dan presentasi",
        "Perpustakaan atau penerbit"
      ]
    },
    {
      question: "Cara kamu menyelesaikan masalah?",
      options: [
        "Mencari solusi kreatif dan unik",
        "Menganalisis data dan fakta",
        "Berdiskusi dengan orang lain",
        "Merenung dan mencari referensi"
      ]
    }
  ];

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Analyze results
      setShowResults(true);
    }
  };

  const analyzeResults = () => {
    const scores = { creative: 0, analytical: 0, social: 0, literary: 0 };
    
    answers.forEach((answer, index) => {
      const optionIndex = questions[index].options.indexOf(answer);
      switch (optionIndex) {
        case 0: scores.creative++; break;
        case 1: scores.analytical++; break;
        case 2: scores.social++; break;
        case 3: scores.literary++; break;
      }
    });

    const maxScore = Math.max(...Object.values(scores));
    const dominantType = Object.keys(scores).find(key => scores[key as keyof typeof scores] === maxScore);

    const recommendations = {
      creative: {
        title: "Kreatif & Artistik",
        careers: ["Desainer Grafis", "Animator", "Arsitek"],
        description: "Kamu memiliki jiwa seni yang tinggi dan suka menciptakan hal-hal baru!"
      },
      analytical: {
        title: "Analitis & Logis",
        careers: ["Data Scientist", "Engineer", "Dokter"],
        description: "Kamu pandai berpikir sistematis dan suka memecahkan masalah dengan logika!"
      },
      social: {
        title: "Sosial & Komunikatif",
        careers: ["HRD", "Marketing", "Psikolog"],
        description: "Kamu punya kemampuan komunikasi yang baik dan suka berinteraksi dengan orang!"
      },
      literary: {
        title: "Literatur & Penelitian",
        careers: ["Penulis", "Peneliti", "Editor"],
        description: "Kamu suka dengan dunia kata-kata dan memiliki kemampuan analisis yang mendalam!"
      }
    };

    return recommendations[dominantType as keyof typeof recommendations];
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
  };

  if (showResults) {
    const result = analyzeResults();
    return (
      <div className="p-4 pb-20 min-h-screen bg-gradient-to-br from-lifeguide-cream to-lifeguide-light-blue">
        <Card className="mb-6 lifeguide-shadow">
          <CardHeader className="text-center">
            <Lightbulb className="w-12 h-12 text-lifeguide-blue mx-auto mb-2" />
            <CardTitle className="text-lifeguide-blue">Hasil Tes Minat & Bakat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-bold text-lifeguide-blue mb-2">
                {result.title}
              </h3>
              <p className="text-muted-foreground mb-4">
                {result.description}
              </p>
            </div>

            <div className="bg-gradient-card p-4 rounded-lg">
              <h4 className="font-semibold mb-3 text-lifeguide-blue">Karir yang Cocok Untukmu:</h4>
              <div className="grid gap-2">
                {result.careers.map((career, index) => (
                  <div key={index} className="bg-white p-3 rounded-md lifeguide-shadow">
                    <span className="font-medium text-gray-800">{career}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <Button 
                onClick={resetTest}
                className="w-full bg-lifeguide-blue hover:bg-lifeguide-teal"
              >
                Ulangi Tes
              </Button>
              <Button 
                variant="outline"
                className="w-full border-lifeguide-blue text-lifeguide-blue hover:bg-lifeguide-blue hover:text-white"
              >
                Simpan Hasil & Lanjut ke Goal Setting
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="p-4 pb-20 min-h-screen bg-gradient-to-br from-lifeguide-cream to-lifeguide-light-blue">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Brain className="w-6 h-6 text-lifeguide-blue mr-2" />
          <h1 className="text-xl font-bold text-lifeguide-blue">Tes Minat & Bakat</h1>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-muted-foreground mt-2">
          Pertanyaan {currentQuestion + 1} dari {questions.length}
        </p>
      </div>

      <Card className="lifeguide-shadow animate-fade-in">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            {questions[currentQuestion].question}
          </h2>
          
          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start text-left h-auto p-4 border-lifeguide-blue/20 hover:bg-lifeguide-blue hover:text-white transition-colors"
                onClick={() => handleAnswer(option)}
              >
                <span className="flex items-center justify-between w-full">
                  {option}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Jawab dengan jujur sesuai dengan minat dan kepribadian kamu ya! 😊
        </p>
      </div>
    </div>
  );
};

export default TesMinat;
