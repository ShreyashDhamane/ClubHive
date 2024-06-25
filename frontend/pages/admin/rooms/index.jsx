import BreadCrumb from "@components/Navbar/BreadCrumb";
import axios from "axios";
import React, { use, useEffect, useState } from "react";
import Calendar from "@components/Calendar/Calendar";
import Loader from "@components/Loader/Loader";
import Modal from "@components/UI/Modal/Modal";
import styles from "./rooms.module.scss";
import API from "@shared/API";
import { toast } from "react-toastify";

const index = () => {
  const [rooms, setRooms] = useState([]);
  const [roomSelected, setRoomSelected] = useState(0);
  const [switchToCalendar, setSwitchToCalendar] = useState(false);
  const [oldRoomNo, setOldRoomNo] = useState(roomSelected);
  const [isLoading, setIsLoading] = useState(true);
  const [myEvents, setMyEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [roomData, setRoomData] = useState({
    roomNo: "",
    type: "",
    capacity: "",
  });

  useEffect(() => {
    API.get(`/rooms/get-rooms`)
      .then((response) => {
        setRooms(response.data.rooms.map((room) => room.roomNo));
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error("Something went wrong");
      });
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  const addRoom = async () => {
    console.log("room data is", roomData);
    let newRoom = {
      roomNo: document.getElementById("roonNumber").value,
      type: document.getElementById("type").value,
      capacity: document.getElementById("capacity").value,
    };
    let newRooms = rooms;
    newRooms.push(newRoom.roomNo);
    setRooms(newRooms);
    API.post(`/rooms/create-room`, newRoom)
      .then((response) => {
        // log(response.data);
        console.log(response.data);
        setShowModal(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (switchToCalendar) {
    return (
      <div className="px-10">
        <div >
          <div class="flex align-center justify-between my-6 bg-red-100 p-5">
            <h1 class="text-6xl">
              <span>Room No: </span>
              <span> {roomSelected}</span>
            </h1>
            <button
              class="text-xl font-bold inline"
              onClick={() => {
                let newRooms = rooms.map((room) => {
                  if (room != oldRoomNo) {
                    return room;
                  } else {
                    return roomSelected;
                  }
                });
                setRooms(newRooms);
                setSwitchToCalendar(false);
              }}
            >
              Close
            </button>
          </div>

        </div>
        <Calendar committeeName={roomSelected}></Calendar>
      </div>
    );
  } else {
    return (
      <>
        <Modal
          show={showModal}
          hideBackdrop={() => setShowModal(false)}
          name="add-user"
        >
          <div className={styles.User_form}>
            <h1 className="text-2xl font-bold">Add Room</h1>
            <div className={"flex flex-col gap-5 mt-5 " + styles.Form}>
              <div className={styles.form_item}>
                <label htmlFor="roonNumber" placeholder="Room Number" >
                  Room Number
                </label>
                <input type="text" name="roomNo" id="roonNumber" onChange={(e) => {
                  setRoomData({ ...roomData, roomNo: e.target.value })
                }} />
              </div>
              <div className={styles.form_item}>
                <label htmlFor="capacity" placeholder="Capacity" onChange={(e) => {
                  setRoomData({ ...roomData, capacity: e.target.value })
                }}>
                  Capacity
                </label>
                <input type="text" name="capacity" id="capacity"
                  onChange={(e) => {
                    setRoomData({ ...roomData, capacity: e.target.value })
                  }}
                />
              </div>
              <div className={styles.form_item}>
                <label htmlFor="type">Type</label>
                <select name="type" id="type" onChange={(e) => {
                  setRoomData({ ...roomData, type: e.target.value })
                }}>
                  <option value="lab">Lab</option>
                  <option value="hall">Hall</option>
                  <option value="classroom">ClassRoom</option>
                  <option value="auditorium">Auditorium</option>
                  <option value="ground">Ground</option>
                </select>
              </div>

              <button onClick={addRoom} className={styles.btn_primary}>
                Add Room
              </button>
            </div>
          </div>
        </Modal>
        <div className="ml-10 mt-8">
          <BreadCrumb />
          <div class="mt-20 flex items-center justify-center">
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-5">
              {rooms.map((room, i) => {
                return (
                  <div
                    key={i}
                    class="bg-green-100 text-green-500 text-3xl font-bold text-center p-20 rounded-lg hover:bg-green-200"
                    onClick={() => {
                      setRoomSelected(room);
                      setOldRoomNo(room);
                      let data = switchToCalendar;
                      // setIsLoading(true);
                      setSwitchToCalendar(!data);
                    }}
                  >
                    {room}
                  </div>
                );
              })}
              <div
                onClick={() => {
                  console.log("clicked");
                  setShowModal(true);
                  // setRooms([...rooms, rooms.length + 1]);
                }}
                class="flex justify-center items-center align-baseline w-50 h-50 bg-green-100 text-green-500 text-6xl font-bold text-center rounded-full"
              >
                <button>+</button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default index;
