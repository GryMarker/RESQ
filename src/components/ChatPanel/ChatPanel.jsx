import React, { useState, useEffect, useRef } from 'react';
import { Card, Form, Button, ListGroup } from 'react-bootstrap';
import './ChatPanel.css';

const ChatPanel = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Dispatcher',
      text: 'Unit A, please respond to a medical emergency at Brgy. 7.',
      time: '10:30 AM',
    },
    {
      id: 2,
      sender: 'Responder Unit A',
      text: 'Copy that. We are en route. ETA 5 minutes.',
      time: '10:31 AM',
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const chatBodyRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const newMsg = {
      id: messages.length + 1,
      sender: 'You',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([...messages, newMsg]);
    setNewMessage('');

    // Simulate auto-reply after 2 seconds
    setTimeout(() => {
      const autoReply = {
        id: messages.length + 2,
        sender: 'Responder Unit A',
        text: 'Message received.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prevMessages) => [...prevMessages, autoReply]);
    }, 2000);
  };

  return (
    <Card className="h-100">
      <Card.Header as="h5">Chat</Card.Header>
      <Card.Body ref={chatBodyRef} className="d-flex flex-column chat-body">
        <ListGroup variant="flush" className="flex-grow-1">
          {messages.map((msg) => (
            <ListGroup.Item
              key={msg.id}
              className={`d-flex flex-column ${
                msg.sender === 'You' ? 'align-items-end' : 'align-items-start'
              }`}
            >
              <div
                className={`p-2 rounded ${
                  msg.sender === 'You' ? 'bg-primary text-white' : 'bg-light'
                }`}
              >
                <div className="fw-bold">{msg.sender}</div>
                <div>{msg.text}</div>
                <div className="text-muted small mt-1">{msg.time}</div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
      <Card.Footer>
        <Form onSubmit={handleSendMessage}>
          <Form.Group className="d-flex">
            <Form.Control
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <Button variant="primary" type="submit" className="ms-2">
              Send
            </Button>
          </Form.Group>
        </Form>
      </Card.Footer>
    </Card>
  );
};

export default ChatPanel;