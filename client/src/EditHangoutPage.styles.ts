import styled from "styled-components";
export default styled.div`
  padding: 10px;

  h2 {
    margin-top: var(--space-4);
  }

  .button-container {
    margin-top: var(--space-7);
  }

  .growable-textarea {
    max-height: 100px;
  }

  .length-indicator {
    margin-top: 2px;
    text-align: right;

    color: var(--gray-11);

    &.warning {
      color: var(--amber-11);
    }

    &.error {
      color: var(--red-9);
      font-weight: bold;
    }
  }

  .checkbox-container {
    display: flex;

    input {
      margin-left: 0;
      margin-right: 5px;
    }
  }
`;
