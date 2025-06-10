// frontend/src/pages/admin/modalAdmin.tsx (ou AdminDashboard.tsx)
import { useState } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/useToast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import OverviewTab from "@/components/admin/modalTab/OverviewTab";
import EventsTab from "@/components/admin/modalTab/EventsTab";
import MerchandiseTab from "@/components/admin/modalTab/MerchandiseTab";
import SalesTab from "@/components/admin/modalTab/SalesTab";
import CollaboratorsTab from "@/components/admin/modalTab/CollaboratorsTab";

import { getCollaboratorById } from "@/services/collaboratorService";

import EventDialog from "@/components/admin/events/EventFormDialog";
import CollaboratorDialog from "@/components/admin/collaborators/CollaboratorForm";

import { useEvents } from "@/hooks/useEvents";
import { useSales } from "@/hooks/useSales";
import { useMerchandise } from "@/hooks/useMerchandise";
import { useCollaborators } from "@/hooks/useCollaborators";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  // Armazena a senha quando criamos um novo colaborador
  const [senhaGerada, setSenhaGerada] = useState<string | undefined>(undefined);

  const {
    events,
    eventDialogOpen,
    setEventDialogOpen,
    editingEvent,
    setEditingEvent,
    deleteDialogOpen,
    setDeleteDialogOpen,
    eventToDelete,
    setEventToDelete,
    handleEventSubmit,
    confirmDeleteEvent,
  } = useEvents();

  const {
    filteredSales,
    filters: salesFilters,
    setFilters: setSalesFilters,
    salesStats,
    eventsOptions,
    merchOptions,
    statuses,
  } = useSales();

  const merchandiseStats = useMerchandise();

  const {
    collaborators,
    filters: collaboratorFilters,
    setFilters: setCollaboratorFilters,
    stats: collaboratorStats,
    collaboratorDialogOpen,
    setCollaboratorDialogOpen,
    editingCollaborator,
    setEditingCollaborator,
    collaboratorDeleteDialogOpen,
    setCollaboratorDeleteDialogOpen,
    collaboratorToDelete,
    setCollaboratorToDelete,
    handleCollaboratorSubmit,
    confirmDeleteCollaborator,
  } = useCollaborators();

  // Wrapper para o onSubmit do modal de colaboradores
  const handleSubmitCollaborator = async (data: any) => {
    const res = await handleCollaboratorSubmit(data);

    // Se veio { senha: "..." }, significa que acabou de criar
    if (res?.senha && res?.colaborador) {
      setSenhaGerada(res.senha);
      setEditingCollaborator({
        ...res.colaborador,
        senha: res.senha,
      });
      setCollaboratorDialogOpen(true);
      return;
    }





    // Se não veio senha, significa atualização ou erro
    setSenhaGerada(undefined);
    setCollaboratorDialogOpen(false);
    setEditingCollaborator(null);
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Painel de Gestão</h1>
            <p className="text-muted-foreground">
              Olá, {user?.name || "usuário"}. Bem-vindo ao painel de gerenciamento.
            </p>
          </div>
        </div>

        <Tabs
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-5 md:w-[600px]">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="events">Eventos</TabsTrigger>
            <TabsTrigger value="merchandise">Loja</TabsTrigger>
            <TabsTrigger value="sales">Vendas</TabsTrigger>
            <TabsTrigger value="collaborators">Colaboradores</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab
              salesStats={salesStats}
              eventCount={events.length}
              merchandise={merchandiseStats.products}
            />
          </TabsContent>

          <TabsContent value="events">
            <EventsTab
              events={events}
              onCreateEvent={() => {
                setEditingEvent(null);
                setEventDialogOpen(true);
              }}
              onEditEvent={(e) => {
                setEditingEvent(e);
                setEventDialogOpen(true);
              }}
              onDeleteEvent={(e) => {
                setEventToDelete(e);
                setDeleteDialogOpen(true);
              }}
            />
          </TabsContent>

          <TabsContent value="merchandise">
            <MerchandiseTab
              products={merchandiseStats.products}
              onRefresh={merchandiseStats.refresh}
            />
          </TabsContent>

          <TabsContent value="sales">
            <SalesTab
              filteredSales={filteredSales}
              salesStats={salesStats}
              salesFilters={salesFilters}
              onFiltersChange={setSalesFilters}
              eventsOptions={eventsOptions}
              merchOptions={merchOptions}
              statuses={statuses}
            />
          </TabsContent>

          <TabsContent value="collaborators">
            <CollaboratorsTab
              collaboratorStats={collaboratorStats}
              collaboratorFilters={collaboratorFilters}
              onFiltersChange={setCollaboratorFilters}
              collaborators={collaborators}
              onCreateCollaborator={() => {
                setEditingCollaborator(null);
                setCollaboratorDialogOpen(true);
              }}
              onEditCollaborator={async (c) => {
                const colaboradorCompleto = await getCollaboratorById(c.id);
                if (colaboradorCompleto) {
                  setEditingCollaborator({
                    ...colaboradorCompleto,
                    senha: colaboradorCompleto.senha, // garante que watch("senha") capture
                  });
                  setCollaboratorDialogOpen(true);
                }
              }}



              onDeleteCollaborator={(c) => {
                setCollaboratorToDelete(c);
                setCollaboratorDeleteDialogOpen(true);
              }}
            />
          </TabsContent>
        </Tabs>

        {/* Dialog de Eventos */}
        <EventDialog
          isOpen={eventDialogOpen}
          onClose={() => {
            setEventDialogOpen(false);
            setEditingEvent(null);
          }}
          onSubmit={handleEventSubmit}
          eventData={editingEvent ?? undefined}
        />

        {/* Confirmação de Exclusão de Evento */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Deseja excluir o evento "{eventToDelete?.title}"?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteEvent}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Dialog de Colaborador */}
        <CollaboratorDialog
          open={collaboratorDialogOpen}
          onClose={() => {
            setCollaboratorDialogOpen(false);
            setEditingCollaborator(null);
            setSenhaGerada(undefined);
          }}
          onSubmit={handleSubmitCollaborator}
          initialData={
            // Se tiver editingCollaborator, passamos ele (pode conter senha!)
            editingCollaborator
              ? { ...editingCollaborator }
              : undefined
          }
        />

        {/* Confirmação de Exclusão de Colaborador */}
        <AlertDialog
          open={collaboratorDeleteDialogOpen}
          onOpenChange={setCollaboratorDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Deseja excluir o colaborador "{collaboratorToDelete?.name}"?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteCollaborator}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}
