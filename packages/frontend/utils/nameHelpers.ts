export function getInitials(firstName?: string, lastName?: string): string {
  if (!firstName && !lastName) {
    return '';
  }
  
  const first = firstName?.trim().charAt(0).toUpperCase() || '';
  const last = lastName?.trim().charAt(0).toUpperCase() || '';
  
  return `${first}${last}`;
}

export function getInitialsFromFullName(fullName?: string): string {
  if (!fullName?.trim()) {
    return '';
  }
  
  const names = fullName.trim().split(' ').filter(name => name.length > 0);
  
  if (names.length === 0) {
    return '';
  }
  
  if (names.length === 1) {
    return names[0]?.charAt(0).toUpperCase() || '';
  }
  
  const first = names[0]?.charAt(0).toUpperCase() || '';
  const last = names[names.length - 1]?.charAt(0).toUpperCase() || '';
  
  return `${first}${last}`;
}