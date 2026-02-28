import React from 'react';
import { useKeyboardShortcut } from '../hooks/use-keyboard-shortcut';

interface KeyboardShortcutProps {
  /** The keys that trigger the action (e.g., ['Ctrl', 'k']) */
  keys: string[];
  /** Action to perform when shortcut is triggered */
  onAction: (e: KeyboardEvent) => void;
  /** Content to wrap (usually a button or link) */
  children: React.ReactNode;
  /** Where to position the hint relative to children */
  hintPosition?: 'left' | 'right';
  /** Additional CSS classes */
  className?: string;
  /** Whether the shortcut is currently active/listening */
  disabled?: boolean;
}

/**
 * A wrapper element that registers a keyboard shortcut and displays a visual hint.
 * Designed to be reusable for any interactive element in the system.
 */
export function KeyboardShortcut({
  keys,
  onAction,
  children,
  hintPosition = 'right',
  className = '',
  disabled = false,
}: KeyboardShortcutProps) {
  // Only register the shortcut if not disabled
  useKeyboardShortcut(
    keys,
    (e) => {
      if (!disabled) {
        onAction(e);
      }
    }
  );

  const formattedHint = keys.map(k => k.length === 1 ? k.toUpperCase() : k).join('+');

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {hintPosition === 'left' && (
        <kbd className="inline-flex items-center justify-center text-[10px] font-mono border border-green-500/50 px-1.5 py-0.5 rounded bg-green-900/20 text-green-400 opacity-70 pointer-events-none whitespace-nowrap">
          {formattedHint}
        </kbd>
      )}
      
      {children}
      
      {hintPosition === 'right' && (
        <kbd className="inline-flex items-center justify-center text-[10px] font-mono border border-green-500/50 px-1.5 py-0.5 rounded bg-green-900/20 text-green-400 opacity-70 pointer-events-none whitespace-nowrap">
          {formattedHint}
        </kbd>
      )}
    </div>
  );
}

export default KeyboardShortcut;
