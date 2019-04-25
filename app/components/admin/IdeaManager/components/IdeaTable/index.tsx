import React from 'react';
import { clone, omit, every, fromPairs, isEmpty, isFunction } from 'lodash-es';
import styled from 'styled-components';

// components
import { Table } from 'semantic-ui-react';
import { FormattedMessage } from 'utils/cl-intl';
import SortableTableHeader from 'components/admin/SortableTableHeader';
import Row from './Row';
import Pagination from 'components/admin/Pagination';
import Checkbox from 'components/UI/Checkbox';
import FeatureFlag from 'components/FeatureFlag';

// services
import { IIdeaData } from 'services/ideas';
import { IPhaseData } from 'services/phases';
import { IIdeaStatusData } from 'services/ideaStatuses';

// resources
import { Sort, SortAttribute } from 'resources/GetIdeas';

// utils
import { SortDirection } from 'utils/paginationUtils';

// i18n
import messages from '../../messages';
import InfoTooltip from 'components/admin/InfoTooltip';
import IdeaPreview from '../IdeaPreview';
import NoIdeas from './NoIdeas';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const Container = styled.div`
  .ui.table {
    margin-bottom: 0;
  }
`;

const TableHeaderCellText = styled.span`
  font-weight: 600;
`;

interface Props {
  ideaSortAttribute?: SortAttribute;
  ideaSortDirection?: SortDirection;
  ideas?: IIdeaData[];
  phases?: IPhaseData[];
  statuses?: IIdeaStatusData[];
  onChangeIdeaSort?: (sort: Sort) => void;
  selectedIdeas: { [key: string]: boolean };
  onChangeIdeaSelection: (selection: { [key: string]: boolean }) => void;
  ideaCurrentPageNumber?: number;
  ideaLastPageNumber?: number;
  onIdeaChangePage?: (number: number) => void;
  activeFilterMenu: string | null;
  handleSeeAllIdeas: () => void;
}

type State = {
  ideaModal: string | null;
};

export default class IdeaTable extends React.Component<Props, State> {
  constructor (props) {
    super(props);
    this.state = {
      ideaModal: null,
    };
  }

  onClickIdeaTitle = (ideaId: string) => this.setState({ ideaModal: ideaId });

  onCloseModal = () => this.setState({ ideaModal: null });

  handleSortClick = (newSortAttribute: SortAttribute) => () => {
    const { ideaSortAttribute: oldSortAttribute, ideaSortDirection: oldSortDirection, onChangeIdeaSort } = this.props;
    if (isFunction(onChangeIdeaSort)) {
      let newSortSign = '-';
      if (newSortAttribute === oldSortAttribute) {
        newSortSign = oldSortDirection === 'ascending' ? '-' : '';
      }
      onChangeIdeaSort(`${newSortSign}${newSortAttribute}` as Sort);
    }
  }

  selectIdea = (idea) => () => {
    const selectedIdeas = clone(this.props.selectedIdeas);
    selectedIdeas[idea.id] = true;
    this.props.onChangeIdeaSelection(selectedIdeas);
  }

  unselectIdea = (idea) => () => {
    const selectedIdeas = omit(this.props.selectedIdeas, [idea.id]);
    this.props.onChangeIdeaSelection(selectedIdeas);
  }

  toggleSelectIdea = (idea) => () => {
    if (this.props.selectedIdeas[idea.id]) {
      this.unselectIdea(idea)();
    } else {
      this.selectIdea(idea)();
    }
  }

  toggleSelectAll = () => {
    if (this.allSelected()) {
      this.props.onChangeIdeaSelection({});
    } else {
      const newSelection = fromPairs(this.props.ideas && this.props.ideas.map((idea) => [idea.id, true]));
      this.props.onChangeIdeaSelection(newSelection);
    }
  }

  singleSelectIdea = (idea) => () => {
    this.props.onChangeIdeaSelection({ [idea.id]: true });
  }

  clearIdeaSelection = () => () => {
    this.props.onChangeIdeaSelection({});
  }

  handlePaginationClick = (page) => {
    this.props.onIdeaChangePage && this.props.onIdeaChangePage(page);
  }

  allSelected = () => {
    return !isEmpty(this.props.ideas) && every(this.props.ideas, (idea) => this.props.selectedIdeas[idea.id]);
  }

