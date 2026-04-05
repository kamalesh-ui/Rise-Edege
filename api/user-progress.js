const supabase = require('./_supabase.js');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { session_id } = req.query;
      if (!session_id) return res.status(400).json({ error: 'session_id required' });
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('session_id', session_id);
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const { session_id, career_id, milestone_key, completed } = req.body;
      const { data: existing } = await supabase
        .from('user_progress')
        .select('*')
        .eq('session_id', session_id)
        .eq('career_id', career_id)
        .eq('milestone_key', milestone_key)
        .single();
      
      if (existing) {
        const { data, error } = await supabase
          .from('user_progress')
          .update({ completed: completed })
          .eq('id', existing.id)
          .select()
          .single();
        if (error) throw error;
        return res.status(200).json(data);
      }

      const { data, error } = await supabase
        .from('user_progress')
        .insert({ session_id: session_id, career_id: career_id, milestone_key: milestone_key, completed: completed })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
};
