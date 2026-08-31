/** @vitest-environment happy-dom */

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vite-plus/test';

import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount } from '#/components/ui/avatar';
import {
  Questionnaire,
  QuestionnaireDescription,
  QuestionnaireItem,
  QuestionnaireTitle,
} from '#/components/ui/questionnaire';

afterEach(() => {
  cleanup();
});

describe('Avatar', () => {
  it('renders fallback, badge, and group count', () => {
    render(
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>AB</AvatarFallback>
          <AvatarBadge />
        </Avatar>
        <AvatarGroupCount>+2</AvatarGroupCount>
      </AvatarGroup>,
    );

    expect(screen.getByText('AB')).toBeTruthy();
    expect(screen.getByText('+2')).toBeTruthy();
    expect(document.querySelector('[data-slot="avatar-badge"]')).toBeTruthy();
  });
});

describe('Questionnaire', () => {
  it('renders a generic multi-step shell', () => {
    render(
      <Questionnaire>
        <QuestionnaireItem name="q1">
          <QuestionnaireTitle>What is your goal?</QuestionnaireTitle>
          <QuestionnaireDescription>Pick the closest match.</QuestionnaireDescription>
        </QuestionnaireItem>
      </Questionnaire>,
    );

    expect(screen.getByText('What is your goal?')).toBeTruthy();
    expect(screen.getByText('Pick the closest match.')).toBeTruthy();
  });
});
