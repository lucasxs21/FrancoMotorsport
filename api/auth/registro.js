const bcrypt = require('bcrypt');
const supabase = require('../config/supabase');
const { registrarAuditoria, obtenerIP, obtenerUserAgent } = require('../utils/auditLogger');

module.exports = async (req, res) => {
  // CORS
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

  try {
    const { email, password, nombre } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y password son requeridos' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const { data: usuario, error } = await supabase
      .from('usuarios')
      .insert({
        email: email,
        password_hash: passwordHash,
        nombre: nombre
      })
      .select()
      .single();

    if (error) {
      await registrarAuditoria({
        emailUsuario: email,
        accion: 'REGISTRO',
        detalles: { error: error.message },
        ipAddress: obtenerIP(req),
        userAgent: obtenerUserAgent(req),
        resultado: 'error'
      });

      return res.status(400).json({ error: 'Error al crear usuario: ' + error.message });
    }

    await registrarAuditoria({
      usuarioId: usuario.id,
      emailUsuario: email,
      accion: 'REGISTRO',
      detalles: { nombre: nombre },
      ipAddress: obtenerIP(req),
      userAgent: obtenerUserAgent(req),
      resultado: 'exito'
    });

    res.status(201).json({ 
      mensaje: 'Usuario registrado exitosamente',
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};