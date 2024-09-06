// URL principal de la imagen
const primaryImageUrl = 'https://fenixfgx.github.io/directoriocachipay/images/DCLOGO.png';

// URL alternativa de la imagen
const alternativeImageUrl = 'img/DCLOGO.png';

// Selecciona la imagen por su ID
const logoImage = document.getElementById('cachedLogo');

// Función para verificar si la imagen está disponible
function checkImageAvailability(url, callback) {
  const img = new Image();
  img.onload = () => callback(true);
  img.onerror = () => callback(false);
  img.src = url;
}

// Comienza con la URL principal y verifica su disponibilidad
checkImageAvailability(primaryImageUrl, (isAvailable) => {
  if (!isAvailable) {
    // Si la URL principal no está disponible, cambiar a la URL alternativa
    logoImage.src = alternativeImageUrl;
  }
});

const API_KEY = 'AIzaSyBbqubwrkNP-0NE5jt24VbVL0662ioHx00';  // Reemplaza con tu clave API
const SHEET_ID = '1DWjL6NXvamRhKGPyL8cgW4RTiD1L9zRfN6iW1Ad1z6c';  // Reemplaza con el ID de tu hoja de cálculo
const SHEET_RANGE = 'Browse!B2:F';  // El rango de las columnas B2 (título) a F (logo)
const CACHE_KEY = 'spreadsheetData'; // Clave para almacenar los datos en localStorage
const CACHE_TIMESTAMP_KEY = 'cacheTimestamp'; // Clave para el tiempo de la caché
const CACHE_DURATION = 1000 * 60 * 15; // Duración de la caché para la actualización (15 minutos)
const INITIAL_UPDATE_DELAY = 1000; // Retraso de la primera actualización después de cargar la página (1 segundo)

const searchInput = document.getElementById('search');
const resultsContainer = document.getElementById('results');
const connectionStatus = document.getElementById('status');
const notification = document.getElementById('notification');
const loadingSpinner = document.getElementById('loading-spinner'); // Nuevo elemento de spinner

let data = [];

// Asegurarse de que los resultados y el spinner estén ocultos inicialmente
resultsContainer.style.display = 'none';
loadingSpinner.style.display = 'none';

// Función para mostrar el spinner de carga
function showLoadingSpinner(show) {
  loadingSpinner.style.display = show ? 'block' : 'none';
}

