import { CheckCircle } from "lucide-react";

interface FormSuccessProps {
  message?: string;
}

export function FormSuccess({ message }: FormSuccessProps) {
  if (!message) return null;

  return (
    <div className="flex items-center gap-2 p-3 text-sm text-green-800 bg-green-50 border border-green-200 rounded-md">
      <CheckCircle className="h-4 w-4 flex-shrink-0" />
      <p>{message}</p>
    </div>
  );
}

