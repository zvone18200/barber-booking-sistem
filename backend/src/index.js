const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./db/connection');

const servicesRouter = require('./routes/services');
const bookingsRouter = require('./routes/bookings');
const authRouter = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/services', servicesRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
    res.json({ message: 'Booking API radi!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server pokrenut na portu ${PORT}`);
});