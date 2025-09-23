// configs/chatService.js
import { db } from "../configs/FireBase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  where,
} from "firebase/firestore";

export const sendMessage = async (text, senderId, receiverId) => {
  await addDoc(collection(db, "messages"), {
    text,
    senderId,
    receiverId,
    createdAt: serverTimestamp(),
  });
};

export const subscribeChat = (userId, partnerId, callback) => {
  const q = query(
    collection(db, "messages"),
    where("senderId", "in", [userId, partnerId]),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const msgs = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      // lọc lại tin nhắn giữa 2 người
      .filter(
        (m) =>
          (m.senderId === userId && m.receiverId === partnerId) ||
          (m.senderId === partnerId && m.receiverId === userId)
      );

    callback(msgs);
  });
};
