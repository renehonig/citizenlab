/**
*
* Image
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

function Comment(props) {
  const { className, commentContent, createdAt, modifiedAt } = props;

  return (
    <div className={className}>
      <span dangerouslySetInnerHTML={{ __html: commentContent.en }} />
      ... created at: {createdAt}
      ... modified at: {modifiedAt}
      <hr />
    </div>
  );
}

Comment.propTypes = {
  className: PropTypes.string,
  commentContent: PropTypes.object.isRequired,
  createdAt: PropTypes.any,
  modifiedAt: PropTypes.any,
};

export default styled(Comment)`
    margin-left: ${(props) => props.parentId ? '15px' : '0'};
`;
