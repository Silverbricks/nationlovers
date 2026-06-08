"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { suggestFixSchema, SuggestFixInput } from "@/lib/validations";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function SuggestPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedIssueId = searchParams.get("issueId") ?? "";
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState<string[]>([""]);
  const [feasibility, setFeasibility] = useState(5);
  const [issueTitle, setIssueTitle] = useState<string>("");

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<SuggestFixInput>({
    resolver: zodResolver(suggestFixSchema),
    defaultValues: {
      issueId: preselectedIssueId,
      feasibilityRating: 5,
      stepsToImplement: [""],
    },
  });

  useEffect(() => {
    if (preselectedIssueId) {
      fetch(`/api/issues/${preselectedIssueId}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.data?.title) setIssueTitle(data.data.title);
        })
        .catch(() => {});
    }
  }, [preselectedIssueId]);

  useEffect(() => {
    setValue("stepsToImplement", steps.filter((s) => s.trim()));
    setValue("feasibilityRating", feasibility);
  }, [steps, feasibility, setValue]);

  function addStep() { setSteps((s) => [...s, ""]); }
  function removeStep(i: number) { setSteps((s) => s.filter((_, idx) => idx !== i)); }
  function updateStep(i: number, val: string) {
    setSteps((s) => s.map((step, idx) => (idx === i ? val : step)));
  }

  if (status === "loading") return <div className="min-h-screen flex items-center justify-center pt-16">Loading...</div>;

  if (!session) {
    return (
      <div className="min-h-screen bg-grey-light flex items-center justify-center pt-16 px-4">
        <div className="text-center max-w-md">
          <span className="text-6xl mb-4 block">💡</span>
          <h1 className="text-2xl font-bold text-navy mb-2">Sign In Required</h1>
          <p className="text-gray-500 mb-6">Sign in to submit your solution for Australia.</p>
          <Link href="/login?callbackUrl=/suggest">
            <Button size="lg">Sign In to Suggest</Button>
          </Link>
        </div>
      </div>
    );
  }

  async function onSubmit(data: SuggestFixInput) {
    setLoading(true);
    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, stepsToImplement: steps.filter((s) => s.trim()), feasibilityRating: feasibility }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Failed to submit solution.");
        setLoading(false);
        return;
      }
      toast.success("Solution submitted! 🇦🇺 Great contribution.");
      router.push(`/issues/${data.issueId}`);
    } catch {
      toast.error("Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-grey-light pt-16">
      <div className="bg-hero-gradient py-10">
        <div className="container-narrow">
          <h1 className="text-3xl font-extrabold text-white mb-1">💡 Suggest a Fix</h1>
          <p className="text-white/60">Submit your solution for Australia</p>
        </div>
      </div>

      <div className="container-narrow py-10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-5">
            <h2 className="text-lg font-bold text-navy">Your Solution</h2>

            {/* Issue ID */}
            <div>
              <Input
                label="Issue ID (paste from issue URL) *"
                placeholder="e.g. clxxxxxx"
                error={errors.issueId?.message}
                defaultValue={preselectedIssueId}
                {...register("issueId")}
              />
              {issueTitle && (
                <p className="text-xs text-alert-green mt-1 font-medium">✓ Issue: &quot;{issueTitle}&quot;</p>
              )}
            </div>

            <Input
              label="Solution Title *"
              placeholder="e.g. Mandatory supermarket price transparency law"
              error={errors.title?.message}
              {...register("title")}
            />

            <Textarea
              label="Brief Description *"
              placeholder="What is your solution? Who does it help?"
              error={errors.description?.message}
              {...register("description")}
            />

            <Textarea
              label="Full Solution Detail *"
              placeholder="Describe your solution in detail — what specifically would be done, who would do it, and how it would work in practice..."
              className="min-h-[140px]"
              error={errors.solution?.message}
              {...register("solution")}
            />
          </div>

          {/* Implementation steps */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-lg font-bold text-navy">Implementation Steps</h2>
            <p className="text-sm text-gray-500">Break your solution into actionable steps</p>
            {errors.stepsToImplement && (
              <p className="text-xs text-alert-red">{String(errors.stepsToImplement.message ?? "At least one step is required.")}</p>
            )}
            {steps.map((step, i) => (
              <div key={i} className="flex gap-2">
                <span className="mt-2.5 text-gold font-bold text-sm min-w-[1.5rem]">{i + 1}.</span>
                <input
                  value={step}
                  onChange={(e) => updateStep(i, e.target.value)}
                  placeholder={`Step ${i + 1}...`}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-navy-royal focus:outline-none focus:ring-2 focus:ring-navy-royal/20"
                />
                {steps.length > 1 && (
                  <button type="button" onClick={() => removeStep(i)} className="text-gray-300 hover:text-alert-red transition-colors mt-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addStep} className="flex items-center gap-1.5 text-navy text-sm font-semibold hover:text-navy-royal transition-colors">
              <Plus className="w-4 h-4" /> Add Step
            </button>
          </div>

          {/* Extras */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-5">
            <h2 className="text-lg font-bold text-navy">Additional Details</h2>

            <Input
              label="Estimated Cost (optional)"
              placeholder="e.g. $45M AUD over 3 years"
              {...register("costEstimate")}
            />

            {/* Feasibility slider */}
            <div>
              <label className="text-sm font-medium text-grey-dark block mb-2">
                Feasibility Rating: <span className="text-gold font-bold">{feasibility}/10</span>
              </label>
              <input
                type="range"
                min={1}
                max={10}
                value={feasibility}
                onChange={(e) => setFeasibility(Number(e.target.value))}
                className="w-full accent-gold"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Very Hard</span>
                <span>Achievable</span>
                <span>Easy Win</span>
              </div>
            </div>

            <Textarea
              label="Community Impact (optional)"
              placeholder="How many Australians would benefit? What measurable change would occur?"
              {...register("communityImpact")}
            />
          </div>

          <Button type="submit" fullWidth size="lg" loading={loading}>
            🟡 Submit Solution for Australia
          </Button>
        </form>
      </div>
    </div>
  );
}
