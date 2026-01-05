const supabase = require('../config/supabase');
const { verificarToken } = require('../middleware/auth');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  await verificarToken(req, res, async () => {
    try {
      const { page = 1, limit = 50, accion, email } = req.query;
      const offset = (page - 1) * limit;

      let query = supabase
        .from('audit_logs_resumen')
        .select('*', { count: 'exact' });

      if (accion) {
        query = query.eq('accion', accion);
      }
      if (email) {
        query = query.ilike('email_usuario', `%${email}%`);
      }

      const { data: logs, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + parseInt(limit) - 1);

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.json({ 
        logs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          totalPages: Math.ceil(count / limit)
        }
      });
    } catch (error) {
      console.error('Error al obtener logs:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
};