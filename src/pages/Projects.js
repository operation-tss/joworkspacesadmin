import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  h1 {
    color: #fab005;
  }
`;

const Projects = () => {
  return (
    <Wrapper>
      <h1>Projects</h1>
    </Wrapper>
  );
};

export default Projects;
