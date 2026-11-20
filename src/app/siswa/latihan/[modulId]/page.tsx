import React, { Suspense, use } from 'react';
import { LatihanContent } from './LatihanContent';

export function generateStaticParams() {
  return [{ modulId: 'mod-1' }, { modulId: 'mod-2' }];
}

function LatihanWrapper({ paramsPromise }: { paramsPromise: Promise<{ modulId: string }> }) {
  const { modulId } = use(paramsPromise);
  return <LatihanContent moduleId={modulId} />;
}

export default function Page({
  params,
}: {
  params: Promise<{ modulId: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-canvas text-ink">
          <p className="text-xl font-bold">Menyiapkan latihan...</p>
        </div>
      }
    >
      <LatihanWrapper paramsPromise={params} />
    </Suspense>
  );
}
