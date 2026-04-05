const supabase = require('./_supabase.js');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'POST') {
      const { skills, interests, education_level } = req.body;
      if (!skills || !interests) {
        return res.status(400).json({ error: 'Skills and interests are required' });
      }

      const { data: allCareers, error } = await supabase
        .from('careers')
        .select('*');
      if (error) throw error;

      const skillsArr = skills.toLowerCase().split(',').map(s => s.trim());
      const interestsArr = interests.toLowerCase().split(',').map(s => s.trim());

      const scored = allCareers.map(career => {
        const careerSkills = (career.skills_required || '').toLowerCase();
        const careerTags = (career.tags || '').toLowerCase();
        const careerDesc = (career.description || '').toLowerCase();
        
        let score = 0;
        let matchReasons = [];

        skillsArr.forEach(skill => {
          if (careerSkills.includes(skill)) { score += 15; matchReasons.push('Your skill in ' + skill + ' is directly relevant'); }
          else if (careerDesc.includes(skill)) { score += 8; matchReasons.push(skill + ' applies to this field'); }
          else if (careerTags.includes(skill)) { score += 10; matchReasons.push(skill + ' is valued in this career'); }
        });

        interestsArr.forEach(interest => {
          if (careerTags.includes(interest)) { score += 12; matchReasons.push('Aligns with your interest in ' + interest); }
          else if (careerDesc.includes(interest)) { score += 8; matchReasons.push('Connects to your passion for ' + interest); }
          else if (careerSkills.includes(interest)) { score += 6; matchReasons.push('Your interest in ' + interest + ' is an asset here'); }
        });

        if (career.demand_level === 'High') score += 10;
        else if (career.demand_level === 'Medium') score += 5;
        if (career.growth_trend === 'Increasing') score += 8;
        else if (career.growth_trend === 'Stable') score += 4;

        if (education_level) {
          const eduLower = education_level.toLowerCase();
          const careerEdu = (career.education_path || '').toLowerCase();
          if (careerEdu.includes(eduLower)) { score += 5; matchReasons.push('Fits your ' + education_level + ' background'); }
        }

        const maxPossible = (skillsArr.length * 15) + (interestsArr.length * 12) + 18;
        const matchPct = Math.min(98, Math.max(35, Math.round((score / Math.max(maxPossible, 1)) * 100)));

        return {
          ...career,
          match_percentage: matchPct,
          match_reasons: matchReasons.slice(0, 3),
          short_reason: matchReasons[0] || 'Great career option based on your profile'
        };
      });

      scored.sort((a, b) => b.match_percentage - a.match_percentage);
      const top = scored.slice(0, 8);

      return res.status(200).json(top);
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
};
