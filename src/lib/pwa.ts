/**
 * Reusable PWA helpers for ReadyGearHub apps.
 * Register a service worker only from pages inside its scope, e.g.
 * registerSW('/storm-tracker/') from /storm-tracker/, never from the whole site.
 */
export async function registerSW(scope: string, swUrl?: string) {
  if (!('serviceWorker' in navigator)) return null;
  const url = swUrl || `${scope.endsWith('/') ? scope : scope + '/'}sw.js`;
  try {
    return await navigator.serviceWorker.register(url, { scope });
  } catch (err) {
    console.warn('Service worker was not registered.', err);
    return null;
  }
}

/** Wire a button to the browser install prompt when it becomes available. */
export function bindInstallPrompt(button?: HTMLElement | null) {
  let deferred: { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> } | null = null;
  if (button) button.hidden = true;

  const onPrompt = (event: Event) => {
    event.preventDefault();
    deferred = event as unknown as { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
    if (button) button.hidden = false;
  };

  const onClick = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    deferred = null;
    if (button) button.hidden = true;
  };

  window.addEventListener('beforeinstallprompt', onPrompt);
  button?.addEventListener('click', onClick);

  return () => {
    window.removeEventListener('beforeinstallprompt', onPrompt);
    button?.removeEventListener('click', onClick);
  };
}
