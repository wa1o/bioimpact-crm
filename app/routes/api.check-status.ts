import type { LoaderFunctionArgs } from "react-router";
import { db } from "~/lib/prisma"; 

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");

  if (!email) {
    return Response.json({ verificado: false, error: "Email requerido" }, { status: 400 });
  }

  try {
    const usuario = await db.usuario.findUnique({
      where: { 
        email: email 
      },
      select: { 
        verificado: true 
      }
    });

    return { 
      verificado: usuario ? usuario.verificado : false 
    };
    
  } catch (error) {
    console.error("Error en DB:", error);
    return Response.json({ verificado: false, error: "Error de servidor" }, { status: 500 });
  }
}