require('dotenv').config();
const express = require('express');
const { connectDB } = require('./config/database');
const cookieParser = require('cookie-parser');

const { corsMiddleware } = require('../middlewares/cors');

const { authRouter } = require('./routes/auth');
const { todoRouter } = require('./routes/todo');

const app = express();
app.use(express.json());
app.use(corsMiddleware);
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api', todoRouter);

connectDB()
	.then(() => {
		app.listen(process.env.PORT, () => {
			console.log(`🚀 server running at port ${process.env.PORT}`);
		});
	})
	.catch(() => {
		console.log(`❌ server failed!`);
	});
