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

/***/ "./src/js/mapa.js":
/*!************************!*\
  !*** ./src/js/mapa.js ***!
  \************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function () {\r\n    // Capturar valores de los inputs de coordenadas en el front-end\r\n    const latInput = document.querySelector('#lat').value || 13.685464899694143;\r\n    const lngInput = document.querySelector('#lng').value || -89.22507507679673;\r\n    \r\n    // Crear el mapa centrado en las coordenadas pasadas desde el front-end\r\n    const mapa = L.map('mapa').setView([latInput, lngInput], 16);\r\n\r\n    // Cargar la capa de tiles antes\r\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\r\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\r\n    }).addTo(mapa);\r\n\r\n    // Crear el marcador en las coordenadas pasadas desde el front-end\r\n    let marker = new L.marker([latInput, lngInput], {\r\n        draggable: true,\r\n        autoPan: true\r\n    }).addTo(mapa);\r\n\r\n    // Evento para cuando el marcador se arrastra y cambia de posición\r\n    marker.on('moveend', function (e) {\r\n        marker = e.target;\r\n\r\n        const posicion = marker.getLatLng();\r\n        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));\r\n\r\n        // Hacer la solicitud de geocoding inverso\r\n        const geocodeService = L.esri.Geocoding.geocodeService();\r\n        geocodeService.reverse().latlng(posicion, 13).run(function (error, resultado) {\r\n            if (resultado) {\r\n                marker.bindPopup(resultado.address.LongLabel).openPopup();\r\n                document.querySelector('.calle').textContent = resultado?.address?.Address ?? '';\r\n                document.querySelector('#calle').value = resultado?.address?.Address ?? '';\r\n                document.querySelector('#lat').value = resultado?.latlng?.lat ?? '';\r\n                document.querySelector('#lng').value = resultado?.latlng?.lng ?? '';\r\n            }\r\n        });\r\n    });\r\n\r\n    // Si se desea usar la geolocalización del navegador como opción alternativa\r\n    if (navigator.geolocation) {\r\n        navigator.geolocation.getCurrentPosition(function (position) {\r\n            const lat = document.querySelector('#lat').value || position.coords.latitude;\r\n            const lng = document.querySelector('#lng').value || position.coords.longitude;\r\n\r\n            // Actualizar la vista del mapa y mover el marcador\r\n            mapa.setView([lat, lng], 16);\r\n            marker.setLatLng([lat, lng]);\r\n        }, function (error) {\r\n            console.error('Error al obtener la geolocalización: ', error.message);\r\n        });\r\n    } else {\r\n        console.error('Geolocalización no soportada en este navegador.');\r\n    }\r\n})();\r\n\n\n//# sourceURL=webpack://proyectobienesraices/./src/js/mapa.js?");

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
/******/ 	__webpack_modules__["./src/js/mapa.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;