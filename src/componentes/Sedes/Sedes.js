import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SedeCard from './SedeCard';
import MovingBar from '../MovingBar';
import Footer from '../Footer';
import '../../styles/Sedes/sedes.css';
import { useTranslation } from 'react-i18next'; // Importamos useTranslation

const Sedes = () => {
  const [sedes, setSedes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation(); // Usamos useTranslation

  useEffect(() => {
    const fetchSedes = async () => {
      try {
        const response = await axios.get('https://belami.pythonanywhere.com/api/sedes/sedes/');
        setSedes(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchSedes();
  }, []);

  if (loading) return <p>{t('mensajes.cargandoSedes')}</p>; 
  if (error) return <p>{t('mensajes.errorCargarSedes')}: {error}</p>; 

  return (
    <div className="sedes-container">
      <MovingBar />
      
      <div className="sedes-grid">
        {sedes.length > 0 ? (
          sedes.map(sede => <SedeCard key={sede.id} sede={sede} />)
        ) : (
          <p>{t('mensajes.noSedesDisponibles')}</p> 
        )}
      </div>

      <Footer /> 
    </div>
  );
};

export default Sedes;
