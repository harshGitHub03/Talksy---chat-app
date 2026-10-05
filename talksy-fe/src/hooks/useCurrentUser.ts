import { useOutletContext } from 'react-router-dom';
import type { User } from '../lib/auth';

// Only valid inside routes nested under <ProtectedRoute />
export function useCurrentUser() {
  return useOutletContext<{user:User,liveUsers:Set<string>}>();
}
