import app from './app.js';
import dotenv from 'dotenv';
import connDB from './config/database.js';
dotenv.config();

const PORT = process.env.PORT || 3000;

connDB();
app.listen(PORT, () => {
  console.log(`Server running on PORT : ${process.env.PORT}`);
});