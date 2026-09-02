import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T, expirationMinutes?: number): [T, (value: T | ((val: T) => T)) => void] {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }
        try {
            // Get from local storage by key
            const item = window.localStorage.getItem(key);
            // Parse stored json or if none return initialValue
            if (item) {
                const parsedItem = JSON.parse(item);

                // Check if item has expiration data
                if (expirationMinutes && parsedItem && typeof parsedItem === 'object' && 'timestamp' in parsedItem && 'value' in parsedItem) {
                    const now = Date.now();
                    const created = parsedItem.timestamp;
                    const expirationMs = expirationMinutes * 60 * 1000;

                    if (now - created > expirationMs) {
                        // Expired, remove and return initialValue
                        window.localStorage.removeItem(key);
                        return initialValue;
                    }
                    return parsedItem.value;
                }

                // Backward compatibility or no expiration
                return parsedItem;
            }
            return initialValue;
        } catch (error) {
            // If error also return initialValue
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = (value: T | ((val: T) => T)) => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            // Save state
            setStoredValue(valueToStore);
            // Save to local storage
            if (typeof window !== 'undefined') {
                if (expirationMinutes) {
                    const itemToStore = {
                        value: valueToStore,
                        timestamp: Date.now()
                    };
                    window.localStorage.setItem(key, JSON.stringify(itemToStore));
                } else {
                    window.localStorage.setItem(key, JSON.stringify(valueToStore));
                }
            }
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error);
        }
    };

    return [storedValue, setValue];
}
