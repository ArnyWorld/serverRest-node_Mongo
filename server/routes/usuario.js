const express = require('express');

const bcrypt = require('bcrypt');

const _= require('underscore');
const Usuario = require('../models/usuario');

const app = express();

app.get('/usuario',(req,res)=>{
    
    let desde = req.query.desde || 0;
    desde=Number(desde);
    let limite =req.query.limite || 5;
    limite=Number(limite);
    /** El segundo parámetro es un string y son los campos que se mostrarán*/
    Usuario.find({estado:true}, 'nombre email')
    /** skip nos permite mostrar desde una cierta posición*/
    .skip(desde)
    /** limit nos permite limitar los documentos listados*/
    .limit(limite)
    .exec((err, usuarios)=>{
       
        if(err){
            return res.status(400).json({
                ok: 'false',
                err
            });
        }

        Usuario.countDocuments({estado:true}, (err, conteo)=>{
            res.json({
                ok:true,
                usuarios,
                cuantos: conteo
            });
    
        })


    })


});
app.post('/usuario',(req,res)=>{
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email:body.email,
        password:bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save( (err, usuarioDB) =>{
        if(err){
            return res.status(400).json({
                ok: 'false',
                err
            });
        }

        res.json({
            ok:true,
            usuario:usuarioDB
        })
    });
});

app.put('/usuario/:id',(req,res)=>{
    let id = req.params.id;
    /** Utilizando el paquete pick para que solo pueda actualizar los campos que se encuentran en el arreglo*/
    let body = _.pick(req.body, ['nombre', 'email','img', 'role', 'estado']);     

    
    Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true},(err, usuarioDB)=>{

        if(err){
            return res.status(400).json({
                ok: 'false',
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

   
});
/*
app.delete('/usuario/:id',(req,res)=>{
    
    let id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado)=>{
        if(err){
            return res.status(400).json({
                ok: 'false',
                err
            });
        }
        if(!usuarioBorrado){
            return res.status(400).json({
                ok: 'false',
                err:{
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });

    });
});*/
/** Actualización del estado, buena práctica para no borrar documentos de la base de datos*/
app.delete('/usuario/:id',(req,res)=>{
    
    let id = req.params.id;

    let actualizarEstado={
        estado:false
    }


    Usuario.findByIdAndUpdate(id,actualizarEstado , {new:true},(err, estadoActualizado)=>{
        if(err){
            return res.status(400).json({
                ok: 'false',
                err
            });
        }
        res.json({
            ok: true,
            usuario: estadoActualizado
        });

    });
});
module.exports = app;