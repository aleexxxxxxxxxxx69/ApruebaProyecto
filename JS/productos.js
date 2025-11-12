const productos = [
  {
    id: 1,
    nombre: 'Anell Diamant',
    categoria: 'anells',
    precio: 2500,
    descripcion: 'Anell dor blanc amb diamant natural de 0.5 quilats. Disseny clssic i elegant.',
    modelo3D: 'models/anillo1.glb'
  },
  {
    id: 2,
    nombre: 'Anell Safir',
    categoria: 'anells',
    precio: 1800,
    descripcion: 'Anell amb safir blau autntic envoltat de diamants petits. Estil vintage.',
    modelo3D: 'models/anillo2.glb'
  },
  {
    id: 3,
    nombre: 'Arracades Diamant',
    categoria: 'arracades',
    precio: 3200,
    descripcion: 'Arracades de penjoll amb diamants naturals. Perfectes per ocasions especials.',
    modelo3D: 'models/pendientes1.glb'
  },
  {
    id: 4,
    nombre: 'Arracades Perla',
    categoria: 'arracades',
    precio: 1500,
    descripcion: "Arracades amb perles cultivades d'aigua dolça. Elegncia atemporal.",
    modelo3D: 'models/pendientes2.glb'
  },
  {
    id: 5,
    nombre: 'Polsera Tennis',
    categoria: 'polseres',
    precio: 4500,
    descripcion: 'Polsera Tennis amb diamants de talla brillant. Luxe incomparable.',
    modelo3D: 'models/pulsera1.glb'
  },
  {
    id: 6,
    nombre: 'Polsera Charm',
    categoria: 'polseres',
    precio: 980,
    descripcion: 'Polsera dor de 18 quilats amb charms personalitzables. Estil modern.',
    modelo3D: 'models/pulsera2.glb'
  }
];

function getProductos() {
  return productos;
}
