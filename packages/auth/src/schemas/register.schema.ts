import * as v from 'valibot';

export const RegisterSchema = v.pipe(
  v.object({
    name: v.pipe(
      v.string('Please enter your name.'),
      v.trim(),
      v.nonEmpty('Please enter your name.'),
      v.minLength(2, 'Your name must have 2 characters or more.'),
    ),
    email: v.pipe(
      v.string('Please enter your email.'),
      v.trim(),
      v.toLowerCase(),
      v.nonEmpty('Please enter your email.'),
      v.email('The email address is badly formatted.'),
    ),
    password: v.pipe(
      v.string('Please enter a password.'),
      v.nonEmpty('Please enter a password.'),
      v.minLength(8, 'Your password must have 8 characters or more.'),
    ),
    confirmPassword: v.pipe(v.string('Please confirm your password.'), v.nonEmpty('Please confirm your password.')),
  }),
  v.forward(
    v.partialCheck(
      [['password'], ['confirmPassword']],
      (input) => input.password === input.confirmPassword,
      'Passwords do not match.',
    ),
    ['confirmPassword'],
  ),
);

export type RegisterSchemaType = v.InferOutput<typeof RegisterSchema>;
