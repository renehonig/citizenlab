import React from 'react';

// components
import HelmetIntl from 'components/HelmetIntl';
import TabbedResource from 'components/admin/TabbedResource';

// i18n
import messages from './messages';
import { InjectedIntlProps } from 'react-intl';
import { injectIntl } from 'utils/cl-intl';

// tracks
import { trackEventByName } from 'utils/analytics';
import tracks from './tracks';

export class InitiativesPage extends React.PureComponent<InjectedIntlProps> {
  private tabs = [
    {
      label: this.props.intl.formatMessage(messages.settingsTab),
      url: '/admin/initiatives',
    },
    {
      label: this.props.intl.formatMessage(messages.manageTab),
      url: '/admin/initiatives/manage',
    },
    {
      label: this.props.intl.formatMessage(messages.permissionTab),
      url: '/admin/initiatives/permissions',
      feature: 'granular_permissions',
    },
  ];

  private resource = {
    title: this.props.intl.formatMessage(messages.titleInitiatives),
  };

  onNewProposal = (pathname: string) => (_event) => {
    trackEventByName(tracks.clickNewProposal.name, {
      extra: { pathnameFrom: pathname },
    });
  };

  render() {
    const { children } = this.props;
    return (
      <TabbedResource resource={this.resource} tabs={this.tabs}>
        <HelmetIntl
          title={messages.metaTitle}
          description={messages.metaDescription}
        />
        {children}
      </TabbedResource>
    );
  }
}

export default injectIntl(InitiativesPage);
