<script lang="ts">
import {defineComponent} from 'vue'
import io from 'socket.io-client';

const socket = io("http://192.168.1.126:3001/");
import { stringify, v4 as uuidv4 } from 'uuid';
import GameRoom from './components/gameRoom.vue';
import Voting from './components/voting.vue';


const id: string = uuidv4();

const Placeholdernames = [
  'femboy',
  'bob',
  'hypernut',
  'hoe',
  ]

//get a random word from urban dictionary and return it

const getWord = async () => {
  const response = await fetch('https://api.urbandictionary.com/v0/random');
  const data = await response.json();
  return data.list[0].word;
}

function notifyMe() {
    if (!window.Notification) {
        console.log('Browser does not support notifications.');
    } else {
        // check if permission is already granted
        if (Notification.permission === 'granted') {
            // show notification here
            var notify = new Notification("TIME'S UP BITCH!!", {
                body: "U HAVE 1 MINUTE TO SUBMIT IMAGE",
                icon: 'https://cdn.7tv.app/emote/617734c7e0801fb98787f3d1/4x.avif',
            });
        } else {
            // request permission from user
            Notification.requestPermission().then(function (p) {
                if (p === 'granted') {
                    // show notification here
                    var notify = new Notification("TIME'S UP BITCH!!", {
                        body: "U HAVE 1 MINUTE TO SUBMIT IMAGE",
                        icon: 'https://cdn.7tv.app/emote/617734c7e0801fb98787f3d1/4x.avif',
                    });
                } else {
                    console.log('User blocked notifications.');
                }
            }).catch(function (err) {
                console.error(err);
            });
        }
    }
}



export default defineComponent({
  
  name: 'App',
  data() {
    return {
      joined: true,
      isAdmin: false,
      inGame: false,
      gameIsDone: false,
      joinedLobby: false,
      userName: Placeholdernames[Math.floor(Math.random() * Placeholdernames.length)],
      room: '',
      usersInRoom: [] as Array<any>, 
      GameSettings: {
        duration: undefined as any,
        image: undefined as any,
      },
      time: {
        minutes: 0,
        seconds: 0,
        totalSeconds: 0,
      },
      finalImg: undefined as any,
      isVoting: false,

      
    }
  },
  created(){
    /** 
    window.onbeforeunload = function() {
        return true;
    }; 
    */
  
  
    socket.on("timer-countdown", (duration) => {
      this.time.minutes = Math.floor(duration / 60);
      this.time.seconds =  duration - this.time.minutes * 60;
      this.time.totalSeconds = duration;
     
      if(this.time.totalSeconds == 60){
        notifyMe();
      }
    }),

    socket.on("timer-end", () => {
        this.gameIsDone = true;
        socket.emit("playerImage", this.finalImg);
    }),


    socket.on("updateRoom", (userInRoom) => {
      this.usersInRoom = userInRoom;
      console.log(this.usersInRoom);
    }),
  

  
    socket.on("connect", () => {
      
      //if user is on phone 
        
        this.room = window.location.pathname.slice(1);

     
   
        if(this.room){
          
          this.joined = false;
        }
      
    });

    socket.on("start-game", (gamesettings) => {
      this.inGame = true; 
      this.GameSettings = gamesettings;
    });
 
    socket.on('connectToRoom', (data, usersInRoom) => {
      this.usersInRoom = usersInRoom;
 
    });

    socket.on('start-voting', () => {
      this.isVoting = true;
    });

  },
  methods: {
    async newRoom() {
      //log getword to console

      this.isAdmin = true;
      this.joined = false;
      const room: string = uuidv4();
      this.room = room;

      //window.location.href = `/${id}`;
      socket.emit("join-room", room, this.userName);
   


    },
    joinRoom(){
      this.joinedLobby = true;
      socket.emit("join-room", this.room, this.userName, this.isAdmin);
    },
    toClipboard(){
       //window.open(
         //   `${window.location.href + this.room}`, "_blank");
      //navigator.clipboard.writeText(window.location.href + this.room);
      //copy text to clipboard
      var textArea = document.createElement("textarea");
      textArea.value = window.location.href + this.room;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      textArea.remove();

    },
    startRoom(){
      //if gamesettings array has a value that is undefined
      this.inGame = true;
      socket.emit("start-game", this.GameSettings, this.room,);
    },
    previewFiles(event: any) {
     
        if(window.FileReader) {
        var file  = event.target.files[0];
        const reader: FileReader = new FileReader();
        if (file && file.type.match('image.*')) {
          reader.readAsDataURL(file);
        } else {
          console.log('File not supported');
        }
        reader.onload = () => {
          this.GameSettings.image = reader.result;
          //console.log(this.GameSettings.image);
        }
      }
   },
   updateVal(img: any){
    this.finalImg = img;
   },
   startVoting(){
     //this.isVoting = true;
     socket.emit("start-voting", this.room);
   },
  },
  components: {
    GameRoom,
    Voting,
}
})

