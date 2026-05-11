import { useState, useCallback, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface OptimisticUpdateOptions<T> {
  id: string; // Unique identifier for this operation (e.g., "like-video-123")
  optimisticData: T; // UI data to show immediately
  onSync: () => Promise<any>; // Function that syncs with backend
  onRollback?: (originalData: T) => void; // Called if sync fails
  retryCount?: number; // Number of retry attempts (default: 3)
  retryDelay?: number; // Delay between retries in ms (default: 1000)
  timeout?: number; // Timeout for sync operation in ms (default: 10000)
}

interface PendingOperation<T> {
  id: string;
  optimisticData: T;
  onSync: () => Promise<any>;
  onRollback?: (originalData: T) => void;
  retryCount: number;
  retriesLeft: number;
  retryDelay: number;
  timeout: number;
  timestamp: number;
  syncInProgress: boolean;
}

const PENDING_OPERATIONS_KEY = '@pending_operations';
const MAX_PENDING_OPERATIONS = 100;

class SyncQueue {
  private queue: Map<string, PendingOperation<any>> = new Map();
  private processing = false;
  private listeners: Set<() => void> = new Set();

  addListener(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  async addOperation<T>(options: OptimisticUpdateOptions<T>) {
    const operation: PendingOperation<T> = {
      id: options.id,
      optimisticData: options.optimisticData,
      onSync: options.onSync,
      onRollback: options.onRollback,
      retryCount: options.retryCount || 3,
      retriesLeft: options.retryCount || 3,
      retryDelay: options.retryDelay || 1000,
      timeout: options.timeout || 10000,
      timestamp: Date.now(),
      syncInProgress: false,
    };

    this.queue.set(options.id, operation);
    this.notifyListeners();
    
    // Persist to AsyncStorage
    await this.savePendingOperations();
    
    // Start processing
    this.processQueue();
  }

  private async processQueue() {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.size > 0) {
      const [operationId, operation] = this.queue.entries().next().value;

      if (operation.syncInProgress) {
        await new Promise(resolve => setTimeout(resolve, 100));
        continue;
      }

      operation.syncInProgress = true;
      this.notifyListeners();

      try {
        // Sync with timeout
        await this.executeWithTimeout(operation.onSync(), operation.timeout);
        
        // Success - remove from queue
        this.queue.delete(operationId);
        await this.savePendingOperations();
        this.notifyListeners();
      } catch (error) {
        operation.retriesLeft--;
        
        if (operation.retriesLeft <= 0) {
          // Failed permanently - rollback
          if (operation.onRollback) {
            operation.onRollback(operation.optimisticData);
          }
          this.queue.delete(operationId);
        } else {
          // Retry after delay
          operation.syncInProgress = false;
          await new Promise(resolve => setTimeout(resolve, operation.retryDelay));
          operation.retryDelay = Math.min(operation.retryDelay * 1.5, 30000); // Exponential backoff, max 30s
        }
        
        await this.savePendingOperations();
        this.notifyListeners();
      }
    }

    this.processing = false;
  }

  private executeWithTimeout(promise: Promise<any>, timeoutMs: number): Promise<any> {
    return Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Sync timeout')), timeoutMs)
      ),
    ]);
  }

  getOperationStatus(operationId: string) {
    return this.queue.get(operationId);
  }

  getPendingOperations() {
    return Array.from(this.queue.values());
  }

  private async savePendingOperations() {
    try {
      const operations = Array.from(this.queue.values());
      if (operations.length > 0) {
        // Only save operation metadata, not functions
        const metadata = operations.map(op => ({
          id: op.id,
          retryCount: op.retryCount,
          retriesLeft: op.retriesLeft,
          retryDelay: op.retryDelay,
          timeout: op.timeout,
          timestamp: op.timestamp,
        }));
        await AsyncStorage.setItem(
          PENDING_OPERATIONS_KEY,
          JSON.stringify(metadata.slice(0, MAX_PENDING_OPERATIONS))
        );
      } else {
        await AsyncStorage.removeItem(PENDING_OPERATIONS_KEY);
      }
    } catch (error) {
      console.error('Error saving pending operations:', error);
    }
  }

  async loadPendingOperations() {
    try {
      const data = await AsyncStorage.getItem(PENDING_OPERATIONS_KEY);
      // Note: Functions can't be serialized, so we only restore metadata
      // Actual sync handlers need to be registered when app starts
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading pending operations:', error);
      return [];
    }
  }
}

// Global sync queue singleton
const globalSyncQueue = new SyncQueue();

export const useOptimisticUpdate = <T>(
  options: OptimisticUpdateOptions<T>
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const operationRef = useRef(options.id);

  useEffect(() => {
    // Listen to queue changes
    const unsubscribe = globalSyncQueue.addListener(() => {
      const operation = globalSyncQueue.getOperationStatus(operationRef.current);
      if (operation) {
        setIsSyncing(operation.syncInProgress);
      }
    });

    return unsubscribe;
  }, []);

  const executeUpdate = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Add to sync queue (handles optimistic update + background sync)
      await globalSyncQueue.addOperation(options);
    } catch (err: any) {
      setError(err.message || 'Update failed');
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  return {
    executeUpdate,
    isLoading,
    isSyncing,
    error,
    getSyncStatus: () => globalSyncQueue.getOperationStatus(operationRef.current),
  };
};

// Helper for network connectivity check
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('https://www.google.com', { method: 'HEAD' });
        setIsOnline(response.ok);
      } catch {
        setIsOnline(false);
      }
    };

    // Check on interval
    const interval = setInterval(checkConnection, 30000); // Every 30 seconds
    checkConnection();

    return () => clearInterval(interval);
  }, []);

  return isOnline;
};
