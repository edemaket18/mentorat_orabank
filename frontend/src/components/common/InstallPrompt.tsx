import React, { useState } from 'react';
import { useInstallPrompt } from '../../hooks/useInstallPrompt';

const InstallPrompt: React.FC = () => {
  const { canInstall, promptInstall } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(false);

  if (!canInstall || dismissed) return null;

  return (
    <div className="install-prompt">
      <span className="install-prompt__text">Installer l'application pour un accès plus rapide.</span>
      <div className="install-prompt__actions">
        <button className="install-prompt__button" onClick={promptInstall}>
          Installer
        </button>
        <button className="install-prompt__dismiss" onClick={() => setDismissed(true)} aria-label="Fermer">
          ✕
        </button>
      </div>
    </div>
  );
};

export default InstallPrompt;