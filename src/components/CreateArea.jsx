import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Pagination from 'react-bootstrap/Pagination';
import { collection, addDoc, updateDoc, doc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase'; 
import NoteCard from './NoteCard'; 
import { ToastContainer, toast } from 'react-toastify';
import Header from './Header';

import 'react-toastify/dist/ReactToastify.css';


function CreateArea({ onAdd, onUpdate }) {
  
  
  const [title, setTitle] = useState('');
  const [showContent, setShowContent] = useState(false);
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState([]);
  const [toastVisible, setToastVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const notesPerPage = 6;

  useEffect(() => {
    const notesRef = collection(db, 'note');

    const unsubscribe = onSnapshot(notesRef, (snapshot) => {
      const notesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort notes by pinned status and createdAt timestamp in descending order

      notesData.sort((a, b) => {
        if (b.pinned !== a.pinned) {
         
          return b.pinned - a.pinned;
        } else {
  
          return b.createdAt - a.createdAt;
        }
      });

      setNotes(notesData);
    });

    return () => unsubscribe();
  }, []);

  const calculateNoteRange = () => {
    const startIndex = (currentPage - 1) * notesPerPage;
    const endIndex = startIndex + notesPerPage;
    return notes.slice(startIndex, endIndex);
  };

  const toggleToast = (message) => {
    setToastVisible(!toastVisible);

    // Show the toast when the note is pinned/unpinned

    toast.info(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleEditNote = async (id, editedTitle, editedContent) => {
    try {
      const updatedNote = {
        title: editedTitle,
        content: editedContent,
      };

      await updateDoc(doc(db, 'note', id), updatedNote);

      setNotes((prevNotes) =>
        prevNotes.map((n) => (n.id === id ? { ...n, ...updatedNote } : n))
      );

      // Show the toast when the note is updated

      toggleToast('Note updated successfully!');
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleAddNote = async () => {
    try {
      const newNote = {
        title,
        content,
        createdAt: new Date().getTime(),
        pinned: false,
      };

      const docRef = await addDoc(collection(db, 'note'), newNote);

      if (typeof onAdd === 'function') {
        onAdd({ ...newNote, id: docRef.id });
      }

    
      setTitle('');
      setContent('');

    
      toggleToast('Note added successfully!');
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

 

  const handleDeleteNote = async (id) => {
    try {
      await deleteDoc(doc(db, 'note', id));
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));

      // Show the toast when the note is deleted
      toggleToast('Note deleted successfully!');
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handlePinNote = async (note) => {
    try {
      const updatedNote = {
        ...note,
        pinned: !note.pinned,
      };

      await updateDoc(doc(db, 'note', note.id), updatedNote);

      setNotes((prevNotes) =>
        prevNotes.map((n) => (n.id === note.id ? { ...n, ...updatedNote } : n))
      );

      // Show the toast when the note is pinned/unpinned
      toggleToast(`Note ${updatedNote.pinned ? 'pinned' : 'unpinned'} successfully!`);
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  return (
    <>
    <Header/>
    <Container>
      
       

      <Row className="justify-content-center mt-5">
        <Col md={6}>
          <div>
          <Form>
              <Form.Group
                
                controlId="exampleForm.ControlInput1"
              >
              
                <Form.Control placeholder='Title'
                className='form-input'
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onFocus={() => setShowContent(true)}
                  onBlur={() => setShowContent(false)}
                  required
                />
              </Form.Group>
              <Form.Group
               className='form-input'
               onFocus={() => setShowContent(true)}
                style={{
                 
                  maxHeight: showContent ? '1000px' : '0',
                  overflow: 'hidden',
                  transition: 'max-height 2.9s ease',
                }}
                controlId="exampleForm.ControlTextarea1"
              >
               <br></br>
                <Form.Control
                placeholder='Take a note....'
                  as="textarea"
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </Form.Group>
              <Button
              id='addnote-btn'
                variant="primary"
                type="button"
                onClick={handleAddNote}
                disabled={!title || !content}
                className="float-end mt-3"
                
              >
                Add Note
              </Button>
            </Form>

          </div>
        </Col>
      </Row>
      
      {/* Display Note Cards */}


      <Row className="justify-content-center mt-3">
        {calculateNoteRange().map((note) => (
          <Col key={note.id} md={4} className="mb-3">
            <NoteCard
              title={note.title}
              content={note.content}
              onDelete={() => handleDeleteNote(note.id)}
              onEdit={(editedTitle, editedContent) =>
                handleEditNote(note.id, editedTitle, editedContent)
              }
              onPin={() => handlePinNote(note)}
              isPinned={note.pinned}
            />
          </Col>
        ))}
      </Row>

      {/*  Pagination Controls */}

      <Row className="mt-3">
  <Col className="text-end">
    <Pagination>
      <Pagination.Prev
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />
      {Array.from({ length: Math.ceil(notes.length / notesPerPage) }, (_, index) => (
        <Pagination.Item
          key={index + 1}
          active={index + 1 === currentPage}
          onClick={() => handlePageChange(index + 1)}
        >
          {index + 1}
        </Pagination.Item>
      ))}
      <Pagination.Next
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === Math.ceil(notes.length / notesPerPage)}
      />
    </Pagination>
  </Col>
</Row>




      <ToastContainer
        autoClose={2000} />
    </Container>
    </>
  );
}

export default CreateArea;
