// NoteCard.jsx

import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { MdDeleteSweep} from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { TiPin } from "react-icons/ti";


import '../index.css';

const NoteCard = ({ title, content, onPin, onDelete, isPinned, onEdit }) => {
  const [showModal, setShowModal] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedContent, setEditedContent] = useState(content);

  const handleEdit = () => {
    onEdit(editedTitle, editedContent);
    setShowModal(false);
  };

  return (
    <>
    <div className='card-container'>
      <Card className="mb-3 custom-note-card">
  <Card.Body className="custom-note-body">
    <Card.Title className="custom-note-title">{title}</Card.Title>
    <hr></hr>
    <Card.Text className="custom-note-content">{content}</Card.Text>
  </Card.Body>
  <div className="note-buttons custom-note-buttons">
  <TiPin
            onClick={onPin}
            className={`icon ${isPinned? 'pinned' : ''}`}
            style={{ color: isPinned ? 'green' : 'inherit' }}
          />
    <div>
    <CiEdit onClick={() => setShowModal(true)} className="icon" />
      <MdDeleteSweep onClick={onDelete} className="d-icon icon" />
    </div>
  </div>
</Card>


      {/* Modal */}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="editNoteTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="editNoteContent">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          
          <Button variant="primary" onClick={handleEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      </div>
    </>
    
  );
};

export default NoteCard;
