import Image from "next/image";
import { client } from "@/lib/sanity";
import { ImageGallery } from "@/components/ui/image-gallery";
import { PaginationControls } from "@/components/ui/pagination-controls";

// Definimos el tipo de dato para una imagen de la galería
interface GalleryImage {
  _id: string;
  title: string;
  imageUrl: string;
  meetingDate: string;
}

// Definimos cuantas imágenes mostrar por página
const IMAGES_PER_PAGE = 9;

// Hacemos que el componente sea asíncrono y que acepte searchParams
export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // 1. Obtenemos la página actual desde la URL, por defecto es la 1
  const pageParam = searchParams["page"];
  const page = Array.isArray(pageParam) ? pageParam[0] : pageParam ?? "1";
  const currentPage = Number(page);

  // 2. Calculamos el rango de imágenes a pedir
  const start = (currentPage - 1) * IMAGES_PER_PAGE;
  const end = start + IMAGES_PER_PAGE;

  // 3. Definimos la consulta para las imágenes de la página y para el conteo total
  const imagesQuery = `*[_type == "galleryImage"] | order(meetingDate desc) [${start}...${end}] {
    _id,
    title,
    meetingDate,
    "imageUrl": image.asset->url
  }`;
  const totalImagesQuery = `count(*[_type == "galleryImage"])`;

  // 4. Ejecutamos ambas consultas en paralelo para mayor eficiencia
  const [images, totalImages] = await Promise.all([
    client.fetch<GalleryImage[]>(imagesQuery),
    client.fetch<number>(totalImagesQuery),
  ]);

  // 5. Calculamos el número total de páginas
  const totalPages = Math.ceil(totalImages / IMAGES_PER_PAGE);

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 text-gray-800">
      {/* Banner Section */}
      <div className="w-full h-64 relative">
        <Image
          src="/img/banner.jpg"
          alt="Banner"
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          <h1 className="text-5xl font-bold text-white text-center drop-shadow-md">
            Política Pública Villavicencio 2025
          </h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto flex-grow p-8 md:p-12">
        {/* Survey Button */}
        <div
          className="my-8 md:my-12 rounded-lg relative overflow-hidden text-center"
          style={{
            backgroundImage: "url(/img/encuesta.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/15" />
          <div className="relative py-20 md:py-32">
            <a
              href="https://forms.gle/5doZe5HjEKmA5C4S9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#0470bd] text-white font-bold text-xl rounded-lg px-10 py-5 shadow-lg hover:bg-[#035da7] transition-transform duration-300 ease-in-out hover:scale-105"
            >
              Diligenciar Encuesta
            </a>
          </div>
        </div>

        {/* Gallery */}
        <h2 className="text-3xl font-bold text-center mb-8">Galería de Encuentros</h2>
        <ImageGallery images={images} />

        {/* Pagination Controls */}
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>

      <footer className="w-full bg-slate-800 text-white p-8 mt-auto">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div className="mb-4 md:mb-0">
            <p className="font-bold">CORPORACIÓN CULTURAL MUNICIPAL DE VILLAVICENCIO</p>
            <p className="text-sm text-slate-300">Dirección: Cra 45a No 8-16/50 La Esperanza</p>
          </div>
          <a
            href="https://www.corcumvi.gov.co/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-4xl font-extrabold tracking-tighter"
          >
            CORCUMVI
          </a>
        </div>
      </footer>
    </main>
  );
}
