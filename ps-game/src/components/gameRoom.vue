<script lang="ts">
import {defineComponent} from 'vue'
import { copyImageToClipboard } from 'copy-image-clipboard'


export default defineComponent({
 props: [ 'GameSettings' ,'time' ,'isAdmin', 'userName', 'usersInRoom', 'room'],
 data() {
    return {
        finalImg: undefined as any,
        show: false,
        gridAutoRows: {
            one: 1,
            two: 5,
        }
        
    }
 },
 created(){

 },
 methods: {
   onPaste (e: any) {
        var data = e.clipboardData.items[0].getAsFile();
        var fr = new FileReader;
        fr.onloadend = () =>{
            //console.log(fr.result); // fr.result is all data
            this.finalImg = fr.result;
            this.$emit('playerImage', this.finalImg);
        };
        fr.readAsDataURL(data);
    },
    downloadImage(){
        var link = document.createElement('a');
        link.download = 'image.png';
        link.href = this.GameSettings.image;
        link.click();
    },
    toClipboard(){
       //copy this.GameSettings.image to clipboard as image
       //  navigator.clipboard.writeText(this.GameSettings.image);
        copyImageToClipboard(this.GameSettings.image)
            .then(() => {
                console.log('Image Copied')
            })
            .catch((e) => {
                console.log('Error: ', e.message)
            })

    }

 },
    
})


</script>

<template>
<div class="container">
    <h1 v-bind:style="[time.minutes < 1 ? {'color': 'red'} : {'color': 'white'}]" 
    ><template  v-if="time.minutes < 10">0</template>{{time.minutes}}:<template
    v-if="time.seconds < 10">0</template>{{time.seconds}}</h1>
    
    <div class="grid-list" >
        <div v-bind:style="{ 'background-image': 'url(' + GameSettings.image + ')' }" class="img-to-edit">
            <div class="inner">
                <button @click="downloadImage">download</button>
                <button @click="toClipboard">copy to clipboard</button>
            </div>
        </div>
        <div @paste="onPaste" class="upload" v-bind:style="{ 'background-image': 'url(' + finalImg + ')' }">
           <div class="paste-here">
                <p>Paste image here <br> (use Win key + S)</p>
           </div>
        </div>
    </div>

   
    <div class="userList">
        <h2>connected users</h2>
        <ul>
            <li v-for="user in usersInRoom" :key="user" >{{user.name}}<a v-if="user.name == userName"> (you)</a></li>
        </ul>
    </div>
</div>
</template>

<style scoped>
.container{
    text-align: center;

}

.upload{
    width: 100%;
    background-color: rgb(46, 46, 46);
    border-radius: 8px;
    background-size: cover;
    background-position: center;
      border: solid 1px #5c5c5c;
        display: flex;
    justify-content: center;
    align-items: center; 
}

.paste-here{
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center; 
    width: 200px;
    height: 60px;
  background-color: rgb(46, 46, 46);
  border: solid 1px #5c5c5c;
}

.upload img{
    float: left;
    border-radius: 8px;
}

.img-to-edit{
    width: 100%;
    background-color: rgb(46, 46, 46);
    border-radius: 8px;
    background-size: cover;
    background-position: center;
    display: flex;
    justify-content: center;
    align-items: center; 
    border: solid 1px #5c5c5c;
}

.inner button{

    color: white;
    padding: 5px;
    margin: 5px;
    font-size: 1.2em;
}

.grid-list{
    transition: grid-auto-rows 0.5s ease; 
    display: grid;
    grid-gap: 25px;
    width: 40%;
    height: 70vh;
    margin: 0 auto;
}


.userList{
      border: solid 1px #5c5c5c;
    margin-right: 20px;
    float: right;
    border-radius: 5px;
    padding: 10px;
    width: 200px;
    height: 30%;
    background-color: rgb(46, 46, 46);
    position: absolute;
    right: 0;
    top: 50%;
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
}

h2{
    margin: 0;
}

.userList > ul{
    list-style-type: none;
    text-align: left;
    padding: 0;
}

</style>
 