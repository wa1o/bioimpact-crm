import { useState } from "react";
import { Link, redirect, useActionData, Form } from "react-router";
import { db } from "~/lib/prisma";
import { getSession, commitSession } from "~/session.server";
import bcrypt from "bcrypt";

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Por favor llena todos los campos." };
  }

  try {
    const usuarioDb = await db.usuario.findUnique({ where: { email } });

    if (!usuarioDb) return { error: "Correo o contraseña incorrectos." };

    const usuario = {
      id: usuarioDb.id_usuario,
      nombre: usuarioDb.nombre,
      email: usuarioDb.email,
      contrasena: usuarioDb.contrasena,
      verificado: usuarioDb.verificado,
    };

    if (!usuario.verificado)
      return { error: "Debes verificar tu cuenta antes de iniciar sesión." };

    const contrasenaValida = await bcrypt.compare(password, usuario.contrasena);
    if (!contrasenaValida) return { error: "Correo o contraseña incorrectos." };

    const session = await getSession(request);
    session.set("userId", usuario.id);
    session.set("nombre", usuario.nombre);
    session.set("email", usuario.email);

    return redirect("/cargando", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  } catch (err) {
    console.error("Error al conectar con la base de datos:", err);
    return { error: "Error del servidor. Intenta más tarde." };
  }
}

export default function Home() {
  const actionData = useActionData<typeof action>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center font-[Archivo Narrow, sans-serif] bg-cover bg-center"
      style={{ backgroundImage: "url('/image-2.jpg')" }}
    >
      {/* Overlay oscuro suave para mejorar legibilidad */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Logo */}
      <img
        src="/Logo Bioimpact.png"
        alt="Bioimpact Logo"
        className="absolute top-6 left-6 w-[120px] h-12 object-contain z-10"
      />

      {/* Formularios */}
      <div
        className="relative z-10 w-full max-w-[440px] mx-4 flex flex-col rounded-[28px] px-10 py-12"
        style={{
          backdropFilter: "blur(32px) saturate(1.8)",
          WebkitBackdropFilter: "blur(32px) saturate(1.8)",
          background: "rgba(255, 255, 255, 0.12)",
          border: "1px solid rgba(255, 255, 255, 0.28)",
          boxShadow:
            "0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {/* Reflejo superior */}
        <div
          className="absolute top-0 left-[15%] right-[15%] h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.65), transparent)",
          }}
        />

        <h1 className="text-[42px] font-semibold text-white text-center mb-8 leading-tight drop-shadow-sm">
          Inicia Sesión
        </h1>

        {/* Error del servidor */}
        {actionData?.error && (
          <div
            className="mb-4 px-4 py-3 rounded-xl text-sm text-center"
            style={{
              background: "rgba(239,68,68,0.18)",
              border: "1px solid rgba(239,68,68,0.4)",
              color: "rgba(255,200,200,0.95)",
            }}
          >
            {actionData.error}
          </div>
        )}

        <Form method="post" className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-sm font-normal"
              style={{ color: "rgba(255,255,255,0.8)" }}
            >
              Correo electrónico
            </label>
            <div
              className="flex items-center rounded-[14px] px-3 py-0 transition-all"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <svg
                className="mr-2 shrink-0"
                width="16"
                height="16"
                fill="none"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <rect x="2" y="4" width="20" height="16" rx="3" />
                <path d="M2 7l10 7 10-7" />
              </svg>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@bioimpact.com.mx"
                className="w-full py-3 text-[14px] font-light bg-transparent outline-none border-none"
                style={{
                  color: "rgba(255,255,255,0.9)",
                  caretColor: "white",
                }}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-sm font-normal"
              style={{ color: "rgba(255,255,255,0.8)" }}
            >
              Contraseña
            </label>
            <div
              className="flex items-center rounded-[14px] px-3 py-0 transition-all"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <svg
                className="mr-2 shrink-0"
                width="16"
                height="16"
                fill="none"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full py-3 text-[14px] font-light bg-transparent outline-none border-none"
                style={{
                  color: "rgba(255,255,255,0.9)",
                  caretColor: "white",
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-1 shrink-0 transition-colors"
                style={{ color: "rgba(255,255,255,0.4)" }}
                aria-label="Mostrar contraseña"
              >
                {showPassword ? (
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Olvidé contraseña */}
          <div className="text-right -mt-1">
            <button
              type="button"
              onClick={() => console.log("Forgot password")}
              className="text-xs transition-colors hover:underline"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-1 w-full py-3.5 font-semibold rounded-[14px] text-[15px] transition-all hover:-translate-y-0.5 active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, rgba(74,222,128,0.92) 0%, rgba(34,197,94,0.88) 100%)",
              color: "#022c12",
              boxShadow:
                "0 4px 20px rgba(74,222,128,0.3), inset 0 1px 0 rgba(255,255,255,0.3)",
            }}
          >
            Iniciar sesión
          </button>
        </Form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.15)" }} />
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            o continúa con
          </span>
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.15)" }} />
        </div>

        {/* Google */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => console.log("Google login")}
            className="flex items-center justify-center w-[72px] h-[48px] rounded-[14px] transition-all hover:-translate-y-0.5 active:scale-[0.97]"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.22)",
            }}
            aria-label="Iniciar sesión con Google"
          >
            <img src="/logo_google.png" alt="Google" className="w-[26px] h-[26px] object-contain" />
          </button>
        </div>

        {/* Registro */}
        <p className="mt-6 text-[13px] text-center" style={{ color: "rgba(255,255,255,0.5)" }}>
          ¿No tienes una cuenta?{" "}
          <Link
            to="/registro"
            className="font-medium transition-colors hover:underline"
            style={{ color: "rgba(134,239,172,0.9)" }}
          >
            Crea una aquí
          </Link>
        </p>
      </div>
    </div>
  );
}