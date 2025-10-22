export function Footer() {
  return (
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
  );
}