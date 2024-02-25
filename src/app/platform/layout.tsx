import Header from "./components/Header";
import Menu from "./components/Menu";
import { Container, Body, Content } from "./styles";

export default function PlatformLayout({ children }: any) {
    return (
        <Container>
            <Menu />
            <Body>
                <Header name="Charlingtonglaevionbeecheknavare dos Anjos Mendonça" alt="João dos Santos" position="Otorrinolaringologista" />
                <Content>
                    {children}
                </Content>
            </Body>
        </Container>
    );
}