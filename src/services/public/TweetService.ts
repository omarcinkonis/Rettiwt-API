// PACKAGES
import { EResourceType, TweetFilter } from 'rettiwt-core';

// SERVICES
import { FetcherService } from '../internal/FetcherService';

// TYPES
import { IRettiwtConfig } from '../../types/RettiwtConfig';

// MODELS
import { Tweet } from '../../models/public/Tweet';
import { User } from '../../models/public/User';
import { CursoredData } from '../../models/public/CursoredData';

/**
 * Handles fetching of data related to tweets.
 *
 * @public
 */
export class TweetService extends FetcherService {
	/**
	 * @param config - The config object for configuring the Rettiwt instance.
	 *
	 * @internal
	 */
	public constructor(config?: IRettiwtConfig) {
		super(config);
	}

	/**
	 * Get the details of a tweet.
	 *
	 * @param id - The id of the target tweet.
	 * @returns The details of a single tweet with the given tweet id.
	 *
	 * @example
	 * ```
	 * import { Rettiwt } from 'rettiwt-api';
	 *
	 * // Creating a new Rettiwt instance using the given 'API_KEY'
	 * const rettiwt = new Rettiwt({ apiKey: API_KEY });
	 *
	 * // Fetching the details of the tweet with the id '12345678'
	 * rettiwt.tweet.details('12345678')
	 * .then(res => {
	 * 	console.log(res);
	 * })
	 * .catch(err => {
	 * 	console.log(err);
	 * });
	 * ```
	 *
	 * @public
	 */
	public async details(id: string): Promise<Tweet> {
		// Fetching the requested data
		const data = await this.fetch<Tweet>(EResourceType.TWEET_DETAILS, { id: id });

		return data.list[0];
	}

	/**
	 * Search for tweets using a query.
	 *
	 * @param query - The query be used for searching the tweets.
	 * @param count - The number of tweets to fetch, must be \<= 20.
	 * @param cursor - The cursor to the batch of tweets to fetch.
	 * @returns The list of tweets that match the given filter.
	 *
	 * @example
	 * ```
	 * import { Rettiwt } from 'rettiwt-api';
	 *
	 * // Creating a new Rettiwt instance using the given 'API_KEY'
	 * const rettiwt = new Rettiwt({ apiKey: API_KEY });
	 *
	 * // Fetching the most recent 5 tweets from user 'user1'
	 * rettiwt.tweet.search({ fromUsers: ['user1'] }, 5)
	 * .then(res => {
	 * 	console.log(res);
	 * })
	 * .catch(err => {
	 * 	console.log(err);
	 * });
	 * ```
	 *
	 * @remarks For details about available filters, refer to {@link TweetFilter}
	 *
	 * @public
	 */
	public async search(query: TweetFilter, count?: number, cursor?: string): Promise<CursoredData<Tweet>> {
		// Fetching the requested data
		const data = await this.fetch<Tweet>(EResourceType.TWEET_SEARCH, {
			filter: query,
			count: count,
			cursor: cursor,
		});

		// Sorting the tweets by date, from recent to oldest
		data.list.sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf());

