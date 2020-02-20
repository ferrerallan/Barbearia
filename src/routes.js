import { Router }  from 'express';
import User from './app/models/User';

const routes = new Router();


routes.get('/',async(req,res)=>{

    const user = await User.create({
        name: 'Allan',
        email: 'allan@gmail.com',
        password_hash:'123'
    });
    
    return res.json(user);
})

routes.get('/:nome',async(req,res)=>{
    const n = req.params.nome;
    const user = await User.findOne({ 
        where: {name:n}        
    });
    
    return res.json(user);
})

module.exports = routes;