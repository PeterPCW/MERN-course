import express from 'express';
import pkg from 'mongodb';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import admin from 'firebase-admin';
import 'dotenv/config';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { MongoClient } = pkg;

/*const app = express();
app.use(express.json());

app.post('/hello', (req, res) => {
	res.send(`Hello ${req.body.name}!`);
});

app.get('/hello/:name', (req, res) => {
	const { name } = req.params
	res.send(`Hello, ${name}?`)
}); 

app.listen(8000, () => {
	console.log("Server listening on :8000");
});*/

const credentials = JSON.parse(
	fs.readFileSync('./credentials.json')
);
admin.initializeApp({credential: admin.credential.cert(credentials), });

const server = express();

server.use(express.static(path.join(__dirname, '../build')))

server.use(express.json());

server.use(async (req, res, next) => {
	const { authtoken } = req.headers;
	if (authtoken) {
		try {
			req.user = await admin.auth.verifyIdToken(authtoken);
		} catch (e) {
			return res.sendStatus(400);
		}
	}

	req.user = req.user || {};

	next();
});

const start = async () => {
	const client = await MongoClient.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.pxxxiln.mongodb.net/?retryWrites=true&w=majority`, { //mongodb://127.0.0.1:27017
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	console.log('Successfully connected to database');
	const db = client.db('react-blog-db');

	server.get('/api/articles/:name', async (req, res) => {
		const { name } = req.params;
		const { uid } = req.user;

		const info = await db.collection('articles').findOne({ name });

		if (info) {
			const upvoteIds = info.upvoteIds || [];
			info.canUpvote = uid && !upvoteIds.includes(uid);
			res.json(info);
		} else {
			return res.sendStatus(404);
		}
	});

	server.use((req, res, next) => {
		if (req.user) {
			next();
		} else {
			return res.sendStatus(401);
		}
	});

	server.post('/api/articles/:name/upvotes', async (req, res) => {
		const { name } = req.params;
		const { uid } = req.user;

		const info = await db.collection('articles').findOne({ name });

		if (info) {
			const upvoteIds = info.upvoteIds || [];
			const canUpvote = uid && !upvoteIds.includes(uid);

			if (canUpvote) {
				await db.collection('articles').updateOne({ name }, {
					$inc: { upvotes: 1 },
					$push: { upvoteIds: uid }		
				});
			}

			const updatedInfo = await db.collection('articles').findOne({ name });
			res.json(updatedInfo);
		} else {
			return res.sendStatus(404);
		}	
	});

	server.post('/api/articles/:name/comments', async (req, res) => {
		const { name } = req.params;
		const { text } = req.body;
		const { email } = req.user;

		await db.collection('articles').updateOne({ name }, {
			$push: { comments: { author: email, text } },
		});

		const updatedInfo = await db.collection('articles').findOne({ name });

		if (updatedInfo) {
			res.json(updatedInfo) ;
		} else {
			return res.sendStatus(404);
		}	
	})

	/*server.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, '../build/index.html'));
	})*/

	server.get(/^(?!\/api).+/, (req, res) => {
		res.sendFile(path.join(__dirname, '../build/index.html'))
	})

	const PORT = process.env.PORT || 8080;

	server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
}

start();