export default function CheckMail() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-100">
        
        {/* Icono con efecto de pulso */}
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full">
          <span className="text-4xl animate-bounce">📧</span>
        </div>

        {/* Textos */}
        <h1 className="text-3xl font-bold text-slate-800 mb-4">
          ¡Revisa tu correo!
        </h1>
        
        <p className="text-slate-600 mb-2">
          Hemos enviado un enlace de verificación a tu bandeja de entrada.
        </p>
        
        <p className="text-slate-500 text-sm mb-8">
          Haz clic en el botón dentro del mensaje para activar tu cuenta y empezar a explorar.
        </p>

        {/* Botón de acción principal */}
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg shadow-blue-200">
          Ir a mi correo

        </button>
        {/* Footer / Reenvío */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-sm">
          <p className="text-slate-500">
            ¿No recibiste nada?  
            <button className="ml-1 text-blue-600 font-medium hover:underline">
              Reenviar enlace
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}