import { Container, Typography } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/home')({
  component: RouteComponent,
})

export function RouteComponent() {
  return (
    <Container maxWidth="sm">
      <Typography variant="body2">You have successfully logged in!</Typography>
    </Container>
  )
}
