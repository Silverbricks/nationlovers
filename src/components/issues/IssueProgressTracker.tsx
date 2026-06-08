import { CheckCircle, Circle } from "lucide-react";
import { PROGRESS_STAGES } from "@/lib/constants";
import { IssueProgress } from "@prisma/client";

interface IssueProgressTrackerProps {
  progress: IssueProgress[];
}

export function IssueProgressTracker({ progress }: IssueProgressTrackerProps) {
  const completedStages = new Set(progress.map((p) => p.stage));

  const lastCompleted = PROGRESS_STAGES.findIndex(
    (s) => !completedStages.has(s.key as any)
  ) - 1;

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <h3 className="font-semibold text-navy mb-5 text-sm uppercase tracking-wider">
        Issue Lifecycle
      </h3>
      <div className="space-y-4">
        {PROGRESS_STAGES.map((stage, index) => {
          const isDone = completedStages.has(stage.key as any);
          const isCurrent = index === lastCompleted + 1;

          return (
            <div key={stage.key} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                {isDone ? (
                  <CheckCircle className="w-5 h-5 text-alert-green shrink-0" />
                ) : isCurrent ? (
                  <div className="w-5 h-5 rounded-full border-2 border-gold bg-gold/20 animate-pulse-dot shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300 shrink-0" />
                )}
                {index < PROGRESS_STAGES.length - 1 && (
                  <div
                    className={`w-0.5 h-6 mt-1 ${isDone ? "bg-alert-green" : "bg-gray-200"}`}
                  />
                )}
              </div>
              <div className="pb-4">
                <p
                  className={`text-sm font-semibold ${
                    isDone ? "text-navy" : isCurrent ? "text-gold" : "text-gray-400"
                  }`}
                >
                  {stage.label}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{stage.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
