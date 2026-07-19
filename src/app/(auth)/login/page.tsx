"use client";

// Next
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
// Components
import { Checkbox, Form, InputField } from "@/components";
// Icons
import { FaGithub } from "react-icons/fa";
import { useAuthStore } from "@/store";

const FormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }),
});

export default function Login() {
  //
  const router = useRouter();
  const { login, isAuthenticated } = useAuthStore((state) => state);

  useEffect(() => {
    if (isAuthenticated) router.replace("/dashboard");
  }, [isAuthenticated, router]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const success = await login(data.email, data.password);
    if (!success) return;

    router.push("/dashboard");
  };

  return (
    <div className="h-full w-full flex">
      {/* Left */}
      <div className="h-full w-1/2 p-[1rem]">
        <div className="h-full w-full bg-primary rounded-[0.8rem]"></div>
      </div>
      {/* Right */}
      <div className="h-full w-1/2 flex flex-col py-[1.5rem]">
        {/* Header */}
        <div className="h-[2rem] w-full flex justify-end px-[2rem]">
          <Link
            className="h-[2rem] w-[2rem] flex justify-center items-center cursor-pointer"
            href="https://github.com/WorstOne0"
            rel="noopener noreferrer"
            target="_blank"
          >
            <FaGithub />
          </Link>
        </div>

        {/* Body */}
        <div className="min-h-0 grow w-full flex flex-col justify-center items-center">
          {/* Logo */}
          <div className="flex flex-col justify-center items-center">
            <div className="h-[7rem] w-[7rem] bg-red-500 rounded-[0.8rem] mb-[2rem]"></div>
            <span className="font-bold text-[2.8rem]">Welcome Back to the App</span>
            <span className="italic text-gray-500 text-[1.6rem]">Enter your username and password to continue</span>
          </div>
          {/* Login */}
          <div className="w-[60%] mt-[3rem]">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <InputField name="email" label="Email" />
                <div className="h-[2rem]"></div>
                <InputField name="password" label="Password" type="password" />

                <div className="w-full flex justify-between mt-[1rem]">
                  <div className="flex items-center cursor-pointer">
                    <Checkbox className="h-[1.3rem] w-[1.3rem] rounded-[0.3rem]" id="remember" />
                    <label className="ml-[0.5rem] text-gray-500 text-[1.5rem] select-none" htmlFor="remember">
                      Lembrar de mim
                    </label>
                  </div>
                  <div className="text-primary font-bold text-[1.5rem] cursor-pointer">Esqueci minha senha</div>
                </div>

                <button
                  className="w-full flex justify-center items-center bg-primary rounded-[0.8rem] py-[1.2rem] mt-[3.5rem] cursor-pointer"
                  type="submit"
                >
                  <span className="text-[1.8rem] text-white font-bold select-none">Entrar</span>
                </button>
              </form>
            </Form>
          </div>
          {/* Singup */}
          <div></div>
        </div>

        {/* Footer */}
        <div className="h-[2rem] w-full flex justify-between px-[2rem]">
          <span className="text-gray-500 text-[1.4rem]"> 2025 Pedro Luis Imóveis Inc. All rights reserved</span>

          <div className="flex">
            <span className="text-gray-500 text-[1.4rem] mr-[2rem]">Privacy Policy</span>
            <span className="text-gray-500 text-[1.4rem]">Term & Conditions</span>
          </div>
        </div>
      </div>
    </div>
  );
}
