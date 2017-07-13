// Libraries
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styled from 'styled-components';

// Components
import Icon from 'components/Icon';

// Styles
const Overlay = styled.div`
  border-radius: 5px;
  background-color: #ffffff;
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.1);
  border: solid 1px #eaeaea;
  display: ${(props) => props.deployed ? 'block' : 'none'};
  padding: 10px;
  position: absolute;
  top: 2rem;
  left: 0;
  z-index: 10;

  ::after {
    border-color: white;
    border-left-color: transparent;
    border-right-color: transparent;
    border-style: solid;
    border-top-color: transparent;
    border-width: 1rem;
    content: "";
    display: block;
    position:absolute;
    top: -2rem;
    left: 1rem;
  }
`;

const ListWrapper = styled.ul`
  list-style: none;
  margin: 0;
  max-height: 10em;
  overflow-y: auto;
  padding: 0;
`;

const StyledOption = styled.li`
  padding: .8rem;
  color: #888;
  display: flex;

  :hover, &.focused {
    background-color: #f9f9f9;
    color: #222;
  }
`;

const OptionText = styled.span`
  flex: 1;
`;

const Checkmark = styled.span`
  background: ${(props) => props.selected ? '#32b67a' : '#fff'};
  border-color: ${(props) => props.selected ? '#32b67a' : '#a6a6a6'};
  border-radius: 3px;
  border-style: solid;
  border-width: 1px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, .1);
  color: white;
  display: inline-block;
  height: 1.5rem;
  margin-left: .5rem;
  text-align: center;
  width: 1.5rem;

  svg {
    transform: scale(.8);
  }
`;

class ValuesList extends React.Component {
  constructor() {
    super();

    this.state = {
      currentFocus: 0,
    };
  }

  isSelected(value) {
    return _.includes(this.props.selected, value);
  }

  updateFocus = (newIndex) => {
    this.setState({ currentFocus: newIndex });
    document.getElementById(`${this.props.baseID}-${newIndex}`).scrollIntoView();
  }

  keypressHandler = (event) => {
    const keyCodes = {
      BACKSPACE: 8,
      TAB: 9,
      RETURN: 13,
      ESC: 27,
      SPACE: 32,
      PAGE_UP: 33,
      PAGE_DOWN: 34,
      END: 35,
      HOME: 36,
      LEFT: 37,
      UP: 38,
      RIGHT: 39,
      DOWN: 40,
      DELETE: 46,
    };
    const maxIndex = this.props.values.length - 1;

    switch (event.keyCode) {
      case keyCodes.UP:
        event.preventDefault();
        this.updateFocus(Math.max(0, this.state.currentFocus - 1));
        break;
      case keyCodes.DOWN:
        event.preventDefault();
        this.updateFocus(Math.min(maxIndex, this.state.currentFocus + 1));
        break;
      case keyCodes.HOME:
        event.preventDefault();
        this.updateFocus(0);
        break;
      case keyCodes.END:
        event.preventDefault();
        this.updateFocus(maxIndex);
        break;
      case keyCodes.SPACE:
        event.preventDefault();
        this.props.onChange(this.props.values[this.state.currentFocus].value);
        break;

      default:
        break;
    }
  }

  render() {
    const { values, multiple, deployed, baseID } = this.props;
    const { currentFocus } = this.state;

    return (
      <Overlay deployed={deployed}>
        <ListWrapper
          onKeyDown={this.keypressHandler}
          role="listbox"
          tabIndex="0"
          aria-labelledby={`${baseID}-label`}
          aria-multiselectable={multiple}
          aria-activedescendant={`${baseID}-${currentFocus}`}
        >
          {values && values.map((entry, index) => {
            const isSelected = this.isSelected(entry.value);
            const clickHandler = () => { this.props.onChange(entry.value); };

            return (
              <StyledOption
                id={`${baseID}-${index}`}
                role="option"
                aria-selected={isSelected}
                key={entry.value}
                onClick={clickHandler}
                className={currentFocus === index ? 'focused' : ''}
              >
                <OptionText>{entry.text}</OptionText>
                {multiple && <Checkmark selected={isSelected}>
                  <Icon name="checkmark" />
                </Checkmark>}
              </StyledOption>
            );
          }
          )}
        </ListWrapper>
      </Overlay>
    );
  }
}

ValuesList.propTypes = {
  values: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      value: PropTypes.any,
    })
  ),
  onChange: PropTypes.func,
  selected: PropTypes.array,
  multiple: PropTypes.bool,
  deployed: PropTypes.bool,
  baseID: PropTypes.string,
};

export default ValuesList;
