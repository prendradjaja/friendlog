import styled from "styled-components";

const padding = 6;
const borderWidth = 1;
export const verticalPadding = padding;

export default styled.div`
  textarea {
    display: block;
    resize: none;
    border: ${borderWidth}px solid var(--gray-7);
    border-radius: 5px;
    font-family: sans-serif;
    padding: ${padding}px;

    /*
      Maybe use box-sizing: border-box so we can just use width: 100%.
      Would require updating height calculations.
    */
    width: calc(100% - 2 * (${padding}px + ${borderWidth}px));

    &:focus {
      outline: var(--focus-8) 1px solid;
      border-color: var(--focus-8);
    }
  }
`;