		return data;
	}

	/**
	 * Get the tweets from the tweet list with the given id.
	 *
	 * @param listId - The id of list from where the tweets are to be fetched.
	 * @param count - The number of tweets to fetch, must be \<= 100.
	 * @param cursor - The cursor to the batch of tweets to fetch.
	 * @returns The list tweets present in the given list.
	 *
	 * @example
	 * ```
	 * import { Rettiwt } from 'rettiwt-api';
	 *
	 * // Creating a new Rettiwt instance using the given 'API_KEY'
	 * const rettiwt = new Rettiwt({ apiKey: API_KEY });
	 *
	 * // Fetching the most recent 100 tweets of the Twitter list with id '12345678'
	 * rettiwt.tweet.list('12345678')
	 * .then(res => {
	 * 	console.log(res);
	 * })
	 * .catch(err => {
	 * 	console.log(err);
	 * });
	 * ```
	 *
	 * @remarks Due a bug in Twitter API, the count is ignored when no cursor is provided and defaults to 100.
	 */
	public async list(listId: string, count?: number, cursor?: string): Promise<CursoredData<Tweet>> {
		// Fetching the requested data
		const data = await this.fetch<Tweet>(EResourceType.LIST_TWEETS, {
			id: listId,
			count: count,
			cursor: cursor,
		});

		// Sorting the tweets by date, from recent to oldest
		data.list.sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf());

		return data;
	}

	/**
	 * Get the list of users who liked a tweet.
	 *
	 * @param tweetId - The rest id of the target tweet.
	 * @param count - The number of favoriters to fetch, must be \<= 100.
	 * @param cursor - The cursor to the batch of favoriters to fetch.
	 * @returns The list of users who liked the given tweet.
	 *
	 * @example
	 * ```
	 * import { Rettiwt } from 'rettiwt-api';
	 *
	 * // Creating a new Rettiwt instance using the given 'API_KEY'
	 * const rettiwt = new Rettiwt({ apiKey: API_KEY });
	 *
	 * // Fetching the most recent 100 likers of the Tweet with id '12345678'
	 * rettiwt.tweet.favoriters('12345678')
	 * .then(res => {
	 * 	console.log(res);
	 * })
	 * .catch(err => {
	 * 	console.log(err);
	 * });
	 * ```
	 *
	 * @public
	 */
	public async favoriters(tweetId: string, count?: number, cursor?: string): Promise<CursoredData<User>> {
		// Fetching the requested data
		const data = await this.fetch<User>(EResourceType.TWEET_FAVORITERS, {
			id: tweetId,
			count: count,
			cursor: cursor,
		});

		return data;
	}

	/**
	 * Get the list of users who retweeted a tweet.
	 *
	 * @param tweetId - The rest id of the target tweet.
	 * @param count - The number of retweeters to fetch, must be \<= 100.
	 * @param cursor - The cursor to the batch of retweeters to fetch.
	 * @returns The list of users who retweeted the given tweet.
	 *
	 * @example
	 * ```
	 * import { Rettiwt } from 'rettiwt-api';
	 *
	 * // Creating a new Rettiwt instance using the given 'API_KEY'
	 * const rettiwt = new Rettiwt({ apiKey: API_KEY });
	 *
	 * // Fetching the most recent 100 retweeters of the Tweet with id '12345678'
	 * rettiwt.tweet.retweeters('12345678')
	 * .then(res => {
	 * 	console.log(res);
	 * })
	 * .catch(err => {
	 * 	console.log(err);
	 * });
	 * ```
	 *
	 * @public
	 */
	public async retweeters(tweetId: string, count?: number, cursor?: string): Promise<CursoredData<User>> {
		// Fetching the requested data
		const data = await this.fetch<User>(EResourceType.TWEET_RETWEETERS, {
			id: tweetId,
			count: count,
			cursor: cursor,
		});

		return data;
	}

	/**
	 * Post a tweet.
	 *
	 * @param tweetText - The text to be posted, length must be \<= 280 characters.
	 * @returns Whether posting was successful or not.
	 *
	 * @example
	 * ```
	 * import { Rettiwt } from 'rettiwt-api';
	 *
	 * // Creating a new Rettiwt instance using the given 'API_KEY'
	 * const rettiwt = new Rettiwt({ apiKey: API_KEY });
	 *
	 * // Posting a tweet to twitter
	 * rettiwt.tweet.tweet('Hello World!')
	 * .then(res => {
	 * 	console.log(res);
	 * })
	 * .catch(err => {
	 * 	console.log(err);
	 * });
	 * ```
	 *
	 * @public
	 */
	public async tweet(tweetText: string): Promise<boolean> {
		// Posting the tweet
		const data = await this.post(EResourceType.CREATE_TWEET, { tweetText: tweetText });

		return data;
	}

	/**
	 * Favorite the tweet with the given id.
	 *
	 * @param tweetId - The id of the tweet to be favorited.
	 * @returns Whether favoriting was successful or not.
	 *
	 * @example
	 * ```
	 * import { Rettiwt } from 'rettiwt-api';
	 *
	 * // Creating a new Rettiwt instance using the given 'API_KEY'
	 * const rettiwt = new Rettiwt({ apiKey: API_KEY });
	 *
	 * // Liking the Tweet with id '12345678'
	 * rettiwt.tweet.favorite('12345678')
	 * .then(res => {
	 * 	console.log(res);
	 * })
	 * .catch(err => {
	 * 	console.log(err);
	 * });
	 * ```
	 *
	 * @public
	 */
	public async favorite(tweetId: string): Promise<boolean> {
		// Favoriting the tweet
		const data = await this.post(EResourceType.FAVORITE_TWEET, { id: tweetId });

		return data;
	}

	/**
	 * Retweet the tweet with the given id.
	 *
	 * @param tweetId - The id of the tweet with the given id.
	 * @returns Whether retweeting was successful or not.
	 *
	 * @example
	 * ```
	 * import { Rettiwt } from 'rettiwt-api';
	 *
	 * // Creating a new Rettiwt instance using the given 'API_KEY'
	 * const rettiwt = new Rettiwt({ apiKey: API_KEY });
	 *
	 * // Retweeting the Tweet with id '12345678'
	 * rettiwt.tweet.retweet('12345678')
	 * .then(res => {
	 * 	console.log(res);
	 * })
	 * .catch(err => {
	 * 	console.log(err);
	 * });
	 * ```
	 *
	 * @public
	 */
	public async retweet(tweetId: string): Promise<boolean> {
		// Retweeting the tweet
		const data = await this.post(EResourceType.CREATE_RETWEET, { id: tweetId });

		return data;
	}
}
