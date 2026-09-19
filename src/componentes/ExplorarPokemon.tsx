import { useEffect, useState } from 'react';

interface Props {
  onRegresar: () => void;
  onVerCategorias?: () => void;
  nombreInicial?: string | null;
}

interface ItemLista {
  name: string;
  url: string;
  id: number;
  miniatura: string;
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

const CLAVE_FAVORITOS = 'pokemon-favoritos';

// Extrae el id del pokémon a partir de la url que entrega la PokeAPI
const obtenerIdDesdeUrl = (url: string): number => {
  const partes = url.split('/').filter(Boolean);
  return Number(partes[partes.length - 1]);
};

export default function ExplorarPokemon({ onRegresar, onVerCategorias, nombreInicial }: Props) {
  const [listaPokemon, setListaPokemon] = useState<ItemLista[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [detalle, setDetalle] = useState<DetallePokemon | null>(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [filtro, setFiltro] = useState<'todos' | 'favoritos'>('todos');
  const [favoritos, setFavoritos] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(CLAVE_FAVORITOS) ?? '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(favoritos));
  }, [favoritos]);

  const alternarFavorito = (nombre: string) => {
    setFavoritos((prev) =>
      prev.includes(nombre) ? prev.filter((f) => f !== nombre) : [...prev, nombre]
    );
  };

  useEffect(() => {
    const cargarLista = async () => {
      try {
        const respuesta = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const datos = await respuesta.json();
        const lista: ItemLista[] = datos.results.map((p: { name: string; url: string }) => {
          const id = obtenerIdDesdeUrl(p.url);
          return {
            ...p,
            id,
            miniatura: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
          };
        });
        setListaPokemon(lista);
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
        imagen:
          datos.sprites.other?.['official-artwork']?.front_default ?? datos.sprites.front_default,
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

  // Si venimos desde "Categorías" con un Pokémon ya elegido, mostramos su detalle de una vez
  useEffect(() => {
    if (nombreInicial) {
      seleccionarPokemon(nombreInicial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nombreInicial]);

  const listaFiltrada = listaPokemon
    .filter((p) => p.name.toLowerCase().includes(busqueda.toLowerCase()))
    .filter((p) => filtro === 'todos' || favoritos.includes(p.name));

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden bg-slate-950 flex flex-col md:flex-row">
      {/* Barra lateral oscura con miniaturas */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900 flex flex-col md:h-full">
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={onRegresar}
              className="text-sm text-slate-400 hover:text-white cursor-pointer"
            >
              ← Regresar
            </button>
            {onVerCategorias && (
              <button
                onClick={onVerCategorias}
                className="text-sm text-fuchsia-400 hover:text-fuchsia-300 cursor-pointer ml-auto"
              >
                🗂️ Categorías
              </button>
            )}
          </div>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar Pokémon..."
            className="w-full bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
          />
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setFiltro('todos')}
              className={`flex-1 text-xs font-semibold px-3 py-1.5 rounded cursor-pointer transition-colors ${
                filtro === 'todos'
                  ? 'bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFiltro('favoritos')}
              className={`flex-1 text-xs font-semibold px-3 py-1.5 rounded cursor-pointer transition-colors ${
                filtro === 'favoritos'
                  ? 'bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              ❤️ Favoritos ({favoritos.length})
            </button>
          </div>
        </div>
        <p className="px-4 pt-3 pb-1 text-xs font-semibold text-slate-500">
          POKÉMON ({listaFiltrada.length})
        </p>
        {/* Solo esta cuadrícula tiene scroll */}
        <div className="overflow-y-auto max-h-80 md:max-h-none md:flex-1 md:min-h-0 p-3">
          {listaFiltrada.length === 0 && (
            <p className="px-4 py-6 text-sm text-slate-500 text-center">
              {filtro === 'favoritos' ? 'Aún no tienes favoritos.' : 'Sin resultados.'}
            </p>
          )}
          <div className="grid grid-cols-3 gap-2">
            {listaFiltrada.map((p) => (
              <button
                key={p.name}
                onClick={() => seleccionarPokemon(p.name)}
                className={`relative flex flex-col items-center rounded-lg py-2 px-1 cursor-pointer transition-all ${
                  detalle?.nombre === p.name
                    ? 'bg-gradient-to-b from-fuchsia-600/30 to-indigo-600/30 ring-2 ring-fuchsia-400'
                    : 'bg-slate-800/60 hover:bg-slate-800'
                }`}
              >
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    alternarFavorito(p.name);
                  }}
                  className="absolute top-1 right-1 cursor-pointer"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className={`w-3.5 h-3.5 ${
                      favoritos.includes(p.name)
                        ? 'fill-red-500 stroke-red-500'
                        : 'fill-none stroke-slate-500 hover:stroke-slate-300'
                    }`}
                    strokeWidth="2"
                  >
                    <path d="M12 21s-6.7-4.35-9.3-8.1C.8 10.1 1.4 6.6 4.3 5.1c2.2-1.1 4.6-.4 6 1.4l1.7 2.1 1.7-2.1c1.4-1.8 3.8-2.5 6-1.4 2.9 1.5 3.5 5 1.6 7.8C18.7 16.65 12 21 12 21z" />
                  </svg>
                </span>
                <img src={p.miniatura} alt={p.name} loading="lazy" className="w-12 h-12" />
                <span className="text-[11px] text-slate-300 capitalize truncate w-full text-center mt-0.5">
                  {p.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Panel de detalle: fijo, sin scroll de página, ocupa el resto de la pantalla */}
      <div className="flex-1 md:h-full overflow-y-auto flex items-center justify-center p-4 md:p-6 bg-gradient-to-br from-slate-950 via-indigo-950 to-fuchsia-950">
        {cargandoDetalle && <p className="text-slate-400">Cargando Pokémon...</p>}

        {!cargandoDetalle && !detalle && (
          <div className="text-center text-slate-400 max-w-xs">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-fuchsia-500/20 to-indigo-500/20 border-4 border-slate-700 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-fuchsia-400"
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
            <p className="font-semibold text-slate-300 mb-1">Selecciona un Pokémon</p>
            <p className="text-sm text-slate-500">
              Elige un Pokémon de la cuadrícula para consultar toda su información.
            </p>
          </div>
        )}

        {!cargandoDetalle && detalle && (
          <div className="w-full md:max-w-[95%] h-full overflow-y-auto rounded-xl border border-slate-800 shadow-2xl bg-slate-900">
            <div
              className={`bg-gradient-to-r ${
                gradienteTipo[detalle.tipos[0]] ?? 'from-slate-400 to-slate-600'
              } px-4 md:px-8 py-4 flex items-center justify-between gap-2`}
            >
              <div className="flex gap-2 flex-wrap">
                {detalle.tipos.map((tipo) => (
                  <span
                    key={tipo}
                    className="bg-white/25 text-white px-4 py-1.5 rounded text-sm font-semibold capitalize"
                  >
                    {tipo}
                  </span>
                ))}
              </div>
              <button
                onClick={() => alternarFavorito(detalle.nombre)}
                className="cursor-pointer transition-transform hover:scale-110"
                aria-label="Marcar como favorito"
              >
                <svg
                  viewBox="0 0 24 24"
                  className={`w-7 h-7 ${
                    favoritos.includes(detalle.nombre)
                      ? 'fill-red-500 stroke-red-500'
                      : 'fill-none stroke-white/70'
                  }`}
                  strokeWidth="2"
                >
                  <path d="M12 21s-6.7-4.35-9.3-8.1C.8 10.1 1.4 6.6 4.3 5.1c2.2-1.1 4.6-.4 6 1.4l1.7 2.1 1.7-2.1c1.4-1.8 3.8-2.5 6-1.4 2.9 1.5 3.5 5 1.6 7.8C18.7 16.65 12 21 12 21z" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col items-center py-8 md:py-10 bg-slate-900 px-4">
              <img src={detalle.imagen} alt={detalle.nombre} className="w-48 h-48 md:w-72 md:h-72 drop-shadow-[0_0_25px_rgba(217,70,239,0.25)]" />
              <h2 className="text-3xl md:text-5xl font-bold text-white capitalize mt-3 text-center">
                {detalle.nombre}{' '}
                <span className="text-slate-500 font-normal">
                  #{String(detalle.id).padStart(3, '0')}
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-3 text-center border-t border-slate-800 py-6">
              <div>
                <p className="text-base text-slate-500 font-semibold">ALTURA</p>
                <p className="text-3xl font-bold text-slate-100">{detalle.altura} m</p>
              </div>
              <div>
                <p className="text-base text-slate-500 font-semibold">PESO</p>
                <p className="text-3xl font-bold text-slate-100">{detalle.peso} kg</p>
              </div>
              <div>
                <p className="text-base text-slate-500 font-semibold">EXPERIENCIA</p>
                <p className="text-3xl font-bold text-slate-100">{detalle.experiencia}</p>
              </div>
            </div>

            <div className="px-4 md:px-8 py-6 border-t border-slate-800">
              <h3 className="font-semibold text-slate-200 text-lg mb-3">Habilidades</h3>
              <div className="flex gap-2 flex-wrap">
                {detalle.habilidades.map((h) => (
                  <span
                    key={h}
                    className="bg-slate-800 text-slate-200 px-4 py-1.5 rounded text-sm capitalize"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>

            <div className="px-4 md:px-8 py-6 border-t border-slate-800">
              <h3 className="font-semibold text-slate-200 text-lg mb-4">Estadísticas</h3>
              <div className="space-y-3">
                {detalle.estadisticas.map((s) => (
                  <div key={s.nombre}>
                    <div className="flex justify-between text-sm text-slate-400 mb-1">
                      <span className="capitalize">{s.nombre.replace('-', ' ')}</span>
                      <span>{s.valor}</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2.5">
                      <div
                        className={`bg-gradient-to-r ${
                          gradienteTipo[detalle.tipos[0]] ?? 'from-fuchsia-400 to-indigo-600'
                        } h-2.5 rounded-full`}
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
