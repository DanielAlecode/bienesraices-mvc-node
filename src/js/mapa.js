(function () {
    // Capturar valores de los inputs de coordenadas en el front-end
    const latInput = document.querySelector('#lat').value || 13.685464899694143;
    const lngInput = document.querySelector('#lng').value || -89.22507507679673;
    
    // Crear el mapa centrado en las coordenadas pasadas desde el front-end
    const mapa = L.map('mapa').setView([latInput, lngInput], 16);

    // Cargar la capa de tiles antes
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    // Crear el marcador en las coordenadas pasadas desde el front-end
    let marker = new L.marker([latInput, lngInput], {
        draggable: true,
        autoPan: true
    }).addTo(mapa);

    // Evento para cuando el marcador se arrastra y cambia de posición
    marker.on('moveend', function (e) {
        marker = e.target;

        const posicion = marker.getLatLng();
        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));

        // Hacer la solicitud de geocoding inverso
        const geocodeService = L.esri.Geocoding.geocodeService();
        geocodeService.reverse().latlng(posicion, 13).run(function (error, resultado) {
            if (resultado) {
                marker.bindPopup(resultado.address.LongLabel).openPopup();
                document.querySelector('.calle').textContent = resultado?.address?.Address ?? '';
                document.querySelector('#calle').value = resultado?.address?.Address ?? '';
                document.querySelector('#lat').value = resultado?.latlng?.lat ?? '';
                document.querySelector('#lng').value = resultado?.latlng?.lng ?? '';
            }
        });
    });

    // Si se desea usar la geolocalización del navegador como opción alternativa
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const lat = document.querySelector('#lat').value || position.coords.latitude;
            const lng = document.querySelector('#lng').value || position.coords.longitude;

            // Actualizar la vista del mapa y mover el marcador
            mapa.setView([lat, lng], 16);
            marker.setLatLng([lat, lng]);
        }, function (error) {
            console.error('Error al obtener la geolocalización: ', error.message);
        });
    } else {
        console.error('Geolocalización no soportada en este navegador.');
    }
})();
