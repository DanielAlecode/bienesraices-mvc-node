

(function () {
    // Capturar valores de los inputs de coordenadas en el front-end
    const latInput = 13.685464899694143;
    const lngInput = -89.22507507679673;

    // Crear el mapa centrado en las coordenadas pasadas desde el front-end
    const mapa = L.map('mapa-inicio').setView([latInput, lngInput], 16);

    let markers = new L.FeatureGroup().addTo(mapa);
    let propiedades = [];
    
    const filtros = {
        categoria: '',
        precio: ''
    }

    const categoriasSelect = document.querySelector('#categorias');
    const preciosSelect = document.querySelector('#precios');

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    //Filtracion por precio y categorias
    categoriasSelect.addEventListener('change', e => {
        filtros.categoria = +e.target.value;
        filtrarPropiedades();
    });

    preciosSelect.addEventListener('change', e => {
        filtros.precio = +e.target.value;
        filtrarPropiedades();
    });

    const obtenerPropiedades = async (req, res) => {
        try {
            const url = '/api/propiedades';
            const respuesta = await fetch(url);
            propiedades = await respuesta.json();
            
            mostrarPropiedades(propiedades);

        } catch (error) {
            console.log(error);
        }
    }

    const mostrarPropiedades = propiedades => {
        //limpiar los markers 
        markers.clearLayers();

        propiedades.forEach(propiedad => {
            const marker = new L.marker([propiedad?.lat, propiedad?.lng], {
                autoPan: true
            })
                .addTo(mapa)
                .bindPopup(`
                <h1 class="text-xl font-extrabold uppercase my-5"> ${propiedad?.titulo} </h1>
                <img src="/uploads/${propiedad?.imagen}" alt="imagen de la propiedad ${propiedad?.titulo}">
                <p class="text-gray-600 font-bold"> Precio:</p> 
                <p class="text-gray-600 font-bold"> ${propiedad?.precio.precio} </p>
                <p class="text-gray-600 font-bold"> Categoría:</p> 
                <p class="text-gray-600 font-bold">${propiedad?.categoria.nombre} </p>\
                <a href="/propiedad/${propiedad?.id}" class=" bg-indigo-500 block p-2 text-center text-white font-bold rounded">
                    <i class="fas fa-eye mr-2"></i>  
                    Ver más
                </a>
            `);

            markers.addLayer(marker);
        });
    }

    const filtrarPropiedades = () => {
       const resultado = propiedades.filter( filtrarCategoria ).filter( filtrarPrecio );
       mostrarPropiedades(resultado);
    }

    const filtrarCategoria = propiedad =>  filtros.categoria ? propiedad.categoriaId === filtros.categoria : propiedad

    const filtrarPrecio = precio =>  filtros.precio ? precio.precioId === filtros.precio : precio

    obtenerPropiedades();

})();