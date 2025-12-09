// const express = require('express');
// const axios = require('axios');
// const path = require('path');

// const app = express();
// const PORT = 3000;

// // Middleware
// app.use(express.json());
// app.use(express.static('public'));

// // Función para calcular precios o retornar "Consultar"
// const calculatePrice = (value, basePrice) => {
//   const parsed = parseFloat(value);
//   if (!value || parsed === 0 || isNaN(parsed)) {
//     return 'Consultar';
//   }
//   return parsed + basePrice;
// };

// // Endpoint para obtener datos de autos
// app.get('/api/cars', async (req, res) => {
//   try {
//     const response = await axios.get('https://dataracing.com.ar/wp-content/uploads/cars_data.json');
//     const cars = response.data;
    
//     // Calcular precios
//     const carsWithPrices = cars.map(car => ({
//       ...car,
//       STG1: calculatePrice(car.D_STG1, 100000),
//       STG2: calculatePrice(car.D_STG2, 100000),
//       STG3: calculatePrice(car.D_STG1, 0) === 'Consultar' 
//         ? 'Consultar' 
//         : (parseFloat(car.D_STG1) * 1.5) + 120000
//     }));
    
//     res.json(carsWithPrices);
//   } catch (error) {
//     console.error('Error fetching car data:', error);
//     res.status(500).json({ error: 'Error al obtener datos de autos' });
//   }
// });

// // Endpoint para obtener filtros únicos
// app.get('/api/filters', async (req, res) => {
//   try {
//     const response = await axios.get('https://dataracing.com.ar/wp-content/uploads/cars_data.json');
//     const cars = response.data;
    
//     const marcas = [...new Set(cars.map(car => car.FABRICANTE))].sort();
//     const modelos = [...new Set(cars.map(car => car.MODELO))].sort();
//     const motores = [...new Set(cars.map(car => car.MOTOR))].sort();
    
//     res.json({ marcas, modelos, motores });
//   } catch (error) {
//     console.error('Error fetching filters:', error);
//     res.status(500).json({ error: 'Error al obtener filtros' });
//   }
// });

// // Endpoint para filtrar autos
// app.post('/api/cars/filter', async (req, res) => {
//   try {
//     const { marca, modelo, motor } = req.body;
//     const response = await axios.get('https://dataracing.com.ar/wp-content/uploads/cars_data.json');
//     let cars = response.data;
    
//     // Aplicar filtros
//     if (marca) {
//       cars = cars.filter(car => car.FABRICANTE === marca);
//     }
//     if (modelo) {
//       cars = cars.filter(car => car.MODELO === modelo);
//     }
//     if (motor) {
//       cars = cars.filter(car => car.MOTOR === motor);
//     }
    
//     // Calcular precios
//     const carsWithPrices = cars.map(car => ({
//       ...car,
//       STG1: calculatePrice(car.D_STG1, 100000),
//       STG2: calculatePrice(car.D_STG2, 100000),
//       STG3: calculatePrice(car.D_STG1, 0) === 'Consultar' 
//         ? 'Consultar' 
//         : (parseFloat(car.D_STG1) * 1.5) + 120000
//     }));
    
//     res.json(carsWithPrices);
//   } catch (error) {
//     console.error('Error filtering cars:', error);
//     res.status(500).json({ error: 'Error al filtrar autos' });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Servidor corriendo en http://localhost:${PORT}`);
// });

const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Función para calcular precios o retornar null (para que el frontend muestre "Consultar")
const calculatePrice = (value, basePrice) => {
  const parsed = parseFloat(value);
  if (!value || parsed === 0 || isNaN(parsed)) {
    return null;
  }
  return parsed + basePrice;
};

// Endpoint para obtener datos de autos
app.get('/api/cars', async (req, res) => {
  try {
    const response = await axios.get('https://dataracing.com.ar/wp-content/uploads/cars_data.json');
    const cars = response.data;
    
    // Calcular precios
    const carsWithPrices = cars.map(car => ({
      ...car,
      STG1: calculatePrice(car.D_STG1, 100000),
      STG2: calculatePrice(car.D_STG2, 100000),
      STG3: calculatePrice(car.D_STG1, 0) === null 
        ? null 
        : (parseFloat(car.D_STG1) * 1.5) + 120000
    }));
    
    res.json(carsWithPrices);
  } catch (error) {
    console.error('Error fetching car data:', error);
    res.status(500).json({ error: 'Error al obtener datos de autos' });
  }
});

// Endpoint para obtener filtros únicos
app.get('/api/filters', async (req, res) => {
  try {
    const response = await axios.get('https://dataracing.com.ar/wp-content/uploads/cars_data.json');
    const cars = response.data;
    
    const marcas = [...new Set(cars.map(car => car.FABRICANTE))].sort();
    const modelos = [...new Set(cars.map(car => car.MODELO))].sort();
    const motores = [...new Set(cars.map(car => car.MOTOR))].sort();
    
    res.json({ marcas, modelos, motores });
  } catch (error) {
    console.error('Error fetching filters:', error);
    res.status(500).json({ error: 'Error al obtener filtros' });
  }
});

// Endpoint para filtrar autos
app.post('/api/cars/filter', async (req, res) => {
  try {
    const { marca, modelo, motor } = req.body;
    const response = await axios.get('https://dataracing.com.ar/wp-content/uploads/cars_data.json');
    let cars = response.data;
    
    // Aplicar filtros
    if (marca) {
      cars = cars.filter(car => car.FABRICANTE === marca);
    }
    if (modelo) {
      cars = cars.filter(car => car.MODELO === modelo);
    }
    if (motor) {
      cars = cars.filter(car => car.MOTOR === motor);
    }
    
    // Calcular precios
    const carsWithPrices = cars.map(car => ({
      ...car,
      STG1: calculatePrice(car.D_STG1, 100000),
      STG2: calculatePrice(car.D_STG2, 100000),
      STG3: calculatePrice(car.D_STG1, 0) === null 
        ? null 
        : (parseFloat(car.D_STG1) * 1.5) + 120000
    }));
    
    res.json(carsWithPrices);
  } catch (error) {
    console.error('Error filtering cars:', error);
    res.status(500).json({ error: 'Error al filtrar autos' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});