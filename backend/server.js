require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const timetableRoutes = require('./routes/timetable');
const examsRoutes = require('./routes/exams');

const notesRoutes = require('./routes/notes');
const remindersRoutes = require('./routes/reminders');
const scheduleRoutes = require('./routes/schedule');
const marksNoteRoutes = require('./routes/marksNote');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/exams', examsRoutes);

app.use('/api/notes', notesRoutes);
app.use('/api/reminders', remindersRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/marks-note', marksNoteRoutes);

const PORT = process.env.PORT || 5000;

// Add root route handler to avoid 404 on '/'
app.get('/', (req, res) => {
  res.send('Backend server is running');
});

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
