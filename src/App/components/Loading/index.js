import React from 'react';
import PropTypes from 'prop-types';

const Loading = ({ error, pastDelay, retry }) => {
  if (error) {
    return (
      <div>
        Error! <button onClick={retry}>Retry</button>
      </div>
    );
  } else if (pastDelay) {
    return <div>Loading...</div>;
  }
  return null;
};

Loading.propTypes = {
  error: PropTypes.bool,
  pastDelay: PropTypes.bool,
  retry: PropTypes.func,
};

Loading.defaultProps = {
  error: null,
  pastDelay: null,
  retry: () => {},
};

export default Loading;
