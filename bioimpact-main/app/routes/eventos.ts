import { db } from "~/lib/prisma"; 

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const year = Number(url.searchParams.get("year") ?? new Date().getFullYear());
  const month = Number(url.searchParams.get("month") ?? new Date().getMonth() + 1);

  const start = new Date(year, month - 1, 1)
  const end   = new Date(year, month, 0, 23, 59, 59)

  const eventos = await db.evento.findMany({
    where: { fecha: { gte: start, lte: end } },
    include: { proyecto: true, usuario: true },
    orderBy: { fecha: "asc" },
  });

  return Response.json(eventos);
}

export async function action({ request }: { request: Request }) {
  const body = await request.json();

  if (request.method === "POST") {
    const evento = await db.evento.create({
      data: {
        titulo:      body.titulo,
        fecha:       new Date(body.fecha),
        tipo:        body.tipo,
        proyecto_id: body.proyecto_id ?? null,
        usuario_id:  body.usuario_id  ?? null,
      },
    })
    return Response.json(evento, { status: 201 });
  }

  if (request.method === "DELETE") {
    await db.evento.delete({ where: { id_evento: Number(body.id) } });
    return Response.json({ ok: true });
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
}