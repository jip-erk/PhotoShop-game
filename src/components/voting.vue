<script lang="ts">
import {defineComponent} from 'vue'
import { copyImageToClipboard } from 'copy-image-clipboard'


export default defineComponent({
 props: [ 'usersInRoom'],
 data() {
    return {
        Submissions: 0,
        countDown: 10,
    }
 },
 created(){
  
    const downloadTimer = setInterval(() =>{
        this.countDown -= 1;
       // console.log(this.Submissions, this.usersInRoom.length);

        if(this.countDown <= 0){
           if(this.Submissions + 1 == this.usersInRoom.length){
            console.log("All Submissions Received");
                clearInterval(downloadTimer);
           }
           else{
               this.Submissions++;
                this.countDown = 10;
           }
        }
     
    }, 1000)
 

 },
 methods: {
   

 },
    
})


</script>

<template>
    <div class="container">
        <div class="text-header">
            <div class="txt">
                <h1>{{usersInRoom[Submissions].name}}</h1>
                <h2>{{countDown}}⏰ >></h2>
            </div>
            <div class="img">
                <img :src="usersInRoom[Submissions].image">
            </div>
        </div>
    </div>
</template>

<style scoped>
.container{
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.container img{
    height: 60vh;
    width: auto;
    background-color: aqua;
}

.text-header{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.txt{
width: 100%;
margin-top: 20px;
}

.txt h1{
    float: left;
    margin: 0;
}
.txt h2{
    float: right;
    text-align: center;
}

</style>
 