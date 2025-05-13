import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const useWebSocket = (url: string, event?: string) => {
  const [messages, setMessages] = useState<
    { event: string; message: string; date: Date }[]
  >([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(url); // Create a Socket.IO connection
    socketRef.current = socket;

    // Listen for connection event
    socket.on('connect', () => {
      console.log('Socket.IO connected');
      setIsConnected(true);
    });

    // Listen for messages from the server
    socket.on(event ? event : 'message', (message: string) => {
      setMessages((prev) => [JSON.parse(message), ...prev]);
    });

    // Handle connection errors
    socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
    });

    // Listen for disconnection
    socket.on('disconnect', () => {
      console.log('Socket.IO disconnected');
      setIsConnected(false);
    });

    return () => {
      console.log('Cleaning up Socket.IO connection');
      socket.disconnect(); // Clean up the socket connection
    };
  }, [url]);

  const sendMessage = (message: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('message', message); // Emit a message to the server
    } else {
      console.warn('Socket.IO is not connected');
    }
  };

  return { messages, isConnected, sendMessage };
};

export default useWebSocket;
