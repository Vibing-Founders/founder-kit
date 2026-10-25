import { supabase } from '@/integrations/supabase/client';

export async function myPets() {
  const { data } = await supabase.from('pets').select('id, name, breed, photo_path');
  return data ?? [];
}

export async function uploadPetPhoto(userId: string, petId: string, file: File) {
  const path = `${userId}/${petId}.jpg`;
  await supabase.storage.from('pet-photos').upload(path, file, { upsert: true });
  await supabase.from('pets').update({ photo_path: path }).eq('id', petId);
  return supabase.storage.from('pet-photos').getPublicUrl(path).data.publicUrl;
}

// Added in the Supabase dashboard while testing; vets upload these for us.
export async function vaccinations(petId: string) {
  const { data } = await supabase
    .from('vaccination_records')
    .select('vaccine, given_on, vet_practice')
    .eq('pet_id', petId);
  return data ?? [];
}
