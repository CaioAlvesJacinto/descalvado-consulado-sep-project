
const HowItWorksSection = () => {
  return (
    <section className="py-12 md:py-16 bg-accent">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl mb-2">
            Como Funciona
          </h2>
          <p className="text-muted-foreground mx-auto max-w-[700px]">
            Comprar ingressos para eventos beneficentes nunca foi tão fácil
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          <div className="flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold mb-4">1</div>
            <h3 className="text-lg font-medium mb-2">Escolha o Evento</h3>
            <p className="text-muted-foreground">
              Navegue pelos eventos disponíveis e escolha o que mais lhe interessa.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold mb-4">2</div>
            <h3 className="text-lg font-medium mb-2">Compre seu Ingresso</h3>
            <p className="text-muted-foreground">
              Efetue o pagamento de forma rápida e segura por Pix ou cartão.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold mb-4">3</div>
            <h3 className="text-lg font-medium mb-2">Receba seu QR Code</h3>
            <p className="text-muted-foreground">
              O QR Code do seu ingresso será enviado por e-mail e WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;