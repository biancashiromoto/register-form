import InputPassword from '@/components/InputPassword';
import InputText from '@/components/InputText';
import useLoginUser from '@/hooks/useLoginUser';
import { useResetForm } from '@/hooks/useResetForm';
import { loginSchema } from '@/schemas/loginSchema';
import { loginUser } from '@/services/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { Form, useForm } from 'react-hook-form';

export const Route = createFileRoute('/home/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <h2>Home</h2>
      You have successfully logged in!
    </div>
  );
}
