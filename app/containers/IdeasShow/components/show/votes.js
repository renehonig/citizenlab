import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { Button, Icon } from 'semantic-ui-react';
import { preprocess } from 'utils';

// import IdeaContent from '../IdeaContent';
import { selectAuthDomain } from 'utils/auth/selectors';

import { makeSelectOwnVotesTot } from '../../selectors';
import { voteIdeaRequest } from '../../actions';

/* eslint-disable */
const Votes =  ({ votes, voteUp, voteDown, disableUp, disableDown }) => (
  <Button.Group>
    <Button basic color='red' onClick={voteDown} disabled={disableDown}>
      <Icon name='thumbs outline down' />
    </Button>
    <Button.Or text={votes}/>
    <Button basic color='green' onClick={voteUp} disabled={disableUp}>
      <Icon name='thumbs outline up' />
    </Button>
  </Button.Group>
)

Votes.propTypes = {
  count: PropTypes.number,
  upVote: PropTypes.func,
  downVote: PropTypes.func,
  children: PropTypes.any,
};


const mapStateToProps = createStructuredSelector({
  auth: selectAuthDomain('id'),
  totOwnVotes: (state, { ideaId }) => makeSelectOwnVotesTot(ideaId)(state),
});


const mergeProps = (stateP, dispatchP, ownP) => {
  const {auth, totOwnVotes} = stateP;
  const { ideaId } = ownP;
  const { voteIdeaRequest } = dispatchP;
  const voteUp = () => voteIdeaRequest(ideaId, 'up')
  const voteDown = () => voteIdeaRequest(ideaId, 'down')
  const disableUp = !auth || totOwnVotes > 0
  const disableDown = !auth || totOwnVotes < 0
  return {
    voteUp,
    voteDown,
    disableUp,
    disableDown,
    votes: totOwnVotes
  }

}


export default preprocess(mapStateToProps, { voteIdeaRequest }, mergeProps)(Votes);