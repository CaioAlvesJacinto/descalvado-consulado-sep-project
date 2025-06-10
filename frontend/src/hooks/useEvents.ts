// src/hooks/useEvents.ts
import { useState, useEffect } from "react";
import {
  getAllEvents,
  createEvent as createEventService,
  updateEvent as updateEventService,
  deleteEvent as deleteEventService,
} from "@/services/eventService";
import type { Event } from "@/types/event";

export type EventFilters = {
  title?: string;
  status?: string;
  category?: string;
  start_datetime?: string;
  end_datetime?: string;
};

export function useEvents(initialFilters: EventFilters = {}) {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<EventFilters>(initialFilters);

  // Modais e edição
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    setLoading(true);
    try {
      const data = await getAllEvents();
      setEvents(data);
    } catch (error) {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let filtered = [...events];

    if (filters.title) {
      filtered = filtered.filter((e) =>
        e.title.toLowerCase().includes(filters.title!.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter((e) => e.status === filters.status);
    }

    if (filters.category) {
      filtered = filtered.filter((e) =>
        e.category?.toLowerCase().includes(filters.category!.toLowerCase())
      );
    }

    if (filters.start_datetime) {
      filtered = filtered.filter(
        (e) => new Date(e.start_datetime) >= new Date(filters.start_datetime!)
      );
    }

    if (filters.end_datetime) {
      filtered = filtered.filter(
        (e) => new Date(e.start_datetime) <= new Date(filters.end_datetime!)
      );
    }

    setFilteredEvents(filtered);
  }, [filters, events]);

  async function handleEventSubmit(event: Omit<Event, "id">) {
    try {
      if (editingEvent) {
        await updateEventService(editingEvent.id, event);
      } else {
        await createEventService(event);
      }
      await fetchEvents();
    } finally {
      setEventDialogOpen(false);
      setEditingEvent(null);
    }
  }

  async function confirmDeleteEvent() {
    if (!eventToDelete) return;
    try {
      await deleteEventService(eventToDelete.id);
      await fetchEvents();
    } finally {
      setDeleteDialogOpen(false);
      setEventToDelete(null);
    }
  }

    async function createEvent(event: Omit<Event, "id">) {
    await createEventService(event);
    await fetchEvents();
  }

  async function updateEvent(id: string, event: Omit<Event, "id">) {
    await updateEventService(id, event);
    await fetchEvents();
  }

  async function deleteEvent(id: string) {
    await deleteEventService(id);
    await fetchEvents();
  }

  return {
    events: filteredEvents,
    loading,
    setEvents,
    filters,
    setFilters,
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
    createEvent,           // ✅ necessário para overview.tsx
    updateEvent,           // ✅ necessário para overview.tsx
    deleteEvent,           // ✅ necessário para overview.tsx
    };
}
