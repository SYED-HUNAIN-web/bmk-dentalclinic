export interface TeamMember {
  id: string;
  name: string;
  credentials: string;
  role: string;
  genderBadge?: string;
  image: string;
  alt: string;
  bio: string;
  specialties: string[];
}

export interface ClinicService {
  id: string;
  number: string;
  title: string;
  slug: string;
  shortDesc: string;
  fullDesc: string;
  indications: string[];
  clinicalApproach: string;
  image: string;
  alt: string;
  category: "Oral Surgery" | "Maxillofacial Trauma & Oncology" | "Restorative & Implantology" | "Preventive & Endodontics";
}

export interface ClientCase {
  id: string;
  title: string;
  category: string;
  image: string;
  alt: string;
  clinicalSummary: string;
  procedureNotes: string;
  modality: string;
  diagnosticMethod: string;
}

export interface ClinicVideo {
  id: string;
  title: string;
  caption: string;
  src: string;
  description: string;
}

export const CLINIC_TEAM: TeamMember[] = [
  {
    id: "dr-vishal-lohana",
    name: "Dr. Vishal Lohana",
    credentials: "FCPS, BDS",
    role: "Consultant Oral & Maxillofacial Surgeon | Dental Surgeon",
    image: "/media/STAFF/DR VISHAL LOHANA (FCPS , BDS ).jpeg",
    alt: "Dr. Vishal Lohana, FCPS, BDS - Consultant Oral and Maxillofacial Surgeon at BMK Clinic",
    bio: "Fellow of the College of Physicians and Surgeons (FCPS) with extensive surgical mastery in oral cancer resections, facial trauma reconstruction, TMJ interventions, and complex osseointegrated dental implantology.",
    specialties: [
      "Maxillofacial Oncology & Neck Dissection",
      "Rigid Internal Fixation of Facial Fractures",
      "Immediate Loading Dental Implants",
      "Complex Surgical Extractions & Cyst Enucleation",
      "Temporomandibular Joint (TMJ) Surgery",
    ],
  },
  {
    id: "dr-jotika",
    name: "Dr. Jotika",
    credentials: "BDS, RDS",
    role: "Dental Surgeon (Female Dentist)",
    genderBadge: "Female Dental Surgeon",
    image: "/media/STAFF/DR JOTIKA (FEMALE DENTIST)(BDS , RDS]).jpeg",
    alt: "Dr. Jotika, BDS, RDS - Female Dental Surgeon at BMK Clinic",
    bio: "Registered Dental Surgeon (RDS) providing compassionate, meticulous restorative care, aesthetic tooth alignment without wires, micro-endodontics, and gentle clinical dentistry tailored for families and female patients.",
    specialties: [
      "Cosmetic Dentistry & Clear Aligners",
      "Microscopic Root Canal Therapy (Endodontics)",
      "Crowns, Bridges & Veneers",
      "Pediatric & Gentle Preventive Dentistry",
      "Teeth Whitening & Ultrasonic Scaling",
    ],
  },
  {
    id: "mr-parboo-malu",
    name: "Mr. Parboo Malu",
    credentials: "D.S.A. Technician",
    role: "Dental Surgery Assistant & Clinical Technician",
    image: "/media/STAFF/MR PARBOO MALU (D.SA  TECHNICIAN).jpeg",
    alt: "Mr. Parboo Malu, Dental Surgery Assistant and Technician at BMK Clinic",
    bio: "Dedicated surgical assistant overseeing theater sterilization, diagnostic radiographic alignment, surgical tray ergonomics, and chairside maxillofacial surgical assistance.",
    specialties: [
      "Operative Theater Sterilization Protocols",
      "Chairside Surgical Instrumentation",
      "Prosthetic Impression & Model Fabrication",
    ],
  },
  {
    id: "mr-touheed-hussain",
    name: "Mr. Touheed Hussain",
    credentials: "Dental Hygienist",
    role: "Certified Dental Hygienist",
    image: "/media/STAFF/MR TOHEED HUSSAIN (DENTAL HYGIENIST).jpeg",
    alt: "Mr. Touheed Hussain, Dental Hygienist at BMK Clinic",
    bio: "Specialist in non-surgical periodontal therapy, ultrasonic subgingival debridement, prophylactic polishing, and clinical patient education for lasting oral health.",
    specialties: [
      "Ultrasonic Deep Scaling & Polishing",
      "Periodontal Maintenance & Pocket Irrigation",
      "Post-Surgical Oral Hygiene Protocols",
    ],
  },
];

