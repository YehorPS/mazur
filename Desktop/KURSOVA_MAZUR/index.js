import express, { urlencoded } from 'express';
import mongoose from 'mongoose';
import router from './Router.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Заміна на ваш MongoDB Atlas URL
const DB_URL = "mongodb+srv://123:123@cluster0.nrpth.mongodb.net/?retryWrites=true&w=majority";
const PORT = 5000;

const app = express();

app.use(express.urlencoded({ extended: true }));
const viewsPath = path.join(__dirname, 'views');
app.set('views', viewsPath);
app.set('view engine', 'ejs');
app.use(express.json());
app.use('/', router);


async function startApp() {
    try {
        await mongoose.connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (e) {
        console.log('Error connecting to MongoDB Atlas:', e);
    }
}

startApp();

export default DB_URL;
