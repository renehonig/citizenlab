import * as React from 'react';
import * as _ from 'lodash';
import * as Rx from 'rxjs/Rx';

// router
import { browserHistory, Link } from 'react-router';
import { Location } from 'history';

// components
import Icon from 'components/UI/Icon';
import FeatureFlag from 'components/FeatureFlag';

// i18n
import { injectIntl, InjectedIntlProps } from 'react-intl';
import messages from './messages';

// style
import styled, { css } from 'styled-components';

const Menu = styled.div`
  width: 240px;
  height: 100%;
  position: fixed;
  z-index: 1;
  margin-top: 0px;
  background: #3b3b3b;
  padding-top: 40px;
`;

const IconWrapper = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledIcon = styled(Icon)`
  height: 19px;
  fill: #fff;
  opacity: 0.5;
`;

const Text = styled.div`
  color: #fff;
  font-size: 17px;
  font-weight: 400;
  line-height: 21px;
  margin-left: 20px;
  opacity: 0.5;
`;

const MenuItem: any = styled(Link)`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  padding-left: 12px;
  background: transparent;
  margin-bottom: 10px;

  &:hover {
    ${StyledIcon} {
      opacity: 1;
    };

    ${Text} {
      opacity: 1;
    };
  }

  ${(props: any) => props.active && css`
    background: #222;

    ${StyledIcon} {
      opacity: 1;
    };

    ${Text} {
      opacity: 1;
    };
  `}
`;

type Props = {};

type State = {
  location: Location;
};

class Sidebar extends React.PureComponent<Props & InjectedIntlProps, State> {
  state: State;
  unlisten: Function | null;

  constructor() {
    super();
    this.state = {
      location: browserHistory.getCurrentLocation()
    };
    this.unlisten = null;
  }

  componentDidMount() {
    this.unlisten = browserHistory.listen((location: Location) => {
      this.setState({ location });
    });
  }

  componentWillUnmount() {
    if (this.unlisten) {
      this.unlisten();
    }
  }

  render() {
    const { formatMessage } = this.props.intl;
    const { location } = this.state;
    const { pathname } = location;

    return (
      <Menu>

        <MenuItem active={pathname === '/admin'} to="/admin">
          <IconWrapper><StyledIcon name="analytics" /></IconWrapper>
          <Text>{formatMessage({ ...messages.dashboard })}</Text>
        </MenuItem>

        <MenuItem active={pathname.startsWith('/admin/users')} to="/admin/users">
          <IconWrapper><StyledIcon name="people" /></IconWrapper>
          <Text>{formatMessage({ ...messages.users })}</Text>
        </MenuItem>

        <FeatureFlag name="groups">
          <MenuItem active={pathname.startsWith('/admin/groups')} to="/admin/groups">
            <IconWrapper><StyledIcon name="groups" /></IconWrapper>
            <Text>{formatMessage({ ...messages.groups })}</Text>
          </MenuItem>
        </FeatureFlag>

        <MenuItem active={pathname.startsWith('/admin/projects')} to="/admin/projects">
          <IconWrapper><StyledIcon name="project" /></IconWrapper>
          <Text>{formatMessage({ ...messages.projects })}</Text>
        </MenuItem>

        <MenuItem active={pathname.startsWith('/admin/ideas')} to="/admin/ideas">
          <IconWrapper><StyledIcon name="idea" /></IconWrapper>
          <Text>{formatMessage({ ...messages.ideas })}</Text>
        </MenuItem>

        <MenuItem active={pathname.startsWith('/admin/settings')} to="/admin/settings">
          <IconWrapper><StyledIcon name="settings" /></IconWrapper>
          <Text>{formatMessage({ ...messages.settings })}</Text>
        </MenuItem>

      </Menu>
    );
  }
}

export default injectIntl<Props>(Sidebar);
