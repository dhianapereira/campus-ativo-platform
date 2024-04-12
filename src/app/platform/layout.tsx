import { ReactNode } from 'react'
import Header from './components/Header'
import Menu from './components/navigation/Menu'
import { Container, Body, Content } from './styles'

export default function PlatformLayout({ children }: { children: ReactNode }) {
  return (
    <Container>
      <Menu />
      <Body>
        <Header
          name="João dos Santos"
          alt="João dos Santos"
          position="Otorrinolaringologista"
        />
        <Content>{children}</Content>
      </Body>
    </Container>
  )
}
