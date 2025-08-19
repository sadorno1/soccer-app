import { Alert } from 'react-native';

// Define a global interface for ErrorUtils
declare var ErrorUtils: {
  getGlobalHandler: () => (error: Error, isFatal?: boolean) => void;
  setGlobalHandler: (handler: (error: Error, isFatal?: boolean) => void) => void;
};

// Extend the global Error object with a potential componentStack
interface ExtendedError extends Error {
  componentStack?: string;
}

export function initializeErrorHandler() {
  // Set a global error handler
  if (ErrorUtils) {
    const defaultHandler = ErrorUtils.getGlobalHandler();

    ErrorUtils.setGlobalHandler((error: ExtendedError, isFatal?: boolean) => {
      // Create a user-friendly error message
      const errorMessage = `
      Fatal Error: ${isFatal ? 'Yes' : 'No'}

      Name: ${error.name}
      Message: ${error.message}

      Component Stack:
      ${error.componentStack || 'N/A'}
    `;

      // Show the error in an alert
      Alert.alert('Application Error', errorMessage, [{ text: 'OK' }]);

      // Fallback to the default handler
      if (defaultHandler) {
        defaultHandler(error, isFatal);
      }
    });

    console.log('✅ Global error handler installed.');
  } else {
    console.warn('⚠️ Global error handler (ErrorUtils) not available.');
  }
}
