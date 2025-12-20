// const TCU_PRICE = 180000;
// let allCars = [], filteredCars = [], currentCar = null;

// const modal = document.getElementById('carModal');
// const span = document.getElementsByClassName('close')[0];

// function fmt(p) {
//     return p === null || p === undefined || p === 0 || p === '0'
//         ? '<span class="consultar">Consultar</span>'
//         : '<span class="price">$' + Math.round(p).toLocaleString('es-AR') + '</span>';
// }

// function fmt3(p) {
//     return p === null || p === undefined || p === 0 || p === '0'
//         ? '<span class="consultar">Consultar</span>'
//         : '<span class="price price-stg3">$' + Math.round(p).toLocaleString('es-AR') + '</span>';
// }

// function fmtTxt(p) {
//     return p === null || p === undefined || p === 0 || p === '0'
//         ? 'Consultar'
//         : '$' + Math.round(p).toLocaleString('es-AR');
// }

// function safe(v) {
//     return parseFloat(String(v).replace(/[^0-9.]/g, '')) || 0;
// }

// async function loadData() {
//     try {
//         const r = await fetch('/api/cars');
//         allCars = await r.json();
//         filteredCars = allCars;

//         const m = [...new Set(allCars.map(c => c.FABRICANTE))].sort();
//         populateSelect('marca', m, 'Todas las marcas');
//         displayCars(filteredCars);
//         updateResultsInfo();

//     } catch (e) {
//         console.error('Error:', e);
//         document.getElementById('loading').innerHTML =
//             '<p style="color:#dc3545;">Error al cargar los datos</p>';
//     }
// }

// function populateSelect(id, opts, def) {
//     const s = document.getElementById(id);
//     s.innerHTML = `<option value="">${def}</option>`;
//     opts.forEach(o => {
//         const opt = document.createElement('option');
//         opt.value = o;
//         opt.textContent = o;
//         s.appendChild(opt);
//     });
// }

// function updateModelosSelect() {
//     const marca = document.getElementById('marca').value;
//     const ms = document.getElementById('modelo');
//     const mt = document.getElementById('motor');

//     if (!marca) {
//         ms.disabled = true;
//         ms.innerHTML = '<option value="">Selecciona una marca primero</option>';
//         mt.disabled = true;
//         mt.innerHTML = '<option value="">Selecciona un modelo primero</option>';
//         return;
//     }

//     const modelos = [...new Set(allCars.filter(c => c.FABRICANTE === marca).map(c => c.MODELO))].sort();
//     populateSelect('modelo', modelos, 'Todos los modelos');

//     ms.disabled = false;
//     mt.disabled = true;
//     mt.innerHTML = '<option value="">Selecciona un modelo primero</option>';
// }

// function updateMotoresSelect() {
//     const marca = document.getElementById('marca').value;
//     const modelo = document.getElementById('modelo').value;
//     const mt = document.getElementById('motor');

//     if (!modelo) {
//         mt.disabled = true;
//         mt.innerHTML = '<option value="">Selecciona un modelo primero</option>';
//         return;
//     }

//     const motores = [...new Set(allCars
//         .filter(c => c.FABRICANTE === marca && c.MODELO === modelo)
//         .map(c => c.MOTOR))].sort();

//     populateSelect('motor', motores, 'Todos los motores');
//     mt.disabled = false;
// }

// function displayCars(cars) {
//     const tbody = document.getElementById('cars-tbody');
//     const table = document.getElementById('cars-table');
//     const loading = document.getElementById('loading');
//     const noRes = document.getElementById('no-results');

//     loading.style.display = 'none';

//     if (cars.length === 0) {
//         table.style.display = 'none';
//         noRes.style.display = 'block';
//         return;
//     }

//     noRes.style.display = 'none';
//     table.style.display = 'table';

