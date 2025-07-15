export default function EyeIcon({ open }) {
  return open ? (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#888" strokeWidth="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3.5"/></svg>
  ) : (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#888" strokeWidth="2"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.77 21.77 0 0 1 5.06-6.06M9.9 4.24A10.94 10.94 0 0 1 12 5c7 0 11 7 11 7a21.77 21.77 0 0 1-4.43 5.94M1 1l22 22"/><circle cx="12" cy="12" r="3.5"/></svg>
  );
} 