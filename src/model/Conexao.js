import knex from 'knex';

// Permitir configuração via variáveis de ambiente, com valores padrão
const configuracao = {
    client: 'mysql',
    connection: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'fgtas_atendimentos',
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306
    }
}

const conexao = knex(configuracao)
export default conexao;
