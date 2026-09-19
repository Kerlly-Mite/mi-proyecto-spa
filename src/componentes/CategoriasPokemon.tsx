import { useEffect, useState } from 'react';

interface Props {
  onRegresar: () => void;
  onSeleccionarPokemon: (nombre: string) => void;
}

interface PokemonCategoria {
  nombre: string;
  id: number;
  imagen: string;
}

interface Categoria {
  clave: string;
  etiqueta: string;
  icono: string;
  colorActivo: string;
  colorTarjeta: string;
  fondoPagina: string;
}

// Se incluyen todos los tipos presentes entre los primeros 151 Pokémon,
// así entre todas las pestañas aparecen los 151 (cada uno según su tipo).
const CATEGORIAS: Categoria[] = [
  {
    clave: 'grass',
    etiqueta: 'Planta',
    icono: '🌿',
    colorActivo: 'bg-gradient-to-r from-green-500 to-emerald-500',
    colorTarjeta: 'hover:border-green-400 hover:ring-green-200',
    fondoPagina: 'from-green-50 via-emerald-50 to-lime-50',
  },
  {
    clave: 'fire',
    etiqueta: 'Fuego',
    icono: '🔥',
    colorActivo: 'bg-gradient-to-r from-orange-500 to-red-500',
    colorTarjeta: 'hover:border-orange-400 hover:ring-orange-200',
    fondoPagina: 'from-orange-50 via-red-50 to-yellow-50',
  },
  {
    clave: 'water',
    etiqueta: 'Agua',
    icono: '💧',
    colorActivo: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    colorTarjeta: 'hover:border-blue-400 hover:ring-blue-200',
    fondoPagina: 'from-blue-50 via-cyan-50 to-sky-50',
  },
  {
    clave: 'ground',
    etiqueta: 'Tierra',
    icono: '⛰️',
    colorActivo: 'bg-gradient-to-r from-amber-600 to-yellow-700',
    colorTarjeta: 'hover:border-amber-500 hover:ring-amber-200',
    fondoPagina: 'from-amber-50 via-yellow-50 to-orange-50',
  },
  {
    clave: 'electric',
    etiqueta: 'Eléctrico',
    icono: '⚡',
    colorActivo: 'bg-gradient-to-r from-yellow-400 to-amber-500',
    colorTarjeta: 'hover:border-yellow-400 hover:ring-yellow-200',
    fondoPagina: 'from-yellow-50 via-amber-50 to-orange-50',
  },
  {
    clave: 'psychic',
    etiqueta: 'Psíquico',
    icono: '🔮',
    colorActivo: 'bg-gradient-to-r from-pink-500 to-fuchsia-500',
    colorTarjeta: 'hover:border-pink-400 hover:ring-pink-200',
    fondoPagina: 'from-pink-50 via-fuchsia-50 to-rose-50',
  },
  {
    clave: 'ice',
    etiqueta: 'Hielo',
    icono: '❄️',
    colorActivo: 'bg-gradient-to-r from-cyan-300 to-blue-400',
    colorTarjeta: 'hover:border-cyan-300 hover:ring-cyan-200',
    fondoPagina: 'from-cyan-50 via-blue-50 to-sky-50',
  },
  {
    clave: 'fighting',
    etiqueta: 'Lucha',
    icono: '🥊',
    colorActivo: 'bg-gradient-to-r from-red-700 to-orange-700',
    colorTarjeta: 'hover:border-red-500 hover:ring-red-200',
    fondoPagina: 'from-red-50 via-orange-50 to-amber-50',
  },
  {
    clave: 'poison',
    etiqueta: 'Veneno',
    icono: '☠️',
    colorActivo: 'bg-gradient-to-r from-purple-500 to-fuchsia-600',
    colorTarjeta: 'hover:border-purple-400 hover:ring-purple-200',
    fondoPagina: 'from-purple-50 via-fuchsia-50 to-pink-50',
  },
  {
    clave: 'flying',
    etiqueta: 'Volador',
    icono: '🕊️',
    colorActivo: 'bg-gradient-to-r from-indigo-400 to-sky-400',
    colorTarjeta: 'hover:border-indigo-400 hover:ring-indigo-200',
    fondoPagina: 'from-indigo-50 via-sky-50 to-blue-50',
  },
  {
    clave: 'bug',
    etiqueta: 'Bicho',
    icono: '🐛',
    colorActivo: 'bg-gradient-to-r from-lime-500 to-green-600',
    colorTarjeta: 'hover:border-lime-400 hover:ring-lime-200',
    fondoPagina: 'from-lime-50 via-green-50 to-emerald-50',
  },
  {
    clave: 'rock',
    etiqueta: 'Roca',
    icono: '🪨',
    colorActivo: 'bg-gradient-to-r from-stone-500 to-stone-700',
    colorTarjeta: 'hover:border-stone-400 hover:ring-stone-200',
    fondoPagina: 'from-stone-50 via-neutral-50 to-amber-50',
  },
  {
    clave: 'ghost',
    etiqueta: 'Fantasma',
    icono: '👻',
    colorActivo: 'bg-gradient-to-r from-violet-600 to-purple-800',
    colorTarjeta: 'hover:border-violet-400 hover:ring-violet-200',
    fondoPagina: 'from-violet-50 via-purple-50 to-indigo-50',
  },
  {
    clave: 'dragon',
    etiqueta: 'Dragón',
    icono: '🐉',
    colorActivo: 'bg-gradient-to-r from-indigo-600 to-violet-700',
    colorTarjeta: 'hover:border-indigo-500 hover:ring-indigo-200',
    fondoPagina: 'from-indigo-50 via-violet-50 to-purple-50',
  },
  {
    clave: 'normal',
    etiqueta: 'Normal',
    icono: '⭐',
    colorActivo: 'bg-gradient-to-r from-gray-400 to-slate-500',
    colorTarjeta: 'hover:border-gray-400 hover:ring-gray-200',
    fondoPagina: 'from-gray-50 via-slate-50 to-zinc-50',
  },
  {
    clave: 'steel',
    etiqueta: 'Acero',
    icono: '⚙️',
    colorActivo: 'bg-gradient-to-r from-slate-400 to-slate-600',
    colorTarjeta: 'hover:border-slate-400 hover:ring-slate-200',
    fondoPagina: 'from-slate-50 via-gray-50 to-zinc-50',
  },
  {
    clave: 'fairy',
    etiqueta: 'Hada',
    icono: '✨',
    colorActivo: 'bg-gradient-to-r from-rose-400 to-pink-500',
    colorTarjeta: 'hover:border-rose-400 hover:ring-rose-200',
    fondoPagina: 'from-rose-50 via-pink-50 to-fuchsia-50',
  },
];

