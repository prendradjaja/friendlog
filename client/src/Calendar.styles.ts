import styled from "styled-components";

const squareSize = "45px";

export default styled.div`
  .week {
    display: flex;
  }

  .day {
    flex: none;
    width: ${squareSize};
    height: ${squareSize};
    border: 1px solid gray;
  }
  .label {
    color: #ccc;
  }
`;
