import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  increment,
  getDoc,
} from 'firebase/firestore'
import { ref, uploadString, getDownloadURL } from 'firebase/storage'
import { db, storage } from './firebase'
import type { Lyric } from '../types'

// Define a new interface that includes all necessary fields
interface LyricData extends Omit<Lyric, 'id' | 'userId'> {
  createdAt: Date; // Include createdAt
}

export const saveLyric = async (
  lyric: Omit<Lyric, 'id' | 'createdAt' | 'likes' | 'userId'> & {
    creatorName: string
  },
  imageDataUrl?: string
) => {
  let backgroundUrl = lyric.backgroundUrl;

  try {
    if (imageDataUrl) {
      const storageRef = ref(storage, `backgrounds/${Date.now()}`);
      await uploadString(storageRef, imageDataUrl, 'data_url');
      backgroundUrl = storageRef.fullPath; // Save only the path
    }

    const lyricData: LyricData = {
      title: lyric.title,
      artist: lyric.artist,
      lyrics: lyric.lyrics,
      backgroundUrl, // This should now be just the path
      createdAt: new Date(),
      likes: 0,
      creatorName: lyric.creatorName,
    };

    if (lyric.gradientType) {
      lyricData.gradientType = lyric.gradientType;
    }

    const docRef = await addDoc(collection(db, 'lyrics'), lyricData);

    return docRef.id;
  } catch (error) {
    console.error('Error saving lyric:', error);
    throw error; // Rethrow the error for further handling
  }
}

export const getLyrics = async (): Promise<Lyric[]> => {
  const querySnapshot = await getDocs(collection(db, 'lyrics'))
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Lyric[]
}

export const toggleLike = async (lyricId: string) => {
  const docRef = doc(db, 'lyrics', lyricId)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    const currentLikes = docSnap.data().likes || 0
    await updateDoc(docRef, {
      likes: increment(1),
    })
    return currentLikes + 1
  }
  return 0
}

// Helper to retrieve background image
export const getBackgroundImage = async (
  backgroundId?: string
): Promise<string | null> => {
  if (!backgroundId) return null

  try {
    const storageRef = ref(storage, backgroundId)
    const url = await getDownloadURL(storageRef)
    return url
  } catch (error) {
    console.error('Error fetching background image:', error)
    return null
  }
}