  render() {
    const { ideaSortAttribute, ideaSortDirection, ideas, selectedIdeas, phases, activeFilterMenu, statuses, handleSeeAllIdeas } = this.props;
    const { ideaModal } = this.state;

    return (
      <Container>
        <Table sortable size="small">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={1}>
                <Checkbox value={this.allSelected()} onChange={this.toggleSelectAll} size="17px"/>
              </Table.HeaderCell>
              <Table.HeaderCell width={4}>
                <TableHeaderCellText>
                  <FormattedMessage {...messages.title} />
                </TableHeaderCellText>
              </Table.HeaderCell>
              <Table.HeaderCell width={2}>
                <TableHeaderCellText>
                  <FormattedMessage {...messages.assignee} />
                </TableHeaderCellText>
              </Table.HeaderCell>
              <Table.HeaderCell width={2}>
                <SortableTableHeader
                  direction={ideaSortAttribute === 'new' ? ideaSortDirection : null}
                  onToggle={this.handleSortClick('new')}
                >
                  <TableHeaderCellText>
                    <FormattedMessage {...messages.publication_date} />
                  </TableHeaderCellText>
                </SortableTableHeader>
              </Table.HeaderCell>
              <Table.HeaderCell width={1}>
                <SortableTableHeader
                  direction={ideaSortAttribute === 'upvotes_count' ? ideaSortDirection : null}
                  onToggle={this.handleSortClick('upvotes_count')}
                >
                  <TableHeaderCellText>
                    <FormattedMessage {...messages.up} />
                  </TableHeaderCellText>
                </SortableTableHeader>
              </Table.HeaderCell >
              <Table.HeaderCell width={1}>
                <SortableTableHeader
                  direction={ideaSortAttribute === 'downvotes_count' ? ideaSortDirection : null}
                  onToggle={this.handleSortClick('downvotes_count')}
                >
                  <TableHeaderCellText>
                    <FormattedMessage {...messages.down} />
                  </TableHeaderCellText>
                </SortableTableHeader>
              </Table.HeaderCell>
              <FeatureFlag name="participatory_budgeting">
                <Table.HeaderCell width={1}>
                  <SortableTableHeader
                    direction={ideaSortAttribute === 'baskets_count' ? ideaSortDirection : null}
                    onToggle={this.handleSortClick('baskets_count')}
                  >
                    <TableHeaderCellText>
                      <FormattedMessage {...messages.participatoryBudgettingPicks} />
                    </TableHeaderCellText>
                    &nbsp;
                    <InfoTooltip {...messages.basketsCountTooltip} size="small" position="top-left" />
                  </SortableTableHeader>
                </Table.HeaderCell>
              </FeatureFlag>
            </Table.Row>
          </Table.Header>
          <Table.Body>
          <TransitionGroup component={null}>
            {(ideas || []).map((idea) =>
              <CSSTransition classNames="fade" timeout={500} key={idea.id}>
                <Row
                  className="e2e-idea-manager-idea-row"
                  key={idea.id}
                  idea={idea}
                  phases={phases}
                  statuses={statuses}
                  onUnselectIdea={this.unselectIdea(idea)}
                  onToggleSelectIdea={this.toggleSelectIdea(idea)}
                  onSingleSelectIdea={this.singleSelectIdea(idea)}
                  selected={selectedIdeas[idea.id]}
                  selectedIdeas={selectedIdeas}
                  activeFilterMenu={activeFilterMenu}
                  openIdea={this.onClickIdeaTitle}
                />
              </CSSTransition>
            )}
            </TransitionGroup>
          </Table.Body>
          {!!ideas && ideas.length > 0 &&
            <Table.Footer fullWidth={true}>
              <Table.Row>
                <Table.HeaderCell colSpan="7">
                  <Pagination
                    currentPage={this.props.ideaCurrentPageNumber || 1}
                    totalPages={this.props.ideaLastPageNumber || 1}
                    loadPage={this.handlePaginationClick}
                  />
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          }
        </Table>
        {!ideas || ideas.length === 0 &&
          <NoIdeas handleSeeAllIdeas={handleSeeAllIdeas} />
        }

        <IdeaPreview
          ideaId={ideaModal}
          closeSideModal={this.onCloseModal}
        />
      </Container>
    );
  }
}
