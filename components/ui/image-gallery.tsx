import Image from 'next/image'

// Definimos el tipo de dato para una imagen de la galería
interface GalleryImage {
  _id: string;
  title: string;
  imageUrl: string;
  meetingDate: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  if (!images || images.length === 0) {
    return <p>No hay imágenes en la galería.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 md:p-8">
      {images.map((image) => (
        <div key={image._id} className="group relative block overflow-hidden rounded-lg shadow-lg">
          <Image
            src={image.imageUrl}
            alt={image.title}
            width={500}
            height={500}
            className="w-full h-64 object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
          />
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
            <h3 className="text-lg font-bold text-white truncate">{image.title}</h3>
            <p className="text-sm text-gray-300">{new Date(image.meetingDate).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
