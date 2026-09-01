import { Field as FormischField, Form, setErrors, useForm, type SubmitHandler } from '@formisch/react';
import { InfoIcon } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@peer-rtc/ui/components/alert';
import { Button } from '@peer-rtc/ui/components/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@peer-rtc/ui/components/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@peer-rtc/ui/components/field';
import { Textarea } from '@peer-rtc/ui/components/textarea';
import { toast } from '@peer-rtc/ui/components/toast';

import { fieldErrorMessage } from '#/lib/utils';

import { useCreateConsultRequestMutation } from './consult-requests.queries';
import { CreateConsultRequestSchema } from './consult-requests.types';

interface ConsultRequestCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ConsultRequestCreateForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const createConsultRequestMutation = useCreateConsultRequestMutation();

  const form = useForm({
    schema: CreateConsultRequestSchema,
    initialInput: {
      note: '',
    },
  });

  const isSubmitting = form.isSubmitting || createConsultRequestMutation.isPending;
  const formError = fieldErrorMessage(form.errors);

  const handleSubmit: SubmitHandler<typeof CreateConsultRequestSchema> = async (payload) => {
    try {
      await createConsultRequestMutation.mutateAsync(payload);
      void toast.add({
        title: 'Consultation requested',
        description: 'Your consult request has been submitted.',
        type: 'success',
      });
      onSuccess();
    } catch (error) {
      setErrors(form, {
        errors: [error instanceof Error ? error.message : 'Failed to create consult request'],
      });
    }
  };

  return (
    <Form of={form} className="flex flex-col gap-4" aria-busy={isSubmitting} onSubmit={handleSubmit}>
      {formError && (
        <Alert variant="destructive">
          <InfoIcon />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}
      <FieldGroup>
        <FormischField of={form} path={['note']}>
          {(noteField) => (
            <Field data-invalid={noteField.errors ? true : undefined}>
              <FieldLabel htmlFor="consult-request-note">Note</FieldLabel>
              <Textarea
                {...noteField.props}
                id="consult-request-note"
                value={noteField.input}
                placeholder="Describe what you need help with"
                aria-invalid={Boolean(noteField.errors)}
                disabled={isSubmitting}
                rows={4}
                required
              />
              <FieldError>{fieldErrorMessage(noteField.errors)}</FieldError>
            </Field>
          )}
        </FormischField>
      </FieldGroup>
      <DialogFooter>
        <DialogClose render={<Button type="button" variant="outline" disabled={isSubmitting} />}>Cancel</DialogClose>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting…' : 'Submit request'}
        </Button>
      </DialogFooter>
    </Form>
  );
};

const ConsultRequestCreateDialog = ({ open, onOpenChange }: ConsultRequestCreateDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request consultation</DialogTitle>
          <DialogDescription>Add a note describing why you are requesting a consultation.</DialogDescription>
        </DialogHeader>
        <ConsultRequestCreateForm key={open ? 'open' : 'closed'} onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default ConsultRequestCreateDialog;
