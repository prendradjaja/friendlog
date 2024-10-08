import styled from "styled-components";
export default styled.div`
  padding: 10px;
  padding-bottom: 0;

  .header {
    margin-bottom: var(--space-3);
    display: flex;
    justify-content: space-between;
  }

  .rt-Card {
    margin-bottom: 10px;
  }

  .floating-action-button {
    box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4);
    position: fixed;
    bottom: 15px;
    right: 15px;
  }
`;