//     tbody.innerHTML = cars.map((c, i) => `
//         <tr onclick="showCarDetails(${i})">
//             <td><strong>${c.FABRICANTE}</strong></td>
//             <td>${c.MODELO}</td>
//             <td>${c.VARIANTE}</td>
//             <td><strong>${c.MOTOR}</strong></td>
//             <td>${c.ORI}</td>
//             <td style="color:#28a745;font-weight:600;">${c.MOD}</td>
//             <td><span class="badge badge-hp">+${c.GAIN} HP</span></td>
//             <td>${fmt(c.STG1)}</td>
//             <td>${fmt(c.STG2)}</td>
//             <td>${fmt3(c.STG3)}</td>
//         </tr>
//     `).join('');
// }

// function showCarDetails(i) {
//     const car = filteredCars[i];
//     if (!car) return;

//     currentCar = car;

//     document.getElementById('modal-title').textContent =
//         `${car.FABRICANTE} ${car.MODELO}`;
//     document.getElementById('car-name').textContent =
//         `${car.FABRICANTE} ${car.MODELO} ${car.VARIANTE}`;

//     document.getElementById('info-motor').textContent = car.MOTOR;
//     document.getElementById('info-hp-ori').textContent = car.ORI + ' HP';
//     document.getElementById('info-hp-mod').textContent = car.MOD + ' HP';
//     document.getElementById('info-gain').textContent = '+' + car.GAIN + ' HP';

//     document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
//     document.getElementById('stage-select').value = 'stage1';

//     document.querySelectorAll('.fuel-option').forEach(opt => opt.classList.remove('active'));
//     document.querySelector('input[name="fuel"][value="NAFTA"]').checked = true;
//     document.querySelector('.fuel-option input[value="NAFTA"]').closest('.fuel-option').classList.add('active');

//     document.getElementById('nafta-features').style.display = 'block';
//     document.getElementById('diesel-features').style.display = 'none';

//     modal.style.display = 'block';

//     calculate();
// }

// function selectFuel(type) {
//     document.querySelectorAll('.fuel-option').forEach(opt => opt.classList.remove('active'));
//     event.target.closest('.fuel-option').classList.add('active');

//     document.querySelector(`input[value="${type}"]`).checked = true;

//     if (type === 'DIESEL') {
//         document.getElementById('nafta-features').style.display = 'none';
//         document.getElementById('diesel-features').style.display = 'block';
//         document.querySelectorAll('#nafta-features input').forEach(cb => cb.checked = false);
//     } else {
//         document.getElementById('nafta-features').style.display = 'block';
//         document.getElementById('diesel-features').style.display = 'none';
//         document.querySelectorAll('#diesel-features input').forEach(cb => cb.checked = false);
//     }

//     calculate();
// }

// function calculate() {
//     if (!currentCar) return;

//     const stage = document.getElementById('stage-select').value;
//     const fuel = document.querySelector('input[name="fuel"]:checked').value;

//     const features = [];
//     document.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => features.push(cb.value));

//     let base = 0;

//     switch (stage) {
//         case 'sin_cambios': base = 0; break;
//         case 'stage1': base = safe(currentCar.STG1); break;
//         case 'stage1_plus': base = safe(currentCar.STG1) * 1.2; break;
//         case 'stage2': base = safe(currentCar.STG2); break;
//         case 'stage2_plus': base = safe(currentCar.STG2) * 1.2; break;
//         case 'stage3': base = safe(currentCar.STG1) * 1.5; break;
//         case 'volver_stock': base = safe(currentCar.STG1) * 0.5; break;
//     }

//     let featPrice = 0;

//     const hasPot = stage !== 'sin_cambios';
//     const isDpf = features.includes('DPF_OFF');

//     features.forEach(f => {
//         let cost = 0;

//         //
//         // *** CAMBIO IMPORTANTE ***
//         // Si hay potencia:
//         // - Nafta  → usar D_COMBO_J2
//         // - Diesel → usar D_COMBO_J4
//         //

//         if ([
//             'DECAT','DTC_OFF','FLAPS_OFF','LAUNCH_CONTROL','COLD_START_HEATING',
//             'EXHAUST_FLAP','SECOND_AIR_INJ_OFF','THROTTLE_BODY_OFF','HARD_CUT',
//             'PEDAL_BOX','START_STOP_OFF','START_STOP'
//         ].includes(f)) {

