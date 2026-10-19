import { useEffect, useState } from 'react';

/**
 * Hook to handle the PWA "Add to Home Screen" install prompt.
 *
 * It listens for the `beforeinstallprompt` event, prevents the default
 * browser prompt, and exposes a `promptInstall` function that can be called
 * from UI components (e.g., a button in the navbar). The hook also provides a
 * `canInstall` boolean indicating whether the prompt is currently available.
 */
export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      // Prevent the automatic prompt.
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };
    // The `beforeinstallprompt` event is only defined on the Window type in
    // browsers that support PWA installation. We cast to `any` to avoid TS
    // errors in environments where it may be undefined.
    window.addEventListener('beforeinstallprompt', handler as any);
    return () => {
      window.removeEventListener('beforeinstallprompt', handler as any);
    };
  }, []);

  const promptInstall = async (): Promise<'accepted' | 'dismissed' | undefined> => {
    if (!deferredPrompt) return undefined;
    // The event has a `prompt` method and a `userChoice` promise.
    // We cast to `any` because the TypeScript lib does not include these.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const promptEvent = deferredPrompt as any;
    await promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    // Reset state after the user has responded.
    setCanInstall(false);
    setDeferredPrompt(null);
    return outcome; // 'accepted' | 'dismissed'
  };

  return { canInstall, promptInstall };
};