// Función para obtener datos de la API de Google Sheets
function fetchSpreadsheetData() {
  const API_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_RANGE}?key=${API_KEY}`;
  
  showLoadingSpinner(true); // Mostrar spinner mientras se cargan los datos

  return fetch(API_URL)
    .then(response => response.json())
    .then(result => {
      const processedData = result.values.map(row => ({
        title: row[0], // Columna B
        subtitle: row[3], // Columna E
        logo: row[4], // Columna F
        keywords: row[2].split(',').map(keyword => keyword.trim().toLowerCase()) // Columna D
      }));

      // Guardar los datos y el tiempo de caché
      localStorage.setItem(CACHE_KEY, JSON.stringify(processedData));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());

      showLoadingSpinner(false); // Ocultar spinner cuando los datos se hayan cargado
      console.log('Datos actualizados desde la API.');
      return processedData;
    })
    .catch(error => {
      showLoadingSpinner(false); // Ocultar spinner si ocurre un error
      console.error('Error al obtener los datos:', error);
      return [];
    });
}

// Función para cargar datos desde la caché
function loadFromCache() {
  const cacheData = localStorage.getItem(CACHE_KEY);
  const cacheTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);

  // Si hay datos en caché y no ha expirado, cargarlos desde la caché
  if (cacheData && cacheTimestamp) {
    const isCacheValid = (Date.now() - parseInt(cacheTimestamp)) < CACHE_DURATION;
    if (isCacheValid) {
      console.log('Cargando datos desde caché...');
      data = JSON.parse(cacheData);
      return Promise.resolve(data);
    }
  }

  // Si no hay datos válidos en caché, devuelve una promesa vacía
  return Promise.resolve([]);
}

// Función para cargar datos desde la API si hay conexión a Internet
function loadData() {
  return loadFromCache().then(cachedData => {
    // Mostrar datos de la caché si están disponibles
    if (cachedData.length > 0) {
      console.log('Datos cargados desde caché');
    }

    // Verificar conexión y actualizar datos desde la API si hay conexión
    if (isOnline()) {
      updateConnectionStatus(true); // Mostrar ícono de conectado
      
      // Retrasar la actualización de los datos por 1 segundo
      setTimeout(() => {
        fetchSpreadsheetData().then(fetchedData => {
          data = fetchedData;
        });
      }, INITIAL_UPDATE_DELAY); // Retrasar la carga inicial por 1 segundo
    } else {
      updateConnectionStatus(false); // Mostrar ícono de desconectado
      console.log('Sin conexión. Manteniendo datos desde caché...');
    }
  });
}

// Función para mostrar los resultados en la lista
function displayResults(results) {
  resultsContainer.innerHTML = ''; // Limpiar resultados anteriores

  // Si no hay resultados, mostrar un mensaje
  if (results.length === 0 && searchInput.value !== '') {
    const li = document.createElement('li');
    li.textContent = 'No se encontraron resultados';
    resultsContainer.appendChild(li);
  }

  // Crear y mostrar los resultados filtrados
  results.forEach(result => {
    const li = document.createElement('li');
    li.innerHTML = `
      <img src="${result.logo}" alt="Logo" class="result-logo">
      <div class="result-text">
        <strong>${result.title}</strong>
        <div class="result-subtitle">${result.subtitle}</div>
      </div>
    `;
    resultsContainer.appendChild(li);
  });
  
  // Mostrar el contenedor solo si hay resultados o el campo de búsqueda tiene texto
  if (results.length > 0 || searchInput.value !== '') {
    resultsContainer.style.display = 'block';
  } else {
    resultsContainer.style.display = 'none';
  }
}

// Función debounce para optimizar la búsqueda
function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

// Evento para detectar cambios en el campo de búsqueda con debounce
searchInput.addEventListener('input', debounce(function () {
  const query = searchInput.value.toLowerCase();

  // Si el campo está vacío, ocultar el contenedor de resultados
  if (query === '') {
    resultsContainer.style.display = 'none';
    return;
  }

  // Filtrar resultados en base a las palabras clave
  const filteredResults = data.filter(item =>
    item.keywords.some(keyword => keyword.includes(query))
  );

  displayResults(filteredResults);
}, 1000)); // 300ms de retraso en la búsqueda

// Función para verificar si hay conexión a Internet
function isOnline() {
  return navigator.onLine;
}

function updateConnectionStatus(isConnected) {
  if (isConnected) {
    connectionStatus.innerHTML = `
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M1.33309 8.07433C0.92156 8.44266 0.886539 9.07485 1.25487 9.48638C1.62319 9.89791 2.25539 9.93293 2.66691 9.5646L1.33309 8.07433ZM21.3331 9.5646C21.7446 9.93293 22.3768 9.89791 22.7451 9.48638C23.1135 9.07485 23.0784 8.44266 22.6669 8.07433L21.3331 9.5646ZM12 19C11.4477 19 11 19.4477 11 20C11 20.5523 11.4477 21 12 21V19ZM12.01 21C12.5623 21 13.01 20.5523 13.01 20C13.01 19.4477 12.5623 19 12.01 19V21ZM14.6905 17.04C15.099 17.4116 15.7315 17.3817 16.1031 16.9732C16.4748 16.5646 16.4448 15.9322 16.0363 15.5605L14.6905 17.04ZM18.0539 13.3403C18.4624 13.7119 19.0949 13.682 19.4665 13.2734C19.8381 12.8649 19.8082 12.2324 19.3997 11.8608L18.0539 13.3403ZM7.96372 15.5605C7.55517 15.9322 7.52524 16.5646 7.89687 16.9732C8.2685 17.3817 8.90095 17.4116 9.3095 17.04L7.96372 15.5605ZM4.60034 11.8608C4.19179 12.2324 4.16185 12.8649 4.53348 13.2734C4.90511 13.682 5.53756 13.7119 5.94611 13.3403L4.60034 11.8608ZM2.66691 9.5646C5.14444 7.34716 8.41371 6 12 6V4C7.90275 4 4.16312 5.54138 1.33309 8.07433L2.66691 9.5646ZM12 6C15.5863 6 18.8556 7.34716 21.3331 9.5646L22.6669 8.07433C19.8369 5.54138 16.0972 4 12 4V6ZM12 21H12.01V19H12V21ZM12 16C13.0367 16 13.9793 16.3931 14.6905 17.04L16.0363 15.5605C14.9713 14.5918 13.5536 14 12 14V16ZM12 11C14.3319 11 16.4546 11.8855 18.0539 13.3403L19.3997 11.8608C17.4466 10.0842 14.8487 9 12 9V11ZM9.3095 17.04C10.0207 16.3931 10.9633 16 12 16V14C10.4464 14 9.02872 14.5918 7.96372 15.5605L9.3095 17.04ZM5.94611 13.3403C7.54544 11.8855 9.66815 11 12 11V9C9.15127 9 6.55344 10.0842 4.60034 11.8608L5.94611 13.3403Z" fill="#2c9b4d"></path> </g></svg>
    `;
  } else {
    connectionStatus.innerHTML = `
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M1.33309 8.07433C0.92156 8.44266 0.886539 9.07485 1.25487 9.48638C1.62319 9.89791 2.25539 9.93293 2.66691 9.5646L1.33309 8.07433ZM21.3331 9.5646C21.7446 9.93293 22.3768 9.89791 22.7451 9.48638C23.1135 9.07485 23.0784 8.44266 22.6669 8.07433L21.3331 9.5646ZM12 19C11.4477 19 11 19.4477 11 20C11 20.5523 11.4477 21 12 21V19ZM12.01 21C12.5623 21 13.01 20.5523 13.01 20C13.01 19.4477 12.5623 19 12.01 19V21ZM14.6905 17.04C15.099 17.4116 15.7315 17.3817 16.1031 16.9732C16.4748 16.5646 16.4448 15.9322 16.0363 15.5605L14.6905 17.04ZM18.0539 13.3403C18.4624 13.7119 19.0949 13.682 19.4665 13.2734C19.8381 12.8649 19.8082 12.2324 19.3997 11.8608L18.0539 13.3403ZM7.96372 15.5605C7.55517 15.9322 7.52524 16.5646 7.89687 16.9732C8.2685 17.3817 8.90095 17.4116 9.3095 17.04L7.96372 15.5605ZM4.60034 11.8608C4.19179 12.2324 4.16185 12.8649 4.53348 13.2734C4.90511 13.682 5.53756 13.7119 5.94611 13.3403L4.60034 11.8608ZM10.5705 4.06305C10.0204 4.1118 9.61391 4.59729 9.66266 5.14741C9.71141 5.69754 10.1969 6.10399 10.747 6.05525L10.5705 4.06305ZM17.3393 10.3798C16.8567 10.1114 16.2478 10.285 15.9794 10.7677C15.711 11.2504 15.8847 11.8593 16.3673 12.1277L17.3393 10.3798ZM3.70711 2.29289C3.31658 1.90237 2.68342 1.90237 2.29289 2.29289C1.90237 2.68342 1.90237 3.31658 2.29289 3.70711L3.70711 2.29289ZM20.2929 21.7071C20.6834 22.0976 21.3166 22.0976 21.7071 21.7071C22.0976 21.3166 22.0976 20.6834 21.7071 20.2929L20.2929 21.7071ZM12 6C15.5863 6 18.8556 7.34716 21.3331 9.5646L22.6669 8.07433C19.8369 5.54138 16.0972 4 12 4V6ZM12 21H12.01V19H12V21ZM12 16C13.0367 16 13.9793 16.3931 14.6905 17.04L16.0363 15.5605C14.9713 14.5918 13.5536 14 12 14V16ZM9.3095 17.04C10.0207 16.3931 10.9633 16 12 16V14C10.4464 14 9.02872 14.5918 7.96372 15.5605L9.3095 17.04ZM10.747 6.05525C11.1596 6.01869 11.5775 6 12 6V4C11.5185 4 11.0417 4.0213 10.5705 4.06305L10.747 6.05525ZM16.3673 12.1277C16.9757 12.466 17.5412 12.874 18.0539 13.3403L19.3997 11.8608C18.7751 11.2927 18.0844 10.7941 17.3393 10.3798L16.3673 12.1277ZM2.29289 3.70711L5.46648 6.8807L6.8807 5.46648L3.70711 2.29289L2.29289 3.70711ZM2.66691 9.5646C3.81213 8.53961 5.12648 7.70074 6.56232 7.09494L5.78486 5.25224C4.14251 5.94517 2.64069 6.904 1.33309 8.07433L2.66691 9.5646ZM5.46648 6.8807L9.46042 10.8746L10.8746 9.46042L6.8807 5.46648L5.46648 6.8807ZM9.46042 10.8746L20.2929 21.7071L21.7071 20.2929L10.8746 9.46042L9.46042 10.8746ZM5.94611 13.3403C7.15939 12.2367 8.67355 11.4612 10.3496 11.1508L9.98543 9.18424C7.93271 9.5644 6.08108 10.5139 4.60034 11.8608L5.94611 13.3403Z" fill="#990000"></path> </g></svg>
    `;
  }
}

// Función para manejar la carga de datos basada en la conexión
function checkConnectionAndLoadData() {
  // Primero cargar desde caché
  loadData().then(() => {
    // Luego verificar la conexión y actualizar los datos si hay conexión a Internet
    if (isOnline()) {
      console.log('Actualizando datos cada 15 minutos...');
      setInterval(() => {
        if (isOnline()) {
          fetchSpreadsheetData().then(() => {
            console.log('Datos actualizados desde la API.');
          });
        }
      }, CACHE_DURATION);
    }
  });
}

// Función para mostrar notificaciones
function showNotification(message) {
  notification.textContent = message;
  notification.style.display = 'block';
  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000); // Ocultar notificación después de 3 segundos
}

// Iniciar la verificación y carga de datos
checkConnectionAndLoadData();