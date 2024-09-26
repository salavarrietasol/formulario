// Capturamos el formulario y el mensaje de confirmación
const form = document.getElementById('phishingForm');

form.addEventListener('submit', function(event) {
  event.preventDefault(); // Evitar la acción de enviar el formulario de forma tradicional

  const formData = new FormData(form); // Crear un objeto FormData con todos los datos del formulario

  // Hacer una solicitud POST al servidor usando Fetch API
  fetch('/submit', {
    method: 'POST',
    body: formData,
  })
  .then(response => response.text())
  .then(data => {
    // Mostrar la respuesta del servidor en la página
    document.body.innerHTML = data;
  })
  .catch(error => console.error('Error:', error));
});
