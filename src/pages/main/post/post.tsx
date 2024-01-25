import "../deletePostModal.scss";

import { addDoc, getDocs, collection, query, where, deleteDoc, doc, getDoc } from "firebase/firestore";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, dataBase } from "../../../config/firebase";
import { Post as IPost } from "../main";
import HashLoader from "react-spinners/HashLoader";
import { DeletePostModal } from "../deletePostModal";
import { EditDescriptionAndTitle } from "./editDescriptionAndTitle";

interface Props
{
    post: IPost;
}

interface Like
{
    likeId: string;
    userId: string;
}

export const Post = (props: Props) =>
{
    const [post, setPost] = useState(props.post);

    const [user] = useAuthState(auth);

    const [likes, setLikes] = useState<Like[] | null>(null);
    const likesRef = collection(dataBase, "likes");
    const likesDoc = query(likesRef, where("postId", "==", post.id));

    const postRef = collection(dataBase, "posts");

    const [showPost, setShowPost] = useState(true);
    const [showMoreDesc, setShowMoreDesc] = useState(false);

    const [showModal, setShowModal] = useState(false);

    const [isLikeLoading, setIsLikeLoading] = useState(true);

    const [showEdit, setShowEdit] = useState(false);

    const unixToNormalDate = new Date(post.postDate);

    const hasUserLiked = likes?.find((like) => like.userId === user?.uid);

    const descRef = useRef<HTMLDivElement>(null);
    const [descHeight, setDescHeight] = useState(0);

    let testBooleanTimer = false;

    // Get likes on mount
    useEffect(() =>
    {
        getLikes();
    }, []);

    //Set description height on update
    useEffect(() =>
    {
        setDescHeight(descRef.current?.clientHeight as SetStateAction<number>);
    }, [descHeight]);



    const getLikes = async () =>
    {
        const data = await getDocs(likesDoc);

        setLikes(data.docs.map((doc) => ({ userId: doc.data().userId, likeId: doc.id })));

        setIsLikeLoading(false);
    };



    const addLike = async () =>
    {
        if (testBooleanTimer) { return; }
        testBooleanTimer = true;
        setTimeout(() => { testBooleanTimer = false; }, 1000);

        const likeToDeleteQuery = query(likesRef,
            where("postId", "==", post.id),
            where("userId", "==", user?.uid));

        const likeToDeleteData = await getDocs(likeToDeleteQuery);

        const newDoc = await addDoc(likesRef,
            {
                userId: user?.uid,
                postId: post.id
            });

        user && setLikes((prev) => prev
            ? [...prev, { userId: user?.uid, likeId: newDoc.id }]
            : [{ userId: user?.uid, likeId: newDoc.id }]);
    };



    const removeLike = async () =>
    {
        if (testBooleanTimer) { return; }
        testBooleanTimer = true;
        setTimeout(() => { testBooleanTimer = false; }, 1000);


        const likeToDeleteQuery = query(likesRef,
            where("postId", "==", post.id),
            where("userId", "==", user?.uid));

        const likeToDeleteData = await getDocs(likeToDeleteQuery);
        const likeId = likeToDeleteData.docs[0].id;
        const likeToDelete = doc(dataBase, "likes", likeId);
        await deleteDoc(likeToDelete);

        setLikes((prev) => prev && prev.filter((like) => like.likeId !== likeId));
    };



    const removePost = async () =>
    {
        // Delete post
        const postToDeleteQuery = query(postRef, where("__name__", "==", post.id));
        const postToDeleteData = await getDocs(postToDeleteQuery);
        const postId = postToDeleteData.docs[0].id;
        const postToDelete = doc(dataBase, "posts", postId);
        await deleteDoc(postToDelete);

        // Delete all likes of the post
        const likeToDeleteQuery = query(likesRef,
            where("postId", "==", post.id));

        const likeToDeleteData = await getDocs(likeToDeleteQuery);
        const likeIds = likeToDeleteData.docs.map((e) => ({ likeId: e.id }));
        likeIds.forEach(async (e) =>
        {
            const docRef = doc(dataBase, "likes", e.likeId);
            await deleteDoc(docRef);

            setLikes((prev) => prev && prev.filter((like) => like.likeId !== e.likeId));
        });
    };



    return (
        <>
            {showPost &&
                <div className="post">
                    {user?.uid === post.userId &&
                        <>
                            <div className="post-delete" onClick={() => { setShowModal(true); }}>X</div>

                            {showModal && <DeletePostModal setShowModal={setShowModal} removePost={removePost} setShowPost={setShowPost} />}
                        </>
                    }

                    {showEdit ? <EditDescriptionAndTitle title={post.title} description={post.description} postId={post.id} setShowEdit={setShowEdit} setPost={setPost} setDescHeight={setDescHeight} /> :
                        <>
                            <div className="post-title">
                                <h1>{post.title}</h1>
                            </div>

                            <div className="post-desc">
                                <p ref={descRef} style={{ display: showMoreDesc ? "block" : "-webkit-box" }}>
                                    {post.description}
                                </p>

                            </div>

                            <div className="post-support">
                                {(descHeight >= 72) && <p className="post-support-showMore" onClick={() => { setShowMoreDesc(prev => !prev); }}>{showMoreDesc ? "Show Less" : "Show More"}</p>}

                                {user?.uid === post.userId && <p className="post-support-edit-button" onClick={() => { setShowEdit(true); }}>Edit</p>}
                            </div>
                        </>
                    }

                    <div className="post-footer">
                        <p className="post-footer-username">@{post.username}</p>

                        <div className="post-footer-info">
                            {isLikeLoading ? <HashLoader size={32} color={"#4dbf6b"} cssOverride={{ marginLeft: ".4em" }} /> :
                                <div className="post-footer-likes">
                                    <button style={{ backgroundColor: hasUserLiked && "#5d7680" }} onClick={() => hasUserLiked ? removeLike() : addLike()}>
                                        {hasUserLiked ? <>&#10060;</> : <>&#128077;</>}
                                    </button>

                                    {likes && <p>{likes?.length}</p>}
                                </div>
                            }

                            <p className="post-footer-date">{`${unixToNormalDate.getDate()}.${unixToNormalDate.getMonth() + 1}.${unixToNormalDate.getFullYear()} \xa0${unixToNormalDate.getHours()}:${(unixToNormalDate.getMinutes() < 10 ? '0' : '') + unixToNormalDate.getMinutes()}`}</p>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

