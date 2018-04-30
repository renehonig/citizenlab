import React from 'react';
import { Observable, Subscription } from 'rxjs/Rx';
import { isString, isEmpty } from 'lodash';
import { browserHistory } from 'react-router';

// components
import Error from 'components/UI/Error';
import Step2 from 'components/SignUp/Step2';
import SignInUpBanner from 'components/SignInUpBanner';
import { landingPageIdeasQuery } from 'containers/LandingPage';

// services
import { authUserStream } from 'services/auth';
import { ideaByIdStream, ideasStream, updateIdea } from 'services/ideas';

// i18n
import { FormattedMessage } from 'utils/cl-intl';
import messages from './messages';

// style
import styled from 'styled-components';
import { media } from 'utils/styleUtils';

const Container = styled.div`
  width: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  border-top: solid 1px #ddd;
  background: #f9f9fa;
  position: relative;

  ${media.biggerThanMaxTablet`
    min-height: calc(100vh - ${props => props.theme.menuHeight}px - 1px);
  `}

  ${media.smallerThanMaxTablet`
    min-height: calc(100vh - ${props => props.theme.mobileMenuHeight}px - ${props => props.theme.mobileTopBarHeight}px);
  `}
`;

const Section = styled.div`
  flex: 1;
  height: 100%;
`;

const Left = Section.extend`
  width: 50vw;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  display: none;

  ${media.biggerThanMaxTablet`
    display: block;
  `}
`;

const Right = Section.extend`
  width: 100%;
  padding-left: 50vw;

  ${media.smallerThanMaxTablet`
    padding: 0;
  `}
`;

const RightInner = styled.div`
  width: 100%;
  max-width: 420px;
  margin-left: auto;
  margin-right: auto;
  padding-top: 60px;
  padding-bottom: 60px;
  padding-left: 30px;
  padding-right: 30px;
`;

const Title = styled.h2`
  width: 100%;
  color: #333;
  font-size: 34px;
  line-height: 42px;
  font-weight: 500;
  text-align: left;
  margin-bottom: 35px;
`;

type Props = {};

type State = {
  authError: boolean;
  loading: boolean;
};

export default class CompleteSignUpPage extends React.PureComponent<Props, State> {
  subscriptions: Subscription[];

  constructor(props: Props) {
    super(props as any);
    this.state = {
      authError: false,
      loading: false
    };
    this.subscriptions = [];
  }

  componentDidMount() {
    const location = browserHistory.getCurrentLocation();
    const query = location.query;
    const authError = (location.pathname === '/authentication-error');
    const authUser$ = authUserStream().observable;
    const ideaToPublish$ = (query && query.idea_to_publish ? ideaByIdStream(query.idea_to_publish).observable : Observable.of(null));

    this.subscriptions = [
      Observable.combineLatest(
        authUser$,
        ideaToPublish$,
      ).subscribe(async ([authUser, ideaToPublish]) => {
        const registrationCompletedAt = (authUser ? authUser.data.attributes.registration_completed_at : null);
        const isRegistrationCompleted = (isString(registrationCompletedAt) && !isEmpty(registrationCompletedAt));

        // remove idea parameter from the url
        window.history.replaceState(null, '', window.location.pathname);

        if (authUser) {
          if (ideaToPublish && ideaToPublish.data.attributes.publication_status === 'draft') {
            await updateIdea(ideaToPublish.data.id, { author_id: authUser.data.id, publication_status: 'published' });
            ideasStream({ queryParameters: landingPageIdeasQuery }).fetch();
          }

          if (isRegistrationCompleted) {
            this.redirectToLandingPage();
          }
        } else {
          this.redirectToLandingPage();
        }

        this.setState({ authError, loading: false });
      })
    ];
  }

  componentWillUnmount() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  redirectToLandingPage = () => {
    browserHistory.push('/');
  }

  render() {
    const { loading, authError } = this.state;

    if (!loading) {
      return (
        <Container>
          <Left>
            <SignInUpBanner />
          </Left>
          <Right>
            <RightInner>
              {!authError ? (
                <>
                  <Title><FormattedMessage {...messages.title} /></Title>
                  <Step2 onCompleted={this.redirectToLandingPage} />
                </>
              ) : (
                <>
                  <Title><FormattedMessage {...messages.somethingWentWrong} /></Title>
                  <Error text={<FormattedMessage {...messages.notSignedIn} />} />
                </>
              )}
            </RightInner>
          </Right>
        </Container>
      );
    }

    return null;
  }
}
