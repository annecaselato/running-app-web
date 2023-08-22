import { Button, Container } from '@mui/material';

export default function Home() {
  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <Container>
      <h1>Home</h1>
      <Button onClick={logout}>Logout</Button>
    </Container>
  );
}
