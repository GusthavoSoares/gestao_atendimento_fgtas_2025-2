import knex from 'knex';

const configuracao = {
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'fgtas_atendimentos'
    }
}

const conexao = knex(configuracao)

export default conexao;