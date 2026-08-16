import React from 'react';
import Button from './UI/Button';

export interface NavigationProps {
  onNewTest: () => void;
  onSettings?: () => void;
  demoMode?: boolean;
  onToggleDemoMode?: (enabled: boolean) => void;
}

const Navigation: React.FC<NavigationProps> = ({
  onNewTest,
  onSettings,
  demoMode = false,
  onToggleDemoMode,
}) => {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-blue-600">📝 Mock Test Generator</h1>
            {demoMode && (
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                DEMO MODE
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {onToggleDemoMode && (
              <label className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                <input
                  type="checkbox"
                  checked={demoMode}
                  onChange={e => onToggleDemoMode(e.target.checked)}
                  className="cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-700">Demo</span>
              </label>
            )}

            <Button variant="secondary" size="md" onClick={onNewTest}>
              + New Test
            </Button>

            {onSettings && (
              <Button variant="secondary" size="md" onClick={onSettings}>
                ⚙️ Settings
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
