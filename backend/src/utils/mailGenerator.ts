import Mailgen from "mailgen";

const mailGenerator=new Mailgen({
    theme:"default",
    product:{
        name:"MediTrack",
        link:"http://localhost:3000"
    }
})

export default mailGenerator;