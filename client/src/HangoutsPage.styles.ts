import styled from "styled-components";
export default styled.div`
  padding: 10px;

  .header {
    margin-bottom: var(--space-3);
    display: flex;
    justify-content: space-between;
  }

  .hangout-card:not(:last-child) {
    margin-bottom: var(--space-3);
  }

  .floating-action-button {
    box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4);
    position: fixed;
    bottom: 15px;
    right: 15px;
  }
`;
