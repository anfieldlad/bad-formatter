import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface PrivacyPolicyModalProps {
  open: boolean;
  onClose: () => void;
}

export function PrivacyPolicyModal({ open, onClose }: PrivacyPolicyModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      className="privacy-dialog"
      onClick={handleBackdropClick}
      aria-label="Privacy Policy"
    >
      <div className="privacy-dialog-inner">
        <div className="privacy-dialog-header">
          <h2 className="privacy-dialog-title">Privacy Policy</h2>
          <button
            type="button"
            className="button ghost privacy-close-btn"
            onClick={onClose}
            aria-label="Close privacy policy"
          >
            <X aria-hidden="true" size={16} />
          </button>
        </div>

        <div className="privacy-dialog-body">
          <p className="privacy-lead">
            <strong>The short version: Bad Formatter never sees your data.</strong>{" "}
            Everything runs in your browser. Nothing is sent to a server.
          </p>

          <h3>How it works</h3>
          <p>
            Bad Formatter is a fully client-side application. When you paste JSON, format,
            validate, or minify it, all processing happens locally in your browser using
            JavaScript. No data is transmitted over the network — not to us, not to anyone.
          </p>

          <h3>What we collect</h3>
          <p>Nothing. There is no backend, no database, no analytics, and no logging.</p>
          <ul>
            <li>We do not collect your JSON data.</li>
            <li>We do not log IP addresses or request metadata.</li>
            <li>We do not use cookies.</li>
            <li>We do not run any third-party analytics or tracking scripts.</li>
            <li>We do not require an account.</li>
          </ul>

          <h3>What stays on your device</h3>
          <table className="privacy-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Storage</th>
                <th>Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Theme preference</td>
                <td><code>localStorage</code></td>
                <td>Remembers light or dark mode between visits</td>
              </tr>
            </tbody>
          </table>
          <p>
            You can clear this at any time through your browser's developer tools or
            site settings.
          </p>

          <h3>Share links</h3>
          <p>
            When you click <strong>Share</strong>, your JSON is compressed using{" "}
            <a href="https://github.com/pieroxy/lz-string" target="_blank" rel="noopener noreferrer">
              lz-string
            </a>{" "}
            and encoded into the <code>#d=…</code> fragment of the URL — entirely in your
            browser. URL fragments are never included in HTTP requests, so the data does not
            touch our servers. When someone opens a share link, their browser decodes the
            fragment locally.
          </p>
          <p>
            Be mindful that anyone with the link can read the JSON encoded in it. Do not
            share links containing sensitive or confidential data.
          </p>

          <h3>Third-party services</h3>
          <p>
            None. Bad Formatter loads no external scripts, fonts, images, or tracking pixels.
            All assets are bundled and served from the same origin.
          </p>

          <h3>Changes to this policy</h3>
          <p>
            If this policy changes, we will update the date below. Because we collect no
            data, any future changes will only ever clarify how the tool works.
          </p>
          <p>
            <strong>Contact: </strong>
            <a href="http://badai.tech" target="_blank" rel="noopener noreferrer">
              badai.tech
            </a>
          </p>

          <p className="privacy-updated">Last updated: May 2025</p>
        </div>
      </div>
    </dialog>
  );
}
