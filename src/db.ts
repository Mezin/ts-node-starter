import mongoose from 'mongoose';

export default (url: string) => {
  const connect = () => {
    mongoose.connect(url, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    })
      .then(() => {
        return console.log(`Successfully connected to ${url}`);
      })
      .catch(error => {
        console.log(`Error connecting to database: ${url}`, error);
        return process.exit(1);
      });
  };
  connect();

  mongoose.connection.on('disconnected', connect);
};
