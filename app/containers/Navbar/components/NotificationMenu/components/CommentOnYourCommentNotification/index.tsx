import React, { memo } from 'react';
import { isNilOrError, stopPropagation } from 'utils/helperUtils';

// data
import { ICommentOnYourCommentNotificationData } from 'services/notifications';

// i18n
import messages from '../../messages';
import { FormattedMessage } from 'utils/cl-intl';

// components
import NotificationWrapper from '../NotificationWrapper';
import { DeletedUser } from '../Notification';
import Link from 'utils/cl-router/Link';
import { reportError } from 'utils/loggingUtils';

interface Props {
  notification: ICommentOnYourCommentNotificationData;
}

const CommentOnYourCommentNotification = memo<Props>(props => {
  const { notification } = props;

  const deletedUser = isNilOrError(notification.attributes.initiating_user_first_name) || isNilOrError(notification.attributes.initiating_user_slug);

  let linkTo;

  switch (notification.attributes.post_type) {
    case 'Idea':
      linkTo = `/ideas/${notification.attributes.post_slug}`;
    case 'Initiative':
      linkTo = `/initiatives/${notification.attributes.post_slug}`;
    default:
     reportError(`Unsupported post type ${notification.attributes.post_type}`);
  }

  return (
    <NotificationWrapper
      linkTo={linkTo}
      timing={notification.attributes.created_at}
      icon="notification_comment"
      isRead={!!notification.attributes.read_at}
    >
      <FormattedMessage
        {...messages.userReactedToYourComment}
        values={{
          name: deletedUser ?
          <DeletedUser>
            <FormattedMessage {...messages.deletedUser} />
          </DeletedUser>
          :
          <Link
            to={`/profile/${notification.attributes.initiating_user_slug}`}
            onClick={stopPropagation}
          >
            {notification.attributes.initiating_user_first_name}
          </Link>,
        }}
      />
    </NotificationWrapper>
  );
});

export default CommentOnYourCommentNotification;
