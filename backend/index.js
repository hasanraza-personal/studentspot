const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors');
// const download = require('download');

connectToMongo();
const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

app.use(express.static(__dirname + '/public'));


// Available Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/common', require('./routes/commonRoute'));
app.use('/api/qna', require('./routes/qnaRoute'));
app.use('/api/student', require('./routes/student/profileRoute'));
app.use('/api/student/achievement', require('./routes/student/achievementRoute'));
app.use('/api/student/internship', require('./routes/student/internshipRoute'));
app.use('/api/student/project', require('./routes/student/projectRoute'));

app.use('/api/teacher', require('./routes/teacher/studentRoute'));
app.use('/api/teacher', require('./routes/teacher/notificationRoute'));

app.use('/api/newsletter', require('./routes/newsletter/newsletterRoute'));

app.get('/', (req, res) => {
    res.send('Hello World')
})

// Download Project
app.get('/project_file', (req, res) => {
    var filename = req.query.filename
    res.download('public/project_file/' + filename)
});

app.listen(port, () => {
    // console.log(`Studentspot app listening at http://localhost:${port}`);
})