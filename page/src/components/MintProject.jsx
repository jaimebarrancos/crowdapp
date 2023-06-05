import styled from "styled-components";
import MintComponent from "./MintComponent";

const Wrapper = styled.div`
  .formbold-btn {
    font-size: 16px;
    border-radius: 5px;
    padding: 14px 25px;
    border: none;
    font-weight: 500;
    background-color: #6a64f1;
    color: white;
    cursor: pointer;
    margin-top: 25px;
  }
  .formbold-btn:hover {
    box-shadow: 0px 3px 20px rgba(0, 0, 0, 0.05);
  }
  .formbold-main-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

function MintProject() {}

export default MintProject;
