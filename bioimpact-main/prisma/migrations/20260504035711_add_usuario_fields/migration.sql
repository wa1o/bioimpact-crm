-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('Deadline', 'Pagos', 'Reunión');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'contador', 'consultor', 'cliente');

-- CreateTable
CREATE TABLE "usuario" (
    "id_usuario" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "token" TEXT,
    "verificado" BOOLEAN NOT NULL DEFAULT false,
    "rol" "UserRole" NOT NULL DEFAULT 'cliente',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "cliente" (
    "id_cliente" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT,
    "telefono" TEXT,
    "empresa" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cliente_pkey" PRIMARY KEY ("id_cliente")
);

-- CreateTable
CREATE TABLE "proyecto" (
    "id_proyecto" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3),
    "cliente_id" INTEGER NOT NULL,

    CONSTRAINT "proyecto_pkey" PRIMARY KEY ("id_proyecto")
);

-- CreateTable
CREATE TABLE "archivo" (
    "id_archivo" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "tipoIcono" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER NOT NULL,
    "proyecto_id" INTEGER,

    CONSTRAINT "archivo_pkey" PRIMARY KEY ("id_archivo")
);

-- CreateTable
CREATE TABLE "evento" (
    "id_evento" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "fecha" TIMESTAMPTZ,
    "tipo" "EventType",
    "proyecto_id" INTEGER,
    "usuario_id" INTEGER,

    CONSTRAINT "evento_pkey" PRIMARY KEY ("id_evento")
);

-- CreateTable
CREATE TABLE "factura" (
    "id_factura" SERIAL NOT NULL,
    "estado" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "monto" DECIMAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "contador_id" INTEGER NOT NULL,
    "usuario_creador_id" INTEGER NOT NULL,

    CONSTRAINT "factura_pkey" PRIMARY KEY ("id_factura")
);

-- CreateTable
CREATE TABLE "formulario" (
    "id_formulario" SERIAL NOT NULL,
    "fecha_envio" TIMESTAMPTZ NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,

    CONSTRAINT "formulario_pkey" PRIMARY KEY ("id_formulario")
);

-- CreateTable
CREATE TABLE "encargado" (
    "usuario_id" INTEGER NOT NULL,
    "proyecto_id" INTEGER NOT NULL,

    CONSTRAINT "encargado_pkey" PRIMARY KEY ("usuario_id","proyecto_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "cliente_email_key" ON "cliente"("email");

-- AddForeignKey
ALTER TABLE "proyecto" ADD CONSTRAINT "proyecto_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "cliente"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "archivo" ADD CONSTRAINT "archivo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "archivo" ADD CONSTRAINT "archivo_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "proyecto"("id_proyecto") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evento" ADD CONSTRAINT "evento_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "proyecto"("id_proyecto") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evento" ADD CONSTRAINT "evento_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura" ADD CONSTRAINT "factura_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "cliente"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura" ADD CONSTRAINT "factura_contador_id_fkey" FOREIGN KEY ("contador_id") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factura" ADD CONSTRAINT "factura_usuario_creador_id_fkey" FOREIGN KEY ("usuario_creador_id") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formulario" ADD CONSTRAINT "formulario_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "cliente"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formulario" ADD CONSTRAINT "formulario_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "encargado" ADD CONSTRAINT "encargado_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "encargado" ADD CONSTRAINT "encargado_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "proyecto"("id_proyecto") ON DELETE RESTRICT ON UPDATE CASCADE;
