import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, Modal, TouchableOpacity, 
  FlatList, TextInput, KeyboardAvoidingView, Platform,
  ActivityIndicator, Keyboard, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme';
import { layout } from '../constants';
import { Avatar } from './Avatar';
import { commentService } from '../services/commentService';
import { formatTimeAgo } from '../utils/videoUtils';
import { useAuth } from '../context/AuthContext';

interface Props {
  visible: boolean;
  onClose: () => void;
  videoId: string;
}

export const CommentsModal: React.FC<Props> = ({ visible, onClose, videoId }) => {
  const { user: currentUser, isAuthenticated } = useAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [syncingCommentIds, setSyncingCommentIds] = useState<Set<string>>(new Set());
  
  const [replyingTo, setReplyingTo] = useState<any>(null);
  const [repliesData, setRepliesData] = useState<{ [key: string]: any[] }>({});
  const [loadingReplies, setLoadingReplies] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (visible && videoId) {
      fetchComments();
    }
  }, [visible, videoId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await commentService.getVideoComments(videoId);
      setComments(data.comments || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || submitting || !isAuthenticated) return;

    // Optimistic Update - Show comment immediately
    const tempId = `temp-${Date.now()}`;
    const newComment = {
      _id: tempId,
      text: commentText,
      createdAt: new Date().toISOString(),
      user: {
        _id: currentUser?._id,
        username: currentUser?.username,
        avatar: currentUser?.avatar
      },
      likes: [],
      likesCount: 0,
      repliesCount: 0,
      parentComment: replyingTo?._id || null
    };

    if (replyingTo) {
      setRepliesData(prev => ({
        ...prev,
        [replyingTo._id]: [newComment, ...(prev[replyingTo._id] || [])]
      }));
      setComments(prev => prev.map(c => 
        c._id === replyingTo._id ? { ...c, repliesCount: (c.repliesCount || 0) + 1 } : c
      ));
    } else {
      setComments(prev => [newComment, ...prev]);
    }
    
    const originalText = commentText;
    const parentId = replyingTo?._id;
    setCommentText('');
    setReplyingTo(null);
    setSubmitting(true);
    setSyncingCommentIds(prev => new Set([...prev, tempId]));
    Keyboard.dismiss();

    try {
      // Sync with backend
      const serverResponse = await commentService.addComment(videoId, originalText, parentId);
      
      // Replace temp comment with server version
      if (replyingTo) {
        setRepliesData(prev => ({
          ...prev,
          [parentId]: prev[parentId]?.map(c => c._id === tempId ? serverResponse : c) || []
        }));
      } else {
        setComments(prev => prev.map(c => c._id === tempId ? serverResponse : c));
      }
    } catch (error) {
      console.error('Add comment failed:', error);
      // Rollback - remove the temp comment
      if (replyingTo) {
        setRepliesData(prev => ({
          ...prev,
          [parentId]: prev[parentId]?.filter(c => c._id !== tempId) || []
        }));
        setComments(prev => prev.map(c => 
          c._id === replyingTo._id ? { ...c, repliesCount: Math.max(0, (c.repliesCount || 0) - 1) } : c
        ));
      } else {
        setComments(prev => prev.filter(c => c._id !== tempId));
      }
      Alert.alert('Error', 'Failed to add comment. Please try again.');
    } finally {
      setSubmitting(false);
      setSyncingCommentIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(tempId);
        return newSet;
      });
    }
  };

  const handleLike = async (comment: any, isReply = false, parentId?: string) => {
    if (!isAuthenticated) return;
    
    // Optimistic update
    const isLiked = comment.likes?.includes(currentUser?._id);
    const newLikesCount = isLiked ? Math.max(0, (comment.likesCount || 0) - 1) : (comment.likesCount || 0) + 1;
    const newLikesArray = isLiked 
      ? comment.likes?.filter((id: string) => id !== currentUser?._id)
      : [...(comment.likes || []), currentUser?._id];

    const updateFn = (c: any) => c._id === comment._id ? { ...c, likesCount: newLikesCount, likes: newLikesArray } : c;

    // Update UI immediately
    if (isReply && parentId) {
      setRepliesData(prev => ({ ...prev, [parentId]: prev[parentId]?.map(updateFn) || [] }));
    } else {
      setComments(prev => prev.map(updateFn));
    }

    // Mark as syncing
    setSyncingCommentIds(prev => new Set([...prev, comment._id]));

    try {
      // Sync with backend
      await commentService.likeComment(comment._id);
    } catch (error) {
      console.error('Like failed:', error);
      // Rollback on error
      const revertUpdateFn = (c: any) => c._id === comment._id 
        ? { ...c, likesCount: comment.likesCount, likes: comment.likes } 
        : c;
      
      if (isReply && parentId) {
        setRepliesData(prev => ({ ...prev, [parentId]: prev[parentId]?.map(revertUpdateFn) || [] }));
      } else {
        setComments(prev => prev.map(revertUpdateFn));
      }
      Alert.alert('Error', 'Failed to like comment. Please try again.');
    } finally {
      setSyncingCommentIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(comment._id);
        return newSet;
      });
    }
  };

  const handleFetchReplies = async (commentId: string) => {
    if (loadingReplies[commentId] || repliesData[commentId]) return;
    try {
      setLoadingReplies(prev => ({ ...prev, [commentId]: true }));
      const replies = await commentService.getCommentReplies(commentId);
      setRepliesData(prev => ({ ...prev, [commentId]: replies }));
    } catch (error) {
      console.error('Fetch replies failed:', error);
    } finally {
      setLoadingReplies(prev => ({ ...prev, [commentId]: false }));
    }
  };

  const handleDelete = async (commentId: string, isReply = false, parentId?: string) => {
    Alert.alert('Delete Comment', 'Are you sure you want to delete this comment?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive',
        onPress: async () => {
          if (isReply && parentId) {
            setRepliesData(prev => ({ ...prev, [parentId]: prev[parentId]?.filter(c => c._id !== commentId) || [] }));
            setComments(prev => prev.map(c => c._id === parentId ? { ...c, repliesCount: Math.max(0, (c.repliesCount || 0) - 1) } : c));
          } else {
            setComments(prev => prev.filter(c => c._id !== commentId));
          }

          try {
            await commentService.deleteComment(commentId);
          } catch (error) {
            console.error('Delete failed:', error);
            fetchComments();
          }
        }
      }
    ]);
  };

  const handleReport = async (commentId: string) => {
    Alert.alert('Report Comment', 'Do you want to report this comment for inappropriate content?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Report', 
        style: 'destructive',
        onPress: async () => {
          try {
            await commentService.reportComment(commentId, 'Inappropriate content');
            Alert.alert('Success', 'Comment has been reported.');
          } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to report comment.');
          }
        }
      }
    ]);
  };

  const handleLongPress = (comment: any, isReply = false, parentId?: string) => {
    if (!isAuthenticated) return;
    if (comment.user._id === currentUser?._id) {
      handleDelete(comment._id, isReply, parentId);
    } else {
      handleReport(comment._id);
    }
  };

  const renderReplyItem = (reply: any, parentId: string) => {
    const isLiked = reply.likes?.includes(currentUser?._id);
    const isSyncing = syncingCommentIds.has(reply._id);
    return (
      <TouchableOpacity 
        key={reply._id} 
        style={[styles.commentItem, styles.replyItem]}
        onLongPress={() => handleLongPress(reply, true, parentId)}
        delayLongPress={500}
      >
        <Avatar uri={reply.user?.avatar} size={28} />
        <View style={styles.commentContent}>
          <View style={styles.commentHeader}>
            <Text style={styles.username}>{reply.user?.username || 'User'}</Text>
            <Text style={styles.timestamp}>{formatTimeAgo(reply.createdAt)}</Text>
          </View>
          <Text style={styles.commentText}>{reply.text}</Text>
          <View style={styles.commentActions}>
            <TouchableOpacity 
              style={styles.commentAction} 
              onPress={() => handleLike(reply, true, parentId)}
              disabled={isSyncing}
            >
              {isSyncing ? (
                <ActivityIndicator size="small" color={colors.dark.primary} />
              ) : (
                <Ionicons 
                  name={isLiked ? "thumbs-up" : "thumbs-up-outline"} 
                  size={14} 
                  color={isLiked ? colors.dark.primary : colors.dark.textSecondary} 
                />
              )}
              <Text style={styles.commentActionText}>{reply.likesCount || reply.likes?.length || 0}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCommentItem = ({ item }: { item: any }) => {
    const isLiked = item.likes?.includes(currentUser?._id);
    const hasReplies = item.repliesCount > 0;
    const isRepliesExpanded = !!repliesData[item._id];
    const isSyncing = syncingCommentIds.has(item._id);

    return (
      <View style={{ marginBottom: layout.spacing.lg }}>
        <TouchableOpacity 
          style={styles.commentItemWrapper}
          onLongPress={() => handleLongPress(item)}
          delayLongPress={500}
        >
          <Avatar uri={item.user?.avatar} size={36} />
          <View style={styles.commentContent}>
            <View style={styles.commentHeader}>
              <Text style={styles.username}>{item.user?.username || 'User'}</Text>
              <Text style={styles.timestamp}>{formatTimeAgo(item.createdAt)}</Text>
            </View>
            <Text style={[styles.commentText, item._id.startsWith('temp-') && { opacity: 0.6 }]}>{item.text}</Text>
            <View style={styles.commentActions}>
              <TouchableOpacity 
                style={styles.commentAction} 
                onPress={() => handleLike(item)}
                disabled={isSyncing}
              >
                {isSyncing ? (
                  <ActivityIndicator size="small" color={colors.dark.primary} />
                ) : (
                  <Ionicons 
                    name={isLiked ? "thumbs-up" : "thumbs-up-outline"} 
                    size={16} 
                    color={isLiked ? colors.dark.primary : colors.dark.textSecondary} 
                  />
                )}
                <Text style={styles.commentActionText}>{item.likesCount || item.likes?.length || 0}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.commentAction} onPress={() => setReplyingTo(item)}>
                <Text style={styles.commentActionText}>Reply</Text>
              </TouchableOpacity>
            </View>
            
            {hasReplies && !isRepliesExpanded && !loadingReplies[item._id] && (
              <TouchableOpacity 
                style={styles.viewRepliesBtn} 
                onPress={() => handleFetchReplies(item._id)}
              >
                <Ionicons name="chevron-down" size={16} color={colors.dark.primary} />
                <Text style={styles.viewRepliesText}>View {item.repliesCount} replies</Text>
              </TouchableOpacity>
            )}

            {loadingReplies[item._id] && (
              <ActivityIndicator size="small" color={colors.dark.primary} style={{ alignSelf: 'flex-start', marginTop: 8 }} />
            )}
          </View>
        </TouchableOpacity>

        {isRepliesExpanded && (
          <View style={styles.repliesContainer}>
            {repliesData[item._id]?.map((reply: any) => renderReplyItem(reply, item._id))}
          </View>
        )}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.content}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Comments ({comments.length})</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.dark.text} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={colors.dark.primary} style={{ flex: 1 }} />
          ) : (
            <FlatList
              data={comments}
              renderItem={renderCommentItem}
              keyExtractor={item => item._id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No comments yet. Be the first to comment!</Text>
              }
            />
          )}

          {replyingTo && (
            <View style={styles.replyingToBanner}>
              <Text style={styles.replyingToText}>Replying to {replyingTo.user?.username}</Text>
              <TouchableOpacity onPress={() => setReplyingTo(null)}>
                <Ionicons name="close-circle" size={20} color={colors.dark.textSecondary} />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.inputContainer}>
            <Avatar uri={currentUser?.avatar} size={36} />
            <TextInput
              style={styles.input}
              placeholder={isAuthenticated ? "Add a comment..." : "Login to comment"}
              placeholderTextColor={colors.dark.textSecondary}
              value={commentText}
              onChangeText={setCommentText}
              multiline
              editable={isAuthenticated && !submitting}
            />
            <TouchableOpacity 
              onPress={handleAddComment}
              disabled={!commentText.trim() || submitting || !isAuthenticated}
            >
              <Ionicons 
                name="send" 
                size={24} 
                color={commentText.trim() ? colors.dark.primary : colors.dark.textSecondary} 
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  content: {
    backgroundColor: colors.dark.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: '70%',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  title: {
    color: colors.dark.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold as '700',
  },
  listContent: {
    padding: layout.spacing.md,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: layout.spacing.lg,
  },
  commentContent: {
    flex: 1,
    marginLeft: layout.spacing.sm,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  username: {
    color: colors.dark.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold as '700',
    marginRight: 8,
  },
  timestamp: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.xs,
  },
  commentText: {
    color: colors.dark.text,
    fontSize: typography.sizes.sm,
    lineHeight: 18,
  },
  commentActions: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
  },
  commentAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  commentActionText: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.xs,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
  },
  input: {
    flex: 1,
    color: colors.dark.text,
    backgroundColor: colors.dark.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 12,
    maxHeight: 100,
  },
  emptyText: {
    color: colors.dark.textSecondary,
    textAlign: 'center',
    marginTop: 40,
    fontSize: typography.sizes.md,
  },
  commentItemWrapper: {
    flexDirection: 'row',
  },
  replyItem: {
    marginTop: layout.spacing.md,
    marginBottom: 0,
  },
  repliesContainer: {
    marginLeft: 36 + layout.spacing.sm,
    borderLeftWidth: 1,
    borderLeftColor: colors.dark.border,
    paddingLeft: layout.spacing.md,
  },
  viewRepliesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  viewRepliesText: {
    color: colors.dark.primary,
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    marginLeft: 4,
  },
  replyingToBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.dark.background,
    paddingHorizontal: layout.spacing.md,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
  },
  replyingToText: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.sm,
  },
});
