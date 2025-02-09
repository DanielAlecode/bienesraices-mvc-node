/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/mapaInicio.js":
/*!******************************!*\
  !*** ./src/js/mapaInicio.js ***!
  \******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n\r\n\r\n(function () {\r\n    // Capturar valores de los inputs de coordenadas en el front-end\r\n    const latInput = 13.685464899694143;\r\n    const lngInput = -89.22507507679673;\r\n\r\n    // Crear el mapa centrado en las coordenadas pasadas desde el front-end\r\n    const mapa = L.map('mapa-inicio').setView([latInput, lngInput], 16);\r\n\r\n    let markers = new L.FeatureGroup().addTo(mapa);\r\n    let propiedades = [];\r\n    \r\n    const filtros = {\r\n        categoria: '',\r\n        precio: ''\r\n    }\r\n\r\n    const categoriasSelect = document.querySelector('#categorias');\r\n    const preciosSelect = document.querySelector('#precios');\r\n\r\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\r\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\r\n    }).addTo(mapa);\r\n\r\n    //Filtracion por precio y categorias\r\n    categoriasSelect.addEventListener('change', e => {\r\n        filtros.categoria = +e.target.value;\r\n        filtrarPropiedades();\r\n    });\r\n\r\n    preciosSelect.addEventListener('change', e => {\r\n        filtros.precio = +e.target.value;\r\n        filtrarPropiedades();\r\n    });\r\n\r\n    const obtenerPropiedades = async (req, res) => {\r\n        try {\r\n            const url = '/api/propiedades';\r\n            const respuesta = await fetch(url);\r\n            propiedades = await respuesta.json();\r\n            \r\n            mostrarPropiedades(propiedades);\r\n\r\n        } catch (error) {\r\n            console.log(error);\r\n        }\r\n    }\r\n\r\n    const mostrarPropiedades = propiedades => {\r\n        //limpiar los markers \r\n        markers.clearLayers();\r\n\r\n        propiedades.forEach(propiedad => {\r\n            const marker = new L.marker([propiedad?.lat, propiedad?.lng], {\r\n                autoPan: true\r\n            })\r\n                .addTo(mapa)\r\n                .bindPopup(`\r\n                <h1 class=\"text-xl font-extrabold uppercase my-5\"> ${propiedad?.titulo} </h1>\r\n                <img src=\"/uploads/${propiedad?.imagen}\" alt=\"imagen de la propiedad ${propiedad?.titulo}\">\r\n                <p class=\"text-gray-600 font-bold\"> Precio:</p> \r\n                <p class=\"text-gray-600 font-bold\"> ${propiedad?.precio.precio} </p>\r\n                <p class=\"text-gray-600 font-bold\"> Categoría:</p> \r\n                <p class=\"text-gray-600 font-bold\">${propiedad?.categoria.nombre} </p>\\\r\n                <a href=\"/propiedad/${propiedad?.id}\" class=\" bg-indigo-500 block p-2 text-center text-white font-bold rounded\">\r\n                    <i class=\"fas fa-eye mr-2\"></i>  \r\n                    Ver más\r\n                </a>\r\n            `);\r\n\r\n            markers.addLayer(marker);\r\n        });\r\n    }\r\n\r\n    const filtrarPropiedades = () => {\r\n       const resultado = propiedades.filter( filtrarCategoria ).filter( filtrarPrecio );\r\n       mostrarPropiedades(resultado);\r\n    }\r\n\r\n    const filtrarCategoria = propiedad =>  filtros.categoria ? propiedad.categoriaId === filtros.categoria : propiedad\r\n\r\n    const filtrarPrecio = precio =>  filtros.precio ? precio.precioId === filtros.precio : precio\r\n\r\n    obtenerPropiedades();\r\n\r\n})();\n\n//# sourceURL=webpack://proyectobienesraices/./src/js/mapaInicio.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/mapaInicio.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;