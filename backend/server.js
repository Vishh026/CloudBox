require('dotenv').config();
const connectDB = require('./src/db/db');
const app = require('./src/app')

connectDB()
.then(()=> {
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
})
.catch((err)=> {
    console.error('Failed to connect to the database', err);
    process.exit(1);
})

