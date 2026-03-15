"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadDropzone } from "@/lib/uploadthing";
import Link from "next/link";
import { PROVINCES } from "@/lib/provinces";
import { updateProfile } from "@/lib/actions/profile";

const UpdateProfileSchema = z.object({
  name: z.string().max(100).optional(),
  province: z.string().nullable().optional(),
  avatarUrl: z.string().optional(),
});

type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

type ProfilePageProps = {
  initialData: {
    name: string;
    province: string | null;
    avatarUrl: string;
  };
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function ProfilePage({ initialData }: ProfilePageProps): React.ReactElement {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      name: initialData.name,
      province: initialData.province,
      avatarUrl: initialData.avatarUrl,
    },
  });

  const avatarUrl = form.watch("avatarUrl");
  const name = form.watch("name");

  async function onSubmit(values: UpdateProfileInput) {
    setError(null);
    const result = await updateProfile({
      name: values.name || undefined,
      province: values.province && PROVINCES.includes(values.province as (typeof PROVINCES)[number])
        ? (values.province as (typeof PROVINCES)[number])
        : undefined,
      avatarUrl: values.avatarUrl && values.avatarUrl !== "" ? values.avatarUrl : undefined,
    });
    if (result.success) {
      router.refresh();
    } else {
      setError(result.error ?? "Failed to update");
    }
  }

  return (
    <div className="container py-10">
      <h1 className="font-display text-3xl font-bold text-foreground mb-2">Profile</h1>
      <p className="text-muted-foreground mb-8">
        Update your name, province, and avatar. This info is used when you submit a testimonial.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-xl space-y-6">
          {error && (
            <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <FormField
            control={form.control}
            name="avatarUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avatar</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        {field.value ? (
                          <AvatarImage src={field.value} alt="Avatar" />
                        ) : null}
                        <AvatarFallback className="bg-muted text-muted-foreground text-lg">
                          {getInitials(name || "?")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <UploadDropzone
                          endpoint="profileImage"
                          onClientUploadComplete={(res) => {
                            if (res?.[0]?.url) {
                              field.onChange(res[0].url);
                            }
                          }}
                          onUploadError={(err) => {
                            setError(err.message);
                          }}
                          className="ut-ready:bg-muted ut-uploading:bg-muted/50 ut-uploading:cursor-not-allowed"
                        />
                      </div>
                    </div>
                    {field.value && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => field.onChange("")}
                      >
                        Remove avatar
                      </Button>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="province"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Province</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select province" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PROVINCES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving..." : "Save changes"}
            </Button>
            <Link href="/dashboard/testimonials">
              <Button type="button" variant="outline">
                Leave a testimonial
              </Button>
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
