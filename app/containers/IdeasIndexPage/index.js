/*
 *
 * IdeasIndexPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import _ from 'lodash';
import IdeaCard from 'components/IdeaCard';
import { Label, Card, Sidebar, Segment, Menu } from 'semantic-ui-react';
import { Reveal, Button } from 'components/Foundation';
import T from 'containers/T';
import styled from 'styled-components';
import { Saga } from 'react-redux-saga';
import isEqual from 'lodash/isEqual';

import messages from './messages';
import makeSelectIdeasIndexPage, {
  makeSelectIdeas, makeSelectLoading, makeSelectNextPageItemCount,
  makeSelectNextPageNumber, makeSelectTopics, makeSelectAreas, makeSelectLoadIdeasError,
} from './selectors';
import {
  resetIdeas, setShowIdeaWithIndexPage, loadTopicsRequest, loadAreasRequest,
  loadIdeasRequest,
} from './actions';
import { ideasSaga, topicsSaga, areasSaga } from './sagas';

export class IdeasIndexPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();

    // bind event handlers
    this.goToNextPage = this.goToNextPage.bind(this);
  }

  componentDidMount() {
    if (!this.props.children) {
      this.props.initData();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.location.query, this.props.location.query)) {
      this.props.reloadIdeas({
        'topics[]': nextProps.location.query.topics,
        'areas[]': nextProps.location.query.areas,
      });
    }
  }

  componentDidUpdate(previousProps) {
    if (!this.props.children && (this.props.children !== previousProps.children)) {
      this.props.initData();
    }
  }

  componentWillUnmount() {
    // reset page state
    this.props.resetData();
  }

  ideaShowPageHtml() {
    const childProps = {
      idea: null,
      showIdeaWithIndexPage: false,
    };
    return React.cloneElement(this.props.children, childProps);
  }

  ideaShowDialogHtml() {
    const childProps = {
      idea: this.findIdeaById(),
      showIdeaWithIndexPage: true,
    };
    return (
      <div>
        <Reveal
          className="clIdeaShowDialog"
          data-overlay="false"
          data-close-on-click="false"
          data-animation-in="slide-in-right"
          data-animation-out="slide-out-right"
          ref={(ref) => ref && ref.instance.open()}
        >
          { React.cloneElement(this.props.children, childProps) }
        </Reveal>
      </div>
    );
  }

  findIdeaById() {
    const { ideas, params } = this.props;
    return _.find(ideas, { id: params.slug });
  }

  goToNextPage() {
    const { loadNextPage, nextPageNumber, nextPageItemCount } = this.props;
    loadNextPage(nextPageNumber, nextPageItemCount);
  }

  indexPageHtml() {
    const { ideas, topics, areas, nextPageNumber, loading, loadIdeasError } = this.props;

    const WrapperDiv = (props) => (
      <div
        {...props}
      >
        {!!props.children[0] && props.children}
      </div>
    );

    const CenteredDiv = styled(WrapperDiv)`
      margin: auto;
      width: 20%;
    `;

    return (
      <div>
        <Helmet
          title="IdeasIndexPage"
          meta={[
            { name: 'description', content: 'Description of IdeasIndexPage' },
          ]}
        />
        <Saga saga={ideasSaga} />
        <Saga saga={topicsSaga} />
        <Saga saga={areasSaga} />

        <h1>
          <FormattedMessage {...messages.header} />
        </h1>

        <Button onClick={this.toggleVisibility}>Toggle Visibility</Button>
        <Sidebar.Pushable as={Segment}>
          <Sidebar as={Menu} animation="overlay" width="thin" visible icon="labeled" vertical inverted>
            {topics.map((topic) =>
              <Menu.Item key={topic.id}>
                <Link to={{ pathname: this.props.location.pathname, query: { ...this.props.location.query, topics: [topic.id] } }}>
                  <T value={topic.attributes.title_multiloc}></T>
                </Link>
              </Menu.Item>)
            }

            {areas.map((area) =>
              <Menu.Item key={area.id}>
                <Link to={{ pathname: this.props.location.pathname, query: { ...this.props.location.query, areas: [area.id] } }}>
                  <T value={area.attributes.title_multiloc}></T>
                </Link>
              </Menu.Item>)
            }
          </Sidebar>
          <Sidebar.Pusher>
            <Segment basic>
              <Card.Group itemsPerRow={4} doubling stackable>
                {ideas && ideas.map((idea) => (
                  <IdeaCard
                    key={idea.id}
                    idea={idea}
                    onClick={() => { this.props.dispatch(setShowIdeaWithIndexPage(true)); this.props.router.push(`/ideas/${idea.id}`); }}
                  ></IdeaCard>
                ))}
              </Card.Group>
              {loadIdeasError && <Label>
                {loadIdeasError}
              </Label>}
              {/* eslint-disable-next-line jsx-ally/no-static-element-interactions */}
              <CenteredDiv onClick={this.goToNextPage}>
                {(nextPageNumber && !loading) && <Button>
                  <FormattedMessage
                    {...messages.loadMore}
                  />
                </Button>}
                {loading && <Label>
                  <FormattedMessage
                    {...messages.loading}
                  /></Label>}
              </CenteredDiv>
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>


      </div>
    );
  }

  render() {
    const { showIdeaWithIndexPage } = this.props.pageData;

    return (
      <div className="ideas-page">
        { (!this.props.children || showIdeaWithIndexPage === true) ? this.indexPageHtml() : null }
        { (this.props.children && showIdeaWithIndexPage === true) ? this.ideaShowDialogHtml() : null }
        { (this.props.children && showIdeaWithIndexPage === false) ? this.ideaShowPageHtml() : null }
      </div>
    );
  }
}

IdeasIndexPage.propTypes = {
  ideas: PropTypes.any.isRequired,
  loadIdeasError: PropTypes.string,
  topics: PropTypes.any.isRequired,
  areas: PropTypes.any.isRequired,
  params: PropTypes.object,
  children: PropTypes.any,
  router: PropTypes.object,
  initData: PropTypes.func.isRequired,
  loadNextPage: PropTypes.func.isRequired,
  nextPageNumber: PropTypes.number,
  nextPageItemCount: PropTypes.number,
  loading: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  pageData: PropTypes.object,
  resetData: PropTypes.func.isRequired,
  location: React.PropTypes.object,
  reloadIdeas: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  ideas: makeSelectIdeas(),
  topics: makeSelectTopics(),
  areas: makeSelectAreas(),
  nextPageNumber: makeSelectNextPageNumber(),
  nextPageItemCount: makeSelectNextPageItemCount(),
  loading: makeSelectLoading(),
  pageData: makeSelectIdeasIndexPage(),
  loadIdeasError: makeSelectLoadIdeasError(),
});

export function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    initData: () => {
      dispatch(loadIdeasRequest(true));
      dispatch(loadTopicsRequest());
      dispatch(loadAreasRequest());
    },
    loadNextPage: (nextPageNumber, nextPageItemCount, filters = {}) => {
      dispatch(loadIdeasRequest(false, nextPageNumber, nextPageItemCount, filters));
    },
    resetData: () => {
      dispatch(resetIdeas());
    },
    reloadIdeas: (filters) => {
      dispatch(loadIdeasRequest({ filters }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IdeasIndexPage);
