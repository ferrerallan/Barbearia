
module.exports = {
    dialect:'postgres',
    host: '127.0.0.1',
    username: 'postgres',
    password: 'docker',
    database: 'gobarber3',
    define:{
        timestamps:true,
        underscored:true,
        underscoredAll:true,      
    },
};
