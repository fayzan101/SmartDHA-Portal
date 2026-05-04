import { ProfileField, ProfileFormData } from '../../components/forms/CommonEntityForm';

export const nonMemberFields: ProfileField[] = [
  // ===== BASIC =====
  { name: 'fullName' as keyof ProfileFormData, label: 'Full Name', type: 'text', required: true },
  { name: 'email' as keyof ProfileFormData, label: 'Email Address', type: 'email', required: true },

  { name: 'password' as keyof ProfileFormData, label: 'Password', type: 'password', required: true },
  { name: 'cellNo' as keyof ProfileFormData, label: 'Cell No', type: 'text', required: true },

  // ===== CATEGORY =====
  { name: 'category' as keyof ProfileFormData, label: 'Category', type: 'select', options: [] },
  { name: 'subCategory' as keyof ProfileFormData, label: 'Sub Category', type: 'select', options: [] },

  // ===== LOCATION =====
  { name: 'phase' as keyof ProfileFormData, label: 'Phase', type: 'text' },
  { name: 'zone' as keyof ProfileFormData, label: 'Zone', type: 'text' },

  { name: 'khayaban' as keyof ProfileFormData, label: 'Khayaban', type: 'text' },
  { name: 'lane' as keyof ProfileFormData, label: 'Lane', type: 'text' },

  // ===== FLOOR + PLOT =====
  { name: 'floor' as keyof ProfileFormData, label: 'Floor (2 digits)', type: 'text' },

  { name: 'plotNoDigits' as keyof ProfileFormData, label: 'Plot No (Digits)', type: 'text' },
  { name: 'plotNoAlpha' as keyof ProfileFormData, label: 'Plot No (Alphabet)', type: 'text' },

  // ===== FILES =====
  { name: 'profilePic' as keyof ProfileFormData, label: 'Profile Picture', type: 'file' },
  { name: 'proofOfPossession' as keyof ProfileFormData, label: 'Proof of Possession', type: 'file' },
  { name: 'utilityBill' as keyof ProfileFormData, label: 'Utility Bill (K.E / Gas)', type: 'file' },
];