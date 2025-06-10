export interface Event {
  id: string;
  title: string;
  description?: string | null;
  location?: string | null;
  price: number;
  start_datetime: string;
  end_datetime?: string | null;
  end_sales_datetime?: string | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  company_id?: string | null;
  image?: string | null;
  category?: string | null;
  available_tickets?: number | null;
  featured?: boolean | null;
  is_published?: boolean | null;
  sold_tickets?: number;

  // Novos campos:
  organizer?: string | null;
  contact_number?: string | null;
  contact_email?: string | null;
}
