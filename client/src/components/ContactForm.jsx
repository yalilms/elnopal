import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope, faClock, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import '../styles/ContactForm.css';

// Configurar base URL para desarrollo y producción
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://elnopal.es' // En producción, usar HTTPS del dominio principal (nginx manejará el proxy)
  : 'http://localhost:5000'; // En desarrollo, puerto del backend

const ContactForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  });
  
  const [animateForm, setAnimateForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // Efecto para las animaciones al hacer scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            
            // Para el formulario activamos la animación con un delay
            if (entry.target.classList.contains('contact-form-container')) {
              setTimeout(() => setAnimateForm(true), 300);
            }
          }
        });
      },
      { threshold: 0.2 }
    );
    
    // Observar elementos para animar
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
    
    setTimeout(() => setAnimateForm(true), 1000);
    
    return () => {
      document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.unobserve(el);
      });
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.nombre || !formData.email || !formData.mensaje) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Animación de envío
      e.target.classList.add('form-submitted');
      
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.nombre,
          email: formData.email,
          subject: formData.asunto,
          message: formData.mensaje
        })
      });
      
      if (!response.ok) {
        throw new Error('Error al enviar el mensaje');
      }
      
      const data = await response.json();
      
      // Éxito
      setTimeout(() => {
        alert('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.');
        setFormData({
          nombre: '',
          email: '',
          asunto: '',
          mensaje: ''
        });
        e.target.classList.remove('form-submitted');
      }, 1000);
      
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      setTimeout(() => {
        alert('Hubo un error al enviar tu mensaje. Por favor, inténtalo de nuevo o contáctanos directamente.');
        e.target.classList.remove('form-submitted');
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-form-container animate-on-scroll">
      <div className="contact-header">
        <h2 className="section-title floating-title">Contáctanos</h2>
        <p className="form-subtitle">Estamos encantados de atender tus consultas y comentarios</p>
      </div>

      <div className="contact-info">
        <div className="contact-info-item" data-delay="100">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="contact-icon pulse-icon" />
          <div>
            <h3>Dirección</h3>
            <p>C. Martínez Campos, 23, bajo, 18002 Granada España</p>
          </div>
        </div>
        <div className="contact-info-item" data-delay="200">
          <FontAwesomeIcon icon={faPhone} className="contact-icon pulse-icon" />
          <div>
            <h3>Teléfono</h3>
            <p><a href="tel:+34653733111" className="contact-link">+34 653 73 31 11</a></p>
          </div>
        </div>
        <div className="contact-info-item" data-delay="300">
          <FontAwesomeIcon icon={faEnvelope} className="contact-icon pulse-icon" />
          <div>
            <h3>Email</h3>
            <p><a href="mailto:reservas@elnopal.es" className="contact-link">reservas@elnopal.es</a></p>
          </div>
        </div>
        <div className="contact-info-item" data-delay="400">
          <FontAwesomeIcon icon={faClock} className="contact-icon pulse-icon" />
          <div>
            <h3>Horario</h3>
            <p>Mar-Jue: 13:00-16:00, 20:00-23:30</p>
            <p>Vie-Sáb: 13:00-16:30, 20:00-23:45 (Sáb hasta 23:30)</p>
            <p>Domingo: 13:00-16:30</p>
            <p>Lunes: Cerrado</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={`contact-form ${animateForm ? 'form-animate' : ''}`}>
        <div className="form-group">
          <label htmlFor="nombre" className="required">Nombre</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="form-field"
            placeholder="Tu nombre"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="required">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-field"
            placeholder="Tu correo electrónico"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="asunto">Asunto</label>
          <input
            type="text"
            id="asunto"
            name="asunto"
            value={formData.asunto}
            onChange={handleChange}
            className="form-field"
            placeholder="Tema de tu mensaje"
          />
        </div>

        <div className="form-group">
          <label htmlFor="mensaje" className="required">Mensaje</label>
          <textarea
            id="mensaje"
            name="mensaje"
            value={formData.mensaje}
            onChange={handleChange}
            required
            className="form-field"
            placeholder="¿En qué podemos ayudarte?"
          ></textarea>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            <span>{isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}</span>
            <FontAwesomeIcon icon={faPaperPlane} className="send-icon" />
          </button>
        </div>
      </form>
      
      <div className="mexican-decorations">
        <div className="decoration-item left"></div>
        <div className="decoration-item right"></div>
      </div>
    </div>
  );
};

export default ContactForm; 