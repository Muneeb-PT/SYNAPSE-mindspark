import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { useProfile, useUpdateProfile, useSkills, useAddSkill, useDeleteSkill, useEducation, useAddEducation, useDeleteEducation, useExperience, useAddExperience, useDeleteExperience, useCertifications, useAddCertification, useDeleteCertification } from "@/hooks/use-profile";
import { statusLabels } from "@/lib/mock-data";
import { Progress } from "@/components/ui/progress";
import {
  User, Target, Heart, Briefcase, Lightbulb, Shield, Edit2,
  GraduationCap, Award, Globe, MapPin, Calendar, ExternalLink, Languages,
  Clock, Building2, Plus, Trash2, Save, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.4 },
  }),
};

function TagList({ tags, color = "primary" }: { tags: string[]; color?: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span key={tag} className={`px-3 py-1 rounded-full text-xs font-medium ${
          color === "primary" ? "bg-primary/10 text-primary" :
          color === "accent" ? "bg-accent/10 text-accent" :
          "bg-secondary text-secondary-foreground"
        }`}>{tag}</span>
      ))}
    </div>
  );
}

function SectionCard({ children, custom, className = "" }: { children: React.ReactNode; custom: number; className?: string }) {
  return (
    <motion.div variants={fadeUp} custom={custom} className={`rounded-xl border border-border bg-card p-4 sm:p-6 ${className}`}>
      {children}
    </motion.div>
  );
}

function AddSkillDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [level, setLevel] = useState(50);
  const addSkill = useAddSkill();

  const handleAdd = () => {
    if (!name.trim()) return;
    addSkill.mutate({ name: name.trim(), level }, { onSuccess: () => { setOpen(false); setName(""); setLevel(50); } });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-border"><Plus className="w-3 h-3 mr-1" /> Add Skill</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Add Skill</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <Input placeholder="Skill name (e.g. React)" value={name} onChange={(e) => setName(e.target.value)} />
          <div>
            <label className="text-sm text-muted-foreground">Level: {level}%</label>
            <input type="range" min={0} max={100} value={level} onChange={(e) => setLevel(Number(e.target.value))} className="w-full" />
          </div>
          <Button onClick={handleAdd} disabled={addSkill.isPending} className="w-full bg-gradient-primary text-primary-foreground">
            {addSkill.isPending ? "Adding..." : "Add Skill"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AddEducationDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ institution: "", degree: "", field: "", start_year: 2024, end_year: undefined as number | undefined, current: false, grade: "" });
  const addEdu = useAddEducation();

  const handleAdd = () => {
    if (!form.institution || !form.degree || !form.field) return;
    addEdu.mutate(form, { onSuccess: () => { setOpen(false); setForm({ institution: "", degree: "", field: "", start_year: 2024, end_year: undefined, current: false, grade: "" }); } });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-border"><Plus className="w-3 h-3 mr-1" /> Add</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Add Education</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Input placeholder="Institution" value={form.institution} onChange={(e) => setForm(f => ({ ...f, institution: e.target.value }))} />
          <Input placeholder="Degree" value={form.degree} onChange={(e) => setForm(f => ({ ...f, degree: e.target.value }))} />
          <Input placeholder="Field of study" value={form.field} onChange={(e) => setForm(f => ({ ...f, field: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <Input type="number" placeholder="Start year" value={form.start_year} onChange={(e) => setForm(f => ({ ...f, start_year: Number(e.target.value) }))} />
            <Input type="number" placeholder="End year" value={form.end_year || ""} onChange={(e) => setForm(f => ({ ...f, end_year: e.target.value ? Number(e.target.value) : undefined }))} />
          </div>
          <Input placeholder="Grade (optional)" value={form.grade} onChange={(e) => setForm(f => ({ ...f, grade: e.target.value }))} />
          <Button onClick={handleAdd} disabled={addEdu.isPending} className="w-full bg-gradient-primary text-primary-foreground">
            {addEdu.isPending ? "Adding..." : "Add Education"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AddExperienceDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ company: "", title: "", type: "full-time", start_date: "", end_date: "", current: false, description: "", skills: [] as string[] });
  const [skillInput, setSkillInput] = useState("");
  const addExp = useAddExperience();

  const handleAdd = () => {
    if (!form.company || !form.title || !form.start_date) return;
    addExp.mutate(form, { onSuccess: () => { setOpen(false); setForm({ company: "", title: "", type: "full-time", start_date: "", end_date: "", current: false, description: "", skills: [] }); } });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-border"><Plus className="w-3 h-3 mr-1" /> Add</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Add Experience</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Input placeholder="Company" value={form.company} onChange={(e) => setForm(f => ({ ...f, company: e.target.value }))} />
          <Input placeholder="Job title" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} />
          <select value={form.type} onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))} className="w-full rounded-md border border-border bg-secondary p-2 text-sm text-foreground">
            {["full-time", "part-time", "internship", "freelance", "volunteer"].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Start (e.g. Jun 2024)" value={form.start_date} onChange={(e) => setForm(f => ({ ...f, start_date: e.target.value }))} />
            <Input placeholder="End (or leave blank)" value={form.end_date} onChange={(e) => setForm(f => ({ ...f, end_date: e.target.value }))} />
          </div>
          <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} />
          <div className="flex gap-2">
            <Input placeholder="Add skill tag" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (skillInput.trim()) { setForm(f => ({ ...f, skills: [...f.skills, skillInput.trim()] })); setSkillInput(""); } } }} />
          </div>
          <div className="flex flex-wrap gap-1">{form.skills.map((s, i) => <Badge key={i} variant="secondary" className="text-xs">{s} <button onClick={() => setForm(f => ({ ...f, skills: f.skills.filter((_, j) => j !== i) }))} className="ml-1"><X className="w-2 h-2" /></button></Badge>)}</div>
          <Button onClick={handleAdd} disabled={addExp.isPending} className="w-full bg-gradient-primary text-primary-foreground">
            {addExp.isPending ? "Adding..." : "Add Experience"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AddCertificationDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", issuer: "", date: "", credential_url: "" });
  const addCert = useAddCertification();

  const handleAdd = () => {
    if (!form.name || !form.issuer || !form.date) return;
    addCert.mutate(form, { onSuccess: () => { setOpen(false); setForm({ name: "", issuer: "", date: "", credential_url: "" }); } });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-border"><Plus className="w-3 h-3 mr-1" /> Add</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Add Certification</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Input placeholder="Certification name" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
          <Input placeholder="Issuer" value={form.issuer} onChange={(e) => setForm(f => ({ ...f, issuer: e.target.value }))} />
          <Input placeholder="Date (e.g. Mar 2024)" value={form.date} onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))} />
          <Input placeholder="Credential URL (optional)" value={form.credential_url} onChange={(e) => setForm(f => ({ ...f, credential_url: e.target.value }))} />
          <Button onClick={handleAdd} disabled={addCert.isPending} className="w-full bg-gradient-primary text-primary-foreground">
            {addCert.isPending ? "Adding..." : "Add Certification"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EditProfileDialog({ profile }: { profile: Record<string, unknown> }) {
  const [open, setOpen] = useState(false);
  const updateProfile = useUpdateProfile();
  const [form, setForm] = useState({
    name: (profile.name as string) || "",
    headline: (profile.headline as string) || "",
    bio: (profile.bio as string) || "",
    location: (profile.location as string) || "",
    availability: (profile.availability as string) || "",
    linkedin: (profile.linkedin as string) || "",
    github: (profile.github as string) || "",
    twitter: (profile.twitter as string) || "",
    portfolio: (profile.portfolio as string) || "",
    status: (profile.status as string) || "casually_browsing",
  });

  const handleSave = () => {
    updateProfile.mutate(form, { onSuccess: () => setOpen(false) });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => {
      setOpen(v);
      if (v) setForm({
        name: (profile.name as string) || "",
        headline: (profile.headline as string) || "",
        bio: (profile.bio as string) || "",
        location: (profile.location as string) || "",
        availability: (profile.availability as string) || "",
        linkedin: (profile.linkedin as string) || "",
        github: (profile.github as string) || "",
        twitter: (profile.twitter as string) || "",
        portfolio: (profile.portfolio as string) || "",
        status: (profile.status as string) || "casually_browsing",
      });
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-border self-start flex-shrink-0">
          <Edit2 className="w-3 h-3 mr-1" /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Edit Profile</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Input placeholder="Name" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
          <Input placeholder="Headline" value={form.headline} onChange={(e) => setForm(f => ({ ...f, headline: e.target.value }))} />
          <Textarea placeholder="Bio" value={form.bio} onChange={(e) => setForm(f => ({ ...f, bio: e.target.value }))} />
          <Input placeholder="Location" value={form.location} onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))} />
          <Input placeholder="Availability" value={form.availability} onChange={(e) => setForm(f => ({ ...f, availability: e.target.value }))} />
          <select value={form.status} onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))} className="w-full rounded-md border border-border bg-secondary p-2 text-sm text-foreground">
            <option value="open_to_work">Open to Work</option>
            <option value="actively_looking">Actively Looking</option>
            <option value="casually_browsing">Casually Browsing</option>
            <option value="not_looking">Not Looking</option>
          </select>
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="LinkedIn URL" value={form.linkedin} onChange={(e) => setForm(f => ({ ...f, linkedin: e.target.value }))} />
            <Input placeholder="GitHub URL" value={form.github} onChange={(e) => setForm(f => ({ ...f, github: e.target.value }))} />
            <Input placeholder="Twitter URL" value={form.twitter} onChange={(e) => setForm(f => ({ ...f, twitter: e.target.value }))} />
            <Input placeholder="Portfolio URL" value={form.portfolio} onChange={(e) => setForm(f => ({ ...f, portfolio: e.target.value }))} />
          </div>
          <Button onClick={handleSave} disabled={updateProfile.isPending} className="w-full bg-gradient-primary text-primary-foreground">
            <Save className="w-4 h-4 mr-2" />
            {updateProfile.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Profile() {
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfile();
  const { data: skills = [] } = useSkills();
  const { data: education = [] } = useEducation();
  const { data: experience = [] } = useExperience();
  const { data: certifications = [] } = useCertifications();
  const deleteSkill = useDeleteSkill();
  const deleteEdu = useDeleteEducation();
  const deleteExp = useDeleteExperience();
  const deleteCert = useDeleteCertification();

  const [privacySettings, setPrivacySettings] = useState({
    dataCollection: true,
    behaviorTracking: false,
    screenAnalysis: false,
  });

  if (isLoading || !profile) {
    return <div className="flex items-center justify-center min-h-[50vh]"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  const statusInfo = statusLabels[profile.status || "casually_browsing"] || statusLabels.casually_browsing;
  const completionPercent = Math.min(100, Math.round(
    (profile.name ? 10 : 0) + (profile.headline ? 10 : 0) + (profile.bio ? 10 : 0) +
    (profile.location ? 10 : 0) + (skills.length > 0 ? 15 : 0) + (education.length > 0 ? 15 : 0) +
    (experience.length > 0 ? 15 : 0) + (certifications.length > 0 ? 15 : 0)
  ));

  return (
    <motion.div initial="hidden" animate="visible" className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
      {/* Header card */}
      <SectionCard custom={0}>
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-primary flex items-center justify-center text-xl sm:text-2xl font-bold text-primary-foreground flex-shrink-0">
              {profile.name?.[0] || user?.email?.[0] || "?"}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold text-foreground">{profile.name || "Set your name"}</h1>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
              </div>
              <p className="text-sm text-muted-foreground truncate">{profile.headline || "Add a headline"}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                {profile.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{profile.location}</span>}
                {profile.availability && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{profile.availability}</span>}
              </div>
              {profile.personality_tags && profile.personality_tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {profile.personality_tags.map((tag: string) => (
                    <span key={tag} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] sm:text-xs">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <EditProfileDialog profile={profile as unknown as Record<string, unknown>} />
        </div>

        {profile.bio && <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{profile.bio}</p>}

        {/* Social Links */}
        <div className="flex flex-wrap gap-2 mt-3">
          {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-xs text-secondary-foreground hover:text-primary transition-colors"><Globe className="w-3 h-3" /> LinkedIn</a>}
          {profile.github && <a href={profile.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-xs text-secondary-foreground hover:text-primary transition-colors"><Globe className="w-3 h-3" /> GitHub</a>}
          {profile.portfolio && <a href={profile.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-xs text-secondary-foreground hover:text-primary transition-colors"><ExternalLink className="w-3 h-3" /> Portfolio</a>}
          {profile.twitter && <a href={profile.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-xs text-secondary-foreground hover:text-primary transition-colors"><Globe className="w-3 h-3" /> Twitter</a>}
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Profile Completion</span>
            <span className="font-medium text-foreground">{completionPercent}%</span>
          </div>
          <Progress value={completionPercent} className="h-2" />
        </div>
      </SectionCard>

      {/* Languages */}
      {profile.languages && profile.languages.length > 0 && (
        <SectionCard custom={1}>
          <div className="flex items-center gap-2 mb-3">
            <Languages className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Languages</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.languages.map((lang: string) => (
              <Badge key={lang} variant="secondary" className="text-xs">{lang}</Badge>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Education */}
      <SectionCard custom={2}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Education</h2>
          </div>
          <AddEducationDialog />
        </div>
        {education.length === 0 ? (
          <p className="text-sm text-muted-foreground">No education added yet. Click "Add" to get started.</p>
        ) : (
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id} className="flex gap-3 p-3 rounded-lg bg-secondary/30 border border-border">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-foreground">{edu.degree} in {edu.field}</h3>
                  <p className="text-xs text-muted-foreground">{edu.institution}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{edu.start_year} – {edu.current ? "Present" : edu.end_year}</span>
                    {edu.grade && <Badge variant="secondary" className="text-[10px] px-1.5">{edu.grade}</Badge>}
                  </div>
                </div>
                <button onClick={() => deleteEdu.mutate(edu.id)} className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Experience */}
      <SectionCard custom={3}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Experience</h2>
          </div>
          <AddExperienceDialog />
        </div>
        {experience.length === 0 ? (
          <p className="text-sm text-muted-foreground">No experience added yet. Click "Add" to get started.</p>
        ) : (
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="flex gap-3 p-3 rounded-lg bg-secondary/30 border border-border">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-5 h-5 text-accent" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-foreground">{exp.title}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-secondary text-[10px] text-secondary-foreground capitalize">{exp.type}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{exp.company}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{exp.start_date} – {exp.current ? "Present" : exp.end_date}</span>
                  </div>
                  {exp.description && <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{exp.description}</p>}
                  {exp.skills && exp.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {exp.skills.map((s: string) => (
                        <span key={s} className="px-2 py-0.5 rounded bg-primary/10 text-[10px] text-primary font-medium">{s}</span>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={() => deleteExp.mutate(exp.id)} className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Certifications */}
      <SectionCard custom={4}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-warning" />
            <h2 className="font-semibold text-foreground">Certifications</h2>
          </div>
          <AddCertificationDialog />
        </div>
        {certifications.length === 0 ? (
          <p className="text-sm text-muted-foreground">No certifications added yet.</p>
        ) : (
          <div className="space-y-3">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border">
                <div className="w-9 h-9 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0">
                  <Award className="w-4 h-4 text-warning" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-foreground">{cert.name}</h3>
                  <p className="text-xs text-muted-foreground">{cert.issuer} · {cert.date}</p>
                </div>
                {cert.credential_url && (
                  <a href={cert.credential_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <button onClick={() => deleteCert.mutate(cert.id)} className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
        {/* Skills */}
        <SectionCard custom={5}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">Skills</h2>
            </div>
            <AddSkillDialog />
          </div>
          {skills.length === 0 ? (
            <p className="text-sm text-muted-foreground">No skills added yet.</p>
          ) : (
            <div className="space-y-3">
              {skills.map((skill) => (
                <div key={skill.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-foreground">{skill.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{skill.level}%</span>
                      <button onClick={() => deleteSkill.mutate(skill.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <Progress value={skill.level} className="h-1.5" />
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Interests & Strengths from profile arrays */}
        <SectionCard custom={6}>
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Interests</h2>
          </div>
          {profile.interests && profile.interests.length > 0 ? <TagList tags={profile.interests} /> : <p className="text-sm text-muted-foreground">Edit profile to add interests.</p>}

          <div className="flex items-center gap-2 mb-3 mt-6">
            <Target className="w-5 h-5 text-success" />
            <h2 className="font-semibold text-foreground">Strengths</h2>
          </div>
          {profile.strengths && profile.strengths.length > 0 ? <TagList tags={profile.strengths} color="secondary" /> : <p className="text-sm text-muted-foreground">Edit profile to add strengths.</p>}
        </SectionCard>
      </div>

      {/* Privacy */}
      <SectionCard custom={7}>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground">Privacy & Data Controls</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          You're always in control. Toggle what data Synapse can use to improve your experience.
        </p>
        <div className="space-y-4">
          {[
            { key: "dataCollection" as const, label: "General Data Collection", desc: "Allow Synapse to use your profile data for AI recommendations" },
            { key: "behaviorTracking" as const, label: "Behavior Tracking", desc: "Track interaction patterns to improve suggestions (optional)" },
            { key: "screenAnalysis" as const, label: "Screen Analysis", desc: "Analyze usage patterns for personalization (coming soon)" },
          ].map((setting) => (
            <div key={setting.key} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <div className="mr-3">
                <p className="text-sm font-medium text-foreground">{setting.label}</p>
                <p className="text-xs text-muted-foreground">{setting.desc}</p>
              </div>
              <Switch
                checked={privacySettings[setting.key]}
                onCheckedChange={(v) => setPrivacySettings((s) => ({ ...s, [setting.key]: v }))}
              />
            </div>
          ))}
        </div>
      </SectionCard>
    </motion.div>
  );
}
