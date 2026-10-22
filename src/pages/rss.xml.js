import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { getPublished } from '../utils/published';
import { getPostSlug } from '../utils/slug';

export async function GET(context) {
	const posts = await getPublished('blog');
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map((post) => ({
			...post.data,
			link: `/blog/${getPostSlug(post.id)}/`,
		})),
	});
}
