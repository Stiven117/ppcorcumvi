'use client';

import { useState, useEffect, useTransition } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { client } from '@/lib/sanity';
import { ImageGallery } from './image-gallery';
import { PaginationControls } from './pagination-controls';
import { ImageModal } from './image-modal';

// Definimos el tipo de dato para una imagen de la galería
interface GalleryImage {
  _id: string;
  title: string;
  imageUrl: string;
  meetingDate: string;
  description?: string;
}

const IMAGES_PER_PAGE = 9;

interface GalleryWrapperProps {
  initialImages: GalleryImage[];
  totalPages: number;
}

export function GalleryWrapper({ initialImages, totalPages }: GalleryWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageParam = searchParams.get('page') ?? '1';
  const initialPage = !isNaN(parseInt(pageParam, 10)) && parseInt(pageParam, 10) > 0 ? parseInt(pageParam, 10) : 1;

  const [images, setImages] = useState(initialImages);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isPending, startTransition] = useTransition();
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    // Si estamos en la página inicial que se cargó desde el servidor, no hacemos nada.
    if (currentPage === initialPage) {
      setImages(initialImages);
      return;
    }

    // Usamos startTransition para las actualizaciones de estado que dependen de datos asíncronos.
    // Esto le permite a React mantener la UI interactiva mientras se cargan los nuevos datos.
    startTransition(async () => {
      const start = (currentPage - 1) * IMAGES_PER_PAGE;
      const end = start + IMAGES_PER_PAGE;

      const query = `*[_type == "galleryImage"] | order(meetingDate desc) [${start}...${end}] {
        _id,
        title,
        meetingDate,
        "imageUrl": image.asset->url,
        description
      }`;
      
      const newImages = await client.fetch<GalleryImage[]>(query);
      setImages(newImages);
    });
  }, [currentPage, initialPage, initialImages]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Actualiza la URL sin recargar la página
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      <ImageGallery images={images} isLoading={isPending} onImageClick={setSelectedImage} />
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        isDisabled={isPending}
      />
      {selectedImage && (
        <ImageModal 
          image={selectedImage} 
          onClose={() => setSelectedImage(null)} 
        />
      )}
    </>
  );
}