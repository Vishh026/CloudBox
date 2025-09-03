require('dotenv').config();
const connectDB = require('./src/db/db');
const app = require('./src/app')

connectDB()
.then(()=> {
    app.listen(3000, () => {
        console.log(`Server running on port 3000`);
    });
})
.catch((err)=> {
    console.error('Failed to connect to the database', err);
    process.exit(1);
})