interface Props {
  nombre: string;
  correo: string;
  telefono: string;
}

export default function TarjetaUsuario({ nombre, correo, telefono }: Props) {
  return (
    <div className="mt-6 p-5 border border-slate-100 rounded-xl bg-gradient-to-br from-slate-50 to-white shadow-sm flex items-center gap-4">
      <div className="w-12 h-12 shrink-0 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
        {nombre.charAt(0).toUpperCase()}
      </div>
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{nombre}</h2>
        <p className="text-slate-500 text-sm mt-0.5">{correo}</p>
        <p className="text-slate-500 text-sm">{telefono}</p>
      </div>
    </div>
  );
}
