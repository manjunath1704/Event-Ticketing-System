"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const [error, setError] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const { signIn, user, loading } = useAuth();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Fetch party images from our server API and fall back to a local image
  const [partyImages, setPartyImages] = React.useState<string[]>([]);
  React.useEffect(() => {
    let mounted = true;
    const fetchImages = async () => {
      try {
        const res = await fetch('/api/pexels/party?per_page=4');
        const data = await res.json();
        if (!mounted) return;
        if (Array.isArray(data.photos) && data.photos.length) {
          setPartyImages(data.photos);
        } else {
          setPartyImages(['/images/auth-bg.jpg']);
        }
      } catch (e) {
        console.error('Failed to fetch party images', e);
        if (mounted) setPartyImages(['/images/auth-bg.jpg']);
      }
    };
    fetchImages();
    return () => { mounted = false; };
  }, []);

  // Debug logs to help diagnose hanging/loading issues
  React.useEffect(() => {
    console.log('LoginPage auth state:', { user, loading });
  }, [user, loading]);

  React.useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const onSubmit = async (values: FormValues) => {
    setError("");
    console.log('Login form submit', values);

    try {
      await signIn(values.email, values.password);
      router.push("/");
    } catch (err: any) {
      console.error('Sign in error', err);
      setError(err.message || "Failed to sign in");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center page-bg p-6 relative overflow-hidden">
      {/* Decorative blurred circles */}
      <div className="absolute -left-20 -top-20 w-72 h-72 bg-gradient-to-tr from-indigo-300 via-pink-300 to-yellow-200 rounded-full opacity-30 blur-3xl transform rotate-45"></div>
      <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-gradient-to-br from-sky-300 via-purple-300 to-pink-200 rounded-full opacity-30 blur-3xl"></div>

      {/* Party image collage behind the card */}
      <div className="absolute left-8 bottom-10 z-0 flex gap-3">
        {(partyImages.length ? partyImages : ['/images/auth-bg.jpg']).map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`party-${i}`}
            className={`w-24 h-16 object-cover rounded-lg shadow-lg border border-white/30 transform transition duration-500 ${i % 2 === 0 ? 'rotate-1' : '-rotate-1'} hover:scale-110`}
          />
        ))}
      </div>

      <Card className="w-full max-w-md bg-white/70 backdrop-blur-md border border-white/30 shadow-2xl rounded-2xl text-gray-900 relative z-10">
        <CardHeader className="space-y-2 pt-8">
        <CardTitle className="text-xl">Welcome Back</CardTitle>
        <CardDescription className="text-sm text-gray-600">Sign in to continue to Event Ticketing</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        className="text-white"
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                           className="text-white"
                          placeholder="••••••••"
                          {...field}
                          disabled={form.formState.isSubmitting}
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        title={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-2 pb-8">
          <p className="text-sm text-center text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-indigo-600 hover:underline font-medium">
              Sign up
            </Link>
          </p>
          <div className="mt-2 text-xs text-gray-500">By continuing you agree to our Terms of Service</div>
        </CardFooter>
      </Card>
    </div>
  );
}
