import { useRef, useState, useEffect } from "react";
import { useFetcher } from "react-router";

interface UploadedFile {
  id: number;
  name: string;
  file: File;
}

interface Props {
  archivos: any[];
}

// ── Íconos SVG inline por tipo de archivo ────────────────────────────────────

const IconPDF = () => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="30" height="30" rx="6" fill="#FDECEA" />
    <path d="M8 6h9l5 5v13a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" fill="#E53935" />
    <path d="M17 6l5 5h-5V6z" fill="#FFCDD2" />
    <text x="9" y="21" fontSize="6" fontWeight="bold" fill="white" fontFamily="sans-serif">PDF</text>
  </svg>
);

const IconWord = () => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="30" height="30" rx="6" fill="#E3F2FD" />
    <path d="M8 6h9l5 5v13a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" fill="#1565C0" />
    <path d="M17 6l5 5h-5V6z" fill="#90CAF9" />
    <text x="8" y="21" fontSize="5.5" fontWeight="bold" fill="white" fontFamily="sans-serif">DOC</text>
  </svg>
);

const IconExcel = () => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="30" height="30" rx="6" fill="#E8F5E9" />
    <path d="M8 6h9l5 5v13a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" fill="#2E7D32" />
    <path d="M17 6l5 5h-5V6z" fill="#A5D6A7" />
    <text x="9" y="21" fontSize="5.5" fontWeight="bold" fill="white" fontFamily="sans-serif">XLS</text>
  </svg>
);

const IconImage = () => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="30" height="30" rx="6" fill="#F3E5F5" />
    <rect x="5" y="7" width="20" height="16" rx="2" fill="#9C27B0" />
    <circle cx="10" cy="12" r="2" fill="#E1BEE7" />
    <path d="M5 19l5-5 4 4 3-3 7 7H5v-3z" fill="#CE93D8" />
  </svg>
);

const IconPFX = () => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="30" height="30" rx="6" fill="#FFF8E1" />
    <path d="M8 6h9l5 5v13a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" fill="#F9A825" />
    <path d="M17 6l5 5h-5V6z" fill="#FFE082" />
    <text x="9" y="21" fontSize="5.5" fontWeight="bold" fill="white" fontFamily="sans-serif">PFX</text>
  </svg>
);

const IconGeneric = () => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="30" height="30" rx="6" fill="#ECEFF1" />
    <path d="M8 6h9l5 5v13a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" fill="#607D8B" />
    <path d="M17 6l5 5h-5V6z" fill="#B0BEC5" />
  </svg>
);

