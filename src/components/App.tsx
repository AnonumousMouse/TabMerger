import React from "react";
import styled from "styled-components";
import { useSelector } from "../hooks/useSelector";
import useUpdateWindows from "../hooks/useUpdateWindows";
import { GlobalStyle } from "../styles/Global";
import Header from "./Header";
import SidePanel from "./SidePanel";
import Windows from "./Windows";

const Container = styled.div`
  width: 600px;
  height: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  outline: 1px solid black;
`;

const MainArea = styled.div`
  display: grid;
  grid-template-columns: 1fr 355px;
  column-gap: 20px;
  align-items: start;
  height: 524px;
  margin-top: 13px;
`;

export default function App(): JSX.Element {
  const { groupCount, filterChoice } = useSelector((state) => state.header);

  useUpdateWindows();

  return (
    <Container>
      <GlobalStyle />
      <Header />

      {(filterChoice === "tab" || (filterChoice === "group" && groupCount > 0)) && (
        <MainArea>
          <SidePanel />

          <Windows />
        </MainArea>
      )}
    </Container>
  );
}
