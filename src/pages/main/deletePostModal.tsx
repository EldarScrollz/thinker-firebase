import { SetStateAction, useEffect, useRef } from "react";

interface Props
{
    setShowModal: React.Dispatch<SetStateAction<boolean>>;
    removePost: () => Promise<void>;
    setShowPost: React.Dispatch<SetStateAction<boolean>>;
}

export const DeletePostModal = (props: Props) =>
{
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() =>
    {
        const closeModalOnClickOutside = (e: MouseEvent) =>
        {
            if (!modalRef.current?.contains(e.target as Node)) 
            {
                props.setShowModal(false);
            }
        };

        document.addEventListener("mousedown", closeModalOnClickOutside);

        return () => 
        {
            document.removeEventListener("mousedown", closeModalOnClickOutside);
        };
    });

    return (
        <div className="post-delete-modal" ref={modalRef}>
            <h1>Are you sure you want to delete the post?</h1>

            <div className="post-delete-modal-buttons">
                <button onClick={() => { props.removePost(); props.setShowPost(false); }}>Yes</button>
                <button onClick={() => props.setShowModal(false)}>No</button>
            </div>
        </div>
    );
};