//             if (hasPot) {
//                 cost = fuel === 'DIESEL'
//                     ? safe(currentCar.D_COMBO_J4)
//                     : safe(currentCar.D_COMBO_J2);
//             } else {
//                 cost = safe(currentCar.ONLY_J2);
//             }
//         }

//         else if (['DPF_OFF','MAF_DELETE','GPF_OFF'].includes(f)) {

//             if (hasPot) {
//                 cost = fuel === 'DIESEL'
//                     ? safe(currentCar.D_COMBO_J4)
//                     : safe(currentCar.D_COMBO_J2);
//             } else {
//                 cost = safe(currentCar.ONLY_J4);
//             }
//         }

//         else if (f === 'SCR_OFF') {
//             if (!isDpf) {
//                 cost = hasPot
//                     ? (fuel === 'DIESEL' ? safe(currentCar.D_COMBO_J4) : safe(currentCar.D_COMBO_J2))
//                     : safe(currentCar.ONLY_J4);
//             }
//         }

//         else if (f === 'LIMITADOR_VELOCIDAD_OFF') {
//             cost = hasPot ? 0 : safe(currentCar.ONLY_J2);
//         }

//         else if (f === 'EGR_OFF') {
//             cost = (hasPot || isDpf)
//                 ? (fuel === 'DIESEL' ? safe(currentCar.D_COMBO_J4) : safe(currentCar.D_COMBO_J2))
//                 : safe(currentCar.ONLY_J2);
//         }

//         else if (['POP_N_BANGS','IMMO_OFF'].includes(f)) {
//             cost = safe(currentCar.ONLY_J2);
//         }

//         else if (f === 'TCU_TUNE_OVER_ECU') {
//             cost = TCU_PRICE;
//         }

//         featPrice += cost;
//     });

//     const total = base + featPrice;

//     document.getElementById('price-base').textContent =
//         '$' + Math.round(base).toLocaleString('es-AR');
//     document.getElementById('price-features').textContent =
//         '$' + Math.round(featPrice).toLocaleString('es-AR');
//     document.getElementById('price-total').textContent =
//         '$' + Math.round(total).toLocaleString('es-AR');

//     let featList = '';
//     if (features.length > 0) {
//         featList = '<strong>Características seleccionadas:</strong><br>• ' +
//             features.join('<br>• ');
//     }

//     document.getElementById('features-list').innerHTML = featList;
// }

// function updateResultsInfo() {
//     document.getElementById('results-info').textContent =
//         `Mostrando ${filteredCars.length} de ${allCars.length} resultados`;
// }

// function filterCars() {
//     const marca = document.getElementById('marca').value;
//     const modelo = document.getElementById('modelo').value;
//     const motor = document.getElementById('motor').value;

//     filteredCars = allCars.filter(c => {
//         if (marca && c.FABRICANTE !== marca) return false;
//         if (modelo && c.MODELO !== modelo) return false;
//         if (motor && c.MOTOR !== motor) return false;
//         return true;
//     });

//     displayCars(filteredCars);
//     updateResultsInfo();
// }

// function clearFilters() {
//     document.getElementById('marca').value = '';
//     document.getElementById('modelo').value = '';
//     document.getElementById('modelo').disabled = true;
//     document.getElementById('modelo').innerHTML =
//         '<option value="">Selecciona una marca primero</option>';

//     document.getElementById('motor').value = '';
//     document.getElementById('motor').disabled = true;
//     document.getElementById('motor').innerHTML =
//         '<option value="">Selecciona un modelo primero</option>';

//     filteredCars = allCars;
//     displayCars(filteredCars);
//     updateResultsInfo();
// }

// document.getElementById('marca').addEventListener('change', () => {
//     updateModelosSelect();
//     filterCars();
// });
// document.getElementById('modelo').addEventListener('change', () => {
//     updateMotoresSelect();
//     filterCars();
// });
// document.getElementById('motor').addEventListener('change', filterCars);
// document.getElementById('clear-btn').addEventListener('click', clearFilters);
// document.getElementById('stage-select').addEventListener('change', calculate);

// span.onclick = function () {
//     modal.style.display = 'none';
// };