export const CLINIC_SERVICES: ClinicService[] = [
  {
    id: "root-canals-hot-tooth",
    number: "01",
    title: "Root Canals for Hot Tooth",
    slug: "root-canal-hot-tooth",
    shortDesc: "Urgent endodontic intervention for acutely inflamed, agonizing dental pulp with profound local anesthesia.",
    fullDesc: "An acute 'hot tooth' presents severe irreversible pulpitis resistant to routine infiltration. Utilizing targeted conduction blocks, rotary nickel-titanium instrumentation, and biocompatible obturation, we arrest agony swiftly and preserve the natural root structure.",
    indications: ["Severe throbbing nocturnal pain", "Extreme thermal hyper-responsiveness", "Spontaneous periapical pressure"],
    clinicalApproach: "Profound specialized anesthesia protocol, digital apex locator verification, 3D warm vertical condensation.",
    image: "/media/SERVICES/1.Root Canal for Hot Tooth.png",
    alt: "Root canal therapy for acute irreversible pulpitis illustration and clinical view",
    category: "Preventive & Endodontics",
  },
  {
    id: "crowns",
    number: "02",
    title: "Crowns & Restorative Prosthetics",
    slug: "crowns",
    shortDesc: "Custom-milled monolithic zirconia and porcelain restorations engineered for anatomical bite restoration.",
    fullDesc: "Deficient, root-treated, or extensively fractured crowns are restored with precision marginal fit. We utilize high-strength monolithic zirconia and aesthetic porcelain layered crowns designed to bear masticatory load harmoniously.",
    indications: ["Post-endodontic tooth protection", "Substantial cuspal breakdown", "Severe occlusal wear"],
    clinicalApproach: "Conservative margin preparation, gingival retraction, high-definition digital impressions, and dual-cure resin bonding.",
    image: "/media/SERVICES/2.Crowns.png",
    alt: "Dental crown preparation and prosthetic placement",
    category: "Restorative & Implantology",
  },
  {
    id: "scaling-polishing",
    number: "03",
    title: "Teeth Scaling & Polishing",
    slug: "scaling-polishing",
    shortDesc: "Ultrasonic supragingival and subgingival calculus debridement to arrest gingivitis and periodontitis.",
    fullDesc: "Complete prophylactic and periodontal debridement utilizing magnetostrictive and piezoelectric ultrasonic tips, followed by micron paste polishing to eliminate pathogenic biofilms, extrinsic stains, and tartar.",
    indications: ["Gingival bleeding upon probing", "Halitosis and tartar deposits", "Maintenance of osseointegrated implants"],
    clinicalApproach: "Acoustic micro-streaming, subgingival pocket irrigation, and enamel fluoridation.",
    image: "/media/SERVICES/3. Teeth Scaling and Polishing.png",
    alt: "Ultrasonic teeth scaling and prophylactic dental polishing",
    category: "Preventive & Endodontics",
  },
  {
    id: "extractions",
    number: "04",
    title: "Surgical & Routine Extractions",
    slug: "extractions",
    shortDesc: "Atraumatic tooth removal prioritizing socket preservation and alveolar bone continuity.",
    fullDesc: "When a tooth cannot be conservatively salvaged due to terminal periodontal disease, vertical root fracture, or unrestorable caries, we execute atraumatic luxation to retain the facial bone plate for future implants.",
    indications: ["Terminal bone resorption", "Unrestorable coronal breakdown", "Longitudinal root splits"],
    clinicalApproach: "Periotome micro-sectioning, minimal bone loss techniques, platelet-rich clot preservation.",
    image: "/media/SERVICES/4. Extractions.png",
    alt: "Atraumatic surgical and simple tooth extractions",
    category: "Oral Surgery",
  },
  {
    id: "impacted-tooth-removal",
    number: "05",
    title: "Impacted Tooth Removal",
    slug: "impacted-tooth-removal",
    shortDesc: "Surgical removal of impacted wisdom teeth (third molars) and ectopically positioned canines.",
    fullDesc: "Impacted teeth can induce pericoronitis, root resorption of adjacent second molars, or follicular cysts. Our surgical team uses minimal osteotomy, anatomical nerve mapping, and low-vibration handpieces to ensure uneventful healing.",
    indications: ["Recurrent pericoronal infections", "Mesioangular impaction damaging adjacent molar", "Pathological dentigerous enlargement"],
    clinicalApproach: "Inferior alveolar canal proximity assessment via CBCT, surgical odontosection, and tension-free resorbable sutures.",
    image: "/media/SERVICES/5. Impacted Teeth Renewal.png",
    alt: "Surgical removal of impacted wisdom tooth and bone management",
    category: "Oral Surgery",
  },
  {
    id: "jaw-cysts-tumours",
    number: "06",
    title: "Removal of Jaw Cysts & Tumours",
    slug: "jaw-cysts-tumours",
    shortDesc: "Pathology-guided enucleation, curettage, and surgical resection of benign odontogenic lesions.",
    fullDesc: "Odontogenic keratocysts (OKC), ameloblastomas, dentigerous cysts, and fibro-osseous lesions demand meticulous surgical planning. Led by Dr. Vishal Lohana (FCPS), we perform thorough enucleation, chemical cauterization (Carnoy's), and bone grafting where indicated.",
    indications: ["Expansile cortical bone lesions", "Asymptomatic cystic radiolucency on orthopantomogram", "Suspected benign or odontogenic neoplastic growth"],
    clinicalApproach: "Preoperative biopsy, primary enucleation with peripheral ostectomy, and microscopic histopathological validation.",
    image: "/media/SERVICES/6. Removal of Jaw Crysts and Tumours.png",
    alt: "Removal of jaw cysts and odontogenic tumours in maxillofacial theater",
    category: "Maxillofacial Trauma & Oncology",
  },
  {
    id: "jaw-fractures",
    number: "07",
    title: "Jaw Fracture Treatment (Trauma)",
    slug: "jaw-fractures",
    shortDesc: "Open reduction and internal fixation (ORIF) of mandibular, maxillary, and zygomatic fractures.",
    fullDesc: "Facial trauma from vehicular accidents or direct blows requires anatomical realignment of the dental occlusion and bone stability. We utilize biocompatible titanium mini-plates and 2.0mm screws along Champy's lines of ideal osteosynthesis.",
    indications: ["Mandibular symphysis, body, or angle fractures", "Malocclusion following facial trauma", "Zygomaticomaxillary complex instability"],
    clinicalApproach: "Intraoral incision approach to minimize facial scarring, rigid mini-plate fixation, and immediate occlusal restoration.",
    image: "/media/SERVICES/7.Jaw Fractures Treatment.png",
    alt: "Maxillofacial jaw fracture treatment with titanium mini plates",
    category: "Maxillofacial Trauma & Oncology",
  },
  {
    id: "orthognathic-surgeries",
    number: "08",
    title: "Orthognathic Surgeries",
    slug: "orthognathic-surgeries",
    shortDesc: "Corrective surgical jaw repositioning for severe dentofacial skeletal deformities and airway enhancement.",
    fullDesc: "For patients with severe prognathism, retrognathism, facial asymmetry, or open bites beyond orthodontic movement alone. Involves Le Fort osteotomies and bilateral sagittal split osteotomy (BSSO) to achieve aesthetic balance and functional mastication.",
    indications: ["Class II or Class III skeletal discrepancies", "Obstructive sleep apnea with retrognathia", "Facial skeletal asymmetries"],
    clinicalApproach: "Computer-assisted surgical simulation, presurgical orthodontics coordination, rigid internal fixation.",
    image: "/media/SERVICES/8. Orthognathic Surgeries.png",
    alt: "Orthognathic corrective jaw surgery diagram and clinical case",
    category: "Maxillofacial Trauma & Oncology",
  },
  {
    id: "tmj-surgeries",
    number: "09",
    title: "TMJ Surgeries & Joint Therapeutics",
    slug: "tmj-surgeries",
    shortDesc: "Comprehensive diagnosis and surgical intervention for temporomandibular joint pain, clicking, and trismus.",
    fullDesc: "Managing internal derangements of the disc, TMJ ankylosis, and severe closed-lock trismus. Treatment modalities range from conservative splint therapy and arthrocentesis with lavage to open joint arthroplasty.",
    indications: ["Severe limited mouth opening (<25mm)", "Painful reciprocal clicking and disc displacement", "Condylar trauma or osseous ankylosis"],
    clinicalApproach: "Joint lavage, hydraulic arthrocentesis, condylar recontouring, and post-operative physical rehabilitation.",
    image: "/media/SERVICES/9. TMJ Surgeries.png",
    alt: "Temporomandibular joint TMJ surgery and arthrocentesis",
    category: "Maxillofacial Trauma & Oncology",
  },
  {
    id: "dental-implants",
    number: "10",
    title: "Dental Implants (Immediate & Delayed)",
    slug: "dental-implants",
    shortDesc: "Titanium and zirconia fixtures for single-tooth replacement, full-arch restorations, and immediate loading.",
    fullDesc: "Permanent replacement of lost teeth with premium biocompatible grade-4 titanium fixtures. We employ 3D CBCT planning to achieve bicortical anchorage and optimal prosthetic emergence profile for natural function and appearance.",
    indications: ["Single or multiple missing teeth", "Edentulous arches seeking fixed full-mouth prosthesis", "Denture stabilization"],
    clinicalApproach: "3D virtual surgical stent guidance, primary stability torque monitoring (>35 Ncm), immediate provisionalization when indicated.",
    image: "/media/SERVICES/10. Dental Implants.png",
    alt: "Dental implant placement and osseointegration restoration",
    category: "Restorative & Implantology",
  },
];

