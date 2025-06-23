
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { answers } = await req.json()
    
    // Get Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user from JWT
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (!user) {
      throw new Error('User not authenticated')
    }

    // Analyze answers and suggest careers
    const careerSuggestions = analyzeAnswers(answers)
    
    // Save test results
    const { error } = await supabaseClient
      .from('interest_test_results')
      .insert({
        user_id: user.id,
        answers: answers,
        career_suggestions: careerSuggestions
      })

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true, careerSuggestions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})

function analyzeAnswers(answers: Record<string, any>) {
  // Simple AI logic to analyze answers and suggest careers
  const interests = {
    creative: 0,
    analytical: 0,
    social: 0,
    technical: 0,
    business: 0
  }

  // Analyze answers (simplified logic)
  Object.values(answers).forEach((answer: any) => {
    if (typeof answer === 'string') {
      const lowerAnswer = answer.toLowerCase()
      if (lowerAnswer.includes('menggambar') || lowerAnswer.includes('seni') || lowerAnswer.includes('musik')) {
        interests.creative++
      }
      if (lowerAnswer.includes('matematika') || lowerAnswer.includes('sains') || lowerAnswer.includes('penelitian')) {
        interests.analytical++
      }
      if (lowerAnswer.includes('membantu') || lowerAnswer.includes('mengajar') || lowerAnswer.includes('sosial')) {
        interests.social++
      }
      if (lowerAnswer.includes('komputer') || lowerAnswer.includes('teknologi') || lowerAnswer.includes('coding')) {
        interests.technical++
      }
      if (lowerAnswer.includes('bisnis') || lowerAnswer.includes('wirausaha') || lowerAnswer.includes('penjualan')) {
        interests.business++
      }
    }
  })

  // Determine top interests
  const sortedInterests = Object.entries(interests).sort((a, b) => b[1] - a[1])
  
  const careerMap = {
    creative: ['Desainer Grafis', 'Arsitek', 'Musisi', 'Penulis', 'Animator'],
    analytical: ['Ilmuwan Data', 'Peneliti', 'Dokter', 'Insinyur', 'Matematikawan'],
    social: ['Guru', 'Psikolog', 'Pekerja Sosial', 'Konselor', 'Diplomat'],
    technical: ['Software Engineer', 'Cybersecurity Specialist', 'AI Engineer', 'Game Developer', 'DevOps Engineer'],
    business: ['Pengusaha', 'Marketing Manager', 'Financial Analyst', 'Consultant', 'Sales Manager']
  }

  // Return top 3 career suggestions
  const topInterest = sortedInterests[0][0] as keyof typeof careerMap
  const secondInterest = sortedInterests[1][0] as keyof typeof careerMap
  
  const suggestions = [
    ...careerMap[topInterest].slice(0, 2),
    careerMap[secondInterest][0]
  ]

  return suggestions
}