// window.onclick = function (e) {
//     if (e.target == modal) modal.style.display = 'none';
// };

// loadData();
const TCU_PRICE = 180000;
let allCars = [], filteredCars = [], currentCar = null;

const modal = document.getElementById('carModal');
const span = document.getElementsByClassName('close')[0];

function fmt(p) {
    return p === null || p === undefined || p === 0 || p === '0'
        ? '<span class="consultar">Consultar</span>'
        : '<span class="price">$' + Math.round(p).toLocaleString('es-AR') + '</span>';
}

function fmt3(p) {
    return p === null || p === undefined || p === 0 || p === '0'
        ? '<span class="consultar">Consultar</span>'
        : '<span class="price price-stg3">$' + Math.round(p).toLocaleString('es-AR') + '</span>';
}

function fmtTxt(p) {
    return p === null || p === undefined || p === 0 || p === '0'
        ? 'Consultar'
        : '$' + Math.round(p).toLocaleString('es-AR');
}

function safe(v) {
    return parseFloat(String(v).replace(/[^0-9.]/g, '')) || 0;
}

async function loadData() {
    try {
        console.log('🔄 Cargando datos...');
        
        const r = await fetch('/api/cars');
        
        if (!r.ok) {
            throw new Error(`HTTP ${r.status}: ${r.statusText}`);
        }
        
        allCars = await r.json();
        filteredCars = allCars;

        console.log(`✅ ${allCars.length} autos cargados`);

        const m = [...new Set(allCars.map(c => c.FABRICANTE))].sort();
        populateSelect('marca', m, 'Todas las marcas');
        displayCars(filteredCars);
        updateResultsInfo();

    } catch (e) {
        console.error('❌ Error:', e);
        const loadingEl = document.getElementById('loading');
        if (loadingEl) {
            loadingEl.innerHTML = `
                <div style="color:#dc3545;padding:20px;text-align:center;">
                    <strong>Error al cargar los datos</strong><br>
                    <small>${e.message}</small>
                </div>
            `;
        }
    }
}

function populateSelect(id, opts, def) {
    const s = document.getElementById(id);
    s.innerHTML = `<option value="">${def}</option>`;
    opts.forEach(o => {
        const opt = document.createElement('option');
        opt.value = o;
        opt.textContent = o;
        s.appendChild(opt);
    });
}

function updateModelosSelect() {
    const marca = document.getElementById('marca').value;
    const ms = document.getElementById('modelo');
    const mt = document.getElementById('motor');

    if (!marca) {
        ms.disabled = true;
        ms.innerHTML = '<option value="">Selecciona una marca primero</option>';
        mt.disabled = true;
        mt.innerHTML = '<option value="">Selecciona un modelo primero</option>';
        return;
    }

    const modelos = [...new Set(allCars.filter(c => c.FABRICANTE === marca).map(c => c.MODELO))].sort();
    populateSelect('modelo', modelos, 'Todos los modelos');

    ms.disabled = false;
    mt.disabled = true;
    mt.innerHTML = '<option value="">Selecciona un modelo primero</option>';
}

function updateMotoresSelect() {
    const marca = document.getElementById('marca').value;
    const modelo = document.getElementById('modelo').value;
    const mt = document.getElementById('motor');

    if (!modelo) {
        mt.disabled = true;
        mt.innerHTML = '<option value="">Selecciona un modelo primero</option>';
        return;
    }

    const motores = [...new Set(allCars
        .filter(c => c.FABRICANTE === marca && c.MODELO === modelo)
        .map(c => c.MOTOR))].sort();

    populateSelect('motor', motores, 'Todos los motores');
    mt.disabled = false;
}

