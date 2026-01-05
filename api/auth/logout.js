const { verificarToken } = require('../middleware/auth');
const { registrarAuditoria, obtenerIP, obtenerUserAgent } = require('../utils/auditLogger');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // Verificar token manualmente
  await verificarToken(req, res, async () => {
    try {
      await registrarAuditoria({
        usuarioId: req.usuario.id,
        emailUsuario: req.usuario.email,
        accion: 'LOGOUT',
        ipAddress: obtenerIP(req),
        userAgent: obtenerUserAgent(req),
        resultado: 'exito'
      });

      res.json({ mensaje: 'Logout exitoso' });
    } catch (error) {
      console.error('Error en logout:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
};
