import styled from "styled-components";
export default styled.div`
  .hangout-header {
    display: flex;

    :first-child {
      flex-grow: 1;
    }
  }

  .date {
    margin-bottom: var(--space-1);
  }

  .body {
    line-height: 1.35;
  }
`;
