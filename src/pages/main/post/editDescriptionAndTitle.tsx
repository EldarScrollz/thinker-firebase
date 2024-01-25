import "./editDescriptionAndTitle.scss";

import { doc, updateDoc } from "firebase/firestore";
import { dataBase } from "../../../config/firebase";
import { SetStateAction, useRef, useState } from "react";
import { Post as IPost } from "../main";

interface Props
{
    title: string;
    description: string;
    postId: string;
    setShowEdit: React.Dispatch<SetStateAction<boolean>>;
    setPost: React.Dispatch<SetStateAction<IPost>>;
    setDescHeight: React.Dispatch<SetStateAction<number>>;
}

export const EditDescriptionAndTitle = (props: Props) =>
{
    const titleRef = useRef<HTMLTextAreaElement>(null);
    const descRef = useRef<HTMLTextAreaElement>(null);

    const [showTitleErrorTooLong, setShowTitleErrorTooLong] = useState(false);
    const [showTitleErrorNoTitle, setShowTitleErrorNoTitle] = useState(false);

    const [showDescErrorTooLong, setShowDescErrorTooLong] = useState(false);
    const [showDescErrorNoDesc, setShowDescErrorNoDesc] = useState(false);

    const editPostTitleAndDesc = async () =>
    {
        const postToEditRef = doc(dataBase, "posts", props.postId);
        const postEditedTitle = titleRef.current?.value;
        const postEditedDesc = descRef.current?.value;

        let shouldReturn = false;
        if (postEditedTitle!.length > 200) { setShowTitleErrorTooLong(true); shouldReturn = true; } else { setShowTitleErrorTooLong(false); }
        if (postEditedTitle!.replace(/\s/g, '').length === 0) { setShowTitleErrorNoTitle(true); shouldReturn = true; } else { setShowTitleErrorNoTitle(false); }

        if (postEditedDesc!.length > 1000) { setShowDescErrorTooLong(true); shouldReturn = true; } else { setShowDescErrorTooLong(false); }
        if (postEditedDesc!.replace(/\s/g, '').length === 0) { setShowDescErrorNoDesc(true); shouldReturn = true; } else { setShowDescErrorNoDesc(false); }

        if (shouldReturn) return;



        updateDoc(postToEditRef, { description: postEditedDesc, title: postEditedTitle });

        props.setDescHeight(descRef.current?.clientHeight as number);

        props.setPost((prev: any) =>
        {
            return { ...prev, title: postEditedTitle, description: postEditedDesc };
        }
        );

        props.setShowEdit(false);
    };

    return (
        <>
            <div className="post-title">
                {/* <h1 contentEditable="true" className="post-edit-text" ref={titleRef}>{props.title}</h1> */}
                <textarea className="post-edit-text-title" ref={titleRef} defaultValue={props.title}></textarea>

                {showTitleErrorTooLong && <p style={{ color: "#E96060", textTransform: "uppercase" }}> Title is too long (max. 200 characters) </p>}
                {showTitleErrorNoTitle && <p style={{ color: "#E96060", textTransform: "uppercase" }}> Title must contain at least 1 character</p>}
            </div>

            <div className="post-desc">
                <textarea className="post-edit-text-description" ref={descRef} defaultValue={props.description}></textarea>

                {showDescErrorTooLong && <p style={{ color: "#E96060", textAlign: "center", textTransform: "uppercase" }}> Description is too long (max. 1000 characters) </p>}
                {showDescErrorNoDesc && <p style={{ color: "#E96060", textAlign: "center", textTransform: "uppercase" }}> Description must contain at least 1 character </p>}

                <div className="post-edit-text-buttons">
                    <button className="post-edit-text-buttons-apply" onClick={editPostTitleAndDesc}> Apply </button>
                    <button className="post-edit-text-buttons-cancel" onClick={() => props.setShowEdit(false)}> Cancel </button>
                </div>
            </div>
        </>
    );
};