import type { SubmitHandler } from '@formisch/react';
import { Form, Field as FormischField } from '@formisch/react';
import { KeyboardIcon, VideoIcon } from 'lucide-react';

import { Button } from '@peer-rtc/ui/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@peer-rtc/ui/components/card';
import { Field, FieldError } from '@peer-rtc/ui/components/field';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@peer-rtc/ui/components/input-group';
import { toast } from '@peer-rtc/ui/components/toast';

import { isValidCode, isValidURL } from '#/lib/utils';
import { LobbySchema } from '#/schemas/lobby.schema';

import { useLobbyActions } from './lobby.actions';

const LobbyPage = () => {
  const { form, joinRoomByCode, joinRoomByURL, createNewRoom } = useLobbyActions();

  const handleSubmit: SubmitHandler<typeof LobbySchema> = async (data) => {
    try {
      if (isValidCode(data.room_id)) {
        await joinRoomByCode(data.room_id);
      } else if (isValidURL(data.room_id)) {
        await joinRoomByURL(data.room_id);
      } else {
        throw new Error('Something went wrong during connecting room');
      }
    } catch (error) {
      void toast.add({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Something went wrong',
        type: 'destructive',
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Peer RTC</CardTitle>
          <CardDescription>PeerRTC is a peer-to-peer real-time communication library.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form of={form} onSubmit={handleSubmit}>
            <div className="flex items-start gap-4">
              <FormischField of={form} path={['room_id']}>
                {(field) => (
                  <Field data-invalid={field.errors !== null}>
                    <InputGroup>
                      <InputGroupAddon>
                        <KeyboardIcon />
                      </InputGroupAddon>
                      <InputGroupInput
                        {...field.props}
                        value={field.input ?? ''}
                        placeholder="Enter a code or link"
                        aria-invalid={field.errors !== null}
                        autoComplete="off"
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupButton variant="secondary" type="submit">
                          Join
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                    {field.errors && <FieldError errors={field.errors.map((message) => ({ message }))} />}
                  </Field>
                )}
              </FormischField>
              <Button type="button" onClick={createNewRoom}>
                <VideoIcon data-icon="inline-start" /> New
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LobbyPage;
