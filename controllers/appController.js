import { Sequelize } from 'sequelize';
import {Precio, Categoria, Propiedad} from '../models/index.js';


const inicio = async (req, res) => {

    const [categorias, precios, casas, departamentos] = await Promise.all([
        Categoria.findAll({ raw: true }), 
        Precio.findAll({ raw: true }),
        Propiedad.findAll({
            limit: 3, 
            where: {
                categoriaId: 1
            }, 
            include: [
                {
                    model: Precio, 
                    as: 'precio'
                }, 
                {
                    model: Categoria, 
                    as: 'categoria'
                }
            ], 
            order: [
                ['createdAt', 'DESC']
            ]
        }), 
        Propiedad.findAll({
            limit: 3, 
            where: {
                categoriaId: 2
            }, 
            include: [
                {
                    model: Precio, 
                    as: 'precio'
                }, 
                {
                    model: Categoria, 
                    as: 'categoria'
                }
            ], 
            order: [
                ['createdAt', 'DESC']
            ]
        })
    ]);

     res.render('inicio',{
        pagina: 'Inicio', 
        csrfToken: req.csrfToken(),
        categorias, 
        precios, 
        casas, 
        departamentos
    });
}

const categoria = async (req, res) => {
    const { id } = req.params;

    //Comprobar que la categoria existe
    const categoria = await Categoria.findByPk(id);

    if(!categoria){
        return res.redirect('/404');
    }
    //Obtener las propiedades de la categoria
    const propiedades = await Propiedad.findAll({
        where: {
            categoriaId: id
        }, 
        include: [
            {
                model: Precio, 
                as: 'precio'
            },
            {
                model: Categoria, 
                as: 'categoria'
            }
        ]
    });

    res.render('categorias', {
        pagina: `${categoria.nombre}s en Venta`, 
        csrfToken: req.csrfToken(),
        propiedades, 
    });
}

const noEncontrado = async (req, res) => {
    res.render('404',{
        pagina: 'No Encontrada', 
        csrfToken: req.csrfToken(),
    });
}

const buscador = async (req, res) => {
    const { termino } = req.body;

    //validar que el campo termino no este vacio
    if(!termino.trim()){
        return res.redirect('back');
    }
    //consultar propiedades
    const propiedades = await Propiedad.findAll({
        where: {
            titulo: {
                [Sequelize.Op.like] : '%' + termino + '%'
            },
        },
        include: [
            {
                model: Precio, 
                as: 'precio'
            },
            {
                model: Categoria, 
                as: 'categoria'
            }
        ]
    });
    res.render('busqueda',{
        pagina: 'Resultados de la Búsqueda', 
        csrfToken: req.csrfToken(),
        propiedades
    });
}

export {
    inicio,
    categoria, 
    noEncontrado, 
    buscador
}