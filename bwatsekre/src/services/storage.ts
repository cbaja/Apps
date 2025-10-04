import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_AUTH = 'bwatsekre.auth.memberId';
const KEY_SEEDED = 'bwatsekre.seeded';

export async function saveMemberId(memberId: string): Promise<void> {
  await AsyncStorage.setItem(KEY_AUTH, memberId);
}

export async function getMemberId(): Promise<string | null> {
  return AsyncStorage.getItem(KEY_AUTH);
}

export async function clearMemberId(): Promise<void> {
  await AsyncStorage.removeItem(KEY_AUTH);
}

export async function setSeeded(): Promise<void> {
  await AsyncStorage.setItem(KEY_SEEDED, 'true');
}

export async function isSeeded(): Promise<boolean> {
  const value = await AsyncStorage.getItem(KEY_SEEDED);
  return value === 'true';
}
