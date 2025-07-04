import { CheckCircle, AlertCircle, Info, Mail, X } from "lucide-react";
import { useState } from "react";

export type Message =
  | { success: string }
  | { error: string }
  | { message: string };

interface FormMessageProps {
  message: Message;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export function FormMessage({
  message,
  dismissible = false,
  onDismiss,
}: FormMessageProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (!message || isDismissed) return null;

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  return (
    <div
      className="flex flex-col gap-2 w-full max-w-md text-sm form-message"
      role="alert"
    >
      {"success" in message && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start gap-3 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-medium mb-1">Success!</div>
            <div className="text-green-600">{message.success}</div>
            {message.success.includes("email") && (
              <div className="mt-2 flex items-center gap-2 text-xs text-green-600">
                <Mail className="w-4 h-4" />
                <span>Check your inbox and spam folder</span>
              </div>
            )}
          </div>
          {dismissible && (
            <button
              onClick={handleDismiss}
              className="text-green-600 hover:text-green-800 transition-colors hover-target interactive-element"
              data-interactive="true"
              aria-label="Dismiss message"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
      {"error" in message && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3 shadow-sm hover:shadow-md transition-shadow duration-200">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-medium mb-1">Error</div>
            <div className="text-red-600">{message.error}</div>
            {message.error.includes("verify") && (
              <div className="mt-2 text-xs text-red-600">
                💡 Tip: Check your spam folder if you don't see the verification
                email
              </div>
            )}
          </div>
          {dismissible && (
            <button
              onClick={handleDismiss}
              className="text-red-600 hover:text-red-800 transition-colors hover-target interactive-element"
              data-interactive="true"
              aria-label="Dismiss message"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
      {"message" in message && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg flex items-start gap-3 shadow-sm hover:shadow-md transition-shadow duration-200">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-medium mb-1">Information</div>
            <div className="text-blue-600">{message.message}</div>
          </div>
          {dismissible && (
            <button
              onClick={handleDismiss}
              className="text-blue-600 hover:text-blue-800 transition-colors hover-target interactive-element"
              data-interactive="true"
              aria-label="Dismiss message"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
