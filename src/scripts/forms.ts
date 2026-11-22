// Wspólna obsługa formularzy: wysyłka w tle, komunikat, zdarzenie GA4 (tylko po zgodzie).
declare global {
  interface Window {
    dataLayer?: unknown[];
    osemkaConsent?: boolean;
  }
}

const MESSAGES: Record<string, string> = {
  newsletter: 'Sprawdź skrzynkę i potwierdź zapis linkiem z maila.',
  lead: 'Dziękujemy. Kapitan odezwie się w ciągu dwóch dni roboczych.',
  kontakt: 'Wiadomość wysłana. Odpowiemy w ciągu dwóch dni roboczych.',
};

export function wireForms() {
  document.querySelectorAll<HTMLFormElement>('form[data-form]').forEach((form) => {
    if (form.dataset.wired) return;
    form.dataset.wired = '1';
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const msg = form.querySelector<HTMLElement>('.form-msg');
      const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
      const kind = form.dataset.form ?? 'kontakt';
      if (button) button.disabled = true;
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });
        if (!res.ok) throw new Error(String(res.status));
        // GTM przekazuje to zdarzenie do GA4 (tag „GA4 – formularze”)
        if (window.osemkaConsent) (window.dataLayer ||= []).push({ event: form.dataset.event ?? 'form_submit', form_id: form.id || kind });
        form.reset();
        if (msg) { msg.dataset.state = 'ok'; msg.textContent = MESSAGES[kind] ?? MESSAGES.kontakt; }
      } catch {
        if (msg) {
          msg.dataset.state = 'err';
          msg.textContent = `Nie udało się wysłać formularza. Napisz bezpośrednio na ${msg.dataset.fallback}.`;
        }
      } finally {
        if (button) button.disabled = false;
      }
    });
  });
}
