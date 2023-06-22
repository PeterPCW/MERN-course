import ArticlesList from '../components/ArticlesList';
import { articles } from './content';

export const Articles = () => {
	return (
		<>
		<h1>Articles</h1>
		<ArticlesList articles={articles} />
		</>
	);
}