import { useEffect, useState } from 'react';

interface Props {
  onRegresar: () => void;
}

interface ItemLista {
  name: string;
  url: string;
}

interface DetallePokemon {
  id: number;
  nombre: string;
  imagen: string;
  tipos: string[];
  altura: number;
  peso: number;
  experiencia: number;
  habilidades: string[];
  estadisticas: { nombre: string; valor: number }[];
}

const gradienteTipo: Record<string, string> = {
  normal: 'from-slate-400 to-slate-500',
  fire: 'from-orange-400 to-orange-600',
  water: 'from-blue-400 to-blue-600',
  electric: 'from-yellow-300 to-yellow-500',
  grass: 'from-green-400 to-emerald-600',
  ice: 'from-cyan-300 to-cyan-500',
  fighting: 'from-red-600 to-red-800',
  poison: 'from-purple-400 to-purple-600',
  ground: 'from-amber-500 to-amber-700',
  flying: 'from-indigo-300 to-indigo-500',
  psychic: 'from-pink-400 to-pink-600',
  bug: 'from-lime-400 to-lime-600',
  rock: 'from-stone-400 to-stone-600',
  ghost: 'from-violet-500 to-violet-700',
  dragon: 'from-indigo-500 to-indigo-700',
  dark: 'from-neutral-600 to-neutral-800',
  steel: 'from-slate-400 to-slate-600',
  fairy: 'from-rose-300 to-rose-500',
};

export default function ExplorarPokemon({ onRegresar }: Props) {
  const [listaPokemon, setListaPokemon] = useState<ItemLista[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [detalle, setDetalle] = useState<DetallePokemon | null>(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);

  useEffect(() => {
    const cargarLista = async () => {
      try {
        const respuesta = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const datos = await respuesta.json();
        setListaPokemon(datos.results);
      } catch (error) {
        console.error('Error al obtener la lista de Pokémon', error);
      }
    };
    cargarLista();
  }, []);

  const seleccionarPokemon = async (nombre: string) => {
    setCargandoDetalle(true);
    try {
      const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`);
      const datos = await respuesta.json();
      setDetalle({
        id: datos.id,
        nombre: datos.name,
        imagen: datos.sprites.front_default,
        tipos: datos.types.map((t: { type: { name: string } }) => t.type.name),
        altura: datos.height / 10,
        peso: datos.weight / 10,
        experiencia: datos.base_experience,
        habilidades: datos.abilities.map((a: { ability: { name: string } }) => a.ability.name),
        estadisticas: datos.stats.map((s: { stat: { name: string }; base_stat: number }) => ({
          nombre: s.stat.name,
          valor: s.base_stat,
        })),
      });
    } catch (error) {
      console.error('Error al obtener el detalle del Pokémon', error);
    } finally {
      setCargandoDetalle(false);
    }
  };

  const listaFiltrada = listaPokemon.filter((p) =>
    p.name.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="h-screen overflow-hidden bg-slate-50 flex">
      {/* Barra lateral */}
      <div className="w-72 border-r border-slate-200 bg-white flex flex-col h-full">
        <div className="p-4 border-b border-slate-100">
          <button
            onClick={onRegresar}
            className="text-sm text-slate-500 hover:text-slate-800 mb-3 cursor-pointer"
          >
            ← Regresar
          </button>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar Pokémon..."
            className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <p className="px-4 pt-3 pb-1 text-xs font-semibold text-slate-400">
          POKÉMON ({listaFiltrada.length})
        </p>
        {/* Solo esta lista tiene scroll */}
        <div className="overflow-y-auto flex-1">
          {listaFiltrada.map((p) => (
            <button
              key={p.name}
              onClick={() => seleccionarPokemon(p.name)}
              className={`w-full text-left px-4 py-3 border-b border-slate-50 hover:bg-slate-50 capitalize flex justify-between items-center cursor-pointer transition-colors ${
                detalle?.nombre === p.name ? 'bg-slate-100 font-semibold text-slate-900' : 'text-slate-600'
              }`}
            >
              {p.name}
              <span className="text-slate-300">→</span>
            </button>
          ))}
        </div>
      </div>

      {/* Panel de detalle: fijo, sin scroll de página, ocupa el resto de la pantalla */}
      <div className="flex-1 h-full overflow-y-auto flex items-center justify-center p-6">
        {cargandoDetalle && <p className="text-slate-400">Cargando Pokémon...</p>}

        {!cargandoDetalle && !detalle && (
          <div className="text-center text-slate-400 max-w-xs">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full border-4 border-slate-200 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-slate-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <p className="font-semibold text-slate-600 mb-1">Selecciona un Pokémon</p>
            <p className="text-sm">
              Selecciona un Pokémon de la lista para consultar toda su información.
            </p>
          </div>
        )}

        {!cargandoDetalle && detalle && (
          <div className="w-full max-w-[95%] h-full overflow-y-auto rounded-xl border border-slate-200 shadow-sm bg-white">
            <div
              className={`bg-gradient-to-r ${
                gradienteTipo[detalle.tipos[0]] ?? 'from-slate-400 to-slate-600'
              } px-8 py-4 flex gap-2`}
            >
              {detalle.tipos.map((tipo) => (
                <span
                  key={tipo}
                  className="bg-white/25 text-white px-4 py-1.5 rounded text-sm font-semibold capitalize"
                >
                  {tipo}
                </span>
              ))}
            </div>

            <div className="flex flex-col items-center py-10 bg-white">
              <img src={detalle.imagen} alt={detalle.nombre} className="w-72 h-72" />
              <h2 className="text-5xl font-bold text-slate-900 capitalize mt-3">
                {detalle.nombre}{' '}
                <span className="text-slate-400 font-normal">
                  #{String(detalle.id).padStart(3, '0')}
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-3 text-center border-t border-slate-100 py-6">
              <div>
                <p className="text-base text-slate-400 font-semibold">ALTURA</p>
                <p className="text-3xl font-bold text-slate-800">{detalle.altura} m</p>
              </div>
              <div>
                <p className="text-base text-slate-400 font-semibold">PESO</p>
                <p className="text-3xl font-bold text-slate-800">{detalle.peso} kg</p>
              </div>
              <div>
                <p className="text-base text-slate-400 font-semibold">EXPERIENCIA</p>
                <p className="text-3xl font-bold text-slate-800">{detalle.experiencia}</p>
              </div>
            </div>

            <div className="px-8 py-6 border-t border-slate-100">
              <h3 className="font-semibold text-slate-800 text-lg mb-3">Habilidades</h3>
              <div className="flex gap-2 flex-wrap">
                {detalle.habilidades.map((h) => (
                  <span
                    key={h}
                    className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded text-sm capitalize"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>

            <div className="px-8 py-6 border-t border-slate-100">
              <h3 className="font-semibold text-slate-800 text-lg mb-4">Estadísticas</h3>
              <div className="space-y-3">
                {detalle.estadisticas.map((s) => (
                  <div key={s.nombre}>
                    <div className="flex justify-between text-sm text-slate-500 mb-1">
                      <span className="capitalize">{s.nombre.replace('-', ' ')}</span>
                      <span>{s.valor}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5">
                      <div
                        className="bg-blue-500 h-2.5 rounded-full"
                        style={{ width: `${Math.min(s.valor, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}