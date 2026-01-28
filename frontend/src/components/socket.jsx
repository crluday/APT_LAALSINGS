import { io } from "socket.io-client"; 
const socket = io(document.location.hostname+":3001"); 
export default socket;