import React, { PureComponent } from 'react';
import { isNilOrError } from 'utils/helperUtils';

// services
import { IMentionInCommentNotificationData } from 'services/notifications';
import GetIdea, { GetIdeaChildProps } from 'resources/GetIdea';

// i18n
import messages from '../../messages';
import { FormattedMessage } from 'utils/cl-intl';

// components
import NotificationWrapper from '../NotificationWrapper';
import Link from 'utils/cl-router/Link';
import { DeletedUser } from '../Notification';

interface InputProps {
  notification: IMentionInCommentNotificationData;
}
interface DataProps {
  idea: GetIdeaChildProps;
}

interface Props extends InputProps, DataProps {}

class MentionInCommentNotification extends PureComponent<Props> {
  onClickUserName = (event) => {
    event.stopPropagation();
  }

  render() {
    const { notification, idea } = this.props;

    if (isNilOrError(idea)) return null;

    const { slug } = idea.attributes;

    const deletedUser = isNilOrError(notification.attributes.initiating_user_first_name) || isNilOrError(notification.attributes.initiating_user_slug);

    return (
      <NotificationWrapper
        linkTo={`/ideas/${slug}`}
        timing={notification.attributes.created_at}
        icon="notification_mention"
        isRead={!!notification.attributes.read_at}
      >
        <FormattedMessage
          {...messages.mentionInComment}
          values={{
            name: deletedUser ?
              <DeletedUser>
                <FormattedMessage {...messages.deletedUser} />
              </DeletedUser>
              :
              <Link
                to={`/profile/${notification.attributes.initiating_user_slug}`}
                onClick={this.onClickUserName}
              >
                {notification.attributes.initiating_user_first_name}
              </Link>,
          }}
        />
      </NotificationWrapper>
    );
  }
}

export default (inputProps: InputProps) => {
  const { notification } = inputProps;

  if (!notification.relationships.idea.data) return null;

  return (
    <GetIdea id={notification.relationships.idea.data.id}>
      {idea => <MentionInCommentNotification notification={notification} idea={idea} />}
    </GetIdea>
  );
};
