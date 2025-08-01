/**
 * Safe clipboard utility that handles permissions and fallbacks
 */

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    // First try the modern Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
    // Fallback to the older execCommand method
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    textArea.style.pointerEvents = 'none';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    return successful;
  } catch (error) {
    console.warn('Copy to clipboard failed:', error);
    return false;
  }
};

export const readFromClipboard = async (): Promise<string | null> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      return await navigator.clipboard.readText();
    }
    
    // Fallback - cannot read from clipboard with execCommand
    console.warn('Reading from clipboard not supported in this context');
    return null;
  } catch (error) {
    console.warn('Read from clipboard failed:', error);
    return null;
  }
};
