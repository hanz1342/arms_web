import styled from "styled-components"

interface PageTitleProps {
   title: string;
   style?: object;
}

const Title = styled.h4`
   color: #232D42;
   font-size: 15px;
   margin-top: 0px;
   margin-bottom: 15px;
`;

export function ListTitle(props: PageTitleProps) {
   return <Title style={props.style}>{props.title}</Title>;
}