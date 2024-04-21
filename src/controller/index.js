// import express from "express";
// import { dbConnect } from "../db/connectdb.js";

// class App {
//   expressApplication;
//   serverPort;

//   constructor(serverPort) {
//     this.expressApplication = this.expressApplication;
//     this.serverPort = serverPort;
//   }

//   async intializeDatabaseConnection() {
//     await dbConnect();
//   }

//   async listen() {
//     try {
//       await this.intializeDatabaseConnection();
//       this.expressApplication = express();
//       this.expressApplication.listen(this.serverPort, () => {
//         console.log(`Server is running on ${this.serverPort}`);
//       });
//     } catch (error) {
//       console.log(error);
//     }
//   }
// }

// export default App;
