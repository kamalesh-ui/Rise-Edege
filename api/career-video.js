const supabase = require('./_supabase.js');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { career_id } = req.query;
      if (!career_id) return res.status(400).json({ error: 'career_id required' });

      const { data: career, error } = await supabase
        .from('careers')
        .select('id, name, video_script, skills_required, demand_level, growth_trend, future_summary')
        .eq('id', parseInt(career_id))
        .single();

      if (error) throw error;

      const script = career.video_script || '';
      const sentences = script.match(/[^.!?]+[.!?]+/g) || [script];
      const segmentDuration = 100 / Math.max(sentences.length, 1);

      const segments = sentences.map((sentence, i) => ({
        text: sentence.trim(),
        startPercent: Math.round(i * segmentDuration),
        endPercent: Math.round((i + 1) * segmentDuration),
      }));

      return res.status(200).json({
        career_id: career.id,
        career_name: career.name,
        video_url: '/videos/career-' + career.id + '.mp4',
        script: career.video_script,
        segments: segments,
      });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
};