const IconUploadCloud = () => (
  <svg width="56" height="48" viewBox="0 0 56 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="28" cy="36" rx="20" ry="8" fill="#E8EDE8" />
    <path d="M14 28C14 20.268 20.268 14 28 14C35.732 14 42 20.268 42 28" stroke="#9CA89C" strokeWidth="2" strokeLinecap="round" />
    <path d="M8 30C8 24.477 12.477 20 18 20H38C43.523 20 48 24.477 48 30C48 35.523 43.523 40 38 40H18C12.477 40 8 35.523 8 30Z" fill="#D6DDD6" />
    <circle cx="28" cy="22" r="10" fill="#E8EDE8" stroke="#9CA89C" strokeWidth="1.5" />
    <path d="M28 18V26M24 22L28 18L32 22" stroke="#9CA89C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ── Función para elegir ícono según extensión ─────────────────────────────────
function getFileIcon(fileName: string, tipoIcono?: string) {
  const ext = (fileName?.split(".").pop() || tipoIcono || "").toLowerCase();
  switch (ext) {
    case "pdf":
      return <IconPDF />;
    case "doc":
    case "docx":
    case "odt":
      return <IconWord />;
    case "xls":
    case "xlsx":
    case "csv":
      return <IconExcel />;
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "webp":
      return <IconImage />;
    case "pfx":
      return <IconPFX />;
    default:
      return <IconGeneric />;
  }
}

// ── Ícono de tres puntos (menú contextual) ────────────────────────────────────
const DotsMenu = () => (
  <svg width="4" height="18" viewBox="0 0 4 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="2" cy="2" r="2" fill="#374151" />
    <circle cx="2" cy="9" r="2" fill="#374151" />
    <circle cx="2" cy="16" r="2" fill="#374151" />
  </svg>
);

// ── Componente principal ──────────────────────────────────────────────────────
export const UploadedFilesListSection = ({ archivos }: Props) => {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"ultimos" | "recientes">("recientes");
  const [uploadingFileName, setUploadingFileName] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.success) {
      setShowModal(false);
      setUploadedFiles([]);
      setUploadingFileName("");
    }
  }, [fetcher.state, fetcher.data]);

  const handleRemoveUploadedFile = (id: number) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setUploadingFileName(files[0].name);
      setUploadedFiles((prev) => [
        ...prev,
        ...files.map((f, i) => ({ id: Date.now() + i, name: f.name, file: f })),
      ]);
    }
  };

  const handleBrowseClick = () => fileInputRef.current?.click();

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setUploadingFileName(files[0].name);
      setUploadedFiles((prev) => [
        ...prev,
        ...files.map((f, i) => ({ id: Date.now() + i, name: f.name, file: f })),
      ]);
    }
  };

  const handleSubir = () => {
    if (uploadedFiles.length === 0) return;
    const formData = new FormData();
    uploadedFiles.forEach((uf) => formData.append("archivos", uf.file));
    fetcher.submit(formData, { method: "post", encType: "multipart/form-data" });
  };

  return (
    /* Contenedor principal: ocupa todo el espacio disponible del padre */
    <div className="relative w-full h-full bg-white rounded-3xl flex flex-col overflow-hidden">

      {/* ── Header ── */}
      <div className="relative flex items-center justify-between px-6 pt-5 pb-0 shrink-0">
        {/* Tabs centrados */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <div className="inline-flex items-center gap-1 px-1 py-1 bg-gray-100 rounded-full shadow-inner">
            {(["ultimos", "recientes"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`h-7 px-5 rounded-full text-[12px] font-semibold transition-colors ${activeTab === tab
                  ? "bg-[#225727] text-white"
                  : "text-[#1a1f19] hover:bg-gray-200"
                  }`}
              >
                {tab === "ultimos" ? "Últimos en subir" : "Recientes"}
              </button>
            ))}
          </div>
        </div>

        {/* Botón de ajustes */}
        <div className="ml-auto w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
          {/* Ícono de engrane inline */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.5 1.5l-.5 1.5a5 5 0 00-1.2.7L3 3.2l-1.5 2.6 1.2 1a5 5 0 000 1.4l-1.2 1L3 11.8l1.8-.5a5 5 0 001.2.7l.5 1.5h3l.5-1.5a5 5 0 001.2-.7l1.8.5 1.5-2.6-1.2-1a5 5 0 000-1.4l1.2-1L13 3.2l-1.8.5A5 5 0 0010 3L9.5 1.5h-3z" stroke="#374151" strokeWidth="1.2" strokeLinejoin="round" />
            <circle cx="8" cy="8" r="2" stroke="#374151" strokeWidth="1.2" />
          </svg>
        </div>
      </div>

      {/* Divisor */}
      <div className="mx-0 mt-4 h-px bg-gray-200 shrink-0" />

      {/* ── Lista de archivos ── */}
      <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
        {archivos.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-2 text-center">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="48" rx="12" fill="#F3F4F6" />
              <path d="M16 14h12l8 8v14a2 2 0 01-2 2H16a2 2 0 01-2-2V16a2 2 0 012-2z" fill="#D1D5DB" />
              <path d="M28 14l8 8h-8v-8z" fill="#E5E7EB" />
            </svg>
            <p className="text-gray-600 font-medium text-base">Aún no tienes archivos</p>
            <p className="text-gray-400 text-sm">Sube tu primer archivo para empezar.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-0">
            {archivos.map((file, index) => (
              <div key={file.id_archivo}>
                <div className="flex items-center gap-4 py-3">
                  {/* Ícono dinámico */}
                  <div className="shrink-0">
                    {getFileIcon(file.nombre, file.tipoIcono)}
                  </div>

                  {/* Nombre + fecha */}
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-gray-800 text-sm leading-tight hover:underline hover:text-[#225727] truncate transition-colors"
                    >
                      {file.nombre}
                    </a>
                    <span className="text-gray-400 text-xs">
                      {new Date(file.createdAt).toLocaleDateString("es-MX", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Tamaño */}
                  <div className="shrink-0 px-2 py-0.5 rounded border border-gray-300">
                    <span className="text-gray-600 text-xs font-semibold">{file.size}</span>
                  </div>

                  {/* Menú tres puntos */}
                  <button className="shrink-0 w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 transition-colors">
                    <DotsMenu />
                  </button>
                </div>

                {/* Divisor entre filas (excepto última) */}
                {index < archivos.length - 1 && (
                  <div className="h-px bg-gray-100" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="shrink-0 px-6 pb-4 flex flex-col gap-3">
        {/* Botón "ver todos" */}
        <div className="flex justify-center">
          <button className="h-7 px-5 rounded-full border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition-colors">
            Ver todos los archivos
          </button>
        </div>

        {/* Barra inferior con última conexión + botón subir */}
        <div className="flex items-center justify-center bg-gray-50 rounded-2xl px-4 py-3">
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 pl-4 pr-3 py-2 bg-[#225727] rounded-full text-white text-xs font-medium hover:bg-[#1a4320] transition-colors shadow-sm"
          >
            Subir nuevo archivo
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 1v12M1 7h12" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Modal de subida ── */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] bg-black/50 backdrop-blur-sm p-4 md:p-8">
          <div className="bg-white w-full h-full md:rounded-3xl max-w-6xl shadow-2xl flex flex-col overflow-hidden">

            {/* Cabecera modal */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 shrink-0">
              <h2 className="font-bold text-gray-900 text-lg">Carga de documentos</h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500"
                aria-label="Cerrar"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M11 3L3 11M3 3l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Zona drag & drop */}
            <div className="px-6 pb-4 flex-1 flex flex-col min-h-[200px]">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex-1 flex flex-col items-center justify-center gap-4 px-4 py-8 rounded-2xl border-2 border-dashed transition-colors ${isDragging
                  ? "border-[#225727] bg-[#225727]/5"
                  : "border-[#384eb74c] bg-[#f8f7ff]"
                  }`}
              >
                <IconUploadCloud />
                <p className="text-sm text-center text-gray-700 mt-1">
                  Arrastra un archivo o{" "}
                  <button
                    type="button"
                    onClick={handleBrowseClick}
                    className="text-[#256c2c] underline font-semibold"
                  >
                    Examinar
                  </button>
                </p>
                <p className="text-gray-400 text-xs text-center">
                  PDF, DOC, DOCX, ODT, PFX, PNG, JPG, JPEG
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.odt,.pfx,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={handleFileInputChange}
                />
              </div>
            </div>

            {/* Nombre del archivo */}
            <div className="px-6 pb-3 shrink-0">
              <p className="text-gray-500 text-xs font-semibold mb-1">
                Subiendo — {uploadedFiles.length} archivo{uploadedFiles.length !== 1 ? "s" : ""}
              </p>
              <div className="flex items-center gap-2 border-b-2 border-[#225727] pb-1">
                <input
                  type="text"
                  value={uploadingFileName}
                  onChange={(e) => setUploadingFileName(e.target.value)}
                  placeholder="Nombre del archivo"
                  className="flex-1 text-gray-900 text-xs outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Lista de archivos seleccionados */}
            <div className="px-6 pb-4 flex-1 overflow-y-auto min-h-0">
              <p className="text-gray-500 text-xs font-semibold mb-2">Archivos seleccionados</p>
              <div className="flex flex-col gap-2">
                {uploadedFiles.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No hay archivos seleccionados</p>
                ) : (
                  uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#11af22] bg-green-50"
                    >
                      <div className="shrink-0">
                        {getFileIcon(file.name)}
                      </div>
                      <span className="flex-1 text-gray-800 text-xs truncate">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveUploadedFile(file.id)}
                        className="w-4 h-4 flex items-center justify-center text-red-500 hover:text-red-700 transition-colors"
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M9 3L3 9M3 3l6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Botón subir */}
            <div className="px-6 pb-6 shrink-0">
              <button
                type="button"
                onClick={handleSubir}
                disabled={isSubmitting || uploadedFiles.length === 0}
                className="w-full py-3 bg-[#225727] rounded-lg font-bold text-white text-sm hover:bg-[#1a4320] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "SUBIENDO..." : "SUBIR"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};