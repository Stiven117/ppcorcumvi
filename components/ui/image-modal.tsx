'use client';

import Image from 'next/image';
import { X } from 'lucide-react';

interface GalleryImage {
  _id: string;
  title: string;
  imageUrl: string;
  description?: string;
}

interface ImageModalProps {
  image: GalleryImage;
  onClose: () => void;
}

export function ImageModal({ image, onClose }: ImageModalProps) {
  // Evita que el clic dentro del contenido del modal lo cierre
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div        
        className="bg-gray-900 text-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
        onClick={handleContentClick}
      >
        {/* Encabezado con el título */}
        <div className="sticky top-0 bg-gray-900 p-6 border-b border-gray-700 z-10">
          <h3 className="text-2xl font-bold text-center">{image.title}</h3>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 text-gray-400 hover:text-white transition-colors"
            aria-label="Cerrar modal"
          >
            <X size={24} />
          </button>
        </div>
        {/* Contenido principal: Imagen y Descripción */}
        <div className="p-6 bg-gray-800">
          <Image
            src={image.imageUrl}
            alt={image.title}
            width={1200}
            height={800}
            className="w-full h-auto object-contain"
          />
          {image.description && (
            <p className="mt-6 text-gray-300 whitespace-pre-wrap text-justify">{image.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}