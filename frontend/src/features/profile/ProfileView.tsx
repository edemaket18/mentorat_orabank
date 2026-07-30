import React, { useEffect, useRef, useState } from 'react';
import { Camera, Mail, Phone, Building2, GraduationCap, Calendar, Pencil, Check, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  getCurrentUser,
  updateMyProfile,
  uploadAvatar,
  AuthUser,
} from '@api/auth.api';

export type ProfileField = 'phone' | 'department' | 'university' | 'bio';

interface ProfileViewProps {
  roleLabel: string;
  roleColor: string; // couleur de la bannière et du badge, ex: '#2563eb'
  fields: ProfileField[]; // champs pertinents pour ce rôle, dans l'ordre d'affichage
}

const FIELD_META: Record<ProfileField, { label: string; icon: React.ReactNode; placeholder: string }> = {
  phone: { label: 'Téléphone', icon: <Phone size={16} />, placeholder: 'Numéro de téléphone' },
  department: { label: 'Département', icon: <Building2 size={16} />, placeholder: 'Département' },
  university: { label: 'Université', icon: <GraduationCap size={16} />, placeholder: 'Université' },
  bio: { label: 'À propos', icon: <Pencil size={16} />, placeholder: 'Parlez un peu de vous...' },
};

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

const ProfileView: React.FC<ProfileViewProps> = ({ roleLabel, roleColor, fields }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = () => {
    getCurrentUser()
      .then((u) => {
        setUser(u);
        setForm({
          name: u.name,
          phone: u.phone ?? '',
          department: u.department ?? '',
          university: u.university ?? '',
          bio: u.bio ?? '',
        });
      })
      .catch(() => toast.error('Erreur lors du chargement du profil.'));
  };

  useEffect(() => { load(); }, []);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Utilisez une image JPEG, PNG ou WebP.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image trop lourde (2 Mo maximum).');
      return;
    }

    setUploadingAvatar(true);
    try {
      const avatarUrl = await uploadAvatar(file);
      setUser((prev) => (prev ? { ...prev, avatarUrl } : prev));
      toast.success('Photo de profil mise à jour.');
    } catch (error) {
      toast.error("Erreur lors de l'envoi de la photo.");
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const [firstName, ...rest] = form.name.trim().split(' ');
      const updated = await updateMyProfile({
        firstName,
        lastName: rest.join(' '),
        phone: form.phone,
        department: form.department,
        university: form.university,
        bio: form.bio,
      });
      setUser(updated);
      setIsEditing(false);
      toast.success('Profil mis à jour.');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du profil.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!user) return;
    setForm({
      name: user.name,
      phone: user.phone ?? '',
      department: user.department ?? '',
      university: user.university ?? '',
      bio: user.bio ?? '',
    });
    setIsEditing(false);
  };

  if (!user) {
    return <div className="p-6 max-w-3xl mx-auto text-gray-500">Chargement du profil...</div>;
  }

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    : null;

  const avatarSrc = user.avatarUrl
    ? `${(process.env.REACT_APP_API_URL || 'http://localhost:5001/api').replace(/\/api$/, '')}${user.avatarUrl}`
    : null;

  return (
    <div className="max-w-3xl mx-auto pb-10">
      {/* Bannière de couverture */}
      <div className="h-32 sm:h-40 rounded-b-none rounded-t-xl" style={{ background: `linear-gradient(135deg, ${roleColor}, ${roleColor}99)` }} />

      <div className="bg-white dark:bg-gray-800 rounded-b-xl shadow px-6 pb-6">
        {/* Avatar chevauchant la bannière */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-12 sm:-mt-14">
          <div className="flex items-end gap-4">
            <div className="relative">
              <div
                className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center text-2xl font-bold text-white overflow-hidden bg-gray-400"
                style={{ backgroundColor: avatarSrc ? undefined : roleColor }}
              >
                {avatarSrc ? (
                  <img src={avatarSrc} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  getInitials(user.name)
                )}
              </div>
              <button
                onClick={handleAvatarClick}
                disabled={uploadingAvatar}
                className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full p-1.5 shadow hover:bg-gray-50 disabled:opacity-50"
                aria-label="Changer la photo de profil"
              >
                <Camera size={14} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
          </div>

          <div className="mt-4 sm:mt-0">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 text-sm border rounded-full px-4 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Pencil size={14} /> Modifier le profil
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1 text-sm border rounded-full px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <X size={14} /> Annuler
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1 text-sm bg-blue-600 text-white rounded-full px-3 py-1.5 hover:bg-blue-700 disabled:opacity-50"
                >
                  <Check size={14} /> {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Nom + rôle */}
        <div className="mt-4">
          {isEditing ? (
            <input
              className="text-xl font-bold border rounded px-2 py-1 w-full max-w-sm"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          ) : (
            <h1 className="text-xl font-bold">{user.name}</h1>
          )}
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span
              className="text-xs font-semibold px-2.5 py-0.5 rounded-full text-white"
              style={{ backgroundColor: roleColor }}
            >
              {roleLabel}
            </span>
            {memberSince && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Calendar size={12} /> Membre depuis {memberSince}
              </span>
            )}
          </div>
        </div>

        {/* Bio */}
        {fields.includes('bio') && (
          <div className="mt-4">
            {isEditing ? (
              <textarea
                className="w-full border rounded p-2 text-sm"
                rows={3}
                placeholder={FIELD_META.bio.placeholder}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {user.bio || <span className="italic text-gray-400">Aucune description pour le moment.</span>}
              </p>
            )}
          </div>
        )}

        {/* Informations */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Mail size={16} />
            <span>{user.email}</span>
          </div>

          {fields
            .filter((f) => f !== 'bio')
            .map((field) => (
              <div key={field} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                {FIELD_META[field].icon}
                {isEditing ? (
                  <input
                    className="border rounded px-2 py-1 text-sm flex-1"
                    placeholder={FIELD_META[field].placeholder}
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  />
                ) : (
                  <span>{(user as any)[field] || <span className="italic text-gray-400">Non renseigné</span>}</span>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;