import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, increment, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebaseconfig";

export default function useHandlePosts() {

    const fnAddPost = async (post) => {
        try {
            const postRef = collection(db, "posts");
            await addDoc(postRef, {
                ...post,
                likesCount: 0,
                timestamp: serverTimestamp(),
            });
            console.log("Post added!");
            // return true;
        } catch (error) {
            console.error("Error adding post: ", error);
            return false;
        }
    };

    const fnGetPosts = (setAllPosts) => {
        const postsRef = collection(db, "posts");
        const q = query(postsRef, orderBy("timestamp", "desc"));
        return onSnapshot(q, (snapshot) => {
            const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setAllPosts(posts);
        });
    };

    const fnLikePost = async (postId, userId) => {
        try {
            const postRef = doc(db, "posts", postId);
            const postSnap = await getDoc(postRef);

            if (postSnap.exists()) {
                const postData = postSnap.data();

                if (postData.likedBy?.includes(userId)) {
                    await updateDoc(postRef, { likesCount: increment(-1), likedBy: arrayRemove(userId) });
                    console.log("Post unliked!");
                } else {
                    await updateDoc(postRef, { likesCount: increment(1), likedBy: arrayUnion(userId) });
                    console.log("Post liked!");
                }
            } else {
                console.error("Post does not exist!");
            }
        } catch (error) {
            console.error("Error liking/unliking post: ", error);
        }
    };

    const fnAddComment = async (postId, comment) => {
        try {
            const commentsRef = collection(db, "posts", postId, "comments");
            await addDoc(commentsRef, {
                ...comment,
                timestamp: serverTimestamp(),
            });
            console.log("Comment added!");
        } catch (error) {
            console.error("Error adding comment: ", error);
        }
    };

    const fnGetComments = (postId, setAllComments) => {
        const commentsRef = collection(db, "posts", postId, "comments");
        const q = query(commentsRef, orderBy("timestamp", "asc"));
        return onSnapshot(q, (snapshot) => {
            const comments = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setAllComments(comments);
        });
    };

    const fnDeletePost = async (postId) => {
        try {
            const postRef = doc(db, "posts", postId);
            await deleteDoc(postRef);
            console.log("Post deleted!");
        } catch (error) {
            console.error("Error deleting post: ", error);
        }
    };

    return {
        fnAddPost,
        fnGetPosts,
        fnLikePost,
        fnAddComment,
        fnGetComments,
        fnDeletePost
    }
}