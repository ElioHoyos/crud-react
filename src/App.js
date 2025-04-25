import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:3000/productos';

function App() {
  const [productos, setProductos] = useState([]);
  const [formulario, setFormulario] = useState({
    nombre: '',
    precio: '',
    stock: ''
  });

  const [errores, setErrores] = useState({});

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    const res = await axios.get(API_URL);
    setProductos(res.data);
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });

    // Oculta el error si se empieza a escribir
    if (value) {
      setErrores(prev => ({ ...prev, [name]: '' }));
    }
  };

  const crearProducto = async () => {
    const nuevosErrores = {};

    if (!formulario.nombre) nuevosErrores.nombre = 'Este campo es obligatorio';
    if (!formulario.precio) nuevosErrores.precio = 'Este campo es obligatorio';
    if (!formulario.stock) nuevosErrores.stock = 'Este campo es obligatorio';

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setErrores({});
    await axios.post(API_URL, formulario);
    setFormulario({ nombre: '', precio: '', stock: '' });
    cargarProductos();
  };

  return (
    <div className="container">
      <h1>Inventario de Productos</h1>

      <div className="formulario">
        <div className="campo">
          <input
            name="nombre"
            placeholder="Nombre"
            value={formulario.nombre}
            onChange={manejarCambio}
          />
          {errores.nombre && <p className="error">{errores.nombre}</p>}
        </div>

        <div className="campo">
          <input
            name="precio"
            placeholder="Precio"
            type="number"
            value={formulario.precio}
            onChange={manejarCambio}
          />
          {errores.precio && <p className="error">{errores.precio}</p>}
        </div>

        <div className="campo">
          <input
            name="stock"
            placeholder="Stock"
            type="number"
            value={formulario.stock}
            onChange={manejarCambio}
          />
          {errores.stock && <p className="error">{errores.stock}</p>}
        </div>

        <button onClick={crearProducto}>Agregar</button>
      </div>

      <ul className="lista">
        {productos.map(p => (
          <li key={p._id}>
            <strong>{p.nombre}</strong> — ${p.precio} — Stock: {p.stock}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
