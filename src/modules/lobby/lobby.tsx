import { Form, Field as FormischField } from "@formisch/react";
import type { SubmitHandler } from "@formisch/react";
import { KeyboardIcon, VideoIcon } from "lucide-react";

import { Button } from "#/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card";
import { Field, FieldError } from "#/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "#/components/ui/input-group";
import { LobbySchema } from "#/schemas/lobby.schema";
import { useLobbyActions } from "./lobby.actions";
import { isURL, isUUID } from "#/utils/room";

const LobbyPage = () => {
  const { form, joinRoomByCode, joinRoomByURL } = useLobbyActions();

  const handleSubmit: SubmitHandler<typeof LobbySchema> = async (data) => {
    try {
      if (isUUID(data.room_id)) {
        await joinRoomByCode(data.room_id);
      } else if (isURL(data.room_id)) {
        await joinRoomByURL(data.room_id);
      } else {
        throw new Error("Something went wrong during connecting room");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Peer RTC</CardTitle>
          <CardDescription>
            PeerRTC is a peer-to-peer real-time communication library.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form of={form} onSubmit={handleSubmit}>
            <div className="flex items-start gap-2">
              <FormischField of={form} path={["room_id"]}>
                {(field) => (
                  <Field data-invalid={field.errors !== null}>
                    <InputGroup>
                      <InputGroupInput
                        {...field.props}
                        value={field.input ?? ""}
                        placeholder="Enter a code or link"
                        aria-invalid={field.errors !== null}
                        autoComplete="off"
                      />
                      <InputGroupAddon>
                        <KeyboardIcon />
                      </InputGroupAddon>
                    </InputGroup>
                    {field.errors && (
                      <FieldError errors={field.errors.map((message) => ({ message }))} />
                    )}
                  </Field>
                )}
              </FormischField>
              <Button type="submit">
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
