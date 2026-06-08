"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { reportIssueSchema, ReportIssueInput } from "@/lib/validations";
import { Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { CATEGORIES, STATES } from "@/lib/constants";
import toast from "react-hot-toast";

const SEVERITY_OPTIONS = [
  { value: "LOW", label: "Low — Minor inconvenience" },
  { value: "MEDIUM", label: "Medium — Significant impact" },
  { value: "HIGH", label: "High — Serious problem" },
  { value: "CRITICAL", label: "Critical — Urgent attention needed" },
];

const STEPS = ["Issue Details", "Location & Severity", "Review & Submit"];

export default function ReportIssuePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, trigger, watch, formState: { errors } } = useForm<ReportIssueInput>({
    resolver: zodResolver(reportIssueSchema),
    defaultValues: { photoUrls: [] },
  });

  const watchedValues = watch();

  if (status === "loading") {
    return <div className="min-h-screen bg-grey-light flex items-center justify-center pt-16">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-grey-light flex items-center justify-center pt-16 px-4">
        <div className="text-center max-w-md">
          <span className="text-6xl mb-4 block">🔒</span>
          <h1 className="text-2xl font-bold text-navy mb-2">Sign In Required</h1>
          <p className="text-gray-500 mb-6">You need to be signed in to report an issue.</p>
          <Link href="/login?callbackUrl=/report">
            <Button size="lg">Sign In to Report</Button>
          </Link>
        </div>
      </div>
    );
  }

  async function nextStep() {
    const fields: (keyof ReportIssueInput)[][] = [
      ["title", "description", "category"],
      ["location", "state", "severity"],
    ];
    const valid = await trigger(fields[step]);
    if (valid) setStep((s) => s + 1);
  }

  async function onSubmit(data: ReportIssueInput) {
    setLoading(true);
    try {
      const res = await fetch("/api/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Failed to report issue.");
        setLoading(false);
        return;
      }
      toast.success("Issue reported! 🇦🇺 Thank you for speaking up.");
      router.push(`/issues/${json.data.id}`);
    } catch {
      toast.error("Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-grey-light pt-16">
      <div className="bg-navy-deep py-10">
        <div className="container-narrow">
          <h1 className="text-3xl font-extrabold text-white mb-1">🚨 Report an Issue</h1>
          <p className="text-white/60">Share what&apos;s happening in your community</p>
        </div>
      </div>

      <div className="container-narrow py-10">
        {/* Step indicators */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                i < step ? "bg-alert-green text-white" :
                i === step ? "bg-navy text-white" : "bg-gray-200 text-gray-400"
              }`}>
                {i < step ? "✓" : i + 1}
              </div>
              <span className={`text-sm ${i === step ? "text-navy font-semibold" : "text-gray-400"} hidden sm:inline`}>
                {label}
              </span>
              {i < STEPS.length - 1 && <div className="h-0.5 w-8 bg-gray-200 mx-1" />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            {/* Step 0: Details */}
            {step === 0 && (
              <div className="space-y-5">
                <h2 className="text-lg font-bold text-navy mb-4">Step 1: Issue Details</h2>
                <Input
                  label="Issue Title *"
                  placeholder="e.g. Grocery prices up 40% in Western Sydney"
                  error={errors.title?.message}
                  {...register("title")}
                />
                <Select
                  label="Category *"
                  placeholder="Select a category..."
                  options={CATEGORIES.map((c) => ({ value: c.value, label: `${c.icon} ${c.label}` }))}
                  error={errors.category?.message}
                  {...register("category")}
                />
                <Textarea
                  label="Describe the Issue *"
                  placeholder="Tell us what's happening, who it's affecting, and why it matters. Include specific details, numbers, or personal experiences..."
                  error={errors.description?.message}
                  className="min-h-[160px]"
                  {...register("description")}
                />
              </div>
            )}

            {/* Step 1: Location & Severity */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-lg font-bold text-navy mb-4">Step 2: Location & Severity</h2>
                <Input
                  label="Location (Suburb or Town) *"
                  placeholder="e.g. Penrith, Cobar, Melbourne CBD"
                  error={errors.location?.message}
                  {...register("location")}
                />
                <Select
                  label="State / Territory *"
                  placeholder="Select your state..."
                  options={STATES.map((s) => ({ value: s.value, label: s.label }))}
                  error={errors.state?.message}
                  {...register("state")}
                />
                <Select
                  label="Severity *"
                  placeholder="How serious is this issue?"
                  options={SEVERITY_OPTIONS}
                  error={errors.severity?.message}
                  {...register("severity")}
                />
              </div>
            )}

            {/* Step 2: Review */}
            {step === 2 && (
              <div>
                <h2 className="text-lg font-bold text-navy mb-4">Step 3: Review & Submit</h2>
                <div className="bg-grey-light rounded-xl p-5 space-y-3 text-sm">
                  <div><span className="font-semibold text-navy">Title:</span> {watchedValues.title}</div>
                  <div><span className="font-semibold text-navy">Category:</span> {watchedValues.category}</div>
                  <div><span className="font-semibold text-navy">Location:</span> {watchedValues.location}, {watchedValues.state}</div>
                  <div><span className="font-semibold text-navy">Severity:</span> {watchedValues.severity}</div>
                  <div>
                    <span className="font-semibold text-navy">Description:</span>
                    <p className="mt-1 text-gray-600 leading-relaxed">{watchedValues.description}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-4">
                  By submitting, you confirm this issue is real and relates to Australia. False reports may be removed.
                </p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
              {step > 0 ? (
                <Button type="button" variant="ghost" onClick={() => setStep((s) => s - 1)}>
                  ← Back
                </Button>
              ) : <div />}

              {step < STEPS.length - 1 ? (
                <Button type="button" onClick={nextStep}>
                  Next Step →
                </Button>
              ) : (
                <Button type="submit" loading={loading} size="lg">
                  🚨 Submit Issue for Australia
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
