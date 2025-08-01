/**
 * Get qualified image URL for avatars and other images
 * @param relativePath - The relative path from backend (can be null/undefined)
 * @param useDefault - Whether to return default avatar if no path provided
 * @returns Fully qualified URL or default avatar URL
 */
export const getQualifiedImageUrl = (
  relativePath?: string | null,
  useDefault: boolean = true
): string => {
  const APP_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  
  // If no path provided and default is requested, return default avatar
  if ((!relativePath || relativePath === null) && useDefault) {
    return `${APP_URL}/uploads/default/avatar-modern.svg`;
  }
  
  // If no path and no default requested, return empty string
  if (!relativePath || relativePath === null) {
    return "";
  }
  
  // If already a full URL, return as-is
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }
  
  // Normalize the path: replace backslashes with forward slashes
  let normalizedPath = relativePath.replace(/\\/g, '/');
  
  // If the path doesn't start with 'uploads/', add it
  if (!normalizedPath.startsWith('uploads/')) {
    normalizedPath = `uploads/${normalizedPath}`;
  }
  
  // Remove any double slashes
  normalizedPath = normalizedPath.replace(/\/+/g, '/');
  
  return `${APP_URL}/${normalizedPath}`;
};

/**
 * Get user avatar URL with proper fallback
 * @param user - User object that may contain avatar path
 * @returns Processed avatar URL or default avatar
 */
export const getUserAvatarUrl = (user?: { avatar?: string | null } | null): string => {
  return getQualifiedImageUrl(user?.avatar, true);
};
