import bcrypt from 'bcrypt';

const usuarios = [
   {
    nombre: 'Daniel',
    email: 'daniel@gmail.com', 
    confirmado: 1, 
    password: bcrypt.hashSync('password', 10)
   }
]

export default usuarios;