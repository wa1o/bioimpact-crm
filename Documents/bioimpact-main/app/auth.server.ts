// app/auth.server.ts
import bcrypt from "bcrypt"; // Te recomiendo 'bcryptjs' para evitar líos de compilación
import crypto from "crypto";
import nodemailer from "nodemailer";
import { db } from "~/db.server";
import { MAIL_USER, MAIL_PASS, APP_URL } from "~/env.server";


export async function registrarUsuario(formData: FormData) {
  const nombre = formData.get("nombre") as string;
  const apellido = formData.get("apellido") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const acceptTerms = formData.get("acceptTerms") === "on";
  console.log("Variable de correo:", MAIL_USER);

  // 1. Validaciones básicas
  if (!nombre || !apellido || !email || !password) {
    return { error: "Por favor llena todos los campos obligatorios." };
  }
  if (password !== confirmPassword) {
    return { error: "Las contraseñas no coinciden." };
  }
  if (!acceptTerms) {
    return { error: "Debes aceptar los términos y condiciones." };
  }

  try {
    // 2. Verificar si el usuario ya existe
    const [existing]: any = await db.execute(
      "SELECT id FROM usuarios WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return { error: "Este correo ya está registrado." };
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // ando testeando lo de las
    console.log("MAIL_USER:", MAIL_USER);
    console.log("MAIL_PASS:", MAIL_PASS ? "***" : "undefined");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
      },
    });

    const baseUrl = APP_URL;
    const verifyUrl = `${baseUrl}/verificacion?token=${verificationToken}`;
    
try {
  await transporter.sendMail({
    from: `"Equipo BioImpact" <${MAIL_USER}>`,
    to: email,
    subject: "Verifica tu cuenta - BioImpact",
    html: `
           <div style="font-family: sans-serif; padding: 20px; color: #333; border: 2px solid #b4b4b47b; border-radius: 10px;margin: 2rem;padding: 2rem;">
        
        <table border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
            <tr>
                <td style="vertical-align: middle; padding-right: 10px;">
                <img src="https://static.wixstatic.com/media/08265b_06aa14f4f7804bfc8ca7672387d4b46d~mv2.png/v1/fit/w_500,h_266,al_c/logo.png" 
                alt="Logo BioImpact" 
                style="width: 60px; height: auto; display: block;">
                </td>
                <td style="vertical-align: middle;">
             <h2 style="margin: 0; font-size: 24px; font-family: sans-serif; color: #333; font-family: Impact, Haettenschweiler,sans-serif;">BioImpact</h2>
             </td>
            </tr>
        </table>

        <hr style="border: 0; border-top: 1px solid #eee; margin-bottom: 20px;">
        <h2>Confirma tu dirección de correo electrónico</h2>
        <p style="font-size: 16px; line-height: 1.5;">
          Gracias por unirte. Haz clic en el botón de abajo para verificar tu cuenta y empezar:
        </p>
        
        <div style="margin-top: 30px;">
          <a href="${verifyUrl}" style="background-color: #485374; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
            Verificar cuenta
          </a>
        </div>

      </div>
    `,
  });
}catch (emailError) {
      console.error("Error enviando email:", emailError);
      return { error: "No se pudo enviar el email de verificación. Verifica tu conexión o intenta más tarde." };
    }

    // 6. Solo guardar en Base de Datos SI el email se envió exitosamente
    await db.execute(
      `INSERT INTO usuarios 
      (nombre, apellido, email, contrasena, verification_token, verificado) 
      VALUES (?, ?, ?, ?, ?, false)`,
      [nombre, apellido, email, hashedPassword, verificationToken]
    );

    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: "Error en el servidor. Intenta más tarde." };
  }
}