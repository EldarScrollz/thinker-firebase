import { getDocs, collection } from "firebase/firestore";
import { auth, dataBase } from "../../config/firebase";
import { useState, useEffect } from "react";
import { Post } from "./post/post";
import { useAuthState } from "react-firebase-hooks/auth";
import { LoadingScreen } from "../../components/loading-screen/loadingScreen";

export interface Post
{
    id: string;
    userId: string;
    title: string;
    username: string;
    description: string;
    postDate: number;
}

export const Main = () =>
{
    const [user, userIsLoading] = useAuthState(auth);

    const [postsList, setPostsList] = useState<Post[] | null>(null);
    const postRef = collection(dataBase, "posts");

    const getPosts = async () =>
    {
        const data = await getDocs(postRef);

        //setPostsList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Post[]);

        const arrayOfIndividualDocs = data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Post[];

        setPostsList(arrayOfIndividualDocs?.sort((a: Post, b: Post) =>
            (new Date(b.postDate) as unknown as number) - (new Date(a.postDate) as unknown as number)) as Post[]);
    };

    useEffect(() => 
    {
        getPosts();
    }, []);



    return (
        <>
            <div className="main-posts">

                {user ? postsList?.map((post, key) =>
                (
                    <Post key={key} post={post} />
                ))
                    : !userIsLoading ? <h1 style={{ fontSize: "3rem", textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center", height: "70vh" }}>
                        Please log in to see this page.</h1>

                        : <LoadingScreen />
                }

                {postsList?.length === 0 && user &&
                    <h1 style={{ fontSize: "3rem", textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center", height: "70vh" }}>
                        No posts found, please add at least 1 post.</h1>
                }
            </div>
        </>
    );
};