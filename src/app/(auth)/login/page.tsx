/* eslint-disable @next/next/no-img-element */
"use client";

// Next
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
// Controllers
import { useAuthController } from "@/core/controllers";
// Services
import { api } from "@/services";
// Components
import { Form, InputField } from "@/components";
// Icons
import { FaGithub } from "react-icons/fa";
import { MdOutlineLock, MdOutlineMail } from "react-icons/md";
// Assets
import logo from "@/../public/logo/logo.png";

const LoginSchema = z.object({
  email: z.string().email("Informe um e-mail válido"),
  password: z.string().min(6, "A senha tem ao menos 6 caracteres"),
});

type LoginValues = z.infer<typeof LoginSchema>;

export default function Login() {
  const router = useRouter();
  const isAuthenticated = useAuthController((state) => state.isAuthenticated);

  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginValues>({ resolver: zodResolver(LoginSchema), defaultValues: { email: "", password: "" } });

  useEffect(() => {
    if (isAuthenticated) router.replace("/dashboard");
  }, [isAuthenticated, router]);

  const onSubmit = async (data: LoginValues) => {
    setError(null);

    try {
      const response = await api.post("/login", data);
      Cookies.set("accessToken", response.data.accessToken, { expires: 7 });

      router.push("/dashboard");
    } catch {
      setError("E-mail ou senha inválidos.");
    }
  };

  return (
    <div className="h-full w-full flex bg-background">
      <div className="h-full w-1/2 p-[1rem] hidden lg:block">
        <div className="h-full w-full px-[4.8rem] py-[3.2rem] flex flex-col justify-between rounded-card bg-action text-on-action">
          {/* White tile: the logo's navy disappears on the brand colour. */}
          <div className="flex items-center gap-[1.2rem]">
            <span className="h-[4.8rem] w-[4.8rem] p-[0.6rem] shrink-0 flex items-center justify-center rounded-control bg-white">
              <img src={logo.src} alt="" className="h-full w-full object-contain" />
            </span>

            <span className="flex flex-col">
              <span className="text-[1.7rem] font-bold">Pedro Luis Imóveis</span>
              <span className="text-[1.3rem] opacity-75">Painel administrativo</span>
            </span>
          </div>

          <div className="max-w-[46rem] flex flex-col gap-[1.2rem]">
            <span className="text-[3.2rem] font-bold leading-[1.15] tracking-[-0.015em]">Cadastre, edite e acompanhe os imóveis do site.</span>
            <span className="text-[1.5rem] leading-[1.6] opacity-80">Os imóveis salvos aqui aparecem no site público, no mapa e na busca.</span>
          </div>

          <span className="text-[1.3rem] opacity-75">Cascavel · Paraná</span>
        </div>
      </div>

      <div className="h-full min-w-0 grow px-[3.2rem] py-[2.4rem] flex flex-col">
        <div className="flex justify-end">
          <a
            href="https://github.com/WorstOne0"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="h-[3.6rem] w-[3.6rem] flex items-center justify-center rounded-control text-meta hover:text-title hover:bg-surface-2"
          >
            <FaGithub size={18} />
          </a>
        </div>

        <div className="min-h-0 grow flex items-center justify-center">
          <div className="w-full max-w-[44rem] flex flex-col gap-[2.4rem]">
            <div className="flex flex-col gap-[0.6rem]">
              <span className="text-[2.6rem] font-bold text-title tracking-[-0.01em]">Entrar</span>
              <span className="text-[1.5rem] text-meta">Use o e-mail e a senha da sua conta.</span>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-[1.6rem]">
                <InputField
                  name="email"
                  label="E-mail"
                  type="email"
                  placeholder="voce@email.com"
                  className="h-[5rem] text-[1.6rem]"
                  startIcon={<MdOutlineMail size={20} />}
                  autoFocus
                />
                <InputField
                  name="password"
                  label="Senha"
                  type="password"
                  placeholder="••••••"
                  className="h-[5rem] text-[1.6rem]"
                  startIcon={<MdOutlineLock size={20} />}
                />

                {error && <span className="px-[1.2rem] py-[1rem] rounded-control bg-negative-soft text-[1.4rem] text-negative">{error}</span>}

                <button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="h-[5.2rem] mt-[0.8rem] flex items-center justify-center rounded-control bg-action text-[1.7rem] font-bold text-on-action hover:bg-action-hover disabled:opacity-60 cursor-pointer"
                >
                  {form.formState.isSubmitting ? "Entrando..." : "Entrar"}
                </button>
              </form>
            </Form>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-[2rem] gap-y-[0.6rem] text-[1.3rem] text-meta">
          <span>© {new Date().getFullYear()} Pedro Luis Imóveis. Todos os direitos reservados.</span>

          <span className="flex gap-[2rem]">
            <span>Política de privacidade</span>
            <span>Termos e condições</span>
          </span>
        </div>
      </div>
    </div>
  );
}
