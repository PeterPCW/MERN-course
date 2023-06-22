import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { NotFound } from './NotFound';
import { useUser } from '../hooks/useUser';
import { articles } from './content';

// const response = await fetch('http://localhost:8080/api/articles/learn-react');
// const data = await response.json();

export const ArticlePage = () => {
	const [articleInfo, setArticleInfo] = useState({ upvotes: 0, comments: [], canUpvote: true });
	const { canUpvote } = articleInfo;
	const { name } = useParams();

	const { user, isLoading } = useUser();

	const [text, setText] = useState('');

	useEffect(() => {
		const loadInfo = async () => {
			const token = user && await user.getIdToken();
			const headers = token ? { authtoken: token } : {};
			const response = await fetch(`/api/articles/${name}`, { headers });
			const data = await response.json();
			setArticleInfo(data);
		}

		if (!isLoading) {
			loadInfo();
		}
	}, [name, isLoading, user]);

	const matchingArticle = articles.find(
		article => article.name === name
	);

	const upvoteArticle = async () => {
		const token = user && await user.getIdToken();
		const headers = token ? { authtoken: token } : {};
		const response = await fetch(`/api/articles/${name}/upvotes`, {
			headers,
			method: 'post',
		});	
		const data = await response.json();
		setArticleInfo(data);
	}

	const addComment = async () => {
		const token = user && await user.getIdToken();
		const headers = token ? { authtoken: token } : {};
		const author = user.email;
		const response = await fetch(`/api/articles/${name}/comments`, {
			method: 'post',
			body: JSON.stringify({ author, text }),
			headers: {
				'Content-Type': 'application/json',
				...headers,
			}
		});
		const data = await response.json();
		setArticleInfo(data);
		setText('');
	}

	return matchingArticle ? (
		<>
		<h1>{matchingArticle.title}</h1>
		{isLoading ? <p>Loading...</p> : (
			<div id="upvotes-section">
				{user
					? <button onClick={() => upvoteArticle()}>{canUpvote ? 'Upvote' : 'Voted'}</button>
					: <button>Log in to vote</button>}
				<p>This article has {articleInfo.upvotes} upvotes</p>
			</div>
		)}
		{matchingArticle.content.map((paragraph, i) => (
			<p key={i}>{paragraph}</p>
		))}
		{user 
			? <div id="add-comment-form">
			<h3>Add a Comment</h3>
			{user && <p>You are posting as {user.email}</p>}
			<label>
				Comment:
				<textarea
					value={text}
					onChange={e => setText(e.target.value)}
					rows="4"
					cols="50" />
			</label>
			<button onClick={() => addComment()}>Add Comment</button>
		</div>
		: <button>Log in to comment</button>}
		<h3>Comments</h3>
		{articleInfo.comments.map(comment => (
			<div className="comment" key={comment.text}>
				<h4>{comment.author}</h4>
				<p>{comment.text}</p>
			</div>
		))}
		</>
	) : <NotFound />;
}