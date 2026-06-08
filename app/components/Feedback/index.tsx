import { Alert, AlertDescription } from "~/components/ui/alert";
import { CircleCheck, CircleAlert } from "lucide-react";
import { useState } from "react";

export interface FeedbackProps {
  type?: "success" | "error";
  message?: string | null | undefined;
}

export default function Feedback({ type = "error", message }: FeedbackProps) {

  if (!message) return null;

  if (type === "success") {
    return (
      <Alert className="border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 [&>svg]:text-emerald-600 dark:[&>svg]:text-emerald-400">
        <CircleCheck />
        <AlertDescription className="text-emerald-600 dark:text-emerald-400">
          {message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="destructive" className="border-destructive/20 bg-destructive/10">
      <CircleAlert />
      <AlertDescription>
        {message}
      </AlertDescription>
    </Alert>
  );
}
