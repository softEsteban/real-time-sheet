import { Server } from 'socket.io';


let initialData = {
  "headers": ["Name", "Lastname", "Age"],
  "data": [
    ["Rupencio", "Aguirre", "23"],
    ["Juanita", "Lopez", "24"],
    ["Marianita", "Londoño", "22"],
  ]
};

const SocketHandler = (req: any, res: any) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');

    // Initialize server
    const io = new Server(res.socket.server, {
      cors: {
        origin: "http://localhost:3000/",
        methods: ["GET", "POST"]
      }
    });
    res.socket.server.io = io;

    // Broadcast to all clients
    io.on('connection', socket => {
      console.log("A user connected")

      // Handle sheet name changes
      socket.on('sheet-name-change', msg => {
        io.emit('update-sheet-name', msg);
      });

      // Handle initial data
      socket.on('get-initial-data', msg => {
        io.emit('get-data', initialData);
      });

      // Handle cell edit
      socket.on('edit-cell', editedData => {
        
        // Edit cell
        const { rowIndex, cellIndex, value } = editedData;
        initialData.data[rowIndex][cellIndex] = value;

        // Broadcast the updated data to all clients
        io.emit('get-data', initialData);
      });

    });
  }
  res.end();
};

export default SocketHandler;
