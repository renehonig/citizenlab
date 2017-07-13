/*
 *
 * IdeasIndexPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// components
import WatchSagas from 'containers/WatchSagas';
import { Segment } from 'semantic-ui-react';
import IdeaCards from './components/ideaCards';

import SelectTopics from './components/selectTopics';
import SelectAreas from './components/selectAreas';

// store
import { preprocess } from 'utils';
import { filterIdeas, loadIdeasRequest, loadTopicsRequest, loadAreasRequest, resetIdeas } from './actions';
import sagasWatchers from './sagas';

const FiltersArea = styled.div`
  align-items: center;
  display: flex;
  height: 3.5rem;
  justify-content: flex-end;
  margin-bottom: 4.5rem;
  width: 100%;
`;

class View extends React.Component {
  constructor(props) {
    super();
    const { location } = props;
    this.search = location.search;
  }

  componentDidMount() {
    this.props.loadTopicsRequest();
    this.props.loadAreasRequest();
  }

  componentWillUnmount() {
    this.props.resetIdeas();
  }

  render() {
    const { filter, withFilters } = this.props;
    return (
      <div>
        <WatchSagas sagas={sagasWatchers} />
        <Segment style={{ width: 1000, marginLeft: 'auto', marginRight: 'auto' }} basic>
          <FiltersArea>
            {withFilters && <SelectTopics />}
            {withFilters && <SelectAreas />}
          </FiltersArea>
          <IdeaCards filter={filter} />
        </Segment>
      </div>
    );
  }
}

View.contextTypes = {
  sagas: PropTypes.func.isRequired,
};

View.propTypes = {
  loadTopicsRequest: PropTypes.func.isRequired,
  loadAreasRequest: PropTypes.func.isRequired,
  location: PropTypes.object,
  filterIdeas: PropTypes.func.isRequired,
  loadIdeasRequest: PropTypes.func.isRequired,
  resetIdeas: PropTypes.func.isRequired,
  filter: PropTypes.object,
  withFilters: PropTypes.bool.isRequired,
};

View.defaultProps = {
  location: {},
  withFilters: true,
};

const actions = { filterIdeas, loadIdeasRequest, loadTopicsRequest, loadAreasRequest, resetIdeas };

export default preprocess(null, actions)(View);
