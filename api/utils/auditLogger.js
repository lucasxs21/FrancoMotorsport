const supabase = require('../config/supabase');

async function registrarAuditoria({
  usuarioId = null,
  emailUsuario,
  accion,
  recurso = null,
  detalles = null,
  ipAddress = null,
  userAgent = null,
  resultado = 'exito'
}) {
  try {
    const { data, error } = await supabase
      .from('audit_logs')
      .insert({
        usuario_id: usuarioId,
        email_usuario: emailUsuario,
        accion: accion,
        recurso: recurso,
        detalles: detalles,
        ip_address: ipAddress,
        user_agent: userAgent,
        resultado: resultado
      });

    if (error) {
      console.error('Error al registrar auditoría:', error);
    }
    
    return { success: !error, data };
  } catch (err) {
    console.error('Error en registrarAuditoria:', err);
    return { success: false, error: err.message };
  }
}

function obtenerIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0] || 
         req.headers['x-real-ip'] || 
         req.connection?.remoteAddress || 
         req.socket?.remoteAddress ||
         'Desconocida';
}

function obtenerUserAgent(req) {
  return req.headers['user-agent'] || 'Desconocido';
}

module.exports = {
  registrarAuditoria,
  obtenerIP,
  obtenerUserAgent
};