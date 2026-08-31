import { Field as FormischField, Form, setErrors, useForm, type SubmitHandler } from '@formisch/react';
import { Link } from '@tanstack/react-router';
import { InfoIcon } from 'lucide-react';

import { AuthScreen } from '#/components/auth-screen';
import { PasswordInput } from '#/components/password-input';
import { Alert, AlertDescription, AlertTitle } from '#/components/ui/alert';
import { Button } from '#/components/ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '#/components/ui/field';
import { Input } from '#/components/ui/input';
import { RegisterSchema } from '#/schemas/register.schema';
import { fieldErrorMessage } from '#/utils/auth';

import { useRegisterFormActions } from './register.actions';

const Register = () => {
  const { isRegisterPending, submitRegister } = useRegisterFormActions();

  const registerForm = useForm({
    schema: RegisterSchema,
    initialInput: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const isSubmitting = registerForm.isSubmitting || isRegisterPending;
  const formError = fieldErrorMessage(registerForm.errors);

  const handleSubmit: SubmitHandler<typeof RegisterSchema> = async (payload) => {
    try {
      await submitRegister(payload);
    } catch (error) {
      setErrors(registerForm, {
        errors: [error instanceof Error ? error.message : 'Failed to register'],
      });
    }
  };

  return (
    <AuthScreen title="Create an account" description="Use your email to register">
      <Form of={registerForm} className="flex flex-col gap-6" aria-busy={isSubmitting} onSubmit={handleSubmit}>
        {formError && (
          <Alert variant="destructive">
            <InfoIcon />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}
        <FieldGroup>
          <FormischField of={registerForm} path={['name']}>
            {(nameField) => (
              <Field data-invalid={nameField.errors ? true : undefined}>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  {...nameField.props}
                  id="name"
                  type="text"
                  value={nameField.input}
                  placeholder="Your name"
                  autoComplete="name"
                  aria-invalid={Boolean(nameField.errors)}
                  disabled={isSubmitting}
                  required
                />
                <FieldError>{fieldErrorMessage(nameField.errors)}</FieldError>
              </Field>
            )}
          </FormischField>
          <FormischField of={registerForm} path={['email']}>
            {(emailField) => (
              <Field data-invalid={emailField.errors ? true : undefined}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  {...emailField.props}
                  id="email"
                  type="email"
                  value={emailField.input}
                  placeholder="you@example.com"
                  autoComplete="username"
                  aria-invalid={Boolean(emailField.errors)}
                  disabled={isSubmitting}
                  required
                />
                <FieldError>{fieldErrorMessage(emailField.errors)}</FieldError>
              </Field>
            )}
          </FormischField>
          <FormischField of={registerForm} path={['password']}>
            {(passwordField) => (
              <Field data-invalid={passwordField.errors ? true : undefined}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <PasswordInput
                  {...passwordField.props}
                  id="password"
                  value={passwordField.input}
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  aria-invalid={Boolean(passwordField.errors)}
                  disabled={isSubmitting}
                  required
                />
                <FieldError>{fieldErrorMessage(passwordField.errors)}</FieldError>
              </Field>
            )}
          </FormischField>
          <FormischField of={registerForm} path={['confirmPassword']}>
            {(confirmPasswordField) => (
              <Field data-invalid={confirmPasswordField.errors ? true : undefined}>
                <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
                <PasswordInput
                  {...confirmPasswordField.props}
                  id="confirmPassword"
                  value={confirmPasswordField.input}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  aria-invalid={Boolean(confirmPasswordField.errors)}
                  disabled={isSubmitting}
                  required
                />
                <FieldError>{fieldErrorMessage(confirmPasswordField.errors)}</FieldError>
              </Field>
            )}
          </FormischField>
          <Field>
            <Button size="lg" type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Creating account…' : 'Create account'}
            </Button>
            <FieldDescription className="text-center">
              Already have an account?{' '}
              <Link to="/auth/login" className="text-muted-foreground">
                Sign in
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </Form>
    </AuthScreen>
  );
};

export default Register;
