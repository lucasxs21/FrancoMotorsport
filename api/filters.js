import axios from 'axios';

let carsCache = null;
let cacheTime = null;
const CACHE_DURATION = 5 * 60 * 1000;

async function getCarsData() {
  const now = Date.now();
  
  if (carsCache && cacheTime && (now - cacheTime) < CACHE_DURATION) {
    return carsCache;
  }
  
  const response = await axios.get('https://dataracing.com.ar/wp-content/uploads/cars_data.json');
  carsCache = response.data;
  cacheTime = now;
  return carsCache;
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const cars = await getCarsData();
    
    const marcas = [...new Set(cars.map(car => car.FABRICANTE))].filter(Boolean).sort();
    const modelos = [...new Set(cars.map(car => car.MODELO))].filter(Boolean).sort();
    const motores = [...new Set(cars.map(car => car.MOTOR))].filter(Boolean).sort();
    
    res.status(200).json({ marcas, modelos, motores });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Error al obtener filtros',
      message: error.message 
    });
  }
}