function displayCars(cars) {
    const tbody = document.getElementById('cars-tbody');
    const table = document.getElementById('cars-table');
    const loading = document.getElementById('loading');
    const noRes = document.getElementById('no-results');

    if (loading) loading.style.display = 'none';

    if (cars.length === 0) {
        if (table) table.style.display = 'none';
        if (noRes) noRes.style.display = 'block';
        return;
    }

    if (noRes) noRes.style.display = 'none';
    if (table) table.style.display = 'table';

    if (tbody) {
        tbody.innerHTML = cars.map((c, i) => `
            <tr onclick="showCarDetails(${i})">
                <td><strong>${c.FABRICANTE}</strong></td>
                <td>${c.MODELO}</td>
                <td>${c.VARIANTE}</td>
                <td><strong>${c.MOTOR}</strong></td>
                <td>${c.ORI}</td>
                <td style="color:#28a745;font-weight:600;">${c.MOD}</td>
                <td><span class="badge badge-hp">+${c.GAIN} HP</span></td>
                <td>${fmt(c.STG1)}</td>
                <td>${fmt(c.STG2)}</td>
                <td>${fmt3(c.STG3)}</td>
            </tr>
        `).join('');
    }
}

function showCarDetails(i) {
    const car = filteredCars[i];
    if (!car) return;

    currentCar = car;

    document.getElementById('modal-title').textContent =
        `${car.FABRICANTE} ${car.MODELO}`;
    document.getElementById('car-name').textContent =
        `${car.FABRICANTE} ${car.MODELO} ${car.VARIANTE}`;

    document.getElementById('info-motor').textContent = car.MOTOR;
    document.getElementById('info-hp-ori').textContent = car.ORI + ' HP';
    document.getElementById('info-hp-mod').textContent = car.MOD + ' HP';
    document.getElementById('info-gain').textContent = '+' + car.GAIN + ' HP';

    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.getElementById('stage-select').value = 'stage1';

    document.querySelectorAll('.fuel-option').forEach(opt => opt.classList.remove('active'));
    document.querySelector('input[name="fuel"][value="NAFTA"]').checked = true;
    document.querySelector('.fuel-option input[value="NAFTA"]').closest('.fuel-option').classList.add('active');

    document.getElementById('nafta-features').style.display = 'block';
    document.getElementById('diesel-features').style.display = 'none';

    modal.style.display = 'block';

    calculate();
}

function selectFuel(type) {
    document.querySelectorAll('.fuel-option').forEach(opt => opt.classList.remove('active'));
    event.target.closest('.fuel-option').classList.add('active');

    document.querySelector(`input[value="${type}"]`).checked = true;

    if (type === 'DIESEL') {
        document.getElementById('nafta-features').style.display = 'none';
        document.getElementById('diesel-features').style.display = 'block';
        document.querySelectorAll('#nafta-features input').forEach(cb => cb.checked = false);
    } else {
        document.getElementById('nafta-features').style.display = 'block';
        document.getElementById('diesel-features').style.display = 'none';
        document.querySelectorAll('#diesel-features input').forEach(cb => cb.checked = false);
    }

    calculate();
}

