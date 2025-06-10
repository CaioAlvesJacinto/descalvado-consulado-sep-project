// src/pages/EventDetails.tsx

import React, { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getEventById } from "@/services/eventService";
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  MailIcon,
  BuildingIcon,
  MessageCircle,
} from "lucide-react";
import SimpleQuantitySelector from "@/components/ticket/SimpleQuantitySelector";
import AddToCartButton from "@/components/ticket/AddToCartButton";
import type { Event } from "@/types/event";

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    // getEventById deve ser async!
    getEventById(id)
      .then((data) => setEvent(data))
      .finally(() => setLoading(false));
  }, [id]);

  if (!id) {
    return <Navigate to="/eventos" replace />;
  }

  if (loading) {
    return (
      <Layout>
        <div className="container py-10 max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Carregando evento...</h1>
        </div>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout>
        <div className="container py-10 max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Evento não encontrado</h1>
          <p className="text-muted-foreground mb-6">
            O evento que você está procurando não existe ou foi removido.
          </p>
          <Button asChild>
            <Link to="/eventos">Ver Todos os Eventos</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const ingressosDisponiveis = Math.max(
    Number(event.available_tickets) - Number(event.sold_tickets ?? 0),
    0
  );

  const totalPrice = Number(event.price) * selectedQuantity;

  const formatWhatsAppNumber = (number: string) => {
    const cleaned = number.replace(/\D/g, "");
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
    return number;
  };

  const getWhatsAppLink = (number: string) => {
    const cleaned = number.replace(/\D/g, "");
    const message = encodeURIComponent(
      `Olá! Tenho interesse no evento "${event.title}". Gostaria de mais informações.`
    );
    return `https://wa.me/55${cleaned}?text=${message}`;
  };

  return (
    <Layout>
      <div className="container py-6 max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              Início
            </Link>
            <span>/</span>
            <Link to="/eventos" className="hover:text-foreground">
              Eventos
            </Link>
            <span>/</span>
            <span className="text-foreground">{event.title}</span>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="mb-8">
          <div className="aspect-video w-full overflow-hidden rounded-lg mb-6">
            <img
              src={event.image || "/placeholder.svg"}
              alt={event.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          </div>

          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
              <Badge variant="outline" className="mb-2">
                {event.category}
              </Badge>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary mb-1">
                R$ {Number(event.price).toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">
                {ingressosDisponiveis > 0
                  ? `${ingressosDisponiveis} ingresso${ingressosDisponiveis > 1 ? "s" : ""} disponível${ingressosDisponiveis > 1 ? "s" : ""}`
                  : "Esgotado"}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Information */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Informações do Evento</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Data</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(event.start_datetime).toLocaleString("pt-BR", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPinIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Local</div>
                      <div className="text-sm text-muted-foreground">
                        {event.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <UsersIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Ingressos</div>
                      <div className="text-sm text-muted-foreground">
                        {ingressosDisponiveis} disponíveis
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <BuildingIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Organizador</div>
                      <div className="text-sm text-muted-foreground">
                        {event.organizer || "Organizador não informado"}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Sobre o Evento</h2>
                <div className="prose prose-sm max-w-none">
                  {(event.description || "").split("\n").map((paragraph, index) => (
                    <p key={index} className="mb-3 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            {(event.contact_email || event.contact_number) && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Contato</h2>
                  <div className="space-y-4">
                    {event.contact_email && (
                      <div className="flex items-center gap-3">
                        <MailIcon className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">Email</div>
                          <a
                            href={`mailto:${event.contact_email}`}
                            className="text-sm text-primary hover:underline"
                          >
                            {event.contact_email}
                          </a>
                        </div>
                      </div>
                    )}

                    {event.contact_number && (
                      <div className="flex items-center gap-3">
                        <MessageCircle className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">WhatsApp</div>
                          <a
                            href={getWhatsAppLink(event.contact_number)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline flex items-center gap-1"
                          >
                            {formatWhatsAppNumber(event.contact_number)}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Purchase */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Adicionar ao Carrinho</h2>

                <div className="mb-4">
                  <div className="text-2xl font-bold text-primary mb-1">
                    R$ {Number(event.price).toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">Por pessoa</div>
                </div>

                <div className="mb-6">
                  <div className="text-sm text-muted-foreground mb-2">Disponibilidade</div>
                  <div className="flex items-center gap-2">
                    <UsersIcon className="h-4 w-4" />
                    <span className="text-sm">
                      {ingressosDisponiveis} ingresso{ingressosDisponiveis > 1 ? "s" : ""} disponível{ingressosDisponiveis > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                {ingressosDisponiveis > 0 && (
                  <div className="mb-6">
                    <div className="text-sm font-medium mb-2">Quantidade</div>
                    <SimpleQuantitySelector
                      quantity={selectedQuantity}
                      onQuantityChange={setSelectedQuantity}
                      availableTickets={ingressosDisponiveis}
                    />
                  </div>
                )}

                {selectedQuantity > 1 && (
                  <div className="mb-4 p-3 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">Total</div>
                    <div className="text-lg font-bold">
                      R$ {totalPrice.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {selectedQuantity} ingressos × R$ {Number(event.price).toFixed(2)}
                    </div>
                  </div>
                )}

                <AddToCartButton
                  event={event}
                  quantity={selectedQuantity}
                  className="w-full mb-4"
                  disabled={ingressosDisponiveis === 0}
                />

                <div className="text-xs text-muted-foreground text-center">
                  Toda a arrecadação é destinada para projetos sociais
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventDetails;
