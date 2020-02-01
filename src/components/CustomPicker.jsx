import React from 'react';
import * as PropTypes from 'prop-types';
import styled from 'styled-components';

function CustomPicker(props) {
  const { children, getPicker } = props;

  const [open, setOpen] = React.useState(false);

  const child = React.Children.only(children);

  return (
    <Container>
      {getPicker && (
        <Picker>
          {getPicker(open, setOpen)}
        </Picker>
      )}

      {React.cloneElement(
        child,
        {
          onClick: () => {
            setOpen(true);
          },
        },
      )}
    </Container>
  );
}

CustomPicker.propTypes = {
  children: PropTypes.node.isRequired,
  getPicker: PropTypes.func,
};

CustomPicker.defaultProps = {
  getPicker: null,
};

export default CustomPicker;

const Container = styled.div`
  position: relative;
  display: inline-block;

  > & {
    position: relative;
  }
`;

const Picker = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  opacity: 0;

  > * {
    width: 100%;
  }
`;
