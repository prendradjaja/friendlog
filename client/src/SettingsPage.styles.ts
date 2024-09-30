import styled from "styled-components";
export default styled.div`
  padding: 10px;

  h1 {
    margin-bottom: var(--space-4);
  }

  button {
    margin-right: var(--space-2);
  }

  .hidden-key,
  .visible-key {
    display: inline;
  }

  .hidden-key {
    color: var(--gray-8);
  }

  .visible-key {
    background-color: var(--gray-5);
  }
`;
