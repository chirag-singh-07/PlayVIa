import { videoService } from './videoService';
import { commentService } from './commentService';
import { subscriptionService } from './subscriptionService';

/**
 * Enhanced video service with optimistic updates
 * Usage: const result = await optimisticVideoService.toggleLikeOptimistic(videoId, currentLikeState);
 */
export const optimisticVideoService = {
  toggleLikeOptimistic: async (videoId: string, currentIsLiked: boolean, currentLikesCount: number) => {
    const newLikeState = !currentIsLiked;
    const newLikesCount = newLikeState 
      ? currentLikesCount + 1 
      : Math.max(0, currentLikesCount - 1);

    // Return optimistic data immediately
    const optimisticData = {
      isLiked: newLikeState,
      likesCount: newLikesCount,
    };

    // This will be synced in background
    const syncFn = () => videoService.toggleLike(videoId);

    return { optimisticData, syncFn };
  },
};

/**
 * Enhanced comment service with optimistic updates
 */
export const optimisticCommentService = {
  addCommentOptimistic: (
    commentText: string,
    userId: string,
    username: string,
    userAvatar: string,
    videoId: string,
    parentCommentId?: string
  ) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticData = {
      _id: tempId,
      text: commentText,
      createdAt: new Date().toISOString(),
      user: {
        _id: userId,
        username,
        avatar: userAvatar,
      },
      likes: [],
      likesCount: 0,
      repliesCount: 0,
      parentComment: parentCommentId || null,
    };

    const syncFn = () =>
      commentService.addComment(videoId, commentText, parentCommentId).then(response => {
        // Server should return the full comment with _id
        return response;
      });

    return { optimisticData, syncFn };
  },

  likeCommentOptimistic: (commentId: string, currentIsLiked: boolean, currentLikesCount: number) => {
    const newLikeState = !currentIsLiked;
    const newLikesCount = newLikeState
      ? currentLikesCount + 1
      : Math.max(0, currentLikesCount - 1);

    const optimisticData = {
      isLiked: newLikeState,
      likesCount: newLikesCount,
    };

    const syncFn = () => commentService.likeComment(commentId);

    return { optimisticData, syncFn };
  },

  deleteCommentOptimistic: (commentId: string) => {
    const optimisticData = { isDeleted: true };
    const syncFn = () => commentService.deleteComment(commentId);
    return { optimisticData, syncFn };
  },
};

/**
 * Enhanced subscription service with optimistic updates
 */
export const optimisticSubscriptionService = {
  toggleSubscribeOptimistic: (
    channelId: string,
    currentIsSubscribed: boolean,
    currentSubscriberCount: number
  ) => {
    const newSubscribeState = !currentIsSubscribed;
    const newSubscriberCount = newSubscribeState
      ? currentSubscriberCount + 1
      : Math.max(0, currentSubscriberCount - 1);

    const optimisticData = {
      isSubscribed: newSubscribeState,
      subscriberCount: newSubscriberCount,
    };

    const syncFn = () => subscriptionService.toggleSubscribe(channelId);

    return { optimisticData, syncFn };
  },
};
