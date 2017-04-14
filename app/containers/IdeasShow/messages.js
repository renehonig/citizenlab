/*
 * IdeasShow Messages
 *
 * This contains all the text for the IdeasShow component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  commentEditorHeader: {
    // generic error, when not set by backend
    id: 'app.containers.IdeasShow.commentEditorHeader',
    defaultMessage: 'Comment the idea!',
  },
  loadingIdea: {
    id: 'app.containers.IdeasShow.loadingIdea',
    defaultMessage: 'Loading...',
  },
  emptyCommentError: {
    id: 'app.containers.IdeasShow.emptyCommentError',
    defaultMessage: 'The comment can\'t be empty',
  },
  submittingComment: {
    id: 'app.containers.IdeasShow.submittingComment',
    defaultMessage: 'Publishing...',
  },
  publishComment: {
    id: 'app.containers.IdeasShow.publishComment',
    defaultMessage: 'Publish',
  },
  loadMoreComments: {
    id: 'app.containers.IdeasShow.loadMoreComments',
    defaultMessage: 'Load more comments...',
  },
  loadingComments: {
    id: 'app.containers.IdeasShow.loadingComments',
    defaultMessage: 'Loading comments...',
  },
});
