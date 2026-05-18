import { db } from "~/lib/prisma";

export async function action({ request }: { request: Request }) {
  try {
    const body = await request.json();
    const token = body.token as string | null;

    if (!token) {
      return new Response(JSON.stringify({ error: "Token missing" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const usuario = await db.usuario.findFirst({
      where: { 
        token: token 
      },
      select: { 
        id_usuario: true 
      }
    });

    if (!usuario) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    await db.usuario.update({
      where: { 
        id_usuario: usuario.id_usuario 
      },
      data: { 
        verificado: true, 
        token: null 
      }
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error verifying email:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}