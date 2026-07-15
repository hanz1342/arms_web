import { CSSProperties } from "react";
import styled from "styled-components"

interface PageTitleProps {
   title: string;
   style?: CSSProperties;
}

const Title = styled.h3`
   color: #232D42;
   font-size: 18px;
   margin-top: 0px;
   margin-bottom: 0px;
`;

export function PageTitle(props: PageTitleProps) {
   return <Title style={props.style}>{props.title}</Title>;
}