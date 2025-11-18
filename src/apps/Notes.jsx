import React, { useState, useEffect } from 'react';
import { FaRegEdit, FaTrash } from 'react-icons/fa';
import './Notes.scss';

const Notes = () => {
    const [notes, setNotes] = useState(() => {
        const saved = localStorage.getItem('macos-notes');
        return saved ? JSON.parse(saved) : [
            { id: 1, title: 'Welcome', content: 'Welcome to Notes! This is a simulation.' }
        ];
    });
    const [activeNoteId, setActiveNoteId] = useState(notes[0]?.id);

    useEffect(() => {
        localStorage.setItem('macos-notes', JSON.stringify(notes));
    }, [notes]);

    const activeNote = notes.find(n => n.id === activeNoteId);

    const createNote = () => {
        const newNote = {
            id: Date.now(),
            title: 'New Note',
            content: ''
        };
        setNotes([newNote, ...notes]);
        setActiveNoteId(newNote.id);
    };

    const updateNote = (key, value) => {
        setNotes(notes.map(n => n.id === activeNoteId ? { ...n, [key]: value } : n));
    };

    const deleteNote = (e, id) => {
        e.stopPropagation();
        const newNotes = notes.filter(n => n.id !== id);
        setNotes(newNotes);
        if (activeNoteId === id) {
            setActiveNoteId(newNotes[0]?.id);
        }
    };

    return (
        <div className="notes-app">
            <div className="sidebar">
                <div className="toolbar">
                    <div className="folder-name">Notes</div>
                </div>
                <div className="notes-list">
                    {notes.map(note => (
                        <div
                            key={note.id}
                            className={`note-item ${note.id === activeNoteId ? 'active' : ''}`}
                            onClick={() => setActiveNoteId(note.id)}
                        >
                            <div className="note-title">{note.title || 'New Note'}</div>
                            <div className="note-preview">{note.content.slice(0, 30)}...</div>
                            <button className="delete-btn" onClick={(e) => deleteNote(e, note.id)}><FaTrash /></button>
                        </div>
                    ))}
                </div>
            </div>
            <div className="editor">
                <div className="toolbar">
                    <button onClick={createNote}><FaRegEdit /></button>
                </div>
                {activeNote ? (
                    <div className="content-area">
                        <input
                            className="title-input"
                            value={activeNote.title}
                            onChange={(e) => updateNote('title', e.target.value)}
                            placeholder="Title"
                        />
                        <textarea
                            className="body-input"
                            value={activeNote.content}
                            onChange={(e) => updateNote('content', e.target.value)}
                            placeholder="Type your note here..."
                        />
                    </div>
                ) : (
                    <div className="no-selection">No Note Selected</div>
                )}
            </div>
        </div>
    );
};

export default Notes;
