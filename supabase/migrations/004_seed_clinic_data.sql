-- ==============================================================================
-- BMK Dental & Maxillofacial Clinic — Migration 004: Seed Verified Clinic Data
-- Safe and repeatable seed script using ON CONFLICT DO UPDATE
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Seed Site Settings
-- ------------------------------------------------------------------------------
INSERT INTO public.site_settings (
  id,
  clinic_name,
  lead_surgeon,
  tagline,
  address,
  city,
  postal_code,
  country,
  phone_display,
  phone_tel,
  whatsapp_url,
  email,
  opening_hours,
  emergency_note
)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'BMK Dental & Maxillofacial Clinic',
  'Dr Vishal Lohana (FCPS, BDS)',
  'Specialist Oral & Maxillofacial Surgery and Restorative Dental Medicine',
  'Quaid-E-Azam Medical Complex, Clinic No: MF:32, CMH Rd, Saddar, Hyderabad, 72000, Pakistan',
  'Hyderabad',
  '72000',
  'Pakistan',
  '03332760510',
  'tel:+923332760510',
  'https://wa.me/923332760510',
  'consultations@bmkdentalclinic.com',
  'Monday – Saturday: 4:00 PM – 10:00 PM | Sunday: Closed',
  'For acute facial trauma, suspected jaw fractures, or urgent clinical inquiries during operating hours, contact the clinic phone directly.'
)
ON CONFLICT (id) DO UPDATE SET
  clinic_name = EXCLUDED.clinic_name,
  lead_surgeon = EXCLUDED.lead_surgeon,
  tagline = EXCLUDED.tagline,
  address = EXCLUDED.address,
  phone_display = EXCLUDED.phone_display,
  phone_tel = EXCLUDED.phone_tel,
  whatsapp_url = EXCLUDED.whatsapp_url,
  opening_hours = EXCLUDED.opening_hours,
  emergency_note = EXCLUDED.emergency_note;

