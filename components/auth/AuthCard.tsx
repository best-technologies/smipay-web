import { ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export function AuthCard({ children, title, description }: AuthCardProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg border border-border shadow-sm p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-brand-text-primary mb-2">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-brand-text-secondary">{description}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}

