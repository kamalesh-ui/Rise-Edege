const supabase = require('./_supabase.js');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { id } = req.query;
      if (id) {
        const { data, error } = await supabase
          .from('careers')
          .select('*')
          .eq('id', parseInt(id))
          .single();
        if (error) throw error;
        return res.status(200).json(data);
      }
      const { data, error } = await supabase
        .from('careers')
        .select('*')
        .order('id', { ascending: true });
      if (error) throw error;
      return res.status(200).json(data);
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
};
