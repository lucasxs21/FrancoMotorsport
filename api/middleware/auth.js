const jwt = require('jsonwebtoken');
const { registrarAuditoria, obtenerIP, obtenerUserAgent } = require('../utils/auditLogger');

const JWT_SECRET = process.env.JWT_SECRET || 'tu-secreto-super-seguro-cambiame';

async function verificarToken(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      await registrarAuditoria({
        emailUsuario: 'Desconocido',
        accion: 'ACCESO_DENEGADO',
        recurso: req.path || req.url,
        detalles: { razon: 'Token no proporcionado' },
        ipAddress: obtenerIP(req),
        userAgent: obtenerUserAgent(req),
        resultado: 'error'
      });

      return res.status(401).json({ 
        error: 'Token no proporcionado' 
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    await registrarAuditoria({
      emailUsuario: 'Desconocido',
      accion: 'ACCESO_DENEGADO',
      recurso: req.path || req.url,
      detalles: { razon: 'Token inválido', error: error.message },
      ipAddress: obtenerIP(req),
      userAgent: obtenerUserAgent(req),
      resultado: 'error'
    });

    return res.status(401).json({ 
      error: 'Token inválido o expirado' 
    });
  }
}

module.exports = { verificarToken };