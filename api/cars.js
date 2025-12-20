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
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const cars = await getCarsData();
    let filteredCars = cars;
    
    if (req.method === 'POST') {
      const { marca, modelo, motor } = req.body;
      
      if (marca) filteredCars = filteredCars.filter(car => car.FABRICANTE === marca);
      if (modelo) filteredCars = filteredCars.filter(car => car.MODELO === modelo);
      if (motor) filteredCars = filteredCars.filter(car => car.MOTOR === motor);
    }
    
    const carsWithPrices = filteredCars.map(car => {
      const d_stg1 = parseFloat(car.D_STG1) || 0;
      const d_stg2 = parseFloat(car.D_STG2) || 0;
      
      return {
        ...car,
        STG1: d_stg1 > 0 ? d_stg1 + 100000 : null,
        STG2: d_stg2 > 0 ? d_stg2 + 100000 : null,
        STG3: d_stg1 > 0 ? (d_stg1 * 1.5) + 120000 : null
      };
    });
    
    res.status(200).json(carsWithPrices);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener datos', message: error.message });
  }
}