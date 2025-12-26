export default () => ({
  port: parseInt(process.env.AUTH_PORT!),
  database: {
    host: process.env.AUTH_DATABASE_HOST!,
    port: parseInt(process.env.AUTH_DATABASE_PORT!),
    username: process.env.AUTH_DATABASE_USERNAME!,
    password: process.env.AUTH_DATABASE_PASSWORD!,
    database: process.env.AUTH_DATABASE_NAME!,
  },
});