-- ------------------------------------------------------------------------------
-- 2. Seed Pages (Home & About)
-- ------------------------------------------------------------------------------
INSERT INTO public.pages (slug, title, meta_description, hero_headline, hero_subheadline, lead_paragraph, content, is_published)
VALUES
  (
    'home',
    'BMK Dental & Maxillofacial Clinic | Dr Vishal Lohana (FCPS, BDS)',
    'Distinguished center for oral & maxillofacial surgery, trauma reconstruction, dental implants, and micro-endodontics led by Dr Vishal Lohana and his team in Saddar, Hyderabad.',
    'Specialist care. Considered in every detail.',
    'BMK Dental & Maxillofacial Clinic brings consultant-led surgical precision and restorative dental medicine together under one roof. Led by Dr Vishal Lohana (FCPS, BDS) and his team in Hyderabad.',
    'A practice founded on surgical rigor, anatomical mastery, and quiet patient dignity.',
    jsonb_build_object(
      'consultant_led_note', 'Dr Vishal Lohana and his team personally oversee all clinical assessments and consultation reviews.',
      'location_plaque', 'Quaid-E-Azam Medical Complex, Saddar, Hyderabad'
    ),
    true
  ),
  (
    'about',
    'The Clinic & Team | BMK Dental & Maxillofacial Clinic',
    'Learn about our surgical faculty, hospital-grade sterilization protocols, and specialist team led by Dr Vishal Lohana (FCPS, BDS).',
    'Clinical Rigor, Surgical Precision & Dedicated Patient Care',
    'Founded by Dr Vishal Lohana (FCPS, BDS) to bring hospital-grade surgical theater standards and specialized restorative dental medicine together under a single unified center in Saddar, Hyderabad.',
    'Every procedure at BMK Clinic is conducted with strict cross-infection barriers, advanced radiographic planning, and empathetic clinical communication.',
    jsonb_build_object(
      'videos', jsonb_build_array(
        jsonb_build_object(
          'id', 'facility-operative-tour',
          'title', 'Clinical Operative Suite & Surgical Setup',
          'src', '/media/videos/WhatsApp Video 2026-10-18 at 2.07.43 AM.mp4'
        ),
        jsonb_build_object(
          'id', 'case-consultation-overview',
          'title', 'Clinical Procedure & Patient Care In-Depth',
          'src', '/media/videos/WhatsApp Video 2026-10-18 at 2.16.33 AM.mp4'
        )
      )
    ),
    true
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  hero_headline = EXCLUDED.hero_headline,
  hero_subheadline = EXCLUDED.hero_subheadline,
  lead_paragraph = EXCLUDED.lead_paragraph,
  content = EXCLUDED.content,
  is_published = EXCLUDED.is_published;

-- ------------------------------------------------------------------------------
-- 3. Seed Clinical Faculty & Staff
-- ------------------------------------------------------------------------------
INSERT INTO public.staff (slug, name, credentials, role, gender_badge, bio, specialties, image_path, image_alt, sort_order, is_published)
VALUES
  (
    'dr-vishal-lohana',
    'Dr. Vishal Lohana',
    'FCPS, BDS',
    'Consultant Oral & Maxillofacial Surgeon | Dental Surgeon',
    NULL,
    'Fellow of the College of Physicians and Surgeons (FCPS) with extensive surgical mastery in oral cancer resections, facial trauma reconstruction, TMJ interventions, and complex osseointegrated dental implantology.',
    ARRAY[
      'Maxillofacial Oncology & Neck Dissection',
      'Rigid Internal Fixation of Facial Fractures',
      'Immediate Loading Dental Implants',
      'Complex Surgical Extractions & Cyst Enucleation',
      'Temporomandibular Joint (TMJ) Surgery'
    ],
    '/media/STAFF/DR VISHAL LOHANA (FCPS , BDS ).jpeg',
    'Dr. Vishal Lohana, FCPS, BDS - Consultant Oral and Maxillofacial Surgeon at BMK Clinic',
    1,
    true
  ),
  (
    'dr-jotika',
    'Dr. Jotika',
    'BDS, RDS',
    'Dental Surgeon (Female Dentist)',
    'Female Dental Surgeon',
    'Registered Dental Surgeon (RDS) providing compassionate, meticulous restorative care, aesthetic tooth alignment without wires, micro-endodontics, and gentle clinical dentistry tailored for families and female patients.',
    ARRAY[
      'Cosmetic Dentistry & Clear Aligners',
      'Microscopic Root Canal Therapy (Endodontics)',
      'Crowns, Bridges & Veneers',
      'Pediatric & Gentle Preventive Dentistry',
      'Teeth Whitening & Ultrasonic Scaling'
    ],
    '/media/STAFF/DR JOTIKA (FEMALE DENTIST)(BDS , RDS]).jpeg',
    'Dr. Jotika, BDS, RDS - Female Dental Surgeon at BMK Clinic',
    2,
    true
  ),
  (
    'mr-parboo-malu',
    'Mr. Parboo Malu',
    'D.S.A. Technician',
    'Dental Surgery Assistant & Clinical Technician',
    NULL,
    'Dedicated surgical assistant overseeing theater sterilization, diagnostic radiographic alignment, surgical tray ergonomics, and chairside maxillofacial surgical assistance.',
    ARRAY[
      'Operative Theater Sterilization Protocols',
      'Chairside Surgical Instrumentation',
      'Prosthetic Impression & Model Fabrication'
    ],
    '/media/STAFF/MR PARBOO MALU (D.SA  TECHNICIAN).jpeg',
    'Mr. Parboo Malu, Dental Surgery Assistant and Technician at BMK Clinic',
    3,
    true
  ),
  (
    'mr-touheed-hussain',
    'Mr. Touheed Hussain',
    'Dental Hygienist',
    'Certified Dental Hygienist',
    NULL,
    'Specialist in non-surgical periodontal therapy, ultrasonic subgingival debridement, prophylactic polishing, and clinical patient education for lasting oral health.',
    ARRAY[
      'Ultrasonic Deep Scaling & Polishing',
      'Periodontal Maintenance & Pocket Irrigation',
      'Post-Surgical Oral Hygiene Protocols'
    ],
    '/media/STAFF/MR TOHEED HUSSAIN (DENTAL HYGIENIST).jpeg',
    'Mr. Touheed Hussain, Dental Hygienist at BMK Clinic',
    4,
    true
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  credentials = EXCLUDED.credentials,
  role = EXCLUDED.role,
  gender_badge = EXCLUDED.gender_badge,
  bio = EXCLUDED.bio,
  specialties = EXCLUDED.specialties,
  image_path = EXCLUDED.image_path,
  image_alt = EXCLUDED.image_alt,
  sort_order = EXCLUDED.sort_order,
  is_published = EXCLUDED.is_published;

-- ------------------------------------------------------------------------------
-- 4. Seed All 10 Clinical Services
-- ------------------------------------------------------------------------------
INSERT INTO public.services (service_number, slug, title, category, short_desc, full_desc, indications, clinical_approach, image_path, image_alt, sort_order, is_published)
VALUES
  (
    '01',
    'root-canals-hot-tooth',
    'Root Canals for Hot Tooth',
    'Preventive & Endodontics',
    'Urgent endodontic intervention for acutely inflamed, agonizing dental pulp with profound local anesthesia.',
    'An acute hot tooth presents severe irreversible pulpitis resistant to routine infiltration. Utilizing targeted conduction blocks, rotary nickel-titanium instrumentation, and biocompatible obturation, we arrest agony swiftly and preserve the natural root structure.',
    ARRAY['Severe throbbing nocturnal pain', 'Extreme thermal hyper-responsiveness', 'Spontaneous periapical pressure'],
    'Profound specialized anesthesia protocol, digital apex locator verification, 3D warm vertical condensation.',
    '/media/SERVICES/1.Root Canal for Hot Tooth.png',
    'Root canal therapy for acute irreversible pulpitis illustration and clinical view',
    1,
    true
  ),
  (
    '02',
    'crowns',
    'Crowns & Restorative Prosthetics',
    'Restorative & Implantology',
    'Custom-milled monolithic zirconia and porcelain restorations engineered for anatomical bite restoration.',
    'Deficient, root-treated, or extensively fractured crowns are restored with precision marginal fit. We utilize high-strength monolithic zirconia and aesthetic porcelain layered crowns designed to bear masticatory load harmoniously.',
    ARRAY['Post-endodontic tooth protection', 'Substantial cuspal breakdown', 'Severe occlusal wear'],
    'Conservative margin preparation, gingival retraction, high-definition digital impressions, and dual-cure resin bonding.',
    '/media/SERVICES/2.Crowns.png',
    'Dental crown preparation and prosthetic placement',
    2,
    true
  ),
  (
    '03',
    'scaling-polishing',
    'Teeth Scaling & Polishing',
    'Preventive & Endodontics',
    'Ultrasonic supragingival and subgingival calculus debridement to arrest gingivitis and periodontitis.',
    'Complete prophylactic and periodontal debridement utilizing magnetostrictive and piezoelectric ultrasonic tips, followed by micron paste polishing to eliminate pathogenic biofilms, extrinsic stains, and tartar.',
    ARRAY['Gingival bleeding upon probing', 'Halitosis and tartar deposits', 'Maintenance of osseointegrated implants'],
    'Acoustic micro-streaming, subgingival pocket irrigation, and enamel fluoridation.',
    '/media/SERVICES/3. Teeth Scaling and Polishing.png',
    'Ultrasonic teeth scaling and prophylactic dental polishing',
    3,
    true
  ),
  (
    '04',
    'extractions',
    'Surgical & Routine Extractions',
    'Oral Surgery',
    'Atraumatic tooth removal prioritizing socket preservation and alveolar bone continuity.',
    'When a tooth cannot be conservatively salvaged due to terminal periodontal disease, vertical root fracture, or unrestorable caries, we execute atraumatic luxation to retain the facial bone plate for future implants.',
    ARRAY['Terminal bone resorption', 'Unrestorable coronal breakdown', 'Longitudinal root splits'],
    'Periotome micro-sectioning, minimal bone loss techniques, platelet-rich clot preservation.',
    '/media/SERVICES/4. Extractions.png',
    'Atraumatic surgical and simple tooth extractions',
    4,
    true
  ),
  (
    '05',
    'impacted-tooth-removal',
    'Impacted Tooth Removal',
    'Oral Surgery',
    'Surgical removal of impacted wisdom teeth (third molars) and ectopically positioned canines.',
    'Impacted teeth can induce pericoronitis, root resorption of adjacent second molars, or follicular cysts. Our surgical team uses minimal osteotomy, anatomical nerve mapping, and low-vibration handpieces to ensure uneventful healing.',
    ARRAY['Recurrent pericoronal infections', 'Mesioangular impaction damaging adjacent molar', 'Pathological dentigerous enlargement'],
    'Inferior alveolar canal proximity assessment via CBCT, surgical odontosection, and tension-free resorbable sutures.',
    '/media/SERVICES/5. Impacted Teeth Renewal.png',
    'Surgical removal of impacted wisdom tooth and bone management',
    5,
    true
  ),
  (
    '06',
    'jaw-cysts-tumours',
    'Removal of Jaw Cysts & Tumours',
    'Maxillofacial Trauma & Oncology',
    'Pathology-guided enucleation, curettage, and surgical resection of benign odontogenic lesions.',
    'Odontogenic keratocysts (OKC), ameloblastomas, dentigerous cysts, and fibro-osseous lesions demand meticulous surgical planning. Led by Dr. Vishal Lohana (FCPS), we perform thorough enucleation, chemical cauterization (Carnoy''s), and bone grafting where indicated.',
    ARRAY['Expansile cortical bone lesions', 'Asymptomatic cystic radiolucency on orthopantomogram', 'Suspected benign or odontogenic neoplastic growth'],
    'Preoperative biopsy, primary enucleation with peripheral ostectomy, and microscopic histopathological validation.',
    '/media/SERVICES/6. Removal of Jaw Crysts and Tumours.png',
    'Removal of jaw cysts and odontogenic tumours in maxillofacial theater',
    6,
    true
  ),
  (
    '07',
    'jaw-fractures',
    'Jaw Fracture Treatment (Trauma)',
    'Maxillofacial Trauma & Oncology',
    'Open reduction and internal fixation (ORIF) of mandibular, maxillary, and zygomatic fractures.',
    'Facial trauma from vehicular accidents or direct blows requires anatomical realignment of the dental occlusion and bone stability. We utilize biocompatible titanium mini-plates and 2.0mm screws along Champy''s lines of ideal osteosynthesis.',
    ARRAY['Mandibular symphysis, body, or angle fractures', 'Malocclusion following facial trauma', 'Zygomaticomaxillary complex instability'],
    'Intraoral incision approach to minimize facial scarring, rigid mini-plate fixation, and immediate occlusal restoration.',
    '/media/SERVICES/7.Jaw Fractures Treatment.png',
    'Maxillofacial jaw fracture treatment with titanium mini plates',
    7,
    true
  ),
  (
    '08',
    'orthognathic-surgeries',
    'Orthognathic Surgeries',
    'Maxillofacial Trauma & Oncology',
    'Corrective surgical jaw repositioning for severe dentofacial skeletal deformities and airway enhancement.',
    'For patients with severe prognathism, retrognathism, facial asymmetry, or open bites beyond orthodontic movement alone. Involves Le Fort osteotomies and bilateral sagittal split osteotomy (BSSO) to achieve aesthetic balance and functional mastication.',
    ARRAY['Class II or Class III skeletal discrepancies', 'Obstructive sleep apnea with retrognathia', 'Facial skeletal asymmetries'],
    'Computer-assisted surgical simulation, presurgical orthodontics coordination, rigid internal fixation.',
    '/media/SERVICES/8. Orthognathic Surgeries.png',
    'Orthognathic corrective jaw surgery diagram and clinical case',
    8,
    true
  ),
  (
    '09',
    'tmj-surgeries',
    'TMJ Surgeries & Joint Therapeutics',
    'Maxillofacial Trauma & Oncology',
    'Comprehensive diagnosis and surgical intervention for temporomandibular joint pain, clicking, and trismus.',
    'Managing internal derangements of the disc, TMJ ankylosis, and severe closed-lock trismus. Treatment modalities range from conservative splint therapy and arthrocentesis with lavage to open joint arthroplasty.',
    ARRAY['Severe limited mouth opening (<25mm)', 'Painful reciprocal clicking and disc displacement', 'Condylar trauma or osseous ankylosis'],
    'Joint lavage, hydraulic arthrocentesis, condylar recontouring, and post-operative physical rehabilitation.',
    '/media/SERVICES/9. TMJ Surgeries.png',
    'Temporomandibular joint TMJ surgery and arthrocentesis',
    9,
    true
  ),
  (
    '10',
    'dental-implants',
    'Dental Implants (Immediate & Delayed)',
    'Restorative & Implantology',
    'Titanium and zirconia fixtures for single-tooth replacement, full-arch restorations, and immediate loading.',
    'Permanent replacement of lost teeth with premium biocompatible grade-4 titanium fixtures. We employ 3D CBCT planning to achieve bicortical anchorage and optimal prosthetic emergence profile for natural function and appearance.',
    ARRAY['Single or multiple missing teeth', 'Edentulous arches seeking fixed full-mouth prosthesis', 'Denture stabilization'],
    '3D virtual surgical stent guidance, primary stability torque monitoring (>35 Ncm), immediate provisionalization when indicated.',
    '/media/SERVICES/10. Dental Implants.png',
    'Dental implant placement and osseointegration restoration',
    10,
    true
  )
ON CONFLICT (slug) DO UPDATE SET
  service_number = EXCLUDED.service_number,
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  short_desc = EXCLUDED.short_desc,
  full_desc = EXCLUDED.full_desc,
  indications = EXCLUDED.indications,
  clinical_approach = EXCLUDED.clinical_approach,
  image_path = EXCLUDED.image_path,
  image_alt = EXCLUDED.image_alt,
  sort_order = EXCLUDED.sort_order,
  is_published = EXCLUDED.is_published;

-- ------------------------------------------------------------------------------
-- 5. Seed All 10 Documented Clinical Cases
-- ------------------------------------------------------------------------------
INSERT INTO public.projects (slug, title, category, modality, diagnostic_method, clinical_summary, procedure_notes, image_path, image_alt, sort_order, is_published)
VALUES
  (
    'immediate-dental-implant',
    'Immediate Dental Implants Loaded',
    'Implantology',
    'Immediate Functional Loading',
    'Preoperative CBCT cross-sectional tomogram',
    'Single-stage immediate extraction and fixture insertion with immediate provisional crown placement.',
    'Atraumatic extraction of non-restorable tooth without raising a full mucoperiosteal flap. Placement of a tapered threaded titanium implant with >40 Ncm insertion torque, jump-gap bone grafting, and immediate non-functional loading.',
    '/media/CLIENT WORK/Immediate Dental Implant Placement.jpeg',
    'Clinical radiographic and intraoral photograph of immediate dental implant placement',
    1,
    true
  ),
  (
    'dental-implants-loaded',
    'Dental Implants Loaded',
    'Implantology',
    'Prosthetic Osseointegration',
    'Periapical digital radiovisiography (RVG)',
    'Secondary stage prosthetic rehabilitation following successful osseointegration period.',
    'Gingival former contouring to shape natural papillae, screw-retained custom zirconia abutments, and anatomical crown delivery. Excellent soft tissue stability and marginal bone maintenance observed.',
    '/media/CLIENT WORK/Dental Implants Loaded.jpeg',
    'Final restorative loading photograph showing prosthetic emergence profile of dental implants',
    2,
    true
  ),
  (
    'impacted-wisdom-tooth',
    'Impacted Wisdom Tooth Extracted',
    'Maxillofacial Surgery',
    'Surgical Odontosection',
    'Orthopantomogram (OPG)',
    'Class II Position B mandibular third molar impaction presenting with recurrent subacute pericoronitis.',
    'Triangular buccal envelope incision, conservative guttering osteotomy with chilled saline irrigation, sagittal crown sectioning, and preservation of the lingual nerve boundary.',
    '/media/CLIENT WORK/Impacted Wisdom Tooth extracted.jpeg',
    'Surgical removal of deeply impacted mandibular third molar',
    3,
    true
  ),
  (
    'pain-free-impacted-tooth',
    'Pain-Free Impacted Tooth Extraction',
    'Maxillofacial Surgery',
    'Atraumatic Surgical Technique',
    'High-resolution digital periapical imaging',
    'Atraumatic surgical extraction carried out under reinforced localized conduction anesthesia.',
    'Complete sensory blockage of the inferior alveolar, lingual, and long buccal nerves. Atraumatic elevation avoiding excessive alveolar plate expansion, resulting in zero intraoperative discomfort and minimal post-op swelling.',
    '/media/CLIENT WORK/Pain Free Impacted Tooth Extracted.jpeg',
    'Minimally invasive atraumatic extraction of impacted tooth without tissue laceration',
    4,
    true
  ),
  (
    'teeth-alignment-no-wires',
    'Teeth Alignment Without Wires',
    'Aesthetic Orthodontics',
    'Clear Aligner Biomechanics',
    'Digital Intraoral 3D Scans',
    'Clear aligner series for correcting moderate anterior crowding and rotational discrepancy.',
    'Digital optical scanning of dental arches, computer-guided interproximal enamel reduction (IPR), and sequential polyurethane aligner trays worn for 22 hours per day over planned movement stages.',
    '/media/CLIENT WORK/TEETH ALIGNMENT WITHOUT WIRES.jpeg',
    'Clear aligner therapy showing progressive teeth alignment without metal wires or brackets',
    5,
    true
  ),
  (
    'implant-planning-cbct',
    'Dental Implant Planning with CBCT',
    'Radiology & Implantology',
    '3D CBCT Volumetric Reconstruction',
    'Cone Beam Computed Tomography (CBCT)',
    'Three-dimensional volumetric bone evaluation prior to posterior mandible implant fixture insertion.',
    'Precise millimeter measurement of residual ridge height, alveolar crest width, and critical safety margins to the inferior alveolar nerve canal. Selection of optimal implant length and trajectory to avoid sinus or nerve perforation.',
    '/media/CLIENT WORK/Dental Implant Planning With CBCT.jpeg',
    '3D Cone Beam Computed Tomography (CBCT) cross-sectional planning for dental implant fixture',
    6,
    true
  ),
  (
    'retreatment-re-endo',
    'Retreatment / Re-endo Case',
    'Micro-Endodontics',
    'Microscopic Endodontic Revision',
    'Multiple-angle Angulated Radiovisiography',
    'Management of persistent apical periodontitis originating from an inadequately instrumented previous root canal.',
    'Coronal disassembly, solvent-assisted removal of aged infected obturation material, ultrasonic path finding, calcium hydroxide interappointment medication, and subsequent bio-ceramic canal sealing.',
    '/media/CLIENT WORK/Retreatment Re-Endo Case.jpeg',
    'Endodontic retreatment demonstrating removal of failing gutta-percha and thorough apical resealing',
    7,
    true
  ),
  (
    'identification-four-canals-rct',
    'Identification of Four Canals & Root Canal Treatment',
    'Micro-Endodontics',
    'High-Magnification Canal Negotiation',
    'Electronic Apex Locator & Digital Radiographs',
    'Successful location and complete cleaning of an anomalous MB2 (mesiobuccal second) canal system in a maxillary molar.',
    'Troughing under magnification along the subpulpal groove, unroofing the calcified MB2 orifice, working length confirmation with dual-frequency apex locator, and hermetic three-dimensional obturation across all four root canals.',
    '/media/CLIENT WORK/Delicately Found 4 Canals and Root Canal Treatment went well.jpeg',
    'Micro-endodontic radiograph displaying four distinct obturated canals in a complex molar',
    8,
    true
  ),
  (
    'neck-dissection-oscc',
    'Neck Dissection for Oral Squamous Cell Carcinoma',
    'Maxillofacial Oncology',
    'Head & Neck Oncological Surgery',
    'Contrast-Enhanced CT & Pre-op Incisional Histopathology',
    'Selective neck dissection (Levels I-III) for primary oral cavity squamous cell carcinoma.',
    'Systematic nodal clearance performed by Dr. Vishal Lohana with preservation of the spinal accessory nerve, internal jugular vein, and sternocleidomastoid muscle. Precise surgical hemostasis and oncological safety margins confirmed on frozen section.',
    '/media/CLIENT WORK/Neck Dissection For Oral Squamous Cell Carcinoma.jpeg',
    'Operative surgical view of selective neck dissection for oral squamous cell carcinoma',
    9,
    true
  ),
  (
    'mandible-fracture-mini-plates',
    'Mandible Fracture Managed with Mini Plates',
    'Maxillofacial Trauma',
    'Open Reduction & Internal Fixation (ORIF)',
    'Panoramic Radiograph (OPG) & Mandibular 3D CT',
    'Unfavorable displaced angle and parasymphysis mandibular fracture following blunt impact trauma.',
    'Temporary intermaxillary fixation to establish premorbid dental occlusion. Open surgical reduction via intraoral incision, placement of low-profile 2.0mm titanium mini-plates along tension and compression stress trajectories, ensuring immediate masticatory recovery.',
    '/media/CLIENT WORK/Mandible Fracture managed with mini plates.jpeg',
    'Intraoperative radiograph and surgical site showing titanium mini plates fixing a mandibular fracture',
    10,
    true
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  modality = EXCLUDED.modality,
  diagnostic_method = EXCLUDED.diagnostic_method,
  clinical_summary = EXCLUDED.clinical_summary,
  procedure_notes = EXCLUDED.procedure_notes,
  image_path = EXCLUDED.image_path,
  image_alt = EXCLUDED.image_alt,
  sort_order = EXCLUDED.sort_order,
  is_published = EXCLUDED.is_published;
