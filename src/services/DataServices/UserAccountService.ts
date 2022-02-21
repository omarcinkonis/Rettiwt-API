// This file contains the service that handles getting and posting User account data to and from official TwitterAPI

// Custom libs

import { FetcherService } from '../FetcherService';

import {
    Errors,
    Error,
    Response
} from '../../schema/types/HTTP'

import { User } from '../../schema/types/UserAccountData';
import { Tweet } from '../../schema/types/TweetData';

import {
    userAccountUrl,
    userFollowingUrl,
    userFollowersUrl,
    userLikesUrl
} from '../helper/Requests';

import { filterJSON, findJSONKey } from '../helper/Parser';

export class UserAccountService extends FetcherService {
    // MEMBER METHODS
    // The constructor
    constructor(
        authToken: string,
        csrfToken: string,
        cookie: string
    ) {
        super(authToken, csrfToken, cookie);
    }

    // Method to fetch the user account details using screen name
    getUserAccountDetails(screenName: string): Promise<Response<User>> {
        return this.fetchData(userAccountUrl(screenName))
            .then(res => {
                // If user does not exist
                if (!Object.keys(res['data']).length) {
                    return new Response<User>(
                        false,
                        new Error(Errors.UserNotFound),
                        {},
                    );
                }
                // If user exists
                else {
                    return new Response<User>(
                        true,
                        new Error(Errors.NoError),
                        new User().deserialize(findJSONKey(res, 'result')),
                    );
                }
            })
            // If other run-time errors
            .catch(err => {
                return new Response<User>(
                    false,
                    new Error(Errors.FatalError),
                    {},
                );
            });
    }

    // Method to fetch the list of users followed by given user
    getUserFollowing(
        userId: string,
        count: number,
        cursor: string
    ): Promise<Response<{ following: User[], next: string }>> {
        return this.fetchData(userFollowingUrl(userId, count, cursor))
            .then(res => {
                // If user does not exists
                if (!Object.keys(res['data']['user']).length) {
                    return new Response<{ following: User[], next: string }>(
                        false,
                        new Error(Errors.UserNotFound),
                        { following: [], next: '' }
                    );
                }
                // If user exists
                else {
                    var following: User[] = [];
                    var next: string = '';

                    // Extracting the raw list of following
                    res = findJSONKey(res, 'entries');

                    // Extracting cursor to next batch
                    next = filterJSON(res, { "cursorType": "Bottom" })['value'].replace('|', '%7C');

                    // Iterating over the raw list of following
                    for (var entry of res) {
                        // Checking if the entry is of type user
                        if (entry['entryId'].indexOf('user') != -1) {
                            // Adding the followed users to list of users
                            following.push(new User().deserialize(findJSONKey(entry, 'result')));
                        }
                    }

                    return new Response<{ following: User[], next: string }>(
                        true,
                        new Error(Errors.NoError),
                        { following: following, next: next }
                    );
                }
            })
            // If other run-time error
            .catch(err => {
                return new Response<{ following: User[], next: string }>(
                    false,
                    new Error(Errors.FatalError),
                    { following: [], next: '' }
                )
            });
    }

    // Method to fetch a list of followers of the given user
    getUserFollowers(
        userId: string,
        count: number,
        cursor: string
    ): Promise<Response<{ followers: User[], next: string }>> {
        return this.fetchData(userFollowersUrl(userId, count, cursor))
            .then(res => {
                // If user does not exist
                if (!Object.keys(res['data']['user']).length) {
                    return new Response<{ followers: User[], next: string }>(
                        false,
                        new Error(Errors.UserNotFound),
                        { followers: [], next: [] }
                    );
                }
                // If user exists
                else {
                    var followers: User[] = [];
                    var next: string = '';

                    // Extracting the raw list of followers
                    res = findJSONKey(res, 'entries');

                    // Extracting cursor to next batch
                    next = filterJSON(res, { "cursorType": "Bottom" })['value'].replace('|', '%7C');

                    // Itearating over the raw list of following
                    for (var entry of res) {
                        // Checking if the entry is of type user
                        if (entry['entryId'].indexOf('user') != -1) {
                            // Adding the follower to list of followers
                            followers.push(new User().deserialize(findJSONKey(entry, 'result')));
                        }
                    }

                    return new Response<{ followers: User[], next: string }>(
                        true,
                        new Error(Errors.NoError),
                        { followers: followers, next: next }
                    );
                }
            })
            // If other run-time error
            .catch(err => {
                return new Response<{ followers: User[], next: string }>(
                    false,
                    new Error(err),
                    { followers: [], next: '' }
                );
            });
    }

    // Method to fetch the list of tweets liked by the user
    getUserLikes(
        userId: string,
        count: number,
        cursor: string
    ): Promise<Response<{ tweets: Tweet[], next: string }>> {
        return this.fetchData(userLikesUrl(userId, count, cursor))
            .then(res => {
                // If user not found
                if (!Object.keys(res['data']['user']).length) {
                    return new Response<{ tweets: Tweet[], next: string }>(
                        false,
                        new Error(Errors.UserNotFound),
                        { tweets: [], next: '' }
                    );
                }
                // If user found
                else {
                    var tweets: Tweet[] = [];
                    var next: string = '';

                    // Extracting the raw list of followers
                    res = findJSONKey(res, 'entries');

                    // Extracting cursor to next batch
                    next = filterJSON(res, { "cursorType": "Bottom" })['value'].replace('|', '%7C');

                    // Itearating over the raw list of following
                    for (var entry of res) {
                        // Checking if the entry is of type user
                        if (entry['entryId'].indexOf('tweet') != -1) {
                            // Adding the tweet to list of liked tweets
                            tweets.push(new Tweet().deserialize(findJSONKey(entry, 'result')));
                        }
                    }

                    return new Response<{ tweets: Tweet[], next: string }>(
                        true,
                        new Error(Errors.NoError),
                        { tweets: tweets, next: next }
                    );
                }
            })
            // If error parsing json
            .catch(err => {
                return new Response<{ tweets: Tweet[], next: string }>(
                    false,
                    new Error(err),
                    { tweets: [], next: '' }
                );
            });
    }
};