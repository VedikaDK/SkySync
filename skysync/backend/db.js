const mongoose = require('mongoose');
require('dotenv').config();
//const mongoURL = 'mongodb+srv://mrunmaikandharkar:Strong2307@cluster0.e6ghm.mongodb.net/Flight_db?retryWrites=true&w=majority&appName=Cluster0';
const mongoURL = process.env.MONGO_URL;


async function fetchData() {
    try {
        // Fetch the 'users' collection
        const fetch_data = mongoose.connection.db.collection("Flight");

        // Find the data asynchronously using async/await
        const data = await fetch_data.find({ DepartingCity: "Mumbai",
            ArrivingCity: "Bengaluru"}).toArray();

        // Log the data
        console.log(data);
    } catch (err) {
        console.log("Error fetching data:", err);
    } finally {
        console.log("Hii");
    }
}
const mongoDB = async () => {
    try {
        await mongoose.connect(mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected Successfully");
        fetchData();


    } catch (error) {
        console.error("Connection Error:", error);
    }
};

module.exports = mongoDB;
