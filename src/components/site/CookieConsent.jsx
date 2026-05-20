import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

const KEY = "aithusiast:cookie-consent:v1";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY);
      if (!v) {
        // delay so it doesn't pop instantly
        const t = setTimeout(() => setShow(true), 800);
        return () => clearTimeout(t);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const decide = (choice) => {
    try {
      localStorage.setItem(
        KEY,
        JSON.stringify({ choice, ts: new Date().toISOString() })
      );
    } catch {
      /* ignore */
    }
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      data-testid="cookie-consent"
      className="fixed bottom-4 right-4 z-50 w-[94%] sm:w-[420px]"
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="glass-panel rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <p className="font-display text-[15px] leading-tight mb-1">Cookies, but make them tasteful</p>
            <p className="text-white/65 text-[13px] leading-relaxed">
              We use essential cookies to run the site and optional analytics + ads to improve it. Read our{" "}
              <Link to="/cookies" className="text-[#C4B5FD] underline underline-offset-2">
                cookie policy
              </Link>
              .
            </p>
          </div>
          <button
            onClick={() => decide("dismissed")}
            className="text-white/40 hover:text-white p-1"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-3 flex items-center justify-end gap-2">
          <button
            data-testid="cookie-reject"
            onClick={() => decide("rejected")}
            className="btn-ghost text-[12px]"
          >
            Reject non-essential
          </button>
          <button
            data-testid="cookie-accept"
            onClick={() => decide("accepted")}
            className="btn-primary text-[12px]"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