function calculate() {
    if (!currentCar) return;

    const stage = document.getElementById('stage-select').value;
    const fuel = document.querySelector('input[name="fuel"]:checked').value;

    const features = [];
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => features.push(cb.value));

    let base = 0;

    switch (stage) {
        case 'sin_cambios': base = 0; break;
        case 'stage1': base = safe(currentCar.STG1); break;
        case 'stage1_plus': base = safe(currentCar.STG1) * 1.2; break;
        case 'stage2': base = safe(currentCar.STG2); break;
        case 'stage2_plus': base = safe(currentCar.STG2) * 1.2; break;
        case 'stage3': base = safe(currentCar.STG1) * 1.5; break;
        case 'volver_stock': base = safe(currentCar.STG1) * 0.5; break;
    }

    let featPrice = 0;

    const hasPot = stage !== 'sin_cambios';
    const isDpf = features.includes('DPF_OFF');

    features.forEach(f => {
        let cost = 0;

        if ([
            'DECAT','DTC_OFF','FLAPS_OFF','LAUNCH_CONTROL','COLD_START_HEATING',
            'EXHAUST_FLAP','SECOND_AIR_INJ_OFF','THROTTLE_BODY_OFF','HARD_CUT',
            'PEDAL_BOX','START_STOP_OFF','START_STOP'
        ].includes(f)) {
            if (hasPot) {
                cost = fuel === 'DIESEL'
                    ? safe(currentCar.D_COMBO_J4)
                    : safe(currentCar.D_COMBO_J2);
            } else {
                cost = safe(currentCar.ONLY_J2);
            }
        }

        else if (['DPF_OFF','MAF_DELETE','GPF_OFF'].includes(f)) {
            if (hasPot) {
                cost = fuel === 'DIESEL'
                    ? safe(currentCar.D_COMBO_J4)
                    : safe(currentCar.D_COMBO_J2);
            } else {
                cost = safe(currentCar.ONLY_J4);
            }
        }

        else if (f === 'SCR_OFF') {
            if (!isDpf) {
                cost = hasPot
                    ? (fuel === 'DIESEL' ? safe(currentCar.D_COMBO_J4) : safe(currentCar.D_COMBO_J2))
                    : safe(currentCar.ONLY_J4);
            }
        }

        else if (f === 'LIMITADOR_VELOCIDAD_OFF') {
            cost = hasPot ? 0 : safe(currentCar.ONLY_J2);
        }

        else if (f === 'EGR_OFF') {
            cost = (hasPot || isDpf)
                ? (fuel === 'DIESEL' ? safe(currentCar.D_COMBO_J4) : safe(currentCar.D_COMBO_J2))
                : safe(currentCar.ONLY_J2);
        }

        else if (['POP_N_BANGS','IMMO_OFF'].includes(f)) {
            cost = safe(currentCar.ONLY_J2);
        }

        else if (f === 'TCU_TUNE_OVER_ECU') {
            cost = TCU_PRICE;
        }

        featPrice += cost;
    });

    const total = base + featPrice;

    document.getElementById('price-base').textContent =
        '$' + Math.round(base).toLocaleString('es-AR');
    document.getElementById('price-features').textContent =
        '$' + Math.round(featPrice).toLocaleString('es-AR');
    document.getElementById('price-total').textContent =
        '$' + Math.round(total).toLocaleString('es-AR');

    let featList = '';
    if (features.length > 0) {
        featList = '<strong>Características seleccionadas:</strong><br>• ' +
            features.join('<br>• ');
    }

    document.getElementById('features-list').innerHTML = featList;
}

function updateResultsInfo() {
    const resultsInfo = document.getElementById('results-info');
    if (resultsInfo) {
        resultsInfo.textContent =
            `Mostrando ${filteredCars.length} de ${allCars.length} resultados`;
    }
}

function filterCars() {
    const marca = document.getElementById('marca').value;
    const modelo = document.getElementById('modelo').value;
    const motor = document.getElementById('motor').value;

    filteredCars = allCars.filter(c => {
        if (marca && c.FABRICANTE !== marca) return false;
        if (modelo && c.MODELO !== modelo) return false;
        if (motor && c.MOTOR !== motor) return false;
        return true;
    });

    displayCars(filteredCars);
    updateResultsInfo();
}

function clearFilters() {
    document.getElementById('marca').value = '';
    document.getElementById('modelo').value = '';
    document.getElementById('modelo').disabled = true;
    document.getElementById('modelo').innerHTML =
        '<option value="">Selecciona una marca primero</option>';

    document.getElementById('motor').value = '';
    document.getElementById('motor').disabled = true;
    document.getElementById('motor').innerHTML =
        '<option value="">Selecciona un modelo primero</option>';

    filteredCars = allCars;
    displayCars(filteredCars);
    updateResultsInfo();
}

document.getElementById('marca').addEventListener('change', () => {
    updateModelosSelect();
    filterCars();
});
document.getElementById('modelo').addEventListener('change', () => {
    updateMotoresSelect();
    filterCars();
});
document.getElementById('motor').addEventListener('change', filterCars);
document.getElementById('clear-btn').addEventListener('click', clearFilters);
document.getElementById('stage-select').addEventListener('change', calculate);

if (span) {
    span.onclick = function () {
        modal.style.display = 'none';
    };
}

window.onclick = function (e) {
    if (e.target == modal) modal.style.display = 'none';
};

// Iniciar la carga cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadData);
} else {
    loadData();
}