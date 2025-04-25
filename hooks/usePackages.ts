import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';

interface Package {
  id: string;
  title: string;
  description: string;
  price: number;
  sessionCount: number;
  durationPerSession: number;
  validity: number;
  features: string[];
  isActive: boolean;
}

interface PackageState {
  packages: Package[];
  loading: boolean;
  error: string | null;
}

export const usePackages = () => {
  const { token } = useAuth();
  const [state, setState] = useState<PackageState>({
    packages: [],
    loading: false,
    error: null,
  });

  const fetchPackages = useCallback(async (params: Record<string, any> = {}) => {
    if (!token) return;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`/api/packages/get-all?${queryString}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch packages');
      }

      setState(prev => ({
        ...prev,
        packages: data.data,
        loading: false,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'An error occurred while fetching packages',
      }));
    }
  }, [token]);

  const createPackage = async (packageData: Omit<Package, 'id'>) => {
    if (!token) return;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await fetch('/api/packages/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(packageData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create package');
      }

      setState(prev => ({
        ...prev,
        packages: [...prev.packages, data.data],
        loading: false,
      }));

      return data.data;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'An error occurred while creating package',
      }));
      throw error;
    }
  };

  const updatePackage = async (packageId: string, updates: Partial<Package>) => {
    if (!token) return;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await fetch(`/api/packages/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ packageId, ...updates }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update package');
      }

      setState(prev => ({
        ...prev,
        packages: prev.packages.map(pkg =>
          pkg.id === packageId ? { ...pkg, ...data.data } : pkg
        ),
        loading: false,
      }));

      return data.data;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'An error occurred while updating package',
      }));
      throw error;
    }
  };

  const deletePackage = async (packageId: string) => {
    if (!token) return;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await fetch(`/api/packages/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ packageId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete package');
      }

      setState(prev => ({
        ...prev,
        packages: prev.packages.filter(pkg => pkg.id !== packageId),
        loading: false,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'An error occurred while deleting package',
      }));
      throw error;
    }
  };

  const togglePackageStatus = async (packageId: string) => {
    const pkg = state.packages.find(p => p.id === packageId);
    if (!pkg) return;

    await updatePackage(packageId, {
      isActive: !pkg.isActive,
    });
  };

  return {
    packages: state.packages,
    loading: state.loading,
    error: state.error,
    fetchPackages,
    createPackage,
    updatePackage,
    deletePackage,
    togglePackageStatus,
  };
}; 