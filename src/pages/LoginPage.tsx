import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address format." }),
  password: z.string().min(1, { message: "Password cannot be empty." }),
});

function LoginPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <div className="w-full min-h-svh grid lg:grid-cols-2">
      <div className="flex flex-col justify-center">
        <div>
          <Card className="max-w-sm mx-auto border-0 sm:border">
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Please enter your email and password!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="john@snap.com"
                            autoComplete="email"
                            {...field}
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
                        <div className="flex justify-between items-center">
                          <FormLabel htmlFor="password">Password</FormLabel>
                          <Link
                            to="/"
                            className="text-sm underline underline-offset-2"
                          >
                            Forgot your password?
                          </Link>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Input
                              id="password"
                              type={passwordVisible ? "text" : "password"}
                              className="pr-11"
                              {...field}
                            />
                            <div
                              className="absolute top-[10px] right-3 cursor-pointer"
                              onClick={() =>
                                setPasswordVisible(!passwordVisible)
                              }
                            >
                              {passwordVisible ? (
                                <Eye className="w-5 h-5" />
                              ) : (
                                <EyeClosed className="w-5 h-5" />
                              )}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="hidden bg-accent lg:block bg-[url('/images/courierPrimary.png')] bg-no-repeat bg-contain bg-bottom">
      </div>
    </div>
  );
}

export default LoginPage;
