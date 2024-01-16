"use client"
import { useEffect, useState, ChangeEvent } from 'react';
import { Socket, io } from 'socket.io-client';

let socket: Socket | undefined;

const socketInitializer = async () => {
  await fetch('/api/socket-sheet');
  return io();
};


interface SpreadsheetData {
  headers: string[];
  data: string[][];
}

export default function Home() {

  const [spreadsheetData, setSpreadsheetData] = useState<SpreadsheetData>();

  const [sheetName, setSheetName] = useState('');
  const [output, setOutput] = useState('');

  const [anyMessage, setAnyMessage] = useState('');

  useEffect(() => {
    const initializeSocket = async () => {
      socket = await socketInitializer();

      socket.on('connect', () => {
        console.log('connected');
      });

      socket.on('update-sheet-name', (msg: any) => {
        setOutput(msg);
      });

      socket.emit('get-initial-data');

      socket.on('get-data', (msg: any) => {
        console.log(msg);
        setSpreadsheetData(msg);
        setAnyMessage("Now data is loaded");
      });
    };

    initializeSocket();
  }, []);

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSheetName(e.target.value);
    if (socket) {
      socket.emit('sheet-name-change', e.target.value);
    }
  };

  const handleCellEdit = (rowIndex: number, cellIndex: number, value: string) => {
    if (spreadsheetData) {
      const newData = { ...spreadsheetData };
      newData.data[rowIndex][cellIndex] = value;
      setSpreadsheetData(newData);
      if (socket) {
        socket.emit('edit-cell', { rowIndex, cellIndex, value });
      }
    }
  };



  return (
    <div className="container mx-auto bg-blue-100">
      <div className="max-w-2xl mx-auto my-12">
        <h1 className="text-3xl font-semibold text-center mb-4">Welcome to socket!</h1>
        <div className="flex py-4">
          <p>Server message: {anyMessage}</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6 bg-gray-100 rounded shadow overflow-x-auto">
        <h1 className="text-3xl font-semibold text-center mb-4">Online Spreadsheet</h1>
        <div className="flex items-center space-x-4 py-4">
          <p>Sheet Name: {sheetName}</p>
          <input
            placeholder="Type sheet name"
            value={sheetName}
            onChange={onChangeHandler}
            className="border p-2 rounded w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6"
          />
        </div>

        {spreadsheetData && (
          <div>
            <table className="table-auto w-full">
              <thead>
                <tr>
                  {spreadsheetData.headers.map((header, index) => (
                    <th key={index} className="p-2 border">
                      <input
                        type="text"
                        value={header}
                        onChange={(e) => {
                          const newData = { ...spreadsheetData };
                          newData.headers[index] = e.target.value;
                          setSpreadsheetData(newData);
                        }}
                        className="w-full sm:w-40 md:w-40 lg:w-40 xl:w-40"
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {spreadsheetData.data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="p-2 border">
                        <input
                          type="text"
                          value={cell}
                          onChange={(e) => handleCellEdit(rowIndex, cellIndex, e.target.value)}
                          className="w-full sm:w-40 md:w-40 lg:w-40 xl:w-40"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>

  );
}
