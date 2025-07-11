'use client';
import { Suspense } from 'react';
import OnboardingContent from './OnboardingContent';

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OnboardingContent />
    </Suspense>
  );
}
