import * as v from 'valibot';

export const AuthRoleSchema = v.picklist(['consumer', 'provider'], 'Please select a role.');

export type AuthRole = v.InferOutput<typeof AuthRoleSchema>;

export const LoginSchema = v.object({
  email: v.pipe(
    v.string('Please enter your email.'),
    v.trim(),
    v.toLowerCase(),
    v.nonEmpty('Please enter your email.'),
    v.email('The email address is badly formatted.'),
  ),
  password: v.pipe(
    v.string('Please enter your password.'),
    v.nonEmpty('Please enter your password.'),
    v.minLength(8, 'Your password must have 8 characters or more.'),
  ),
  role: AuthRoleSchema,
});

export type LoginSchemaType = v.InferOutput<typeof LoginSchema>;
