module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  res.status(200).json({ 
    message: '✅ API funcionando correctamente en Vercel!',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  });
};