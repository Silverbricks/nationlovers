"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@/lib/validations";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { STATES } from "@/lib/constants";
import toast from "react-hot-toast";

const ROLE_OPTIONS = [
  { value: "CITIZEN", label: "Citizen Reporter" },
  { value: "VOLUNTEER", label: "Community Volunteer" },
  { value: "EXPERT", label: "Verified Expert" },
];

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get("role") ?? "CITIZEN";
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: defaultRole as any },
  });

  async function onSubmit(data: RegisterInput) {
    setLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? "Registration failed.");
        setLoading(false);
        return;
      }

      // Auto sign in
      await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      toast.success("Welcome to NationLovers! 🇦🇺");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center px-4 py-20 pt-24">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <span className="text-3xl">🇦🇺</span>
            <span className="text-2xl font-bold text-white">
              Nation<span className="text-gold">Lovers</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Join NationLovers</h1>
          <p className="text-white/60 mt-1">Be part of Australia&apos;s civic voice</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Jane Smith"
              error={errors.name?.message}
              {...register("name")}
            />
            <Input
              label="Email address"
              type="email"
              placeholder="jane@example.com.au"
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Min. 8 chars with uppercase and number"
              error={errors.password?.message}
              {...register("password")}
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Repeat your password"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />
            <Select
              label="Your State / Territory"
              placeholder="Select your state..."
              options={STATES.map((s) => ({ value: s.value, label: s.label }))}
              error={errors.state?.message}
              {...register("state")}
            />
            <Select
              label="Join As"
              options={ROLE_OPTIONS}
              error={errors.role?.message}
              {...register("role")}
            />

            <Button type="submit" fullWidth size="lg" loading={loading} className="mt-2">
              Create My Account
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-navy font-semibold hover:text-navy-royal">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