export const CLIENT_CASES: ClientCase[] = [
  {
    id: "immediate-dental-implant",
    title: "Immediate Dental Implants Loaded",
    category: "Implantology",
    image: "/media/CLIENT WORK/Immediate Dental Implant Placement.jpeg",
    alt: "Clinical radiographic and intraoral photograph of immediate dental implant placement",
    clinicalSummary: "Single-stage immediate extraction and fixture insertion with immediate provisional crown placement.",
    procedureNotes: "Atraumatic extraction of non-restorable tooth without raising a full mucoperiosteal flap. Placement of a tapered threaded titanium implant with >40 Ncm insertion torque, jump-gap bone grafting, and immediate non-functional loading.",
    modality: "Immediate Functional Loading",
    diagnosticMethod: "Preoperative CBCT cross-sectional tomogram",
  },
  {
    id: "dental-implants-loaded",
    title: "Dental Implants Loaded",
    category: "Implantology",
    image: "/media/CLIENT WORK/Dental Implants Loaded.jpeg",
    alt: "Final restorative loading photograph showing prosthetic emergence profile of dental implants",
    clinicalSummary: "Secondary stage prosthetic rehabilitation following successful osseointegration period.",
    procedureNotes: "Gingival former contouring to shape natural papillae, screw-retained custom zirconia abutments, and anatomical crown delivery. Excellent soft tissue stability and marginal bone maintenance observed.",
    modality: "Prosthetic Osseointegration",
    diagnosticMethod: "Periapical digital radiovisiography (RVG)",
  },
  {
    id: "impacted-wisdom-tooth",
    title: "Impacted Wisdom Tooth Extracted",
    category: "Maxillofacial Surgery",
    image: "/media/CLIENT WORK/Impacted Wisdom Tooth extracted.jpeg",
    alt: "Surgical removal of deeply impacted mandibular third molar",
    clinicalSummary: "Class II Position B mandibular third molar impaction presenting with recurrent subacute pericoronitis.",
    procedureNotes: "Triangular buccal envelope incision, conservative guttering osteotomy with chilled saline irrigation, sagittal crown sectioning, and preservation of the lingual nerve boundary.",
    modality: "Surgical Odontosection",
    diagnosticMethod: "Orthopantomogram (OPG)",
  },
  {
    id: "pain-free-impacted-tooth",
    title: "Pain-Free Impacted Tooth Extraction",
    category: "Maxillofacial Surgery",
    image: "/media/CLIENT WORK/Pain Free Impacted Tooth Extracted.jpeg",
    alt: "Minimally invasive atraumatic extraction of impacted tooth without tissue laceration",
    clinicalSummary: "Atraumatic surgical extraction carried out under reinforced localized conduction anesthesia.",
    procedureNotes: "Complete sensory blockage of the inferior alveolar, lingual, and long buccal nerves. Atraumatic elevation avoiding excessive alveolar plate expansion, resulting in zero intraoperative discomfort and minimal post-op swelling.",
    modality: "Atraumatic Surgical Technique",
    diagnosticMethod: "High-resolution digital periapical imaging",
  },
  {
    id: "teeth-alignment-no-wires",
    title: "Teeth Alignment Without Wires",
    category: "Aesthetic Orthodontics",
    image: "/media/CLIENT WORK/TEETH ALIGNMENT WITHOUT WIRES.jpeg",
    alt: "Clear aligner therapy showing progressive teeth alignment without metal wires or brackets",
    clinicalSummary: "Clear aligner series for correcting moderate anterior crowding and rotational discrepancy.",
    procedureNotes: "Digital optical scanning of dental arches, computer-guided interproximal enamel reduction (IPR), and sequential polyurethane aligner trays worn for 22 hours per day over planned movement stages.",
    modality: "Clear Aligner Biomechanics",
    diagnosticMethod: "Digital Intraoral 3D Scans",
  },
  {
    id: "implant-planning-cbct",
    title: "Dental Implant Planning with CBCT",
    category: "Radiology & Implantology",
    image: "/media/CLIENT WORK/Dental Implant Planning With CBCT.jpeg",
    alt: "3D Cone Beam Computed Tomography (CBCT) cross-sectional planning for dental implant fixture",
    clinicalSummary: "Three-dimensional volumetric bone evaluation prior to posterior mandible implant fixture insertion.",
    procedureNotes: "Precise millimeter measurement of residual ridge height, alveolar crest width, and critical safety margins to the inferior alveolar nerve canal. Selection of optimal implant length and trajectory to avoid sinus or nerve perforation.",
    modality: "3D CBCT Volumetric Reconstruction",
    diagnosticMethod: "Cone Beam Computed Tomography (CBCT)",
  },
  {
    id: "retreatment-re-endo",
    title: "Retreatment / Re-endo Case",
    category: "Micro-Endodontics",
    image: "/media/CLIENT WORK/Retreatment Re-Endo Case.jpeg",
    alt: "Endodontic retreatment demonstrating removal of failing gutta-percha and thorough apical resealing",
    clinicalSummary: "Management of persistent apical periodontitis originating from an inadequately instrumented previous root canal.",
    procedureNotes: "Coronal disassembly, solvent-assisted removal of aged infected obturation material, ultrasonic path finding, calcium hydroxide interappointment medication, and subsequent bio-ceramic canal sealing.",
    modality: "Microscopic Endodontic Revision",
    diagnosticMethod: "Multiple-angle Angulated Radiovisiography",
  },
  {
    id: "identification-four-canals-rct",
    title: "Identification of Four Canals & Root Canal Treatment",
    category: "Micro-Endodontics",
    image: "/media/CLIENT WORK/Delicately Found 4 Canals and Root Canal Treatment went well.jpeg",
    alt: "Micro-endodontic radiograph displaying four distinct obturated canals in a complex molar",
    clinicalSummary: "Successful location and complete cleaning of an anomalous MB2 (mesiobuccal second) canal system in a maxillary molar.",
    procedureNotes: "Troughing under magnification along the subpulpal groove, unroofing the calcified MB2 orifice, working length confirmation with dual-frequency apex locator, and hermetic three-dimensional obturation across all four root canals.",
    modality: "High-Magnification Canal Negotiation",
    diagnosticMethod: "Electronic Apex Locator & Digital Radiographs",
  },
  {
    id: "neck-dissection-oscc",
    title: "Neck Dissection for Oral Squamous Cell Carcinoma",
    category: "Maxillofacial Oncology",
    image: "/media/CLIENT WORK/Neck Dissection For Oral Squamous Cell Carcinoma.jpeg",
    alt: "Operative surgical view of selective neck dissection for oral squamous cell carcinoma",
    clinicalSummary: "Selective neck dissection (Levels I-III) for primary oral cavity squamous cell carcinoma.",
    procedureNotes: "Systematic nodal clearance performed by Dr. Vishal Lohana with preservation of the spinal accessory nerve, internal jugular vein, and sternocleidomastoid muscle. Precise surgical hemostasis and oncological safety margins confirmed on frozen section.",
    modality: "Head & Neck Oncological Surgery",
    diagnosticMethod: "Contrast-Enhanced CT & Pre-op Incisional Histopathology",
  },
  {
    id: "mandible-fracture-mini-plates",
    title: "Mandible Fracture Managed with Mini Plates",
    category: "Maxillofacial Trauma",
    image: "/media/CLIENT WORK/Mandible Fracture managed with mini plates.jpeg",
    alt: "Intraoperative radiograph and surgical site showing titanium mini plates fixing a mandibular fracture",
    clinicalSummary: "Unfavorable displaced angle and parasymphysis mandibular fracture following blunt impact trauma.",
    procedureNotes: "Temporary intermaxillary fixation to establish premorbid dental occlusion. Open surgical reduction via intraoral incision, placement of low-profile 2.0mm titanium mini-plates along tension and compression stress trajectories, ensuring immediate masticatory recovery.",
    modality: "Open Reduction & Internal Fixation (ORIF)",
    diagnosticMethod: "Panoramic Radiograph (OPG) & Mandibular 3D CT",
  },
];

