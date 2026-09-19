import { useState } from 'react';
import TarjetaUsuario from './componentes/TarjetaUsuario';
import ExplorarPokemon from './componentes/ExplorarPokemon';
import CategoriasPokemon from './componentes/CategoriasPokemon';

interface Usuario {
  name: string;
  email: string;
  phone: string;
}

type Vista = 'inicio' | 'pokemon' | 'categorias';

export default function App() {
  const [vista, setVista] = useState<Vista>('inicio');
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState<boolean>(false);
  const [pokemonInicial, setPokemonInicial] = useState<string | null>(null);

  // Se llama desde "Categorías" cuando el usuario toca un Pokémon
  const irADetallePokemon = (nombre: string) => {
    setPokemonInicial(nombre);
    setVista('pokemon');
  };

  const obtenerDatos = async () => {
    setCargando(true);
    try {
      const respuesta = await fetch('https://jsonplaceholder.typicode.com/users/1');
      const datos = await respuesta.json();
      setUsuario(datos);
    } catch (error) {
      console.error("Error al consumir la API", error);
    } finally {
      setCargando(false);
    }
  };

  if (vista === 'pokemon') {
    return (
      <ExplorarPokemon
        onRegresar={() => {
          setPokemonInicial(null);
          setVista('inicio');
        }}
        onVerCategorias={() => {
          setPokemonInicial(null);
          setVista('categorias');
        }}
        nombreInicial={pokemonInicial}
      />
    );
  }

  if (vista === 'categorias') {
    return (
      <CategoriasPokemon
        onRegresar={() => setVista('inicio')}
        onSeleccionarPokemon={irADetallePokemon}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-slate-50 to-emerald-100 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
            Fundamentos de React
          </h1>
          <p className="text-slate-500 mt-2">Práctica de consumo de APIs y componentes</p>
        </div>

        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-white p-6 md:p-8">
          <div className="grid sm:grid-cols-3 gap-3 md:gap-4">
            <button
              onClick={obtenerDatos}
              className="group flex flex-col items-center gap-2 bg-blue-50 hover:bg-blue-100 border border-blue-100 text-blue-700 px-4 py-5 rounded-xl shadow-sm transition-all cursor-pointer hover:-translate-y-0.5"
            >
              <span className="text-2xl">👤</span>
              <span className="font-semibold text-sm text-center">
                {cargando ? 'Consultando...' : 'Obtener Usuario'}
              </span>
            </button>

            <button
              onClick={() => setVista('pokemon')}
              className="group flex flex-col items-center gap-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 text-emerald-700 px-4 py-5 rounded-xl shadow-sm transition-all cursor-pointer hover:-translate-y-0.5"
            >
              <span className="text-2xl">🔍</span>
              <span className="font-semibold text-sm text-center">Explorar Pokémon</span>
            </button>

            <button
              onClick={() => setVista('categorias')}
              className="group flex flex-col items-center gap-2 bg-purple-50 hover:bg-purple-100 border border-purple-100 text-purple-700 px-4 py-5 rounded-xl shadow-sm transition-all cursor-pointer hover:-translate-y-0.5"
            >
              <span className="text-2xl">🗂️</span>
              <span className="font-semibold text-sm text-center">Categorías Pokémon</span>
            </button>
          </div>

          {usuario && (
            <TarjetaUsuario nombre={usuario.name} correo={usuario.email} telefono={usuario.phone} />
          )}
        </div>
      </div>
    </div>
  );
}