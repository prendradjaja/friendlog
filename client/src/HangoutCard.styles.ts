import styled from "styled-components";
export default styled.div`
  > div {
    border: 1px solid var(--gray-7);
    border-radius: var(--space-2);
    padding: 10px;
  }

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
    white-space: pre-line;
  }
`;