export const CLINIC_VIDEOS: ClinicVideo[] = [
  {
    id: "facility-operative-tour",
    title: "Clinical Operative Suite & Surgical Setup",
    caption: "A comprehensive look into BMK Clinic's sterilized operative theater and precision instrument ergonomics.",
    src: "/media/videos/WhatsApp Video 2026-10-18 at 2.07.43 AM.mp4",
    description: "Dr. Vishal Lohana and the surgical team demonstrate sterile theater preparation, high-vacuum aspiration, and surgical field protocols before maxillofacial procedures.",
  },
  {
    id: "case-consultation-overview",
    title: "Clinical Procedure & Patient Care In-Depth",
    caption: "Documentation of chairside examination, patient communication, and surgical workflow.",
    src: "/media/videos/WhatsApp Video 2026-10-18 at 2.16.33 AM.mp4",
    description: "Insight into the thorough diagnostic discussion, pre-surgical explanation, and compassionate delivery of surgical and aesthetic oral care.",
  },
];

export const CLINIC_INFO = {
  name: "BMK Dental & Maxillofacial Clinic",
  tagline: "Surgical Mastery. Restorative Elegance. Uncompromising Care.",
  director: "Dr Vishal Lohana",
  credentials: "FCPS, BDS",
  leadSurgeon: "Dr Vishal Lohana (FCPS, BDS)",
  hours: "Monday – Saturday: 4:00 PM – 10:00 PM | Sunday: Closed",
  address: "Quaid-E-Azam Medical Complex, Clinic No: MF:32, CMH Rd, Saddar, Hyderabad, 72000, Pakistan",
  // Primary contact
  phoneDisplay: "03332760510",
  phoneTel: "tel:+923332760510",
  whatsappUrl: "https://wa.me/923332760510",
  // Secondary / Additional contact (Calls & WhatsApp)
  secondaryPhoneDisplay: "03430386371",
  secondaryPhoneTel: "tel:+923430386371",
  secondaryWhatsappUrl: "https://wa.me/923430386371",
  // Official social media
  facebookUrl: "https://www.facebook.com/share/1CUX9XEzHH/?mibextid=wwXIfr",
  instagramUrl: "https://www.instagram.com/bmkdentalclinic?obrf=MXg5eHFmZTgwOWViNg==",
  email: "consultations@bmkdentalclinic.com",
  emergencyNote: "For acute facial trauma, suspected jaw fractures, or urgent clinical inquiries during operating hours, contact the clinic phone directly.",
};

