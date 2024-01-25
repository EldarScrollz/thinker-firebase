import "../create-post/create-form.scss";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { addDoc, collection } from "firebase/firestore";
import { auth, dataBase } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { ChangeEvent, useState } from "react";

export const CreateForm = () =>
{
    const [user] = useAuthState(auth);
    const navigate = useNavigate();

    const [showTitleErrorNoTitle, setShowTitleErrorNoTitle] = useState(false);
    const [showDescErrorNoDesc, setShowDescErrorNoDesc] = useState(false);
    const [descAndTitleNotSpaceOnly, setDescAndTitleNotSpaceOnly] = useState(false);



    interface CreateFormData
    {
        title: string;
        description: string;
    }



    const schema = yup.object().shape
        ({
            title: yup.string().max(200, "Title is too long (max. 200 characters)").required("You must add a title"),
            description: yup.string().max(1000, "Description is too long (max. 1000 characters)").required("You must add a description")
        });



    const { register, handleSubmit, formState: { errors } } = useForm<CreateFormData>
        ({
            resolver: yupResolver(schema),
        });



    const onCreatePost = async (data: CreateFormData) =>
    {
        if (!descAndTitleNotSpaceOnly) return;

        const postsRef = collection(dataBase, "posts");

        await addDoc(postsRef,
            {
                ...data,
                username: user?.displayName,
                userId: user?.uid,
                postDate: new Date().getTime(),
            });
        navigate("/");
    };

    const checkDescAndTitleForSpaces = (e: ChangeEvent<HTMLTextAreaElement>) =>
    {
        let shouldReturn = false;

        if (e.target.value.replace(/\s/g, '').length === 0 && e.target.name === "title") { setShowTitleErrorNoTitle(true); setDescAndTitleNotSpaceOnly(false); shouldReturn = true; } 
        else if (e.target.value.replace(/\s/g, '').length > 0 && e.target.name === "title") { setShowTitleErrorNoTitle(false); }

        if (e.target.value.replace(/\s/g, '').length === 0 && e.target.name === "description") { setShowDescErrorNoDesc(true); setDescAndTitleNotSpaceOnly(false); shouldReturn = true; } 
        else if (e.target.value.replace(/\s/g, '').length > 0 && e.target.name === "description") { setShowDescErrorNoDesc(false); }

        if (shouldReturn) { return; }

        setDescAndTitleNotSpaceOnly(true);
    };



    return (
        <form className="createForm" onSubmit={handleSubmit(onCreatePost)}>
            <textarea placeholder="Title..." className="createForm-title" {...register("title")} onChange={(e) => checkDescAndTitleForSpaces(e as ChangeEvent<HTMLTextAreaElement>)} />
            {errors.title && <p className="createForm-error">{errors.title?.message}</p>}
            {showTitleErrorNoTitle && <p className="createForm-error"> Title must contain at least 1 character</p>}

            <textarea placeholder="Description..." {...register("description")} onChange={(e) => checkDescAndTitleForSpaces(e as ChangeEvent<HTMLTextAreaElement>)} />
            {errors.description && <p className="createForm-error">{errors.description?.message}</p>}
            {showDescErrorNoDesc && <p className="createForm-error"> Description must contain at least 1 character</p>}

            <input type="submit" value="POST" />
        </form>
    );
};