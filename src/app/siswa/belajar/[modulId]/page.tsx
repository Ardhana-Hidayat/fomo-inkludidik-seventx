import React, { Suspense, use } from 'react';
import { BelajarContent } from './BelajarContent';

export function generateStaticParams() {
  return [{ modulId: 'mod-1' }, { modulId: 'mod-2' }];
}

function BelajarWrapper({ paramsPromise }: { paramsPromise: Promise<{ modulId: string }> }) {
  const { modulId } = use(paramsPromise);
  return <BelajarContent moduleId={modulId} />;
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
          <p className="text-xl font-bold">Memuat modul belajar...</p>
        </div>
      }
    >
      <BelajarWrapper paramsPromise={params} />
    </Suspense>
  );
}
