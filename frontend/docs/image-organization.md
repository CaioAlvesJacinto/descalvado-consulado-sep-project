
# Organização de Imagens - IngressaSolidário

## Estrutura de Pastas

```
public/images/
├── events/          # Imagens de eventos
├── merchandise/     # Imagens de produtos/camisetas
├── logos/          # Logos e banners da organização
└── avatars/        # Avatars de usuários
```

## Convenções de Nomenclatura

### Eventos
- `evento-{id}-principal.jpg` - Imagem principal do evento
- `evento-{id}-galeria-{numero}.jpg` - Imagens da galeria
- Exemplo: `evento-123-principal.jpg`, `evento-123-galeria-1.jpg`

### Produtos
- `produto-{id}-principal.jpg` - Imagem principal do produto
- `produto-{id}-{cor}-{angulo}.jpg` - Variações por cor e ângulo
- Exemplo: `produto-456-verde-frente.jpg`, `produto-456-azul-costas.jpg`

### Logos e Banners
- `logo-principal.png` - Logo principal da organização
- `banner-{evento}.jpg` - Banners específicos de eventos
- `favicon.ico` - Ícone do site

### Avatars
- `avatar-default.png` - Avatar padrão
- `avatar-{user-id}.jpg` - Avatars personalizados

## Especificações Técnicas

### Formatos Recomendados
- **JPG**: Fotos e imagens com muitas cores
- **PNG**: Logos, ícones e imagens com transparência
- **WebP**: Formato moderno com melhor compressão (quando suportado)

### Tamanhos Recomendados
- **Eventos - Principal**: 1200x630px (proporção 1.91:1)
- **Eventos - Galeria**: 800x600px (proporção 4:3)
- **Produtos - Principal**: 800x800px (quadrado)
- **Produtos - Galeria**: 600x600px (quadrado)
- **Logos**: 512x512px (quadrado) ou manter proporção original
- **Banners**: 1920x1080px (Full HD)

### Limites de Arquivo
- **Tamanho máximo**: 5MB por imagem
- **Quantidade máxima**: 5 imagens por evento/produto
- **Formatos aceitos**: JPG, PNG, GIF, WebP

## Uso dos Componentes

### ImageUpload
```tsx
import { ImageUpload } from "@/components/ui/image-upload";

<ImageUpload
  value={images}
  onChange={setImages}
  maxFiles={3}
  label="Imagens do Evento"
/>
```

### OptimizedImage
```tsx
import { OptimizedImage } from "@/components/ui/optimized-image";

<OptimizedImage
  src="/images/events/evento-123-principal.jpg"
  alt="Nome do Evento"
  fallbackSrc="/placeholder.svg"
  lazy={true}
/>
```

### EventImageGallery
```tsx
import EventImageGallery from "@/components/EventImageGallery";

<EventImageGallery
  images={event.images}
  eventTitle={event.title}
/>
```

## Otimizações Implementadas

1. **Lazy Loading**: Imagens carregam apenas quando visíveis
2. **Fallbacks**: Imagem placeholder em caso de erro
3. **Compressão**: Componentes otimizados para performance
4. **Responsividade**: Adaptação automática a diferentes telas
5. **Cache**: Aproveitamento do cache do navegador

## Upload via Lovable

Para fazer upload de imagens diretamente no Lovable:
1. Arraste a imagem para o editor
2. A imagem será hospedada automaticamente
3. Use a URL gerada nos formulários

## Integração com Supabase Storage

Para projetos que precisam de mais capacidade de armazenamento:
1. Configure o Supabase Storage
2. Atualize o hook `useImageUpload` 
3. Implemente upload direto para o bucket do Supabase