</script>

<template>
<div class="wrap" v-if="!inGame">
  <div v-if="joined">    
    <div class="cont">
      <input v-model="userName" placeholder="username" type="text" />
      <button @click="newRoom" class="new-room">Create new room</button>
    </div>
  </div>
  <div v-else-if="isAdmin">
    <div class="wrapper">
      
      <div class="input">Minutes Time Limit<input type="number" v-model="GameSettings.duration"></div>
      <div class="input">Theme<input type="text"></div>

      <div class="fileUpload">
        <h2>upload file</h2>
        <label for="file">
        <img v-if="GameSettings.image" :src="GameSettings.image" alt="selectedImg">
        <h2>choose image</h2>
    
        </label>
        <input id="file" type="file" @change="previewFiles" multiple>
      </div>
      <button @click="startRoom">start</button>
    
      <ul v-for="user in usersInRoom" :key="user">
        <li>{{user.name}}<a v-if="user.name == userName"> (you) 👑</a></li>
      </ul>
      <button @click="toClipboard">copy to clipboard</button>

    </div>
  </div>
  <div v-else>
    <div v-if="!joinedLobby" class="cont">
      <input v-model="userName" placeholder="username" type="text" />
      <button @click="joinRoom" class="new-room">join</button>
    </div>
    <div v-else class="wrapper">
      <h1>users</h1>
      <ul v-for="user in usersInRoom" :key="user">
        <li>{{user.name}}<a v-if="user.name == userName"> (you)</a></li>
      </ul>
      <button @click="toClipboard">copy to clipboard</button>
    </div>
  </div>
</div>
<div v-else>
  <div v-if="!gameIsDone">
    <GameRoom :GameSettings="GameSettings" :time="time" :isAdmin="isAdmin" :room="room" :userName="userName" :usersInRoom="usersInRoom" @playerImage="updateVal($event)" />
  </div>
  <div v-else>
    <div v-if="!isVoting">
      <h1>voting</h1>
      <button v-if="isAdmin" v-on:click="startVoting">start Voting</button>
    </div>
    <div v-else>
      <Voting :usersInRoom="usersInRoom" />
    </div>

  </div>
 
</div>
</template>

<style scoped>

input[type="file"]{
  display: none;
}
.fileUpload{
  justify-content: center;
  align-items: center;
  background-color: rgb(46, 46, 46);
  margin: 20px 0px;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  border: solid 1px #5c5c5c;
  display: grid;
}

.fileUpload label h2{
  margin: 5px;
  font-size: 1.2em;
}

.fileUpload img{

  max-height: 200px;
  height: auto;
}



.wrap{
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

.cont{
  width: 300px;
}

input {
  box-sizing: border-box;
  width: 100%;
  padding: 3px 5px;
  height: 37px;
  font-size: 1.3em;
}
.new-room {
  margin-top: 10px;
  height: 37px;
  width: 100%;
  font-size: 1.3em;
}


</style>
