import SequelizeAuto from 'sequelize-auto';
import config from '../config';

const auto = new SequelizeAuto(config.database.name,
  config.database.username, config.database.password, {
      host: config.database.host,
      port: config.database.port,
      dialect: config.database.dialect,
      additional: {
          timestamps: false,
      },
      directory: './src/database/models',
      camelCase: true,
  });

auto.run((err) => {
    if (err) throw err;

    console.log(auto.tables); // table list
    console.log(auto.foreignKeys); // foreign key list
});
