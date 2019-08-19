import React from 'react';
import { Popup } from 'semantic-ui-react';
import { IIdeaStatusData } from 'services/ideaStatuses';
import { IInitiativeAllowedTransitions } from 'services/initiatives';
import T from 'components/T';
import styled from 'styled-components';
import { colors } from 'utils/styleUtils';

const Container = styled.div`
  display: flex;
`;

const ColorIndicator = styled.div<{ active: boolean, disabled: boolean }>`
  width: 1rem;
  height: 1rem;
  border: 1px solid ${props => props.color};
  border-radius: ${props => props.theme.borderRadius};
  margin-right: 0.5rem;
  cursor: pointer;
  margin: 0 0.25rem;
  ${props => props.disabled ? `
    background-color: ${colors.mediumGrey};
    cursor: not-allowed;
  ` : '' /* line order matters here so active element is displayed correctly */}
  ${props => props.active ? `background-color: ${props.color};` : ''}
`;

type Props = {
  selectedStatus?: string,
  statuses: IIdeaStatusData[],
  onUpdateStatus: (statusId: string) => void;
  allowedTransitions: IInitiativeAllowedTransitions | null;
};

class StatusSelector extends React.PureComponent<Props> {

  isActive = (statusId) => {
    return this.props.selectedStatus === statusId;
  }

  isAllowed = (statusId) => {
    return this.props.allowedTransitions && this.props.allowedTransitions[statusId] !== undefined;
  }

  handleStatusClick = (statusId) => (event) => {
    event.stopPropagation();
    this.props.onUpdateStatus(statusId);
  }

  render() {
    const { statuses } = this.props;
    return (
      <Container>
        {statuses.map((status) => (
          <Popup
            key={status.id}
            basic
            trigger={
              <ColorIndicator
                disabled={!this.isAllowed(status.id)}
                color={status.attributes.color}
                active={this.isActive(status.id)}
                onClick={this.handleStatusClick(status.id)}
              />
            }
            content={<T value={status.attributes.title_multiloc} />}
            position="top center"
          />
        ))}
      </Container>
    );
  }
}

export default StatusSelector;
