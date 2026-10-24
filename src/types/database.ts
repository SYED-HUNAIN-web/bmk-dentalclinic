export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type NotificationChannel = "phone_call" | "whatsapp" | "email" | "sms" | "internal";
export type NotificationDeliveryStatus = "queued" | "sent" | "delivered" | "failed";
export type AdminRole = "admin" | "surgeon" | "staff";
export type ServiceCategory =
  | "Oral Surgery"
  | "Maxillofacial Trauma & Oncology"
  | "Restorative & Implantology"
  | "Preventive & Endodontics";

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: AdminRole;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          role?: AdminRole;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          role?: AdminRole;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      site_settings: {
        Row: {
          id: string;
          clinic_name: string;
          lead_surgeon: string;
          tagline: string | null;
          address: string;
          city: string;
          postal_code: string | null;
          country: string;
          phone_display: string;
          phone_tel: string;
          whatsapp_url: string;
          email: string | null;
          opening_hours: string;
          emergency_note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          clinic_name: string;
          lead_surgeon: string;
          tagline?: string | null;
          address: string;
          city?: string;
          postal_code?: string | null;
          country?: string;
          phone_display: string;
          phone_tel: string;
          whatsapp_url: string;
          email?: string | null;
          opening_hours: string;
          emergency_note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          clinic_name?: string;
          lead_surgeon?: string;
          tagline?: string | null;
          address?: string;
          city?: string;
          postal_code?: string | null;
          country?: string;
          phone_display?: string;
          phone_tel?: string;
          whatsapp_url?: string;
          email?: string | null;
          opening_hours?: string;
          emergency_note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      pages: {
        Row: {
          id: string;
          slug: string;
          title: string;
          meta_description: string | null;
          hero_headline: string | null;
          hero_subheadline: string | null;
          lead_paragraph: string | null;
          content: Json;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          meta_description?: string | null;
          hero_headline?: string | null;
          hero_subheadline?: string | null;
          lead_paragraph?: string | null;
          content?: Json;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          meta_description?: string | null;
          hero_headline?: string | null;
          hero_subheadline?: string | null;
          lead_paragraph?: string | null;
          content?: Json;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      staff: {
        Row: {
          id: string;
          slug: string;
          name: string;
          credentials: string;
          role: string;
          gender_badge: string | null;
          bio: string;
          specialties: string[];
          image_path: string;
          image_alt: string | null;
          sort_order: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          credentials: string;
          role: string;
          gender_badge?: string | null;
          bio: string;
          specialties?: string[];
          image_path: string;
          image_alt?: string | null;
          sort_order?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          credentials?: string;
          role?: string;
          gender_badge?: string | null;
          bio?: string;
          specialties?: string[];
          image_path?: string;
          image_alt?: string | null;
          sort_order?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          service_number: string;
          slug: string;
          title: string;
          category: ServiceCategory;
          short_desc: string;
          full_desc: string;
          indications: string[];
          clinical_approach: string | null;
          image_path: string;
          image_alt: string | null;
          sort_order: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          service_number: string;
          slug: string;
          title: string;
          category: ServiceCategory;
          short_desc: string;
          full_desc: string;
          indications?: string[];
          clinical_approach?: string | null;
          image_path: string;
          image_alt?: string | null;
          sort_order?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          service_number?: string;
          slug?: string;
          title?: string;
          category?: ServiceCategory;
          short_desc?: string;
          full_desc?: string;
          indications?: string[];
          clinical_approach?: string | null;
          image_path?: string;
          image_alt?: string | null;
          sort_order?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          slug: string;
          title: string;
          category: string;
          modality: string;
          diagnostic_method: string;
          clinical_summary: string;
          procedure_notes: string;
          image_path: string;
          image_alt: string | null;
          sort_order: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          category: string;
          modality: string;
          diagnostic_method: string;
          clinical_summary: string;
          procedure_notes: string;
          image_path: string;
          image_alt?: string | null;
          sort_order?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          category?: string;
          modality?: string;
          diagnostic_method?: string;
          clinical_summary?: string;
          procedure_notes?: string;
          image_path?: string;
          image_alt?: string | null;
          sort_order?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      appointments: {
        Row: {
          id: string;
          patient_name: string;
          patient_phone: string;
          patient_email: string | null;
          preferred_date: string;
          preferred_time_slot: string;
          dental_concern: string;
          consent_given: boolean;
          status: AppointmentStatus;
          is_triage_urgent: boolean;
          internal_notes: string | null;
          notification_sent: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          patient_name: string;
          patient_phone: string;
          patient_email?: string | null;
          preferred_date: string;
          preferred_time_slot: string;
          dental_concern: string;
          consent_given: boolean;
          status?: AppointmentStatus;
          is_triage_urgent?: boolean;
          internal_notes?: string | null;
          notification_sent?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          patient_name?: string;
          patient_phone?: string;
          patient_email?: string | null;
          preferred_date?: string;
          preferred_time_slot?: string;
          dental_concern?: string;
          consent_given?: boolean;
          status?: AppointmentStatus;
          is_triage_urgent?: boolean;
          internal_notes?: string | null;
          notification_sent?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      notification_logs: {
        Row: {
          id: string;
          appointment_id: string | null;
          channel: NotificationChannel;
          recipient: string;
          delivery_status: NotificationDeliveryStatus;
          error_message: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          appointment_id?: string | null;
          channel: NotificationChannel;
          recipient: string;
          delivery_status: NotificationDeliveryStatus;
          error_message?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          appointment_id?: string | null;
          channel?: NotificationChannel;
          recipient?: string;
          delivery_status?: NotificationDeliveryStatus;
          error_message?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_clinic_staff: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      appointment_status: AppointmentStatus;
      notification_channel: NotificationChannel;
      notification_delivery_status: NotificationDeliveryStatus;
      admin_role: AdminRole;
      service_category: ServiceCategory;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
