import { useEffect } from 'react';

/**
 * Hook to execute a callback when a specific keyboard shortcut is pressed.
 * Designed to be reusable across the application.
 */
export function useKeyboardShortcut(keys: string[], callback: (e: KeyboardEvent) => void) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMatch = keys.every(key => {
        const lowerKey = key.toLowerCase();
        if (lowerKey === 'ctrl' || lowerKey === 'control') return event.ctrlKey;
        if (lowerKey === 'alt') return event.altKey;
        if (lowerKey === 'shift') return event.shiftKey;
        if (lowerKey === 'meta' || lowerKey === 'cmd') return event.metaKey;
        return event.key.toLowerCase() === lowerKey;
      });

      // Also ensure that we aren't matching when extra modifiers are pressed.
      // E.g. if we only want 'm', we shouldn't trigger on 'Ctrl+m'.
      const requiresCtrl = keys.some(k => k.toLowerCase() === 'ctrl' || k.toLowerCase() === 'control');
      const requiresAlt = keys.some(k => k.toLowerCase() === 'alt');
      const requiresShift = keys.some(k => k.toLowerCase() === 'shift');
      const requiresMeta = keys.some(k => k.toLowerCase() === 'meta' || k.toLowerCase() === 'cmd');

      const matchesModifiers = 
        event.ctrlKey === requiresCtrl &&
        event.altKey === requiresAlt &&
        event.shiftKey === requiresShift &&
        event.metaKey === requiresMeta;

      if (isMatch && matchesModifiers) {
        event.preventDefault();
        callback(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keys, callback]);
}
