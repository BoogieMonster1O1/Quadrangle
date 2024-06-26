import { getRecentPostsNow } from '$lib/graphql/post/recentPosts';

export const load = async ({ cookies }) => {
    const accessToken = cookies.get('accessToken')!;
    const data = await getRecentPostsNow(accessToken, 10);
    return {
        data: data
    };
};
