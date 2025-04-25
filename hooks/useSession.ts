import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';

interface Session {
  id: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  patient: {
    id: string;
    name: string;
  };
  therapist: {
    id: string;
    name: string;
  };
  package: {
    id: string;
    title: string;
  };
}

interface SessionState {
  sessions: Session[];
  loading: boolean;
  error: string | null;
}

export const useSession = () => {
  const { token } = useAuth();
  const [state, setState] = useState<SessionState>({
    sessions: [],
    loading: false,
    error: null,
  });

  const fetchSessions = useCallback(async (params: Record<string, any> = {}) => {
    if (!token) return;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`/api/session/get-all?${queryString}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch sessions');
      }

      setState(prev => ({
        ...prev,
        sessions: data.data,
        loading: false,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'An error occurred while fetching sessions',
      }));
    }
  }, [token]);

  const createSession = async (sessionData: Partial<Session>) => {
    if (!token) return;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await fetch('/api/session/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(sessionData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create session');
      }

      setState(prev => ({
        ...prev,
        sessions: [...prev.sessions, data.data],
        loading: false,
      }));

      return data.data;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'An error occurred while creating session',
      }));
      throw error;
    }
  };

  const updateSession = async (sessionId: string, updates: Partial<Session>) => {
    if (!token) return;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await fetch(`/api/session/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sessionId, ...updates }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update session');
      }

      setState(prev => ({
        ...prev,
        sessions: prev.sessions.map(session =>
          session.id === sessionId ? { ...session, ...data.data } : session
        ),
        loading: false,
      }));

      return data.data;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'An error occurred while updating session',
      }));
      throw error;
    }
  };

  const cancelSession = async (sessionId: string, reason: string) => {
    if (!token) return;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await fetch(`/api/session/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sessionId,
          status: 'cancelled',
          cancellationReason: reason,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to cancel session');
      }

      setState(prev => ({
        ...prev,
        sessions: prev.sessions.map(session =>
          session.id === sessionId ? { ...session, status: 'cancelled' } : session
        ),
        loading: false,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'An error occurred while cancelling session',
      }));
      throw error;
    }
  };

  return {
    sessions: state.sessions,
    loading: state.loading,
    error: state.error,
    fetchSessions,
    createSession,
    updateSession,
    cancelSession,
  };
}; 