/*
 *
 * IdeasPage
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { LocalForm, Control } from 'react-redux-form';
import { makeSelectIdeas } from './selectors';
import messages from './messages';
import { addIdea } from './actions';
import {
  Button,
  Label,
} from '../../components/Foundation';

const IdeaListDiv = styled.div`
  margin-bottom: 40px;
`;

export class IdeasPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <Helmet
          title="IdeasPage"
          meta={[
            { name: 'description', content: 'Description of IdeasPage' },
          ]}
        />

        <h1>
          <FormattedMessage {...messages.header} />
        </h1>

        <p>Total { this.props.ideas.length } ideas</p>

        <IdeaListDiv>
          {this.props.ideas.map((idea, index) => (
            <Label className="success" key={index}>{ idea.heading }</Label>
          ))}
        </IdeaListDiv>

        <LocalForm model="idea" onSubmit={this.props.onFormSubmit}>
          <label htmlFor=".clIdeaFormHeading">Heading
              <Control.text model=".heading" className="clIdeaFormHeading" required />
          </label>
          <label htmlFor=".clIdeaFormDescription">Description
            <Control.text model=".description" className="clIdeaFormDescription" required />
          </label>

          <Button>Submit</Button>
        </LocalForm>
      </div>
    );
  }
}

IdeasPage.propTypes = {
  ideas: PropTypes.array.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  ideas: makeSelectIdeas(),
});

function mapDispatchToProps(dispatch) {
  return {
    onFormSubmit: (values) => { dispatch(addIdea(values)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IdeasPage);
