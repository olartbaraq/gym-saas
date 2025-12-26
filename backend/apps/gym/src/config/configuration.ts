export default () => ({
  port: parseInt(process.env.GYM_PORT!),
  database: {
    host: process.env.GYM_DATABASE_HOST!,
    port: parseInt(process.env.GYM_DATABASE_PORT!),
    username: process.env.GYM_DATABASE_USERNAME!,
    password: process.env.GYM_DATABASE_PASSWORD!,
    database: process.env.GYM_DATABASE_NAME!,
  },
});
