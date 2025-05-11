// frontend/cognitive-training-frontend/src/components/ProfileCard.tsx
import React from 'react';

export interface ProfileCardProps {
  username: string;
  score: number;
  trainingRoute: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ username, score, trainingRoute }) => {
  return (
    <div className="bg-white/20 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg group overflow-hidden">
      {/* Sección de la imagen con efecto zoom y overlay */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src="/profile-banner.jpg" 
          alt="Profile Banner" 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        {/* Overlay degradado para mejorar la legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900 to-transparent opacity-60"></div>
        {/* Etiqueta de Usuario */}
        <span className="absolute bottom-2 left-2 rounded-full bg-purple-600/80 backdrop-blur-sm px-2 py-1 text-xs text-white">
          Usuario
        </span>
      </div>

      {/* Sección de contenido */}
      <div className="p-6">
        <h3 className="mb-2 text-xl font-semibold text-white">Perfil de Usuario</h3>
        <p className="mb-2 text-sm text-gray-200">
          <strong>Usuario:</strong> {username}
        </p>
        <p className="mb-2 text-sm text-gray-200">
          <strong>Puntaje:</strong> {score} puntos
        </p>
        <p className="text-sm text-gray-200">
          <strong>Ruta de entrenamiento:</strong> {trainingRoute ? trainingRoute : "Aún no definido"}
        </p>
      </div>
    </div>
  );
};

export default ProfileCard;
