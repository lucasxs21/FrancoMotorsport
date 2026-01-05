const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');
const { registrarAuditoria, obtenerIP, obtenerUserAgent } = require('../utils/auditLogger');

const JWT_SECRET = process.env.JWT_SECRET || 'tu-secreto-super-seguro-cambiame';

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

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y password son requeridos' });
    }

    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .eq('activo', true)
      .single();

    if (error || !usuario) {
      await registrarAuditoria({
        emailUsuario: email,
        accion: 'LOGIN',
        detalles: { razon: 'Usuario no encontrado' },
        ipAddress: obtenerIP(req),
        userAgent: obtenerUserAgent(req),
        resultado: 'error'
      });

      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password_hash);

    if (!passwordValido) {
      await registrarAuditoria({
        usuarioId: usuario.id,
        emailUsuario: email,
        accion: 'LOGIN',
        detalles: { razon: 'Password incorrecto' },
        ipAddress: obtenerIP(req),
        userAgent: obtenerUserAgent(req),
        resultado: 'error'
      });

      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { 
        id: usuario.id, 
        email: usuario.email,
        nombre: usuario.nombre
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    await registrarAuditoria({
      usuarioId: usuario.id,
      emailUsuario: email,
      accion: 'LOGIN',
      detalles: { nombre: usuario.nombre },
      ipAddress: obtenerIP(req),
      userAgent: obtenerUserAgent(req),
      resultado: 'exito'
    });

    res.json({
      mensaje: 'Login exitoso',
      token: token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};