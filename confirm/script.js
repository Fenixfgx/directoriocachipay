function getQueryParams() {
      const params = new URLSearchParams(window.location.search);
      return {
        input1: params.get('A') || '',
        input2: params.get('B') || ''
      };
    }

    // Llenar los campos del formulario con los valores de los parámetros de la URL
    function populateForm() {
      const { input1, input2 } = getQueryParams();
      document.getElementById('input1').value = input1;
      document.getElementById('input2').value = input2;
    }

    // Esperar 1 segundo después de que el DOM se haya cargado
    document.addEventListener('DOMContentLoaded', function() {
      populateForm(); // Llenar el formulario con los parámetros de la URL
      setTimeout(function() {
        // Imitar el clic en el botón de enviar
        document.querySelector('button[type="submit"]').click();
      }, 1000); // 1000 ms = 1 segundo
    });

    document.getElementById('url-form').addEventListener('submit', function(e) {
      e.preventDefault(); // Evitar el comportamiento por defecto del formulario

      const input1 = document.getElementById('input1').value;
      const input2 = document.getElementById('input2').value;
      
      const url = `https://script.google.com/macros/s/AKfycbw-Ws_1s2s1_gCY949Tcb1UYD2u6sRQUAATK81kC9CnbGNEOCvjMlx_FPz5sW-yJflV/exec?input1=${encodeURIComponent(input1)}&input2=${encodeURIComponent(input2)}`;

      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
          }
          return response.json();
        })
        .then(data => {
          if (data.status === 'success') {
            alert('Registro exitoso: ' + data.message);
          } else if (data.status === 'not_found') {
            alert('No se encontró el valor en la columna D.');
          } else {
            alert('Ocurrió un error: ' + data.message);
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Error en la solicitud.');
        });
    });