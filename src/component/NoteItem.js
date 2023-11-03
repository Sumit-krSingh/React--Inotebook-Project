import React, { useContext } from 'react'
import noteContext from "../context/notes/noteContext"


const NoteItem = (props) => {
    const context = useContext(noteContext);
    // eslint-disable-next-line
    const { deleteNote } = context;
    const { note, updateNote } = props;
    return (
        <div className="col-md-3">

            <div className="card my-3">

                <div className="card-body">
                    <div className="d-flex align-item-center">
                        <h5 className="card-title">{note.title}</h5>
                        <i className=" fa fa-sharp fa-light fa-trash mx-1" onClick={() => {
                            deleteNote(note._id);
                            props.showAlert("deleted successfully", "success");
                        }}></i>
                        <i className="fa fa-light fa-pen-to-square mx-1" onClick={() => { updateNote(note) }}></i>

                    </div>
                    <p className="card-text">{note.description}</p>

                </div>
            </div>
        </div>
    )
}

export default NoteItem
