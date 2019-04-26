// Libraries
import React, { PureComponent } from 'react';

// services
import { deleteUser } from 'services/users';

// Styles
import styled from 'styled-components';

// components
import ProfileSection from './ProfileSection';
import { SectionTitle, SectionSubtitle } from 'components/admin/Section';
import Button from 'components/UI/Button';
import Error from 'components/UI/Error';

// intl
import { FormattedMessage, injectIntl } from 'utils/cl-intl';
import { InjectedIntlProps } from 'react-intl';
import messages from './messages';

// utils
import { reportError } from 'utils/loggingUtils';
import eventEmitter from 'utils/eventEmitter';

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  > :not(:last-child) {
    margin-right: 20px;
  }
`;

interface Props {
  userId: string;
}

interface State {
  processing: boolean;
  error: boolean;
}

class ProfileDeletion extends PureComponent<Props & InjectedIntlProps, State> {
  constructor(props) {
    super(props);
    this.state = {
      processing: false,
      error: false
    };
  }

  deleteProfile = () => {
    const { intl: { formatMessage } } = this.props;
    if (window.confirm(formatMessage(messages.profileDeletionConfirmation))) {
      this.setState({ processing: true, error: false });
      deleteUser(this.props.userId)
      .then(() => {
        setTimeout(() => eventEmitter.emit('UserProfile', 'profileDeletedSuccessfuly', null), 2000);
      }).catch(err => {
        reportError(err);
        this.setState({ error: true, processing: false });
      });
    }
  }

  render() {
    const { error, processing } = this.state;
    return (
      <ProfileSection>
        <SectionTitle><FormattedMessage {...messages.deletionSection} /></SectionTitle>
        <SectionSubtitle><FormattedMessage {...messages.deletionSubtitle} /></SectionSubtitle>
        <Row>
          <Button
            style="delete"
            id="deletion"
            onClick={this.deleteProfile}
            width="auto"
            justifyWrapper="left"
            processing={processing}

            className="e2e-delete-profile"
          >
            <FormattedMessage {...messages.deleteProfile} />
          </Button>
          {error &&
            <Error text={<FormattedMessage {...messages.deleteProfileError} />}/>
          }
        </Row>
      </ProfileSection>
    );
  }

}

export default injectIntl(ProfileDeletion);
