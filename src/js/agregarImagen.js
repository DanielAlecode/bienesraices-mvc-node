import { Dropzone } from 'dropzone';

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

Dropzone.options.imagen = {
    dictDefaultMessage: 'Sube tus imágenes aquí', 
    acceptedFiles: '.png, .jpeg, .jpg',
    maxFilesize: 5, 
    maxFiles: 5, 
    pararelleUpload: 1, 
    autoProcessQueue: false, 
    addRemoveLinks: true, 
    dictRemoveFile: 'Borrar archivo',
    dictMaxFilesExceeded: 'Solo puedes subir un archivo',
    headers: {
        'CSRF-Token': token
    }, 
    paramName:'imagen', 
    init: function() {
        const dropzone = this;
        const btnPublicar = document.querySelector('#publicar');

        btnPublicar.addEventListener('click', function(){
            dropzone.processQueue();
        });

        dropzone.on('queuecomplete',function(){
            if(dropzone.getActiveFiles().length == 0) {
                window.location.href = '/mis-propiedades'
            }
        });
    }
}