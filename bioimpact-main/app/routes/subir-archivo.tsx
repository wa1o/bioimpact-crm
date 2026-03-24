import { Form, redirect, useNavigation, Link } from "react-router";
import { db } from "~/lib/prisma";
import { getSession } from "~/session.server";
import { supabase } from "~/lib/supabase.server";

export async function action({ request }: { request: Request }) {
  const session = await getSession(request);
  const userId = session.get("userId");

  if (!userId) throw redirect("/");

  const formData = await request.formData();
  const file = formData.get("archivo") as File;

  if (!file || file.size === 0) {
    return { error: "Por favor selecciona un archivo." };
  }

  try {
    // 1. Limpiamos el nombre del archivo y creamos una ruta única
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
    const filePath = `${userId}/${Date.now()}_${cleanFileName}`;

    // 2. Subimos el archivo a Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("archivos") // El nombre del bucket que creaste
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Error subiendo a Supabase:", uploadError);
      return { error: "Hubo un error al subir el archivo físico." };
    }

    // 3. Obtenemos la URL pública del archivo
    const { data: publicUrlData } = supabase.storage
      .from("archivos")
      .getPublicUrl(filePath);

    // 4. Guardamos los metadatos y la URL en Prisma
    const sizeInKB = Math.round(file.size / 1024);
    const sizeStr = sizeInKB > 1024 ? `${(sizeInKB / 1024).toFixed(1)}MB` : `${sizeInKB}KB`;
    const tipoIcono = file.type.includes("pdf") ? "PDF" : "IMAGE";

    await db.archivo.create({
      data: {
        nombre: file.name,
        size: sizeStr,
        tipoIcono: tipoIcono,
        url: publicUrlData.publicUrl, // Guardamos la URL de Supabase
        usuarioId: userId,
      },
    });

    return redirect("/dashboard");

  } catch (error) {
    console.error("Error general:", error);
    return { error: "Error de servidor al procesar el archivo." };
  }
}

export default function SubirArchivo() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="min-h-screen bg-[#f6fafde6] flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-[#1a1f19] mb-6">Subir Archivo</h2>
        
        {/* Usamos el Form de React Router con encType para archivos */}
        <Form method="post" encType="multipart/form-data" className="flex flex-col gap-6">
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors">
            <input 
              type="file" 
              name="archivo" 
              id="archivo" 
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-[#225727] file:text-white
                hover:file:bg-[#1a431e] cursor-pointer"
              required
            />
          </div>

          <div className="flex gap-4">
            <Link 
              to="/dashboard" 
              className="flex-1 py-3 text-center border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
            >
              Cancelar
            </Link>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 py-3 bg-[#225727] text-white rounded-xl hover:bg-[#1a431e] transition-colors disabled:bg-gray-400"
            >
              {isSubmitting ? "Subiendo..." : "Subir Archivo"}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}