// Extrae el id del pokémon a partir de la url que entrega la PokeAPI
const obtenerIdDesdeUrl = (url: string): number => {
  const partes = url.split('/').filter(Boolean);
  return Number(partes[partes.length - 1]);
};

export default function CategoriasPokemon({ onRegresar, onSeleccionarPokemon }: Props) {
  const [categoriaActiva, setCategoriaActiva] = useState<string>('grass');
  const [pokemones, setPokemones] = useState<PokemonCategoria[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);

  useEffect(() => {
    const cargarPorCategoria = async () => {
      setCargando(true);
      try {
        const respuesta = await fetch(`https://pokeapi.co/api/v2/type/${categoriaActiva}`);
        const datos = await respuesta.json();
        const lista: PokemonCategoria[] = datos.pokemon
          .map((entrada: { pokemon: { name: string; url: string } }) => {
            const id = obtenerIdDesdeUrl(entrada.pokemon.url);
            return {
              nombre: entrada.pokemon.name,
              id,
              imagen: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
            };
          })
          // Solo la primera generación (1-151), igual que en "Explorar Pokémon"
          .filter((p: PokemonCategoria) => p.id <= 151)
          .sort((a: PokemonCategoria, b: PokemonCategoria) => a.id - b.id);
        setPokemones(lista);
      } catch (error) {
        console.error('Error al obtener la categoría', error);
      } finally {
        setCargando(false);
      }
    };
    cargarPorCategoria();
  }, [categoriaActiva]);

  const categoria = CATEGORIAS.find((c) => c.clave === categoriaActiva)!;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${categoria.fondoPagina} p-4 md:p-8 transition-colors`}>
      <button
        onClick={onRegresar}
        className="text-sm text-slate-500 hover:text-slate-800 mb-4 cursor-pointer"
      >
        ← Regresar
      </button>

      <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1">Categorías Pokémon</h1>
      <p className="text-slate-500 mb-6">
        Explora Pokémon agrupados por su tipo · toca uno para ver todos sus datos
      </p>

      {/* Pestañas de categorías */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIAS.map((cat) => (
          <button
            key={cat.clave}
            onClick={() => setCategoriaActiva(cat.clave)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-sm transition-all cursor-pointer ${
              categoriaActiva === cat.clave
                ? `${cat.colorActivo} text-white shadow-md scale-105`
                : 'bg-white/70 text-slate-600 border border-slate-200 hover:bg-white'
            }`}
          >
            <span>{cat.icono}</span>
            {cat.etiqueta}
          </button>
        ))}
      </div>

      {cargando && <p className="text-slate-400">Cargando Pokémon de tipo {categoria.etiqueta}...</p>}

      {!cargando && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {pokemones.map((p) => (
            <button
              key={p.nombre}
              onClick={() => onSeleccionarPokemon(p.nombre)}
              className={`bg-white rounded-xl border-2 border-transparent shadow-sm p-3 flex flex-col items-center text-center hover:shadow-lg hover:-translate-y-1 hover:ring-4 transition-all cursor-pointer ${categoria.colorTarjeta}`}
            >
              <img src={p.imagen} alt={p.nombre} loading="lazy" className="w-20 h-20" />
              <p className="text-xs text-slate-400 mt-1">#{String(p.id).padStart(3, '0')}</p>
              <p className="text-sm font-semibold text-slate-700 capitalize">{p.nombre}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
