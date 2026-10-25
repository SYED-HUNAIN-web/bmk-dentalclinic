"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  adminSignOutAction,
  touchAdminSessionAction,
  adminChangePasswordAction,
} from "@/app/actions/admin-auth";
import {
  updateAppointmentStatusAction,
  deleteAppointmentAction,
  updateClinicSettingsAction,
  getAppointmentsAction,
} from "@/app/actions/admin-triage";
import {
  getAdminStaffAction,
  createStaffAction,
  updateStaffAction,
  deleteStaffAction,
  getAdminServicesAction,
  createServiceAction,
  updateServiceAction,
  deleteServiceAction,
  getAdminCasesAction,
  createCaseAction,
  updateCaseAction,
  deleteCaseAction,
  uploadClinicMediaAction,
} from "@/app/actions/admin-cms";
import type { AdminProfile } from "@/lib/supabase/auth-guard";
import type { AppointmentStatus, ServiceCategory } from "@/types/database";
import {
  CalendarDays,
  Users,
  FileText,
  Clock,
  Phone,
  Mail,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  AlertCircle,
  RefreshCw,
  LogOut,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Settings,
  Shield,
  Layers,
  MapPin,
  MessageCircle,
  Check,
  Trash2,
  Lock,
  Plus,
  Pencil,
  Upload,
  X,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

interface AdminDashboardClientProps {
  profile: AdminProfile;
  initialStats: {
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    total: number;
    recentUrgent: number;
  };
  initialAppointments: any[];
  initialSettings: any;
  staffList: any[];
  servicesList: any[];
  casesList: any[];
}

export default function AdminDashboardClient({
  profile,
  initialStats,
  initialAppointments,
  initialSettings,
  staffList,
  servicesList,
  casesList,
}: AdminDashboardClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "overview" | "appointments" | "content" | "settings"
  >("overview");
  const [contentSubTab, setContentSubTab] = useState<
    "hours" | "staff" | "services" | "cases"
  >("hours");

  // Appointments state
  const [appointments, setAppointments] = useState<any[]>(initialAppointments);
  const [stats, setStats] = useState(initialStats);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);

  // Modal / Drawer edit states
  const [isUpdating, setIsUpdating] = useState(false);
  const [triageNotes, setTriageNotes] = useState("");
  const [triageStatus, setTriageStatus] = useState<AppointmentStatus>("pending");
  const [isUrgent, setIsUrgent] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState(initialSettings || {});
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsFeedback, setSettingsFeedback] = useState<string | null>(null);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // ── CMS Live Data & Modals State ──────────────────────────────────────────
  const [liveStaff, setLiveStaff] = useState<any[]>(staffList);
  const [liveServices, setLiveServices] = useState<any[]>(servicesList);
  const [liveCases, setLiveCases] = useState<any[]>(casesList);

  useEffect(() => { setLiveStaff(staffList); }, [staffList]);
  useEffect(() => { setLiveServices(servicesList); }, [servicesList]);
  useEffect(() => { setLiveCases(casesList); }, [casesList]);

  const [cmsModalOpen, setCmsModalOpen] = useState(false);
  const [cmsModalType, setCmsModalType] = useState<"staff" | "service" | "case">("staff");
  const [cmsModalMode, setCmsModalMode] = useState<"create" | "edit">("create");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isCmsSaving, setIsCmsSaving] = useState(false);
  const [cmsFeedback, setCmsFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Forms
  const [staffForm, setStaffForm] = useState({
    name: "",
    credentials: "",
    role: "",
    gender_badge: "",
    bio: "",
    specialties: "",
    image_path: "",
    image_alt: "",
    sort_order: 10,
    is_published: true,
  });

  const [serviceForm, setServiceForm] = useState({
    service_number: "",
    title: "",
    category: "Oral Surgery" as ServiceCategory,
    short_desc: "",
    full_desc: "",
    indications: "",
    clinical_approach: "",
    image_path: "",
    image_alt: "",
    sort_order: 10,
    is_published: true,
  });

  const [caseForm, setCaseForm] = useState({
    title: "",
    category: "Oral Surgery",
    modality: "",
    diagnostic_method: "",
    clinical_summary: "",
    procedure_notes: "",
    image_path: "",
    image_alt: "",
    sort_order: 10,
    is_published: true,
  });

  // Modal open helpers
  const handleOpenCreateStaff = () => {
    setStaffForm({
      name: "",
      credentials: "",
      role: "",
      gender_badge: "",
      bio: "",
      specialties: "",
      image_path: "",
      image_alt: "",
      sort_order: (liveStaff.length + 1) * 10,
      is_published: true,
    });
    setEditingItemId(null);
    setCmsModalMode("create");
    setCmsModalType("staff");
    setCmsFeedback(null);
    setCmsModalOpen(true);
  };

  const handleOpenEditStaff = (item: any) => {
    setStaffForm({
      name: item.name || "",
      credentials: item.credentials || "",
      role: item.role || "",
      gender_badge: item.gender_badge || item.genderBadge || "",
      bio: item.bio || "",
      specialties: Array.isArray(item.specialties) ? item.specialties.join("\n") : "",
      image_path: item.image_path || item.image || "",
      image_alt: item.image_alt || item.alt || "",
      sort_order: item.sort_order ?? 10,
      is_published: item.is_published ?? true,
    });
    setEditingItemId(item._dbId || item.id);
    setCmsModalMode("edit");
    setCmsModalType("staff");
    setCmsFeedback(null);
    setCmsModalOpen(true);
  };

  const handleOpenCreateService = () => {
    const nextNum = String(liveServices.length + 1).padStart(2, "0");
    setServiceForm({
      service_number: nextNum,
      title: "",
      category: "Oral Surgery",
      short_desc: "",
      full_desc: "",
      indications: "",
      clinical_approach: "",
      image_path: "",
      image_alt: "",
      sort_order: (liveServices.length + 1) * 10,
      is_published: true,
    });
    setEditingItemId(null);
    setCmsModalMode("create");
    setCmsModalType("service");
    setCmsFeedback(null);
    setCmsModalOpen(true);
  };

  const handleOpenEditService = (item: any) => {
    setServiceForm({
      service_number: item.service_number || item.number || "",
      title: item.title || "",
      category: item.category || "Oral Surgery",
      short_desc: item.short_desc || item.shortDesc || "",
      full_desc: item.full_desc || item.fullDesc || "",
      indications: Array.isArray(item.indications) ? item.indications.join("\n") : "",
      clinical_approach: item.clinical_approach || item.clinicalApproach || "",
      image_path: item.image_path || item.image || "",
      image_alt: item.image_alt || item.alt || "",
      sort_order: item.sort_order ?? 10,
      is_published: item.is_published ?? true,
    });
    setEditingItemId(item._dbId || item.id);
    setCmsModalMode("edit");
    setCmsModalType("service");
    setCmsFeedback(null);
    setCmsModalOpen(true);
  };

  const handleOpenCreateCase = () => {
    setCaseForm({
      title: "",
      category: "Oral Surgery",
      modality: "",
      diagnostic_method: "",
      clinical_summary: "",
      procedure_notes: "",
      image_path: "",
      image_alt: "",
      sort_order: (liveCases.length + 1) * 10,
      is_published: true,
    });
    setEditingItemId(null);
    setCmsModalMode("create");
    setCmsModalType("case");
    setCmsFeedback(null);
    setCmsModalOpen(true);
  };

  const handleOpenEditCase = (item: any) => {
    setCaseForm({
      title: item.title || "",
      category: item.category || "",
      modality: item.modality || "",
      diagnostic_method: item.diagnostic_method || item.diagnosticMethod || "",
      clinical_summary: item.clinical_summary || item.clinicalSummary || "",
      procedure_notes: item.procedure_notes || item.procedureNotes || "",
      image_path: item.image_path || item.image || "",
      image_alt: item.image_alt || item.alt || "",
      sort_order: item.sort_order ?? 10,
      is_published: item.is_published ?? true,
    });
    setEditingItemId(item._dbId || item.id);
    setCmsModalMode("edit");
    setCmsModalType("case");
    setCmsFeedback(null);
    setCmsModalOpen(true);
  };

  // Client-side image optimization (resizes large camera photos to max 1920px & WebP to stay well under Vercel 4.5MB limit)
  const optimizeImageForUpload = async (file: File): Promise<File> => {
    if (!file.type.startsWith("image/") || file.type === "image/svg+xml" || file.type === "image/gif") {
      return file;
    }
    if (file.size < 750 * 1024) {
      return file;
    }

    return new Promise((resolve) => {
      const img = document.createElement("img");
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const maxDim = 1920;
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < file.size) {
              const ext = blob.type === "image/webp" ? "webp" : "jpg";
              const newName = file.name.replace(/\.[^/.]+$/, `.${ext}`);
              const optimized = new File([blob], newName, { type: blob.type });
              resolve(optimized);
            } else {
              resolve(file);
            }
          },
          "image/webp",
          0.85
        );
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(file);
      };
      img.src = objectUrl;
    });
  };

  // Image Upload handler
  const handleCmsFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const originalFile = e.target.files?.[0];
    if (!originalFile) return;

    setIsUploading(true);
    setCmsFeedback(null);
    try {
      const file = await optimizeImageForUpload(originalFile);

      if (file.size > 4.5 * 1024 * 1024) {
        setCmsFeedback({
          type: "error",
          text: `Image "${file.name}" is ${(file.size / (1024 * 1024)).toFixed(1)}MB. Vercel allows uploads up to 4.5MB. Please choose or compress to under 4.5MB.`,
        });
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      const res = await uploadClinicMediaAction(formData);
      if (res && res.success && res.data?.url) {
        if (cmsModalType === "staff") {
          setStaffForm((prev) => ({ ...prev, image_path: res.data!.url }));
        } else if (cmsModalType === "service") {
          setServiceForm((prev) => ({ ...prev, image_path: res.data!.url }));
        } else if (cmsModalType === "case") {
          setCaseForm((prev) => ({ ...prev, image_path: res.data!.url }));
        }
        setCmsFeedback({ type: "success", text: "Image successfully uploaded to clinic-media storage." });
      } else {
        const errorMsg = res?.message || "Failed to upload image. Unexpected empty response from server.";
        setCmsFeedback({ type: "error", text: errorMsg });
      }
    } catch (err: any) {
      setCmsFeedback({ type: "error", text: err?.message ? `Upload error: ${err.message}` : "Upload network error occurred." });
    } finally {
      setIsUploading(false);
      // Reset input element value so re-selecting the same file will trigger onChange again
      if (e.target) {
        e.target.value = "";
      }
    }
  };

  // Save CMS item
  const handleSaveCmsItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCmsSaving(true);
    setCmsFeedback(null);

    try {
      if (cmsModalType === "staff") {
        const payload = {
          name: staffForm.name,
          credentials: staffForm.credentials,
          role: staffForm.role,
          gender_badge: staffForm.gender_badge || undefined,
          bio: staffForm.bio,
          specialties: staffForm.specialties
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
          image_path: staffForm.image_path,
          image_alt: staffForm.image_alt,
          sort_order: Number(staffForm.sort_order) || 10,
          is_published: staffForm.is_published,
        };

        if (cmsModalMode === "create") {
          const res = await createStaffAction(payload);
          if (res?.success) {
            setCmsFeedback({ type: "success", text: res.message || "Faculty member added successfully." });
            const ref = await getAdminStaffAction();
            if (ref?.data && ref.data.length > 0) {
              setLiveStaff(ref.data);
            } else if (res.data) {
              setLiveStaff((prev) => [...prev, res.data]);
            }
            setTimeout(() => setCmsModalOpen(false), 800);
          } else {
            setCmsFeedback({ type: "error", text: res?.message || "Failed to create faculty member." });
          }
        } else if (editingItemId) {
          const res = await updateStaffAction(editingItemId, payload);
          if (res?.success) {
            setCmsFeedback({ type: "success", text: res.message || "Faculty member updated successfully." });
            const ref = await getAdminStaffAction();
            if (ref?.data && ref.data.length > 0) {
              setLiveStaff(ref.data);
            } else if (res.data) {
              setLiveStaff((prev) =>
                prev.map((m) =>
                  m.id === editingItemId || m._dbId === editingItemId || m.slug === editingItemId
                    ? { ...m, ...res.data }
                    : m
                )
              );
            }
            setTimeout(() => setCmsModalOpen(false), 800);
          } else {
            setCmsFeedback({ type: "error", text: res?.message || "Failed to update faculty member." });
          }
        }
      } else if (cmsModalType === "service") {
        const payload = {
          service_number: serviceForm.service_number,
          title: serviceForm.title,
          category: serviceForm.category,
          short_desc: serviceForm.short_desc,
          full_desc: serviceForm.full_desc,
          indications: serviceForm.indications
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
          clinical_approach: serviceForm.clinical_approach || undefined,
          image_path: serviceForm.image_path,
          image_alt: serviceForm.image_alt,
          sort_order: Number(serviceForm.sort_order) || 10,
          is_published: serviceForm.is_published,
        };

        if (cmsModalMode === "create") {
          const res = await createServiceAction(payload);
          if (res?.success) {
            setCmsFeedback({ type: "success", text: res.message || "Procedure added successfully." });
            const ref = await getAdminServicesAction();
            if (ref?.data && ref.data.length > 0) {
              setLiveServices(ref.data);
            } else if (res.data) {
              setLiveServices((prev) => [...prev, res.data]);
            }
            setTimeout(() => setCmsModalOpen(false), 800);
          } else {
            setCmsFeedback({ type: "error", text: res?.message || "Failed to create procedure." });
          }
        } else if (editingItemId) {
          const res = await updateServiceAction(editingItemId, payload);
          if (res?.success) {
            setCmsFeedback({ type: "success", text: res.message || "Procedure updated successfully." });
            const ref = await getAdminServicesAction();
            if (ref?.data && ref.data.length > 0) {
              setLiveServices(ref.data);
            } else if (res.data) {
              setLiveServices((prev) =>
                prev.map((s) =>
                  s.id === editingItemId || s._dbId === editingItemId || s.slug === editingItemId
                    ? { ...s, ...res.data }
                    : s
                )
              );
            }
            setTimeout(() => setCmsModalOpen(false), 800);
          } else {
            setCmsFeedback({ type: "error", text: res?.message || "Failed to update procedure." });
          }
        }
      } else if (cmsModalType === "case") {
        const payload = {
          title: caseForm.title,
          category: caseForm.category,
          modality: caseForm.modality,
          diagnostic_method: caseForm.diagnostic_method,
          clinical_summary: caseForm.clinical_summary,
          procedure_notes: caseForm.procedure_notes,
          image_path: caseForm.image_path,
          image_alt: caseForm.image_alt,
          sort_order: Number(caseForm.sort_order) || 10,
          is_published: caseForm.is_published,
        };

        if (cmsModalMode === "create") {
          const res = await createCaseAction(payload);
          if (res?.success) {
            setCmsFeedback({ type: "success", text: res.message || "Case added successfully." });
            const ref = await getAdminCasesAction();
            if (ref?.data && ref.data.length > 0) {
              setLiveCases(ref.data);
            } else if (res.data) {
              setLiveCases((prev) => [...prev, res.data]);
            }
            setTimeout(() => setCmsModalOpen(false), 800);
          } else {
            setCmsFeedback({ type: "error", text: res?.message || "Failed to create case." });
          }
        } else if (editingItemId) {
          const res = await updateCaseAction(editingItemId, payload);
          if (res?.success) {
            setCmsFeedback({ type: "success", text: res.message || "Case updated successfully." });
            const ref = await getAdminCasesAction();
            if (ref?.data && ref.data.length > 0) {
              setLiveCases(ref.data);
            } else if (res.data) {
              setLiveCases((prev) =>
                prev.map((c) =>
                  c.id === editingItemId || c._dbId === editingItemId || c.slug === editingItemId
                    ? { ...c, ...res.data }
                    : c
                )
              );
            }
            setTimeout(() => setCmsModalOpen(false), 800);
          } else {
            setCmsFeedback({ type: "error", text: res?.message || "Failed to update case." });
          }
        }
      }
    } catch (err: any) {
      setCmsFeedback({ type: "error", text: err?.message || "Operation failed." });
    } finally {
      setIsCmsSaving(false);
    }
  };

  // Toggle publish
  const handleTogglePublishStaff = async (id: string, current: boolean) => {
    try {
      const res = await updateStaffAction(id, { is_published: !current });
      if (res?.success) {
        setLiveStaff((prev) =>
          prev.map((m) =>
            m.id === id || m._dbId === id || m.slug === id ? { ...m, is_published: !current } : m
          )
        );
      } else {
        alert(res?.message || "Failed to update publication status.");
      }
    } catch (e: any) {
      alert(e?.message || "Error updating publication status.");
    }
  };

  const handleTogglePublishService = async (id: string, current: boolean) => {
    try {
      const res = await updateServiceAction(id, { is_published: !current });
      if (res?.success) {
        setLiveServices((prev) =>
          prev.map((s) =>
            s.id === id || s._dbId === id || s.slug === id ? { ...s, is_published: !current } : s
          )
        );
      } else {
        alert(res?.message || "Failed to update publication status.");
      }
    } catch (e: any) {
      alert(e?.message || "Error updating publication status.");
    }
  };

  const handleTogglePublishCase = async (id: string, current: boolean) => {
    try {
      const res = await updateCaseAction(id, { is_published: !current });
      if (res?.success) {
        setLiveCases((prev) =>
          prev.map((c) =>
            c.id === id || c._dbId === id || c.slug === id ? { ...c, is_published: !current } : c
          )
        );
      } else {
        alert(res?.message || "Failed to update publication status.");
      }
    } catch (e: any) {
      alert(e?.message || "Error updating publication status.");
    }
  };

  // Delete handlers with confirmation
  const handleDeleteStaff = async (id: string) => {
    if (deleteConfirmId !== id) {
      setDeleteConfirmId(id);
      return;
    }
    try {
      const res = await deleteStaffAction(id);
      if (res?.success) {
        setLiveStaff((prev) => prev.filter((m) => m.id !== id && m._dbId !== id && m.slug !== id));
        setDeleteConfirmId(null);
      } else {
        alert(res?.message || "Failed to delete staff member.");
      }
    } catch (e: any) {
      alert(e?.message || "Error deleting staff member.");
    }
  };

  const handleDeleteService = async (id: string) => {
    if (deleteConfirmId !== id) {
      setDeleteConfirmId(id);
      return;
    }
    try {
      const res = await deleteServiceAction(id);
      if (res?.success) {
        setLiveServices((prev) => prev.filter((s) => s.id !== id && s._dbId !== id && s.slug !== id));
        setDeleteConfirmId(null);
      } else {
        alert(res?.message || "Failed to delete service.");
      }
    } catch (e: any) {
      alert(e?.message || "Error deleting service.");
    }
  };

  const handleDeleteCase = async (id: string) => {
    if (deleteConfirmId !== id) {
      setDeleteConfirmId(id);
      return;
    }
    try {
      const res = await deleteCaseAction(id);
      if (res?.success) {
        setLiveCases((prev) => prev.filter((c) => c.id !== id && c._dbId !== id && c.slug !== id));
        setDeleteConfirmId(null);
      } else {
        alert(res?.message || "Failed to delete case.");
      }
    } catch (e: any) {
      alert(e?.message || "Error deleting case.");
    }
  };

  // Open drawer
  const handleOpenAppointment = (app: any) => {
    setSelectedAppointment(app);
    setTriageNotes(app.internal_notes || "");
    setTriageStatus(app.status);
    setIsUrgent(Boolean(app.is_triage_urgent));
    setActionFeedback(null);
  };

  // Refresh appointments
  const refreshAppointments = async () => {
    setIsRefreshing(true);
    try {
      const res = await getAppointmentsAction({
        status: statusFilter,
        date: dateFilter,
        search: searchQuery,
      });
      if (res.success && res.data) {
        setAppointments(res.data);
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  // Filtered in-memory list
  const filteredAppointments = appointments.filter((app) => {
    if (statusFilter !== "all" && app.status !== statusFilter) return false;
    if (dateFilter && app.preferred_date !== dateFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = (app.patient_name || "").toLowerCase().includes(q);
      const matchPhone = (app.patient_phone || "").toLowerCase().includes(q);
      const matchConcern = (app.dental_concern || "").toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchConcern) return false;
    }
    return true;
  });

  // Save Triage Updates
  const handleSaveTriage = async () => {
    if (!selectedAppointment) return;
    setIsUpdating(true);
    setActionFeedback(null);

    try {
      const res = await updateAppointmentStatusAction({
        id: selectedAppointment.id,
        status: triageStatus,
        internalNotes: triageNotes,
        isTriageUrgent: isUrgent,
      });

      if (res.success) {
        setActionFeedback({ type: "success", text: res.message });
        // Update local state
        setAppointments((prev) =>
          prev.map((a) =>
            a.id === selectedAppointment.id
              ? {
                  ...a,
                  status: triageStatus,
                  internal_notes: triageNotes,
                  is_triage_urgent: isUrgent,
                }
              : a
          )
        );
        // Update stats
        if (selectedAppointment.status !== triageStatus) {
          setStats((prev) => ({
            ...prev,
            [selectedAppointment.status]: Math.max(0, (prev as any)[selectedAppointment.status] - 1),
            [triageStatus]: ((prev as any)[triageStatus] || 0) + 1,
          }));
        }
        setTimeout(() => setSelectedAppointment(null), 1200);
      } else {
        setActionFeedback({ type: "error", text: res.message });
      }
    } catch (err: unknown) {
      setActionFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to update appointment.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete appointment
  const handleDeleteAppointment = async (id: string) => {
    if (!confirm("Are you certain you want to permanently delete this appointment record? This action cannot be undone.")) {
      return;
    }
    setIsUpdating(true);
    try {
      const res = await deleteAppointmentAction(id);
      if (res.success) {
        setAppointments((prev) => prev.filter((a) => a.id !== id));
        setSelectedAppointment(null);
      } else {
        alert(res.message);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  // Save clinic settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setSettingsFeedback(null);
    try {
      const res = await updateClinicSettingsAction(settingsForm);
      setSettingsFeedback(res.message);
    } catch (err: unknown) {
      setSettingsFeedback(err instanceof Error ? err.message : "Failed to save settings.");
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Sign out & session activity state
  const [isSigningOut, setIsSigningOut] = useState(false);
  const lastActiveRef = useRef<number>(Date.now());
  const lastPingRef = useRef<number>(Date.now());

  // Explicit session departure and idle timeout listener
  useEffect(() => {
    const TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes default policy
    const PING_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes heartbeat interval

    const handleUserInteraction = () => {
      const now = Date.now();
      lastActiveRef.current = now;
      if (now - lastPingRef.current > PING_INTERVAL_MS) {
        lastPingRef.current = now;
        touchAdminSessionAction().catch(() => {});
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const elapsed = Date.now() - lastActiveRef.current;
        if (elapsed > TIMEOUT_MS) {
          handleSignOut("timeout");
        } else {
          handleUserInteraction();
        }
      } else {
        lastActiveRef.current = Date.now();
      }
    };

    const idleInterval = setInterval(() => {
      if (Date.now() - lastActiveRef.current > TIMEOUT_MS) {
        handleSignOut("timeout");
      }
    }, 30000);

    window.addEventListener("mousemove", handleUserInteraction, { passive: true });
    window.addEventListener("keydown", handleUserInteraction, { passive: true });
    window.addEventListener("touchstart", handleUserInteraction, { passive: true });
    window.addEventListener("scroll", handleUserInteraction, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(idleInterval);
      window.removeEventListener("mousemove", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
      window.removeEventListener("scroll", handleUserInteraction);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Sign out
  const handleSignOut = async (reason?: string) => {
    setIsSigningOut(true);
    try {
      await adminSignOutAction();
    } finally {
      const target = reason === "timeout" ? "/admin/login?reason=timeout" : "/admin/login";
      router.push(target);
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#202622]">
      {/* ─────────────────────────────────────────────────────────────
          1. TOP ADMIN CONTROL BAR
      ────────────────────────────────────────────────────────────── */}
      <header className="bg-[#103629] text-[#F7F5EF] border-b border-[#174635] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B69A61]" />
            <div>
              <span className="text-[10px] font-sans tracking-[0.2em] uppercase text-[#B69A61] font-semibold block">
                BMK Dental Clinic &bull; Admin Operations
              </span>
              <h1 className="font-serif text-lg text-[#F7F5EF] font-normal leading-tight">
                Clinical Director Triage Suite
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-xs font-sans">
            <div className="hidden md:flex items-center gap-2 bg-[#0A241B] border border-[#174635] px-3 py-1.5 text-ivory-200">
              <Shield className="w-3.5 h-3.5 text-[#B69A61]" />
              <span>
                {profile.full_name} ({profile.role.toUpperCase()})
              </span>
            </div>

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-ivory-300 hover:text-ivory-100 transition-colors px-2.5 py-1.5 border border-ivory-200/20"
            >
              <span>Public Website</span>
              <ExternalLink className="w-3 h-3 text-[#B69A61]" />
            </Link>

            <button
              onClick={() => handleSignOut()}
              disabled={isSigningOut}
              className="inline-flex items-center gap-1.5 bg-red-950/40 hover:bg-red-900/60 disabled:opacity-50 text-red-200 border border-red-800/40 px-3 py-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isSigningOut ? "Signing Out..." : "Sign Out"}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 border-t border-[#174635]/80 overflow-x-auto">
          {[
            { id: "overview", label: "Overview", icon: Layers },
            { id: "appointments", label: "Appointment Inbox", icon: CalendarDays },
            { id: "content", label: "Content & CMS", icon: FileText },
            { id: "settings", label: "Clinic Settings", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3 text-xs font-sans uppercase tracking-[0.14em] font-medium transition-colors border-b-2 whitespace-nowrap ${
                  isActive
                    ? "border-[#B69A61] text-[#F7F5EF] bg-[#0A241B]"
                    : "border-transparent text-ivory-300 hover:text-ivory-100 hover:bg-[#103629]/60"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#B69A61]" : "text-ivory-400"}`} />
                <span>{tab.label}</span>
                {tab.id === "appointments" && stats.pending > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 bg-[#B69A61] text-[#103629] text-[10px] font-bold rounded-full">
                    {stats.pending}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN DASHBOARD CONTENT AREA
      ────────────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
        {/* ── TAB 1: OVERVIEW ── */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div
                onClick={() => {
                  setStatusFilter("pending");
                  setActiveTab("appointments");
                }}
                className="bg-[#EFECE3] border border-[#E4E0D6] p-6 space-y-2 cursor-pointer hover:border-[#B69A61] transition-all shadow-sm"
              >
                <div className="flex items-center justify-between text-xs font-sans text-[#707873]">
                  <span className="uppercase tracking-wider font-semibold text-[#B69A61]">
                    Pending Triage
                  </span>
                  <Clock className="w-4 h-4 text-[#B69A61]" />
                </div>
                <div className="font-serif text-4xl text-[#103629] font-normal">
                  {stats.pending}
                </div>
                <p className="text-[11px] text-[#545C57] font-sans font-light">
                  Awaiting phone triage &amp; slot verification
                </p>
              </div>

              <div
                onClick={() => {
                  setStatusFilter("confirmed");
                  setActiveTab("appointments");
                }}
                className="bg-[#EFECE3] border border-[#E4E0D6] p-6 space-y-2 cursor-pointer hover:border-[#103629] transition-all shadow-sm"
              >
                <div className="flex items-center justify-between text-xs font-sans text-[#707873]">
                  <span className="uppercase tracking-wider font-semibold text-emerald-800">
                    Confirmed Bookings
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                </div>
                <div className="font-serif text-4xl text-[#103629] font-normal">
                  {stats.confirmed}
                </div>
                <p className="text-[11px] text-[#545C57] font-sans font-light">
                  Confirmed clinical consultation appointments
                </p>
              </div>

              <div
                onClick={() => {
                  setStatusFilter("completed");
                  setActiveTab("appointments");
                }}
                className="bg-[#EFECE3] border border-[#E4E0D6] p-6 space-y-2 cursor-pointer hover:border-[#103629] transition-all shadow-sm"
              >
                <div className="flex items-center justify-between text-xs font-sans text-[#707873]">
                  <span className="uppercase tracking-wider font-semibold text-[#545C57]">
                    Completed Cases
                  </span>
                  <Check className="w-4 h-4 text-[#103629]" />
                </div>
                <div className="font-serif text-4xl text-[#103629] font-normal">
                  {stats.completed}
                </div>
                <p className="text-[11px] text-[#545C57] font-sans font-light">
                  Archived consultations &amp; treatments
                </p>
              </div>

              <div className="bg-[#EFECE3] border border-[#E4E0D6] p-6 space-y-2 shadow-sm">
                <div className="flex items-center justify-between text-xs font-sans text-[#707873]">
                  <span className="uppercase tracking-wider font-semibold text-[#707873]">
                    Total Requests Logged
                  </span>
                  <CalendarDays className="w-4 h-4 text-[#707873]" />
                </div>
                <div className="font-serif text-4xl text-[#103629] font-normal">
                  {stats.total}
                </div>
                <p className="text-[11px] text-[#545C57] font-sans font-light">
                  Lifetime patient appointment inquiries
                </p>
              </div>
            </div>

            {/* Quick Actions & Recent Incoming Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Recent Requests Feed */}
              <div className="lg:col-span-8 bg-[#EFECE3] border border-[#E4E0D6] p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#E4E0D6] pb-3">
                  <div>
                    <h2 className="font-serif text-xl text-[#103629] font-normal">
                      Recent Consultation Inquiries
                    </h2>
                    <p className="text-xs text-[#707873] font-sans">
                      Latest appointment submissions from patients
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("appointments")}
                    className="text-xs font-sans uppercase tracking-wider text-[#103629] hover:text-[#B69A61] font-semibold flex items-center gap-1"
                  >
                    <span>View Inbox</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {appointments.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#707873] font-sans">
                    No appointment requests logged yet.
                  </div>
                ) : (
                  <div className="divide-y divide-[#E4E0D6]">
                    {appointments.slice(0, 5).map((app) => (
                      <div
                        key={app.id}
                        onClick={() => handleOpenAppointment(app)}
                        className="py-3.5 flex items-center justify-between gap-4 hover:bg-[#FAF9F6] px-2 transition-colors cursor-pointer"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-serif text-base text-[#103629]">
                              {app.patient_name}
                            </span>
                            {app.is_triage_urgent && (
                              <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[9px] font-sans uppercase tracking-widest font-bold">
                                Urgent
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#707873] font-sans">
                            {app.preferred_date} &bull; {app.preferred_time_slot} &bull;{" "}
                            <span className="font-mono text-[#103629]">{app.patient_phone}</span>
                          </p>
                          <p className="text-xs text-[#545C57] font-sans italic line-clamp-1">
                            &ldquo;{app.dental_concern}&rdquo;
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <span
                            className={`inline-block px-2.5 py-1 text-[10px] font-sans uppercase tracking-widest font-semibold border ${
                              app.status === "pending"
                                ? "bg-amber-50 text-amber-900 border-amber-200"
                                : app.status === "confirmed"
                                ? "bg-emerald-50 text-emerald-900 border-emerald-200"
                                : app.status === "completed"
                                ? "bg-blue-50 text-blue-900 border-blue-200"
                                : "bg-gray-100 text-gray-700 border-gray-200"
                            }`}
                          >
                            {app.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Clinic Fast Facts / Settings Widget */}
              <div className="lg:col-span-4 bg-[#EFECE3] border border-[#E4E0D6] p-6 space-y-5">
                <div className="border-b border-[#E4E0D6] pb-3">
                  <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#B69A61] font-semibold block">
                    Practice Profile
                  </span>
                  <h3 className="font-serif text-xl text-[#103629] font-normal">
                    {initialSettings?.clinic_name || "BMK Dental Clinic"}
                  </h3>
                </div>

                <div className="space-y-3 text-xs font-sans text-[#545C57]">
                  <div className="flex items-start gap-2.5">
                    <Users className="w-4 h-4 text-[#103629] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#103629] block">Lead Surgeon:</strong>
                      <span>{initialSettings?.lead_surgeon || "Dr Vishal Lohana (FCPS, BDS)"}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-[#103629] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#103629] block">Verified Hours:</strong>
                      <span>{initialSettings?.opening_hours || "Mon–Sat: 4:00 PM – 10:00 PM (Sun Closed)"}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Phone className="w-4 h-4 text-[#103629] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#103629] block">Telephone:</strong>
                      <span>{initialSettings?.phone_display || "03332760510"}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#103629] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#103629] block">Location:</strong>
                      <span className="line-clamp-2">
                        {initialSettings?.address || "Quaid-E-Azam Medical Complex, Saddar, Hyderabad"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E4E0D6]">
                  <button
                    onClick={() => setActiveTab("settings")}
                    className="w-full py-2.5 bg-[#FAF9F6] hover:bg-[#FAF9F6]/80 text-[#103629] text-xs font-sans uppercase tracking-wider font-medium border border-[#E4E0D6] transition-colors"
                  >
                    Edit Clinic Configuration
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: APPOINTMENT INBOX ── */}
        {activeTab === "appointments" && (
          <div className="space-y-6">
            {/* Header & Controls */}
            <div className="bg-[#EFECE3] border border-[#E4E0D6] p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E0D6] pb-4">
                <div>
                  <h2 className="font-serif text-2xl text-[#103629] font-normal">
                    Appointment Triage Inbox
                  </h2>
                  <p className="text-xs text-[#707873] font-sans">
                    Review incoming consultation requests, verify availability by phone, and update booking status.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={refreshAppointments}
                    disabled={isRefreshing}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#FAF9F6] border border-[#E4E0D6] text-xs font-sans text-[#103629] hover:bg-[#FAF9F6]/70 transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#B69A61]" : ""}`} />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {/* Filters Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
                {/* Search */}
                <div className="sm:col-span-5 relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by patient name, phone, or concern..."
                    className="w-full px-3.5 py-2 pl-9 bg-[#FAF9F6] border border-[#E4E0D6] text-xs text-[#103629] focus:outline-none focus:border-[#B69A61]"
                  />
                  <Search className="w-3.5 h-3.5 text-[#707873] absolute left-3 top-2.5" />
                </div>

                {/* Status Pills */}
                <div className="sm:col-span-4 flex items-center gap-1 overflow-x-auto">
                  {["all", "pending", "confirmed", "completed", "cancelled"].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 text-xs font-sans uppercase tracking-wider transition-colors whitespace-nowrap ${
                        statusFilter === st
                          ? "bg-[#103629] text-[#F7F5EF] font-semibold"
                          : "bg-[#FAF9F6] text-[#545C57] border border-[#E4E0D6] hover:bg-[#FAF9F6]/60"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                {/* Date Filter */}
                <div className="sm:col-span-3">
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#FAF9F6] border border-[#E4E0D6] text-xs text-[#103629] focus:outline-none focus:border-[#B69A61]"
                  />
                </div>
              </div>
            </div>

            {/* Appointments Table */}
            <div className="bg-[#EFECE3] border border-[#E4E0D6] overflow-x-auto shadow-sm">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-[#103629] text-[#F7F5EF] text-[10px] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-3.5 pl-5">Patient Name</th>
                    <th className="p-3.5">Contact Phone</th>
                    <th className="p-3.5">Requested Date</th>
                    <th className="p-3.5">Time Slot</th>
                    <th className="p-3.5">Clinical Concern</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 pr-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E0D6]">
                  {filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-10 text-center text-xs text-[#707873]">
                        No appointment records match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredAppointments.map((app) => (
                      <tr
                        key={app.id}
                        onClick={() => handleOpenAppointment(app)}
                        className="hover:bg-[#FAF9F6] transition-colors cursor-pointer group"
                      >
                        <td className="p-3.5 pl-5 font-serif text-sm font-medium text-[#103629]">
                          <div className="flex items-center gap-1.5">
                            <span>{app.patient_name}</span>
                            {app.is_triage_urgent && (
                              <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" title="Urgent Clinical Case" />
                            )}
                          </div>
                        </td>
                        <td className="p-3.5 font-mono text-[#103629]">
                          <a
                            href={`tel:${app.patient_phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="underline hover:text-[#B69A61]"
                          >
                            {app.patient_phone}
                          </a>
                        </td>
                        <td className="p-3.5 font-medium text-[#202622]">{app.preferred_date}</td>
                        <td className="p-3.5 text-[#545C57]">{app.preferred_time_slot}</td>
                        <td className="p-3.5 text-[#545C57] max-w-xs truncate italic">
                          {app.dental_concern}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`inline-block px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-bold border ${
                              app.status === "pending"
                                ? "bg-amber-50 text-amber-900 border-amber-200"
                                : app.status === "confirmed"
                                ? "bg-emerald-50 text-emerald-900 border-emerald-200"
                                : app.status === "completed"
                                ? "bg-blue-50 text-blue-900 border-blue-200"
                                : "bg-gray-100 text-gray-700 border-gray-200"
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="p-3.5 pr-5 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenAppointment(app);
                            }}
                            className="px-2.5 py-1 bg-[#103629] text-[#F7F5EF] text-[10px] uppercase tracking-widest font-medium hover:bg-[#174635] transition-colors"
                          >
                            Triage
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB 3: CONTENT & CMS ── */}
        {activeTab === "content" && (
          <div className="space-y-6">
            <div className="bg-[#EFECE3] border border-[#E4E0D6] p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E0D6] pb-4">
                <div>
                  <h2 className="font-serif text-2xl text-[#103629] font-normal">
                    Clinical Content Management (CMS)
                  </h2>
                  <p className="text-xs text-[#707873] font-sans">
                    Manage team qualifications, surgical services, documented cases, and clinic hours.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {[
                    { id: "hours", label: "Clinic Profile" },
                    { id: "staff", label: `Faculty (${liveStaff.length})` },
                    { id: "services", label: `Services (${liveServices.length})` },
                    { id: "cases", label: `Cases (${liveCases.length})` },
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setContentSubTab(sub.id as any)}
                      className={`px-3 py-1.5 text-xs font-sans uppercase tracking-wider transition-colors ${
                        contentSubTab === sub.id
                          ? "bg-[#103629] text-[#F7F5EF] font-semibold"
                          : "bg-[#FAF9F6] text-[#545C57] border border-[#E4E0D6] hover:bg-[#FAF9F6]/60"
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subtab: Hours & Clinic Details */}
              {contentSubTab === "hours" && (
                <form onSubmit={handleSaveSettings} className="space-y-6 pt-6">
                  {settingsFeedback && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-sans">
                      {settingsFeedback}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-sans uppercase tracking-wider text-[#103629] font-medium mb-1">
                        Clinic Official Name
                      </label>
                      <input
                        type="text"
                        value={settingsForm.clinic_name || ""}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, clinic_name: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E4E0D6] text-xs text-[#103629] focus:outline-none focus:border-[#B69A61]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-sans uppercase tracking-wider text-[#103629] font-medium mb-1">
                        Lead Surgeon &amp; Credentials
                      </label>
                      <input
                        type="text"
                        value={settingsForm.lead_surgeon || ""}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, lead_surgeon: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E4E0D6] text-xs text-[#103629] focus:outline-none focus:border-[#B69A61]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-sans uppercase tracking-wider text-[#103629] font-medium mb-1">
                        Phone Number Display
                      </label>
                      <input
                        type="text"
                        value={settingsForm.phone_display || ""}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, phone_display: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E4E0D6] text-xs text-[#103629] focus:outline-none focus:border-[#B69A61]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-sans uppercase tracking-wider text-[#103629] font-medium mb-1">
                        Operating Hours Schedule
                      </label>
                      <input
                        type="text"
                        value={settingsForm.opening_hours || ""}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, opening_hours: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E4E0D6] text-xs text-[#103629] focus:outline-none focus:border-[#B69A61]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-sans uppercase tracking-wider text-[#103629] font-medium mb-1">
                        Physical Clinic Address
                      </label>
                      <input
                        type="text"
                        value={settingsForm.address || ""}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, address: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E4E0D6] text-xs text-[#103629] focus:outline-none focus:border-[#B69A61]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-sans uppercase tracking-wider text-[#103629] font-medium mb-1">
                        Emergency Care Notice
                      </label>
                      <textarea
                        rows={2}
                        value={settingsForm.emergency_note || ""}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, emergency_note: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E4E0D6] text-xs text-[#103629] focus:outline-none focus:border-[#B69A61]"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSavingSettings}
                      className="inline-flex items-center gap-2 bg-[#103629] hover:bg-[#174635] text-[#F7F5EF] px-6 py-3 text-xs font-sans uppercase tracking-[0.16em] font-medium transition-all disabled:opacity-50"
                    >
                      <span>{isSavingSettings ? "Saving Settings..." : "Update Clinic Profile"}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Subtab: Staff Directory with full CRUD */}
              {contentSubTab === "staff" && (
                <div className="pt-6 space-y-4">
                  <div className="flex items-center justify-between pb-2">
                    <span className="text-xs font-sans text-[#707873]">
                      Faculty roster actively displayed on public About and Home pages.
                    </span>
                    <button
                      type="button"
                      onClick={handleOpenCreateStaff}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#103629] text-[#F7F5EF] text-xs font-sans uppercase tracking-wider hover:bg-[#174635] transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Faculty Member</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {liveStaff.map((m) => {
                      const itemId = m._dbId || m.id;
                      const isPublished = m.is_published !== false;
                      const isConfirmingDelete = deleteConfirmId === itemId;

                      return (
                        <div
                          key={itemId}
                          className="p-5 bg-[#FAF9F6] border border-[#E4E0D6] flex flex-col justify-between gap-4"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border border-[#E4E0D6] bg-[#103629]">
                              <img
                                src={m.image_path || m.image}
                                alt={m.name}
                                className="w-full h-full object-cover object-top"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <h4 className="font-serif text-lg text-[#103629] truncate">{m.name}</h4>
                                <button
                                  type="button"
                                  onClick={() => handleTogglePublishStaff(itemId, isPublished)}
                                  className={`px-2 py-0.5 text-[9px] font-mono uppercase font-bold shrink-0 transition-colors ${
                                    isPublished
                                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                      : "bg-amber-100 text-amber-800 border border-amber-200"
                                  }`}
                                  title="Click to toggle publish status"
                                >
                                  {isPublished ? "Published" : "Draft"}
                                </button>
                              </div>
                              <p className="text-xs font-sans text-[#B69A61] font-semibold">
                                {m.credentials} &bull; {m.role}
                              </p>
                              {(m.gender_badge || m.genderBadge) && (
                                <span className="inline-block mt-0.5 text-[10px] font-mono bg-[#EFECE3] px-1.5 py-0.2 text-[#545C57]">
                                  {m.gender_badge || m.genderBadge}
                                </span>
                              )}
                              <p className="text-xs text-[#707873] font-sans mt-1 line-clamp-2">
                                {m.bio}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-[#E4E0D6]/80 text-xs">
                            <span className="text-[10px] font-mono text-[#707873]">
                              Sort Order: {m.sort_order ?? 10}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleOpenEditStaff(m)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-sans text-[#103629] bg-[#EFECE3] hover:bg-[#E4E0D6] transition-colors"
                              >
                                <Pencil className="w-3 h-3 text-[#B69A61]" />
                                <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteStaff(itemId)}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-sans transition-colors ${
                                  isConfirmingDelete
                                    ? "bg-red-700 text-white font-bold"
                                    : "text-red-700 bg-red-50 hover:bg-red-100"
                                }`}
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>{isConfirmingDelete ? "Confirm Delete?" : "Delete"}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Subtab: Services with full CRUD */}
              {contentSubTab === "services" && (
                <div className="pt-6 space-y-4">
                  <div className="flex items-center justify-between pb-2">
                    <span className="text-xs font-sans text-[#707873]">
                      Clinical services listed on Directory and Home pages.
                    </span>
                    <button
                      type="button"
                      onClick={handleOpenCreateService}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#103629] text-[#F7F5EF] text-xs font-sans uppercase tracking-wider hover:bg-[#174635] transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Service</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {liveServices.map((s) => {
                      const itemId = s._dbId || s.id;
                      const isPublished = s.is_published !== false;
                      const isConfirmingDelete = deleteConfirmId === itemId;

                      return (
                        <div
                          key={itemId}
                          className="p-5 bg-[#FAF9F6] border border-[#E4E0D6] flex flex-col justify-between gap-3"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-14 h-14 bg-[#103629] shrink-0 overflow-hidden border border-[#E4E0D6]">
                              <img
                                src={s.image_path || s.image}
                                alt={s.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-sans uppercase tracking-wider text-[#B69A61] font-bold">
                                  {s.category} &bull; #{s.service_number || s.number}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleTogglePublishService(itemId, isPublished)}
                                  className={`px-2 py-0.5 text-[9px] font-mono uppercase font-bold shrink-0 transition-colors ${
                                    isPublished
                                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                      : "bg-amber-100 text-amber-800 border border-amber-200"
                                  }`}
                                  title="Click to toggle publish status"
                                >
                                  {isPublished ? "Published" : "Draft"}
                                </button>
                              </div>
                              <h4 className="font-serif text-base text-[#103629] mt-0.5 truncate">{s.title}</h4>
                              <p className="text-xs text-[#707873] font-sans line-clamp-2 mt-1">
                                {s.short_desc || s.shortDesc}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-[#E4E0D6]/80 text-xs">
                            <span className="text-[10px] font-mono text-[#707873]">
                              Sort Order: {s.sort_order ?? 10}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleOpenEditService(s)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-sans text-[#103629] bg-[#EFECE3] hover:bg-[#E4E0D6] transition-colors"
                              >
                                <Pencil className="w-3 h-3 text-[#B69A61]" />
                                <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteService(itemId)}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-sans transition-colors ${
                                  isConfirmingDelete
                                    ? "bg-red-700 text-white font-bold"
                                    : "text-red-700 bg-red-50 hover:bg-red-100"
                                }`}
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>{isConfirmingDelete ? "Confirm Delete?" : "Delete"}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Subtab: Cases with full CRUD */}
              {contentSubTab === "cases" && (
                <div className="pt-6 space-y-4">
                  <div className="flex items-center justify-between pb-2">
                    <span className="text-xs font-sans text-[#707873]">
                      Clinical cases displayed on public Work / Case Archive page.
                    </span>
                    <button
                      type="button"
                      onClick={handleOpenCreateCase}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#103629] text-[#F7F5EF] text-xs font-sans uppercase tracking-wider hover:bg-[#174635] transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Clinical Case</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {liveCases.map((c) => {
                      const itemId = c._dbId || c.id;
                      const isPublished = c.is_published !== false;
                      const isConfirmingDelete = deleteConfirmId === itemId;

                      return (
                        <div
                          key={itemId}
                          className="p-5 bg-[#FAF9F6] border border-[#E4E0D6] flex flex-col justify-between gap-3"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-[#103629] shrink-0 overflow-hidden border border-[#E4E0D6]">
                              <img
                                src={c.image_path || c.image}
                                alt={c.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-sans uppercase tracking-wider text-[#B69A61] font-bold">
                                  {c.category} &bull; {c.modality}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleTogglePublishCase(itemId, isPublished)}
                                  className={`px-2 py-0.5 text-[9px] font-mono uppercase font-bold shrink-0 transition-colors ${
                                    isPublished
                                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                      : "bg-amber-100 text-amber-800 border border-amber-200"
                                  }`}
                                  title="Click to toggle publish status"
                                >
                                  {isPublished ? "Published" : "Draft"}
                                </button>
                              </div>
                              <h4 className="font-serif text-base text-[#103629] mt-0.5 truncate">{c.title}</h4>
                              <p className="text-xs text-[#707873] font-sans line-clamp-2 mt-1">
                                {c.clinical_summary || c.clinicalSummary}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-[#E4E0D6]/80 text-xs">
                            <span className="text-[10px] font-mono text-[#707873]">
                              Sort Order: {c.sort_order ?? 10}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleOpenEditCase(c)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-sans text-[#103629] bg-[#EFECE3] hover:bg-[#E4E0D6] transition-colors"
                              >
                                <Pencil className="w-3 h-3 text-[#B69A61]" />
                                <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCase(itemId)}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-sans transition-colors ${
                                  isConfirmingDelete
                                    ? "bg-red-700 text-white font-bold"
                                    : "text-red-700 bg-red-50 hover:bg-red-100"
                                }`}
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>{isConfirmingDelete ? "Confirm Delete?" : "Delete"}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 4: SETTINGS & SECURITY ── */}
        {activeTab === "settings" && (
          <div className="max-w-2xl bg-[#EFECE3] border border-[#E4E0D6] p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#B69A61] font-semibold block mb-1">
                Account &amp; Security
              </span>
              <h2 className="font-serif text-2xl text-[#103629] font-normal">
                Administrator Security Settings
              </h2>
              <p className="text-xs text-[#707873] font-sans pt-1">
                Active clinical administrator: <strong>{profile.email}</strong> ({profile.role})
              </p>
            </div>

            {passwordFeedback && (
              <div
                className={`p-4 text-xs font-sans flex items-start gap-3 border ${
                  passwordFeedback.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-red-50 text-red-800 border-red-200"
                }`}
              >
                {passwordFeedback.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                )}
                <div className="leading-relaxed">{passwordFeedback.text}</div>
              </div>
            )}

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setPasswordFeedback(null);

                if (!currentPassword) {
                  setPasswordFeedback({
                    type: "error",
                    text: "Current password is required to authorize this change.",
                  });
                  return;
                }

                if (newPassword.length < 8) {
                  setPasswordFeedback({
                    type: "error",
                    text: "New password must be at least 8 characters long.",
                  });
                  return;
                }

                if (newPassword !== confirmPassword) {
                  setPasswordFeedback({
                    type: "error",
                    text: "New password and confirmation password do not match.",
                  });
                  return;
                }

                if (currentPassword === newPassword) {
                  setPasswordFeedback({
                    type: "error",
                    text: "New password must be different from your current password.",
                  });
                  return;
                }

                setIsChangingPassword(true);
                try {
                  const res = await adminChangePasswordAction({
                    currentPassword,
                    newPassword,
                    confirmPassword,
                  });

                  if (res.success) {
                    setPasswordFeedback({ type: "success", text: res.message });
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setTimeout(() => {
                      router.push(res.redirectTo || "/admin/login?reason=password_changed");
                    }, 1500);
                  } else {
                    setPasswordFeedback({ type: "error", text: res.message });
                  }
                } catch (err: unknown) {
                  setPasswordFeedback({
                    type: "error",
                    text: err instanceof Error ? err.message : "Password update failed.",
                  });
                } finally {
                  setIsChangingPassword(false);
                }
              }}
              className="space-y-5 pt-4 border-t border-[#E4E0D6]"
              autoComplete="off"
            >
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#B69A61]" />
                <h3 className="font-serif text-lg text-[#103629]">Change Password</h3>
              </div>

              {/* 1. Verified Account Email (Read-only) */}
              <div>
                <label
                  htmlFor="settings-email"
                  className="block text-xs font-sans uppercase tracking-wider text-[#103629] font-medium mb-1.5"
                >
                  Administrator Email (Verified)
                </label>
                <div className="relative">
                  <input
                    id="settings-email"
                    type="email"
                    readOnly
                    value={profile.email}
                    className="w-full px-3.5 py-2.5 bg-[#E4E0D6]/50 border border-[#E4E0D6] text-xs font-mono text-[#545C57] cursor-not-allowed select-all"
                  />
                  <ShieldCheck className="w-4 h-4 text-[#B69A61] absolute right-3 top-3" />
                </div>
                <p className="mt-1 text-[11px] text-[#707873] font-sans">
                  Password changes apply directly to this authenticated Supabase administrator identity.
                </p>
              </div>

              {/* 2. Current Password */}
              <div>
                <label
                  htmlFor="settings-current-password"
                  className="block text-xs font-sans uppercase tracking-wider text-[#103629] font-medium mb-1.5"
                >
                  Current Password *
                </label>
                <div className="relative">
                  <input
                    id="settings-current-password"
                    name="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password to verify identity"
                    autoComplete="current-password"
                    className="w-full px-3.5 py-2.5 pr-10 bg-[#FAF9F6] border border-[#E4E0D6] text-xs text-[#103629] focus:outline-none focus:border-[#B69A61] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}
                    aria-pressed={showCurrentPassword}
                    className="absolute right-3 top-2.5 text-[#707873] hover:text-[#103629] transition-colors focus:outline-none"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 3. New Password */}
              <div>
                <label
                  htmlFor="settings-new-password"
                  className="block text-xs font-sans uppercase tracking-wider text-[#103629] font-medium mb-1.5"
                >
                  New Password (min 8 characters) *
                </label>
                <div className="relative">
                  <input
                    id="settings-new-password"
                    name="new-password"
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    autoComplete="new-password"
                    className="w-full px-3.5 py-2.5 pr-10 bg-[#FAF9F6] border border-[#E4E0D6] text-xs text-[#103629] focus:outline-none focus:border-[#B69A61] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                    aria-pressed={showNewPassword}
                    className="absolute right-3 top-2.5 text-[#707873] hover:text-[#103629] transition-colors focus:outline-none"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 4. Confirm Password */}
              <div>
                <label
                  htmlFor="settings-confirm-password"
                  className="block text-xs font-sans uppercase tracking-wider text-[#103629] font-medium mb-1.5"
                >
                  Confirm New Password *
                </label>
                <div className="relative">
                  <input
                    id="settings-confirm-password"
                    name="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    autoComplete="new-password"
                    className="w-full px-3.5 py-2.5 pr-10 bg-[#FAF9F6] border border-[#E4E0D6] text-xs text-[#103629] focus:outline-none focus:border-[#B69A61] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    aria-pressed={showConfirmPassword}
                    className="absolute right-3 top-2.5 text-[#707873] hover:text-[#103629] transition-colors focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Strength Guidelines */}
              <div className="p-3 bg-[#FAF9F6] border border-[#E4E0D6] text-[11px] font-sans text-[#707873] space-y-1">
                <p className="font-medium text-[#103629]">Password Security Guidelines:</p>
                <ul className="list-disc pl-4 space-y-0.5">
                  <li className={newPassword.length >= 8 ? "text-emerald-700 font-medium" : ""}>
                    Minimum 8 characters in length
                  </li>
                  <li className={/[a-zA-Z]/.test(newPassword) ? "text-emerald-700 font-medium" : ""}>
                    Contains alphabetic characters
                  </li>
                  <li className={/[0-9!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? "text-emerald-700 font-medium" : ""}>
                    Contains numbers or special characters
                  </li>
                  <li className={newPassword && confirmPassword && newPassword === confirmPassword ? "text-emerald-700 font-medium" : ""}>
                    Confirmation matches new password
                  </li>
                </ul>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={
                    isChangingPassword ||
                    !currentPassword ||
                    newPassword.length < 8 ||
                    newPassword !== confirmPassword
                  }
                  className="inline-flex items-center gap-2 bg-[#103629] hover:bg-[#174635] text-[#F7F5EF] px-6 py-3 text-xs font-sans uppercase tracking-[0.16em] font-medium transition-all disabled:opacity-50 shadow-sm"
                >
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#B69A61]" />
                      <span>Re-authenticating &amp; Updating...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-[#B69A61]" />
                      <span>Update Administrator Password</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* ─────────────────────────────────────────────────────────────
          3. APPOINTMENT TRIAGE DRAWER / MODAL
      ────────────────────────────────────────────────────────────── */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FAF9F6] border border-[#103629]/30 max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Drawer Header */}
            <div className="bg-[#103629] text-[#F7F5EF] p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#B69A61] font-semibold block">
                  Triage Consultation Request &bull; ID: {selectedAppointment.id.slice(0, 8).toUpperCase()}
                </span>
                <h3 className="font-serif text-2xl font-normal">
                  {selectedAppointment.patient_name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-ivory-300 hover:text-ivory-100 p-1 text-sm font-sans"
              >
                ✕
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs font-sans text-[#202622]">
              {actionFeedback && (
                <div
                  className={`p-4 text-xs font-sans flex items-start gap-2.5 ${
                    actionFeedback.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {actionFeedback.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <span>{actionFeedback.text}</span>
                </div>
              )}

              {/* Patient Details Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#EFECE3] border border-[#E4E0D6]">
                <div>
                  <span className="text-[#707873] uppercase text-[10px] tracking-wider block">
                    Contact Phone:
                  </span>
                  <a
                    href={`tel:${selectedAppointment.patient_phone}`}
                    className="font-mono text-sm font-semibold text-[#103629] underline"
                  >
                    {selectedAppointment.patient_phone}
                  </a>
                </div>

                <div>
                  <span className="text-[#707873] uppercase text-[10px] tracking-wider block">
                    Patient Email:
                  </span>
                  <span className="text-sm text-[#103629]">
                    {selectedAppointment.patient_email || "None provided"}
                  </span>
                </div>

                <div>
                  <span className="text-[#707873] uppercase text-[10px] tracking-wider block">
                    Requested Date:
                  </span>
                  <span className="text-sm font-medium text-[#103629]">
                    {selectedAppointment.preferred_date}
                  </span>
                </div>

                <div>
                  <span className="text-[#707873] uppercase text-[10px] tracking-wider block">
                    Requested Time Slot:
                  </span>
                  <span className="text-sm font-medium text-[#103629]">
                    {selectedAppointment.preferred_time_slot}
                  </span>
                </div>

                <div className="sm:col-span-2">
                  <span className="text-[#707873] uppercase text-[10px] tracking-wider block">
                    Submitted Clinical Concern:
                  </span>
                  <p className="mt-1 p-3 bg-[#FAF9F6] border-l-2 border-[#B69A61] italic text-xs leading-relaxed text-[#545C57]">
                    &ldquo;{selectedAppointment.dental_concern}&rdquo;
                  </p>
                </div>
              </div>

              {/* Triage Decision Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-sans uppercase tracking-wider text-[#103629] font-medium mb-1.5">
                    Triage Status
                  </label>
                  <select
                    value={triageStatus}
                    onChange={(e) => setTriageStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E4E0D6] text-xs font-sans text-[#103629] focus:outline-none focus:border-[#B69A61]"
                  >
                    <option value="pending">Pending (Awaiting telephone triage)</option>
                    <option value="confirmed">Confirmed (Verified &amp; scheduled with surgeon)</option>
                    <option value="completed">Completed (Treatment concluded)</option>
                    <option value="cancelled">Cancelled (Declined or patient unavailable)</option>
                  </select>
                  {triageStatus === "confirmed" && selectedAppointment.patient_email && (
                    <p className="text-[11px] text-emerald-700 font-sans mt-1">
                      &bull; Saving as <strong>Confirmed</strong> will automatically dispatch a confirmation email with directions to the patient ({selectedAppointment.patient_email}).
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-sans uppercase tracking-wider text-[#103629] font-medium mb-1.5">
                    Internal Clinical Notes (Restricted to Staff)
                  </label>
                  <textarea
                    rows={3}
                    value={triageNotes}
                    onChange={(e) => setTriageNotes(e.target.value)}
                    placeholder="Enter phone triage outcomes, clinical history, radiograph requirements, or doctor assignment notes..."
                    className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E4E0D6] text-xs text-[#103629] focus:outline-none focus:border-[#B69A61]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="urgent-check"
                    checked={isUrgent}
                    onChange={(e) => setIsUrgent(e.target.checked)}
                    className="w-4 h-4 text-[#103629] border-[#E4E0D6]"
                  />
                  <label htmlFor="urgent-check" className="text-xs font-sans text-[#103629] font-medium">
                    Flag as Urgent Surgical Priority (Acute trauma, severe infection, or hot tooth)
                  </label>
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 bg-[#EFECE3] border-t border-[#E4E0D6] flex items-center justify-between">
              {(profile.role === "admin" || profile.role === "surgeon") && (
                <button
                  onClick={() => handleDeleteAppointment(selectedAppointment.id)}
                  disabled={isUpdating}
                  className="inline-flex items-center gap-1.5 text-red-700 hover:text-red-900 text-xs font-sans uppercase tracking-wider font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Record</span>
                </button>
              )}

              <div className="flex items-center gap-3 ml-auto">
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="px-4 py-2 border border-[#E4E0D6] text-xs font-sans uppercase tracking-wider text-[#707873] hover:text-[#103629]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTriage}
                  disabled={isUpdating}
                  className="px-5 py-2 bg-[#103629] hover:bg-[#174635] text-[#F7F5EF] text-xs font-sans uppercase tracking-[0.14em] font-semibold transition-all disabled:opacity-50"
                >
                  {isUpdating ? "Saving Changes..." : "Save Triage Decision"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. CMS CONTENT EDIT / CREATE MODAL
      ────────────────────────────────────────────────────────────── */}
      {cmsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FAF9F6] border border-[#103629]/30 max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="bg-[#103629] text-[#F7F5EF] p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#B69A61] font-semibold block">
                  Content Management System &bull; {cmsModalType.toUpperCase()}
                </span>
                <h3 className="font-serif text-2xl font-normal">
                  {cmsModalType === "staff" &&
                    (cmsModalMode === "create" ? "Add New Faculty Member" : "Edit Faculty Member")}
                  {cmsModalType === "service" &&
                    (cmsModalMode === "create" ? "Add Clinical Service Procedure" : "Edit Service Procedure")}
                  {cmsModalType === "case" &&
                    (cmsModalMode === "create" ? "Add Documented Clinical Case" : "Edit Clinical Case")}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCmsModalOpen(false)}
                className="text-ivory-300 hover:text-ivory-100 p-1 text-sm font-sans"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveCmsItem} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 overflow-y-auto space-y-5 text-xs font-sans text-[#202622]">
                {cmsFeedback && (
                  <div
                    className={`p-3.5 text-xs font-sans flex items-start gap-2.5 ${
                      cmsFeedback.type === "success"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                  >
                    {cmsFeedback.type === "success" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    )}
                    <span>{cmsFeedback.text}</span>
                  </div>
                )}

                {/* ── STAFF FORM FIELDS ── */}
                {cmsModalType === "staff" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-sans uppercase tracking-wider text-[#103629] font-medium mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={staffForm.name}
                          onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                          placeholder="e.g. Dr. Vishal Lohana"
                          className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E4E0D6] text-xs text-[#103629] focus:outline-none focus:border-[#B69A61]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-sans uppercase tracking-wider text-[#103629] font-medium mb-1">
                          Credentials &amp; Degrees *
                        </label>
                        <input
                          type="text"
                          required
                          value={staffForm.credentials}
                          onChange={(e) => setStaffForm({ ...staffForm, credentials: e.target.value })}
                          placeholder="e.g. FCPS, BDS"
                          className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E4E0D6] text-xs text-[#103629] focus:outline-none focus:border-[#B69A61]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-sans uppercase tracking-wider text-[#103629] font-medium mb-1">
                          Role &amp; Clinical Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={staffForm.role}
                          onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                          placeholder="e.g. Consultant Oral & Maxillofacial Surgeon"
                          className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E4E0D6] text-xs text-[#103629] focus:outline-none focus:border-[#B69A61]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-sans uppercase tracking-wider text-[#103629] font-medium mb-1">
                          Gender / Distinction Badge
                        </label>
                        <input
                          type="text"
                          value={staffForm.gender_badge}
                          onChange={(e) => setStaffForm({ ...staffForm, gender_badge: e.target.value })}
                          placeholder="e.g. Female Dental Surgeon (optional)"
                          className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E4E0D6] text-xs text-[#103629] focus:outline-none focus:border-[#B69A61]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-sans uppercase tracking-wider text-[#103629] font-medium mb-1">
                          Sort Order
                        </label>
                        <input
                          type="number"
                          value={staffForm.sort_order}
                          onChange={(e) =>
                            setStaffForm({ ...staffForm, sort_order: parseInt(e.target.value, 10) || 0 })
                          }
                          className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E4E0D6] text-xs text-[#103629] focus:outline-none focus:border-[#B69A61]"
                        />
                      </div>

                      <div className="flex items-center pt-6">
                        <label className="flex items-center gap-2 cursor-pointer text-xs text-[#103629] font-medium">
                          <input
                            type="checkbox"
                            checked={staffForm.is_published}
                            onChange={(e) => setStaffForm({ ...staffForm, is_published: e.target.checked })}
                            className="w-4 h-4 accent-[#103629]"
                          />
                          <span>Publish on Website (Public Roster)</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-sans uppercase tracking-wider text-[#103629] font-medium mb-1">
                        Professional Biography *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={staffForm.bio}
                        onChange={(e) => setStaffForm({ ...staffForm, bio: e.target.value })}
                        placeholder="Comprehensive surgical or restorative bio..."
                        className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E4E0D6] text-xs text-[#103629] focus:outline-none focus:border-[#B69A61]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-sans uppercase tracking-wider text-[#103629] font-medium mb-1">
                        Clinical Specialties (One per line)
                      </label>
                      <textarea
                        rows={3}
                        value={staffForm.specialties}
                        onChange={(e) => setStaffForm({ ...staffForm, specialties: e.target.value })}
                        placeholder="Maxillofacial Oncology & Neck Dissection&#10;Immediate Loading Implants"
                        className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E4E0D6] text-xs text-[#103629] focus:outline-none focus:border-[#B69A61]"
                      />
                    </div>

                    {/* Image Upload Area */}
                    <div className="p-3.5 bg-[#EFECE3] border border-[#E4E0D6] space-y-3">
                      <label className="block text-[11px] font-sans uppercase tracking-wider text-[#103629] font-semibold">
                        Portrait Photograph *
                      </label>
                      <div className="flex items-center gap-4">
                        {staffForm.image_path ? (
                          <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-[#103629] bg-[#103629]">
                            <img
                              src={staffForm.image_path}
                              alt="Staff preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-[#E4E0D6] flex items-center justify-center shrink-0 text-[#707873]">
                            <Users className="w-6 h-6" />
                          </div>
                        )}
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            required
                            value={staffForm.image_path}
                            onChange={(e) => setStaffForm({ ...staffForm, image_path: e.target.value })}
                            placeholder="/media/STAFF/portrait.jpeg or storage URL"
                            className="w-full px-2.5 py-1.5 bg-[#FAF9F6] border border-[#E4E0D6] text-xs text-[#103629]"
                          />
                          <div className="flex items-center gap-2">
                            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 bg-[#103629] text-[#F7F5EF] text-[11px] font-sans uppercase tracking-wider hover:bg-[#174635]">
                              <Upload className="w-3 h-3" />
                              <span>{isUploading ? "Uploading..." : "Upload New File"}</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleCmsFileUpload}
                                disabled={isUploading}
                                className="hidden"
                              />
                            </label>
                            <span className="text-[10px] text-[#707873]">PNG, JPG, WEBP up to 15MB</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── SERVICES FORM FIELDS ── */}
                {cmsModalType === "service" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-sans uppercase tracking-wider text-[#103629] font-medium mb-1">
                          Procedure Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={serviceForm.title}
                          onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                          placeholder="e.g. Rigid Internal Fixation of Fractures"
                          className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E4E0D6] text-xs text-[#103629] focus:outline-none focus:border-[#B69A61]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-sans uppercase tracking-wider text-[#103629] font-medium mb-1">
                          Department Category *
                        </label>
                        <select
                          value={serviceForm.category}
                          onChange={(e) =>
                            setServiceForm({ ...serviceForm, category: e.target.value as ServiceCategory })
                          }
                          className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E4E0D6] text-xs text-[#103629] focus:outline-none focus:border-[#B69A61]"
                        >
                          <option value="Oral Surgery">Oral Surgery</option>
                          <option value="Maxillofacial Trauma &amp; Oncology">
                            Maxillofacial Trauma &amp; Oncology
                          </option>
                          <option value="Restorative &amp; Implantology">
                            Restorative &amp; Implantology
                          </option>
                          <option value="Preventive &amp; Endodontics">
                            Preventive &amp; Endodontics
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-sans uppercase tracking-wider text-[#103629] font-medium mb-1">
                          Service Number (Display)
                        </label>
                        <input
                          type="text"
                          value={serviceForm.service_number}
                          onChange={(e) => setServiceForm({ ...serviceForm, service_number: e.target.value })}
                          placeholder="e.g. 07"
                          className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E4E0D6] text-xs text-[#103629] focus:outline-none focus:border-[#B69A61]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-sans uppercase tracking-wider text-[#103629] font-medium mb-1">
                          Sort Order
                        </label>
                        <input
                          type="number"
                          value={serviceForm.sort_order}
                          onChange={(e) =>
                            setServiceForm({ ...serviceForm, sort_order: parseInt(e.target.value, 10) || 0 })
                          }
                          className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E4E0D6] text-xs text-[#103629] focus:outline-none focus:border-[#B69A61]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="flex items-center gap-2 cursor-pointer text-xs text-[#103629] font-medium">
                          <input
                            type="checkbox"
                            checked={serviceForm.is_published}
                            onChange={(e) => setServiceForm({ ...serviceForm, is_published: e.target.checked })}
                            className="w-4 h-4 accent-[#103629]"
                          />
                          <span>Publish on Website (Public Procedures Directory)</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-sans uppercase tracking-wider text-[#103629] font-medium mb-1">
                        Short Summary Description *
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={serviceForm.short_desc}
                        onChange={(e) => setServiceForm({ ...serviceForm, short_desc: e.target.value })}
                        placeholder="Concise overview for directory listings..."
                        className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E4E0D6] text-xs text-[#103629] focus:outline-none focus:border-[#B69A61]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-sans uppercase tracking-wider text-[#103629] font-medium mb-1">
                        Full Clinical Description *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={serviceForm.full_desc}
                        onChange={(e) => setServiceForm({ ...serviceForm, full_desc: e.target.value })}
                        placeholder="Comprehensive technical and procedural breakdown..."
                        className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E4E0D6] text-xs text-[#103629] focus:outline-none focus:border-[#B69A61]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-sans uppercase tracking-wider text-[#103629] font-medium mb-1">
                        Clinical Indications (One per line)
                      </label>
                      <textarea
                        rows={3}
                        value={serviceForm.indications}
                        onChange={(e) => setServiceForm({ ...serviceForm, indications: e.target.value })}
                        placeholder="Parasymphyseal & angle fractures&#10;Severe comminuted trauma"
                        className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E4E0D6] text-xs text-[#103629] focus:outline-none focus:border-[#B69A61]"
                      />
                    </div>

                    {/* Image Upload Area */}
                    <div className="p-3.5 bg-[#EFECE3] border border-[#E4E0D6] space-y-3">
                      <label className="block text-[11px] font-sans uppercase tracking-wider text-[#103629] font-semibold">
                        Service Clinical Illustration / Photograph *
                      </label>
                      <div className="flex items-center gap-4">
                        {serviceForm.image_path ? (
                          <div className="w-16 h-16 bg-[#103629] shrink-0 overflow-hidden border border-[#E4E0D6]">
                            <img
                              src={serviceForm.image_path}
                              alt="Service preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-[#E4E0D6] flex items-center justify-center shrink-0 text-[#707873]">
                            <Layers className="w-6 h-6" />
                          </div>
                        )}
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            required
                            value={serviceForm.image_path}
                            onChange={(e) => setServiceForm({ ...serviceForm, image_path: e.target.value })}
                            placeholder="/media/SERVICES/procedure.jpg or storage URL"
                            className="w-full px-2.5 py-1.5 bg-[#FAF9F6] border border-[#E4E0D6] text-xs text-[#103629]"
                          />
                          <div className="flex items-center gap-2">
                            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 bg-[#103629] text-[#F7F5EF] text-[11px] font-sans uppercase tracking-wider hover:bg-[#174635]">
                              <Upload className="w-3 h-3" />
                              <span>{isUploading ? "Uploading..." : "Upload New File"}</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleCmsFileUpload}
                                disabled={isUploading}
                                className="hidden"
                              />
                            </label>
                            <span className="text-[10px] text-[#707873]">PNG, JPG, WEBP up to 15MB</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── CASES FORM FIELDS ── */}
                {cmsModalType === "case" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-sans uppercase tracking-wider text-[#103629] font-medium mb-1">
                          Case Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={caseForm.title}
                          onChange={(e) => setCaseForm({ ...caseForm, title: e.target.value })}
                          placeholder="e.g. Mandibular Fracture Reduction with Mini-Plates"
                          className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E4E0D6] text-xs text-[#103629] focus:outline-none focus:border-[#B69A61]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-sans uppercase tracking-wider text-[#103629] font-medium mb-1">
                          Category *
                        </label>
                        <input
                          type="text"
                          required
                          value={caseForm.category}
                          onChange={(e) => setCaseForm({ ...caseForm, category: e.target.value })}
                          placeholder="e.g. Maxillofacial Trauma, Implantology"
                          className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E4E0D6] text-xs text-[#103629] focus:outline-none focus:border-[#B69A61]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-sans uppercase tracking-wider text-[#103629] font-medium mb-1">
                          Modality / Presentation *
                        </label>
                        <input
                          type="text"
                          required
                          value={caseForm.modality}
                          onChange={(e) => setCaseForm({ ...caseForm, modality: e.target.value })}
                          placeholder="e.g. Pre-op &amp; Post-op Radiographs (OPG)"
                          className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E4E0D6] text-xs text-[#103629] focus:outline-none focus:border-[#B69A61]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-sans uppercase tracking-wider text-[#103629] font-medium mb-1">
                          Diagnostic Method *
                        </label>
                        <input
                          type="text"
                          required
                          value={caseForm.diagnostic_method}
                          onChange={(e) => setCaseForm({ ...caseForm, diagnostic_method: e.target.value })}
                          placeholder="e.g. Digital Orthopantomogram &amp; Clinical Exploration"
                          className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E4E0D6] text-xs text-[#103629] focus:outline-none focus:border-[#B69A61]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-sans uppercase tracking-wider text-[#103629] font-medium mb-1">
                          Sort Order
                        </label>
                        <input
                          type="number"
                          value={caseForm.sort_order}
                          onChange={(e) =>
                            setCaseForm({ ...caseForm, sort_order: parseInt(e.target.value, 10) || 0 })
                          }
                          className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E4E0D6] text-xs text-[#103629] focus:outline-none focus:border-[#B69A61]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="flex items-center gap-2 cursor-pointer text-xs text-[#103629] font-medium">
                          <input
                            type="checkbox"
                            checked={caseForm.is_published}
                            onChange={(e) => setCaseForm({ ...caseForm, is_published: e.target.checked })}
                            className="w-4 h-4 accent-[#103629]"
                          />
                          <span>Publish on Website (Public Case Studies Archive)</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-sans uppercase tracking-wider text-[#103629] font-medium mb-1">
                        Clinical Presentation Summary *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={caseForm.clinical_summary}
                        onChange={(e) => setCaseForm({ ...caseForm, clinical_summary: e.target.value })}
                        placeholder="Presentation, occlusal derangement, or radiographic findings..."
                        className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E4E0D6] text-xs text-[#103629] focus:outline-none focus:border-[#B69A61]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-sans uppercase tracking-wider text-[#103629] font-medium mb-1">
                        Procedural &amp; Operative Notes *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={caseForm.procedure_notes}
                        onChange={(e) => setCaseForm({ ...caseForm, procedure_notes: e.target.value })}
                        placeholder="Incision, anatomical reduction, titanium hardware fixation..."
                        className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E4E0D6] text-xs text-[#103629] focus:outline-none focus:border-[#B69A61]"
                      />
                    </div>

                    {/* Image Upload Area */}
                    <div className="p-3.5 bg-[#EFECE3] border border-[#E4E0D6] space-y-3">
                      <label className="block text-[11px] font-sans uppercase tracking-wider text-[#103629] font-semibold">
                        Radiographic / Clinical Case Image *
                      </label>
                      <div className="flex items-center gap-4">
                        {caseForm.image_path ? (
                          <div className="w-16 h-16 bg-[#103629] shrink-0 overflow-hidden border border-[#E4E0D6]">
                            <img
                              src={caseForm.image_path}
                              alt="Case preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-[#E4E0D6] flex items-center justify-center shrink-0 text-[#707873]">
                            <FileText className="w-6 h-6" />
                          </div>
                        )}
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            required
                            value={caseForm.image_path}
                            onChange={(e) => setCaseForm({ ...caseForm, image_path: e.target.value })}
                            placeholder="/media/CASES/case.jpg or storage URL"
                            className="w-full px-2.5 py-1.5 bg-[#FAF9F6] border border-[#E4E0D6] text-xs text-[#103629]"
                          />
                          <div className="flex items-center gap-2">
                            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 bg-[#103629] text-[#F7F5EF] text-[11px] font-sans uppercase tracking-wider hover:bg-[#174635]">
                              <Upload className="w-3 h-3" />
                              <span>{isUploading ? "Uploading..." : "Upload New File"}</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleCmsFileUpload}
                                disabled={isUploading}
                                className="hidden"
                              />
                            </label>
                            <span className="text-[10px] text-[#707873]">PNG, JPG, WEBP up to 15MB</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-[#EFECE3] border-t border-[#E4E0D6] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCmsModalOpen(false)}
                  className="px-4 py-2 border border-[#E4E0D6] text-xs font-sans uppercase tracking-wider text-[#707873] hover:text-[#103629]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCmsSaving || isUploading}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#103629] hover:bg-[#174635] text-[#F7F5EF] text-xs font-sans uppercase tracking-[0.14em] font-semibold transition-all disabled:opacity-50"
                >
                  {isCmsSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>{isCmsSaving ? "Saving Record..." : "Save Clinical Record"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
