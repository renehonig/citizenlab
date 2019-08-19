/*
 * NotificationMenu Messages
 *
 * This contains all the text for the NotificationMenu component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  loading: {
    id: 'app.containers.NotificationMenu.loading',
    defaultMessage: 'Loading notifications...',
  },
  error: {
    id: 'app.containers.NotificationMenu.error',
    defaultMessage: 'Couldn\'t load notifications',
  },
  loadMore: {
    id: 'app.containers.NotificationMenu.loadMore',
    defaultMessage: 'Load more...',
  },
  clearAll: {
    id: 'app.containers.NotificationMenu.clearAll',
    defaultMessage: 'Clear all',
  },
  noNotifications: {
    id: 'app.containers.NotificationMenu.noNotifications',
    defaultMessage: 'You don\'t have any notifications yet',
  },
  userCommentedOnYourIdea: {
    id: 'app.containers.NotificationMenu.userCommentedOnYourIdea',
    defaultMessage: '{name} commented on your idea',
  },
  userCommentedOnYourInitiative: {
    id: 'app.containers.NotificationMenu.userCommentedOnYourInitiative',
    defaultMessage: '{name} commented on your initiative',
  },
  userReactedToYourComment: {
    id: 'app.containers.NotificationMenu.userReactedToYourComment',
    defaultMessage: '{name} reacted to your comment',
  },
  mentionInComment: {
    id: 'app.containers.NotificationMenu.mentionInComment',
    defaultMessage: '{name} mentioned you in a comment',
  },
  userMarkedCommentAsSpam: {
    id: 'app.containers.NotificationMenu.userMarkedCommentAsSpam',
    defaultMessage: '{name} reported a comment on \'{postTitle}\' as spam',
  },
  userMarkedPostAsSpam: {
    id: 'app.containers.NotificationMenu.userMarkedPostAsSpam',
    defaultMessage: '{name} reported \'{postTitle}\' as spam',
  },
  statusChangedOfYourIdea: {
    id: 'app.containers.NotificationMenu.statusChangedOfYourIdea',
    defaultMessage: '\'{ideaTitle}\' status has changed to {status}',
  },
  statusChangeOnVotedIdea: {
    id: 'app.containers.NotificationMenu.statusChangeOnVotedIdea',
    defaultMessage: 'The status of an idea you voted for changed to {status}',
  },
  statusChangeOnCommentedIdea: {
    id: 'app.containers.NotificationMenu.statusChangeOnCommentedIdea',
    defaultMessage: 'The status of an idea you commented on changed to {status}',
  },
  userAcceptedYourInvitation: {
    id: 'app.containers.NotificationMenu.userAcceptedYourInvitation',
    defaultMessage: '{name} accepted your invitation',
  },
  commentDeletedByAdmin: {
    id: 'app.containers.NotificationMenu.commentDeletedByAdmin',
    defaultMessage: `Your comment on '{postTitle}' has been deleted by an admin because
      {reasonCode, select,
        irrelevant {it is irrelevant}
        inappropriate {its content is inappropriate}
        other {{otherReason}}
      }
    `,
  },
  projectModerationRightsReceived: {
    id: 'app.containers.NotificationMenu.projectModerationRightsReceived',
    defaultMessage: 'You\'re now a moderator of {projectLink}',
  },
  adminRightsReceived: {
    id: 'app.containers.NotificationMenu.adminRightsReceived',
    defaultMessage: 'You\'re now an administrator of the platform',
  },
  notificationsLabel: {
    id: 'app.containers.NotificationMenu.notificationsLabel',
    defaultMessage: 'Notifications',
  },
  deletedUser: {
    id: 'app.containers.NotificationMenu.deletedUser',
    defaultMessage: 'Deleted user',
  },
  userPostedIdea: {
    id: 'app.containers.NotificationMenu.userPostedIdea',
    defaultMessage: '{ideaAuthorFirstName} posted {idea}',
  },
  userPostedComment: {
    id: 'app.containers.NotificationMenu.userPostedComment',
    defaultMessage: '{commentAuthorFirstName} commented on {idea}',
  },
  officialFeedbackOnYourIdea: {
    id: 'app.containers.NotificationMenu.officialFeedbackOnYourIdea',
    defaultMessage: '{officialName} gave an official update on {idea}',
  },
  officialFeedbackOnVotedIdea: {
    id: 'app.containers.NotificationMenu.officialFeedbackOnVotedIdea',
    defaultMessage: '{officialName} gave an official update on an idea you voted for',
  },
  officialFeedbackOnCommentedIdea: {
    id: 'app.containers.NotificationMenu.officialFeedbackOnCommentedIdea',
    defaultMessage: '{officialName} gave an official update on an idea you commented on',
  },
  mentionInOfficialFeedback: {
    id: 'app.containers.NotificationMenu.mentionInOfficialFeedback',
    defaultMessage: '{officialName} mentioned you in an official update',
  },
  projectPhaseStarted: {
    id: 'app.containers.NotificationMenu.projectPhaseStarted',
    defaultMessage: '{projectTitle} entered a new phase',
  },
  projectPhaseUpcoming: {
    id: 'app.containers.NotificationMenu.projectPhaseUpcoming',
    defaultMessage: '{projectTitle} will enter a new phase on {phaseStartAt}',
  },
  postAssignedToYou: {
    id: 'app.containers.NotificationMenu.postAssignedToYou',
    defaultMessage: '{postTitle} was assigned to you',
  },
  xAssignedPostToYou: {
    id: 'app.containers.NotificationMenu.xAssignedPostToYou',
    defaultMessage: '{name} assigned {postTitle} to you',
  },
});
